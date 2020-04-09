import * as fs from 'fs';

import { handlePullRequest } from './pull-request';
import { handleIssueComment } from './issue-comment';

async function main() {
  const eventName = process.env.GITHUB_EVENT_NAME;
  if (eventName !== 'pull_request' && eventName !== 'issue_comment') {
    process.exit(1);
  }

  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (!eventPath) {
    console.log('Couldn\'t find the event file path.');
    process.exit(1);
  }

  const eventData = fs.readFileSync(eventPath, 'utf8');
  const eventObj = JSON.parse(eventData);

  if (eventName === 'pull_request') {
    await handlePullRequest(eventObj);
    return;
  }

  if (eventName === 'issue_comment' && eventObj.action === 'edited') {
    await handleIssueComment(eventObj);
    return;
  }
}

main();
