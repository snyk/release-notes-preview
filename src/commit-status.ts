export async function commitStatusPending(url: string): Promise<void> {
  await postCommitStatus(
    url,
    'pending',
    'awaiting release notes review',
  );
}

export async function commitStatusSuccess(url: string): Promise<void> {
  await postCommitStatus(
    url,
    'success',
    'release notes reviewed',
  );
}

async function postCommitStatus(
  url: string,
  state: string,
  description: string,
  ): Promise<void> {
  const config = require('./config');
  const options = {
    json: true,
    compressed: true,
    headers: {
      Authorization: 'token ' + config.GITHUB_TOKEN,
    },
  };

  const statusPayload = {
    state,
    description,
    context: 'Release Notes Confirmation',
  };

  const needle = require('needle');
  await needle('post', url, statusPayload, options);
}
