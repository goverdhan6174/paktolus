const core = require('@actions/core');
const github = require('@actions/github');

function isValidFormat(version) {
  let isValid = true;
  const splitVersionArray = version.split('.');
  splitVersionArray.forEach((str) => {
    if (isNaN(Number(str))) isValid = false;
  });
  if (splitVersionArray.length > 3) isValid = false;
  return isValid;
}

function isValidBumped(nextVersion, previousVersion) {
  const covertToNumberArray = (version) => {
    const versionArray = version.split('.').map(Number);
    if (!versionArray[0]) versionArray[0] = -1;
    if (!versionArray[1]) versionArray[1] = 0;
    if (!versionArray[2]) versionArray[2] = 0;
    return versionArray;
  };

  let currArrayVersion = covertToNumberArray(nextVersion);
  let prevArrayVersion = covertToNumberArray(previousVersion);

  /**
   * Incrementing semantic versions {{ Major.Minor.Patch }} stage
   * Rules
   * Start with 1.0.0
   * X should be +1
   * Patch 1.0.X
   * Minor 1.X.0
   * Major X.0.0
   */

  if (
    currArrayVersion[0] < 1 ||
    currArrayVersion[1] < 0 ||
    currArrayVersion[2] < 0
  )
    return false;

  if (
    (currArrayVersion[0] + 1 === prevArrayVersion[0] &&
      currArrayVersion[1] === 0 &&
      currArrayVersion[2] === 0) ||
    (currArrayVersion[0] === prevArrayVersion[0] &&
      currArrayVersion[1] + 1 === prevArrayVersion[1] &&
      currArrayVersion[2] === 0) ||
    (currArrayVersion[0] === prevArrayVersion[0] &&
      currArrayVersion[1] === prevArrayVersion[1] &&
      currArrayVersion[2] + 1 === prevArrayVersion[2])
  )
    return true;

  return false;
}

try {
  if (github.context.eventName !== 'pull_request') {
    core.info('Skipping as it is not pull request');
    return;
  }

  const token = core.getInput('token');
  const repo = github.context.repo.repo;
  const owner = github.context.repo.owner;
  const baseSha = github.context.payload.pull_request.base.sha;
  const headSha = github.context.payload.pull_request.head.sha;

  const octokit = github.getOctokit(token, { required: true });

  const headers = {};
  if (token) {
    core.info('Using specified token');
    headers.Authorization = `token ${token}`;
  }

  core.info(`Comparing ${headSha} to ${baseSha}`);
  const baseUrl = `https://raw.githubusercontent.com/:owner/:repo/:baseSha/package.json`;

  octokit
    .request(`GET ${baseUrl}`, { owner, repo, baseSha })
    .then((res) => {
      return JSON.parse(res.data);
    })
    .then((res) => res.version)
    .then((version) => {
      const localVersion =
        require(`${process.env.GITHUB_WORKSPACE}/package.json`).version;

      if (!isValidFormat(version))
        core.setFailed(
          `Version '${version}' detected as invalid one. Format {{ n.n.n }} where n is number`
        );
      if (!isValidBumped(version, localVersion))
        core.setFailed(
          `Version '${version}' wasn't detected as greater than '${localVersion}'`
        );
    })
    .catch(core.setFailed);
} catch (error) {
  core.setFailed(error.message);
}
