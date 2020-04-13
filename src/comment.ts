import * as needle from 'needle';

import * as config from './config';

const options = {
  json: true,
  compressed: true,
  headers: {
    Authorization: 'token ' + config.GITHUB_TOKEN,
  },
};

export async function postComment(issueUrl: string, commentText: string): Promise<void> {
  const url = `${issueUrl}/comments`;
  const payload = {
    body: commentText,
  };

  await needle('post', url, payload, options);
}

export async function deleteExistingComments(issueUrl: string): Promise<void> {
  const listCommentsUrl = `${issueUrl}/comments`;
  const payload = null;

  const commentsResponse = await needle('get', listCommentsUrl, payload, options);
  const comments = commentsResponse.body;

  const deleteRequests: any[] = [];
  for (const comment of comments) {
    // TODO: identify comments to delete better
    // can also check comment.user: login, id, type
    if ((comment.body.indexOf(config.ACKNOWLEDGEMENT.CHECKED) === -1) &&
      (comment.body.indexOf(config.ACKNOWLEDGEMENT.UNCHECKED) === -1)) {
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
