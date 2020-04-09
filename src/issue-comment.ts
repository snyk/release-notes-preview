const needle = require('needle');

import * as config from './config';
import { commitStatusSuccess } from './commit-status';

// TODO type
export async function handleIssueComment(eventObj: any): Promise<void> {
  const changesFrom = eventObj.changes.body.from;
  const markOfTheSabichFound = changesFrom.indexOf(config.ACKNOWLEDGEMENT.UNCHECKED) !== -1;
  const newComment = eventObj.comment.body;
  const markOfAcknowledgedSabich = newComment.indexOf(config.ACKNOWLEDGEMENT.CHECKED) !== -1;

  if (!(markOfTheSabichFound && markOfAcknowledgedSabich)) {
    console.log('some issue comment was edited but nothing interesting', markOfTheSabichFound, markOfAcknowledgedSabich);
    return;
  }

  const options = {
    json: true,
    compressed: true,
    headers: {
      Authorization: 'token ' + config.GITHUB_TOKEN,
    },
  };

  const pullRequest = await needle('get', eventObj.issue.pull_request.url, null, options);
  const statusesUrl = pullRequest.body.statuses_url;
  await commitStatusSuccess(statusesUrl);
}
