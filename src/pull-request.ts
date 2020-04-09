import * as comment from './comment';
import * as commit from './commit';
import * as compose from './compose';

import { postCommitStatus } from './commit-status';

// TODO type
export async function handlePullRequest(eventObj: any): Promise<void> {
  const issueUrl = eventObj.pull_request.issue_url;
  await comment.deleteExistingComments(issueUrl);

  const commitsData = await commit.getCommits();
  const message = compose.previewFromCommits(commitsData);
  if (!message) {
    console.log('no relevant changes detected, exiting gracefully');
    process.exit(0);
  }

  comment.postComment(issueUrl, message);
  await postCommitStatus(eventObj.pull_request.statuses_url, 'pending', 'awaiting release notes review');
}
