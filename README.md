[![Known Vulnerabilities](https://snyk.io/test/github/snyk/release-notes-preview/badge.svg?targetFile=package.json)](https://snyk.io/test/github/snyk/release-notes-preview?targetFile=package.json)

# snyk/release-notes-preview #

## Summary ##

GitHub Action to provide preview of expected release notes based on [Semantic Release](https://github.com/semantic-release/semantic-release).
The preview would be posted on every pull request opened against the desired branch(es).
A _pending_ commit status titled `Release Notes Confirmation` would be created when initially posting the release notes.
The commit status would change to _success_ once the checkbox at the bottom of the release notes preview is checked.

## Setup ##

Create a file with the following content under `.github/workflows/release-notes.yaml`:

```
name: Release-Notes-Preview

on:
  pull_request:
    branches: [ master ]
  issue_comment:
    types: [ edited ]

jobs:
  preview:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - run: |
        git fetch --prune --unshallow --tags
    - uses: snyk/release-notes-preview@v1.6.2
      with:
        releaseBranch: master
      env:
        GITHUB_PR_USERNAME: ${{ github.actor }}
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
