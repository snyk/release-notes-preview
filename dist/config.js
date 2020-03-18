"use strict";
const initialConfig = {
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    RELEASE_BRANCH: process.env.INPUT_RELEASEBRANCH,
    GITHUB_POSTER_ID: process.env.INPUT_GITHUBPOSTERID,
    GITHUB_PR_USERNAME: process.env.GITHUB_PR_USERNAME,
};
if (!initialConfig.GITHUB_TOKEN) {
    throw new Error('missing GITHUB_TOKEN');
}
if (!initialConfig.RELEASE_BRANCH) {
    throw new Error('missing input: releaseBranch');
}
if (!initialConfig.GITHUB_POSTER_ID) {
    throw new Error('missing input: githubPosterId');
}
const posterId = parseInt(initialConfig.GITHUB_POSTER_ID);
const config = {
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    RELEASE_BRANCH: process.env.INPUT_RELEASEBRANCH,
    GITHUB_POSTER_ID: posterId,
    GITHUB_PR_USERNAME: process.env.GITHUB_PR_USERNAME,
};
module.exports = config;
//# sourceMappingURL=config.js.map