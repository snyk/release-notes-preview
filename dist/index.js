"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const needle = require("needle");
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const eventName = process.env.GITHUB_EVENT_NAME;
if (eventName !== 'pull_request') {
    process.exit(1);
}
const eventPath = process.env.GITHUB_EVENT_PATH;
if (!eventPath) {
    console.log('Couldn\'t find the event file path.');
    process.exit(1);
}
const eventData = fs.readFileSync(eventPath, 'utf8');
const eventObj = JSON.parse(eventData);
console.log(eventObj);
async function postComment(issueUrl) {
    const url = `${issueUrl}/comments`;
    const payload = {
        body: 'There\'s butter on my face!',
    };
    const options = {
        json: true,
        compressed: true,
        headers: {
            Authorization: 'token ' + GITHUB_TOKEN,
        },
    };
    try {
        await needle('post', url, payload, options);
        console.log('huzzah!');
    }
    catch (err) {
        console.log('I have no idea what I\'m doing');
    }
}
const issueUrl = eventObj.pull_request.issue_url;
postComment(issueUrl);
//# sourceMappingURL=index.js.map