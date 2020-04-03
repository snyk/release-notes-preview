[![Known Vulnerabilities](https://snyk.io/test/github/snyk/release-notes-preview/badge.svg?targetFile=package.json)](https://snyk.io/test/github/snyk/release-notes-preview?targetFile=package.json)

# snyk/release-notes-preview #

## Summary ##

GitHub Action to provide preview of expected release notes based on [Semantic Release](https://github.com/semantic-release/semantic-release).
The preview would be posted on every pull request opened against the desired branch(es).

## Prerequisites ##

An authentication token for GitHub, used for posting the preview of the release notes.

## Example ##

1. Generate a GitHub token with sufficient write access to the repository. Privileges depend on whether the project is open sourced or not.
2. Add the GitHub token as a secret to the repository, named `RELEASE_NOTES_GITHUB_TOKEN`.
3. Use GitHub's API `https://api.github.com/users/your_github_user_name` to find the ID of the user the token belongs to, we use it in the next step to delete previous comments on pull requests from the user so we don't litter the PR over and over.
4. Create a file with the following content under `.github/workflows/release-notes.yaml`:

```
name: Release-Notes-Preview

on:
  pull_request:
    branches: [ master ]

jobs:
  preview:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - run: |
        git fetch --prune --unshallow --tags
    - uses: snyk/release-notes-preview@v1.3.5
      with:
        releaseBranch: master
        githubPosterId: <ID from step 3>
      env:
        GITHUB_PR_USERNAME: ${{ github.actor }}
        GITHUB_TOKEN: ${{ secrets.RELEASE_NOTES_GITHUB_TOKEN }}
```
