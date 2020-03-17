import * as fs from 'fs';

// only imports that start with 'com'
import * as comment from './comment';
import * as commit from './commit';
import * as compose from './compose';

async function main() {
  // TODO: move to a different module?
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
  // console.log(eventObj);

  const commitsData = await commit.getCommits();
  const message = compose.previewFromCommits(commitsData);
  if (!message) {
    console.log('no relevant changes detected, exiting gracefully');
    process.exit(0);
  }

  // TODO: list all comments
  // TODO: delete all relevant comments
  const issueUrl = eventObj.pull_request.issue_url;
  comment.postComment(issueUrl, message);
}

main();
