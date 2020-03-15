const fs = require('fs');
const needle = require('needle');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const eventName = process.env.GITHUB_EVENT_NAME;
if (eventName !== 'pull_request') {
  process.exit(1);
}

const eventPath = process.env.GITHUB_EVENT_PATH;
const eventData = fs.readFileSync(eventPath);
const event = JSON.parse(eventData);
console.log(event);

const issueUrl = event.pull_request.issue_url;

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


needle('post', url, payload, options)
  .then((response) => {
    console.log('huzzah!');
  }).catch((err) => {
    console.log('I have no idea what I\'m doing');
  });
