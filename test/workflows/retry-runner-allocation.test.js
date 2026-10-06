'use strict';

const assert = require('node:assert/strict');
const { test } = require('node:test');
const retryRunnerAllocation = require('../../scripts/retry-runner-allocation');
const fixture = require('../fixtures/runner-allocation-failure.json');

function harness() {
  const data = structuredClone(fixture);
  const calls = [];
  const reads = [];
  const pages = [];
  const github = {
    rest: {
      actions: {
        getWorkflowRun: async (params) => {
          reads.push(params);
          return { data: data.run };
        },
        listJobsForWorkflowRunAttempt: 'jobs',
        reRunWorkflowFailedJobs: async (params) => calls.push(params),
      },
      checks: { listAnnotations: 'annotations' },
    },
    paginate: async (route, params) => {
      pages.push({ route, params });
      return data[route];
    },
  };
  const context = {
    repo: { owner: 'DarinRowe', repo: 'googletrans' },
    payload: { workflow_run: structuredClone(data.run) },
  };
  const delays = [];
  const options = {
    github,
    context,
    core: { info() {} },
    wait: async (ms) => delays.push(ms),
  };
  return { data, calls, reads, pages, delays, options };
}

test('retries the captured Runner allocation failure exactly once after a delay', async () => {
  const h = harness();
  assert.equal(await retryRunnerAllocation(h.options), true);
  assert.deepEqual(h.delays, [120000]);
  assert.equal(h.reads.length, 2);
  assert.deepEqual(h.pages, [
    { route: 'jobs', params: { owner: 'DarinRowe', repo: 'googletrans', run_id: 37366054230, attempt_number: 1, per_page: 100 } },
    { route: 'annotations', params: { owner: 'DarinRowe', repo: 'googletrans', check_run_id: 111951379040, per_page: 100 } },
  ]);
  assert.deepEqual(h.calls, [{ owner: 'DarinRowe', repo: 'googletrans', run_id: 37366054230 }]);
});

for (const [name, change] of [
  ['successful run', (h) => { h.options.context.payload.workflow_run.conclusion = 'success'; }],
  ['manual cancellation', (h) => { h.options.context.payload.workflow_run.conclusion = 'cancelled'; }],
  ['second attempt', (h) => { h.options.context.payload.workflow_run.run_attempt = 2; }],
  ['release workflow', (h) => { h.options.context.payload.workflow_run.name = 'Release'; }],
  ['unexpected workflow path', (h) => { h.options.context.payload.workflow_run.path = '.github/workflows/release.yml'; }],
  ['forked repository', (h) => { h.options.context.payload.workflow_run.head_repository.full_name = 'someone/googletrans'; }],
  ['manual rerun already requested', (h) => { h.data.run.run_attempt = 2; h.data.run.status = 'queued'; }],
  ['no jobs', (h) => { h.data.jobs = []; }],
  ['only successful jobs', (h) => { h.data.jobs[0].conclusion = 'success'; }],
  ['executed steps', (h) => { h.data.jobs[0].steps = [{ name: 'Test', conclusion: 'failure' }]; }],
  ['assigned Runner', (h) => { h.data.jobs[0].runner_id = 123; }],
  ['named Runner', (h) => { h.data.jobs[0].runner_name = 'hosted'; }],
  ['missing step data', (h) => { delete h.data.jobs[0].steps; }],
  ['missing check run', (h) => { delete h.data.jobs[0].check_run_url; }],
  ['missing annotations', (h) => { h.data.annotations = []; }],
  ['internal server error alone', (h) => { h.data.annotations[0].message = 'Internal server error'; }],
  ['notice instead of error', (h) => { h.data.annotations[0].annotation_level = 'notice'; }],
  ['mixed test and infrastructure failures', (h) => {
    h.data.jobs.push({ ...h.data.jobs[0], id: 2, runner_id: 123, steps: [{ name: 'Test', conclusion: 'failure' }] });
  }],
]) {
  test(`does not retry ${name}`, async () => {
    const h = harness();
    change(h);
    assert.equal(await retryRunnerAllocation(h.options), false);
    assert.deepEqual(h.calls, []);
    assert.deepEqual(h.delays, []);
  });
}

test('does not retry when a manual rerun starts during the delay', async () => {
  const h = harness();
  h.options.wait = async () => { h.data.run.run_attempt = 2; h.data.run.status = 'queued'; };
  assert.equal(await retryRunnerAllocation(h.options), false);
  assert.deepEqual(h.calls, []);
});

test('retries Test when all unfinished jobs have explicit allocation failures', async () => {
  const h = harness();
  for (const run of [h.data.run, h.options.context.payload.workflow_run]) {
    run.name = 'Test';
    run.path = '.github/workflows/test.yml';
    run.event = 'pull_request';
  }
  h.data.jobs.push({ ...h.data.jobs[0], id: 2, conclusion: 'failure' });
  h.data.jobs.push({ id: 3, conclusion: 'success', runner_id: 123 });
  h.data.jobs.push({ id: 4, conclusion: 'skipped' });
  assert.equal(await retryRunnerAllocation(h.options), true);
  assert.equal(h.calls.length, 1);
});

test('surfaces API errors without requesting a retry', async () => {
  const h = harness();
  h.options.github.paginate = async () => { throw new Error('API unavailable'); };
  await assert.rejects(retryRunnerAllocation(h.options), /API unavailable/);
  assert.deepEqual(h.calls, []);
});
