'use strict';

const workflows = {
  Integration: '.github/workflows/integration.yml',
  Test: '.github/workflows/test.yml',
};
const allocationError = 'The job was not acquired by Runner of type hosted even after multiple attempts';

module.exports = async function retryRunnerAllocation({ github, context, core, wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms)) }) {
  const repo = context.repo;
  const eligible = (run) => run.status === 'completed'
    && run.conclusion === 'failure'
    && run.run_attempt === 1
    && Object.hasOwn(workflows, run.name)
    && workflows[run.name] === run.path
    && run.head_repository?.full_name === `${repo.owner}/${repo.repo}`;
  const skip = (reason) => {
    core.info(`Not retrying: ${reason}`);
    return false;
  };

  const run = context.payload.workflow_run;
  if (!eligible(run)) return skip('run is outside the recovery policy');

  const params = { ...repo, run_id: run.id };
  const current = await github.rest.actions.getWorkflowRun(params);
  if (!eligible(current.data)) return skip('run has already changed');

  const jobs = await github.paginate(github.rest.actions.listJobsForWorkflowRunAttempt, {
    ...params,
    attempt_number: run.run_attempt,
    per_page: 100,
  });
  const failedJobs = jobs.filter((job) => !['success', 'skipped'].includes(job.conclusion));
  if (failedJobs.length === 0) return skip('no failed jobs');

  for (const job of failedJobs) {
    if (job.status !== 'completed'
      || !['failure', 'cancelled'].includes(job.conclusion)
      || job.runner_id !== 0
      || job.runner_name !== ''
      || !Array.isArray(job.steps)
      || job.steps.length !== 0) {
      return skip('a job ran or failed for another reason');
    }
    const checkRunId = Number(job.check_run_url?.split('/').pop());
    if (!Number.isSafeInteger(checkRunId) || checkRunId <= 0) return skip('missing check run');
    const annotations = await github.paginate(github.rest.checks.listAnnotations, {
      ...repo,
      check_run_id: checkRunId,
      per_page: 100,
    });
    if (!annotations.some((annotation) => annotation.annotation_level === 'failure'
      && annotation.message === allocationError)) {
      return skip('no explicit hosted Runner allocation error');
    }
  }

  core.info(`Run ${run.id} failed to acquire a hosted Runner; waiting two minutes before retrying.`);
  await wait(120000);

  // Recheck after the delay so a manual rerun takes precedence.
  const latest = await github.rest.actions.getWorkflowRun(params);
  if (!eligible(latest.data)) return skip('run changed during the delay');

  await github.rest.actions.reRunWorkflowFailedJobs(params);
  core.info(`Requested the only automatic retry for run ${run.id}.`);
  return true;
};
