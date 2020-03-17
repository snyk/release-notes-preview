"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const needle = require("needle");
const config = require("./config");
async function postComment(issueUrl, commentText) {
    const url = `${issueUrl}/comments`;
    const payload = {
        body: commentText,
    };
    const options = {
        json: true,
        compressed: true,
        headers: {
            Authorization: 'token ' + config.GITHUB_TOKEN,
        },
    };
    await needle('post', url, payload, options);
}
exports.postComment = postComment;
//# sourceMappingURL=comment.js.map