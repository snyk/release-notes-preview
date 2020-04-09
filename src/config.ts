const initialConfig = {
  GITHUB_TOKEN: process.env.GITHUB_TOKEN,
  RELEASE_BRANCH: process.env.INPUT_RELEASEBRANCH,
  GITHUB_PR_USERNAME: process.env.GITHUB_PR_USERNAME,
};

if (!initialConfig.GITHUB_TOKEN) {
  throw new Error('missing GITHUB_TOKEN');
}

if (!initialConfig.RELEASE_BRANCH) {
  throw new Error('missing input: releaseBranch');
}

const config = {
  GITHUB_TOKEN: process.env.GITHUB_TOKEN!,
  RELEASE_BRANCH: process.env.INPUT_RELEASEBRANCH!,
  GITHUB_PR_USERNAME: process.env.GITHUB_PR_USERNAME,
  ACKNOWLEDGEMENT: {
    CHECKED: '- [x] I hereby acknowledge these release notes are 🥙 AWESOME 🥙',
    UNCHECKED: '- [ ] I hereby acknowledge these release notes are 🥙 AWESOME 🥙',
  }
}

export = config;
