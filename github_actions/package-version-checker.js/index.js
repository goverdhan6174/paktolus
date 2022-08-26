/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 396:
/***/ ((module) => {

module.exports = eval("require")("@actions/core");


/***/ }),

/***/ 716:
/***/ ((module) => {

module.exports = eval("require")("@actions/github");


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId](module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const core = __nccwpck_require__(396);
const github = __nccwpck_require__(716);

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
    .then((res) => res.json())
    .then((res) => res.version)
    .then((version) => {
      const localVersion = require(`${process.env.GITHUB_WORKSPACE}/package.json`).version;

      if (!isValidFormat('version')) 
       core.setFailed(`Version '${version}' detected as invalid one. Format {{ n.n.n }} where n is number`);
      if (!isValidBumped(version, localVersion)) 
       core.setFailed(`Version '${version}' wasn't detected as greater than '${localVersion}'`);
    })
    .catch(core.setFailed);
} catch (error) {
  core.setFailed(error.message);
}

})();

module.exports = __webpack_exports__;
/******/ })()
;