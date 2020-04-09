import * as comment from './comment';
import * as commit from './commit';
import * as compose from './compose';

import { commitStatusPending, commitStatusSuccess } from './commit-status';

// TODO type
export async function handlePullRequest(eventObj: any): Promise<void> {
  const issueUrl = eventObj.pull_request.issue_url;
  await comment.deleteExistingComments(issueUrl);

  const commitsData = await commit.getCommits();
  const message = compose.previewFromCommits(commitsData);
  if (!message) {
    console.log('no relevant changes detected, exiting gracefully');
    await commitStatusSuccess(eventObj.pull_request.statuses_url);
    process.exit(0);
  }

  comment.postComment(issueUrl, message);
  await commitStatusPending(eventObj.pull_request.statuses_url);
}
