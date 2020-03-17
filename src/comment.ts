import * as needle from 'needle';

import * as config from './config';

export async function postComment(issueUrl: string, commentText: string): Promise<void> {
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
