"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const needle = require("needle");
const config = require("./config");
const options = {
    json: true,
    compressed: true,
    headers: {
        Authorization: 'token ' + config.GITHUB_TOKEN,
    },
};
async function postComment(issueUrl, commentText) {
    const url = `${issueUrl}/comments`;
    const payload = {
        body: commentText,
    };
    await needle('post', url, payload, options);
}
exports.postComment = postComment;
async function deleteExistingComments(issueUrl) {
    const listCommentsUrl = `${issueUrl}/comments`;
    const payload = null;
    const commentsResponse = await needle('get', listCommentsUrl, payload, options);
    const comments = commentsResponse.body;
    const deleteRequests = [];
    for (const comment of comments) {
        if (comment.user.id !== config.GITHUB_POSTER_ID) {
            continue;
        }
        const deleteUrl = comment.url;
        console.log('deleting comment', deleteUrl);
        const deleteRequest = needle('delete', deleteUrl, payload, options);
        deleteRequests.push(deleteRequest);
    }
    // TODO: throttle if needed
    // right now it is expected that no more than 1 request will be present
    await Promise.all(deleteRequests);
}
exports.deleteExistingComments = deleteExistingComments;
//# sourceMappingURL=comment.js.map