import json
import os
import requests
import subprocess
import sys

eventName = os.environ['GITHUB_EVENT_NAME']
if eventName != 'pull_request':
    sys.exit(0)

GITHUB_USERNAME = os.environ.get('GITHUB_USERNAME', 'USER_NOT_FOUND')
GITHUB_OWNER_AND_REPO = os.environ['GITHUB_REPOSITORY']
GITHUB_TOKEN = os.environ['GITHUB_TOKEN']
if not GITHUB_TOKEN:
    print('GITHUB_TOKEN is missing')
    sys.exit(1)

eventPath = os.environ['GITHUB_EVENT_PATH']
with open(eventPath) as f:
    eventData = json.loads(f.read())
    print('**************************')
    print(eventData)
    print('**************************')

def main():
    headers = {'Authorization': 'token ' + GITHUB_TOKEN}
    # TODO error handling
    pullRequestUrl = eventData['pull_request']['url']
    print(pullRequestUrl)
    pullRequest = requests.get(pullRequestUrl)
    pullRequestObject = pullRequest.json()
    if 'message' in pullRequestObject and pullRequestObject['message'] == 'Not Found':
        print('could not find this PR, probably insufficient privileges on the token!', pullRequestUrl)
        sys.exit(1)

    print(pullRequestObject)
    issue = pullRequestObject['_links']['issue']

    # get all existing comments for this issue/PR
    allCommentsResponse = requests.get(
        '%s/comments' % issue['href'],
        headers=headers,
    ).json()

    # TODO replace login & id for the details of the token
    commentIds = [
        comment['id'] for comment in allCommentsResponse
        if comment['user']['login'] == 'snyk-deployer'
        and comment['user']['id'] == 18642669
        and 'Expected release notes' in comment['body']
    ]

    # delete old & irrelevant release notes previews
    for id in commentIds:
        requests.delete(
            'https://api.github.com/repos/{orgAndRepo}/issues/comments/{commentId}'.format(orgAndRepo=GITHUB_OWNER_AND_REPO, commentId=id),
            headers=headers,
        )

    # TODO: "master" needs to be parameterised
    lastVersion = subprocess.check_output(['git', 'describe', '--abbrev=0', '--tags', 'origin/master'], text=True, stderr=subprocess.STDOUT).strip()
    commitsSinceLastVersion = subprocess.check_output(['git', 'log', '--no-decorate', lastVersion + '..HEAD', '--oneline'], text=True).strip()
    commits = processCommits(commitsSinceLastVersion)
    if not (commits['features'] or commits['fixes']):
        sys.exit(0)

    # post new release notes
    textToPost = getTextToPost(commits)
    comment = '*{title}*\n{body}'.format(**textToPost)
    requests.post(
        '%s/comments' % issue['href'],
        json={'body': comment},
        headers=headers,
    )

def processCommits(commitsSinceLastVersion):
    # TODO: handle reverts
    # TODO: handle merges
    commits = {
        "features": [],
        "fixes": [],
        "others": [],
    }

    lines = commitsSinceLastVersion.split('\n')
    for line in lines:
        words = line.split(' ')
        hash = words[0]
        prefix = words[1]
        rest = ' '.join(words[2:])

        title = ''.join(rest) + ' (%s)' % hash
        if prefix == 'feat:':
            commits['features'].append(title)
        elif prefix == 'fix:':
            commits['fixes'].append(title)
        else:
            commits['others'].append(title)
    
    return commits

def getTextToPost(commits):
    textToPost = {
        'title': 'Expected release notes (by @%s)' % GITHUB_USERNAME,
        'body': '',
    }

    if commits['features']:
        textToPost['body'] += '\nfeatures:\n' + '\n'.join(commits['features'])
    if commits['fixes']:
        textToPost['body'] += '\n\nfixes:\n' + '\n'.join(commits['fixes'])
    if commits['others']:
        textToPost['body'] += '\n\nothers (will not be included in Semantic-Release notes):\n' + '\n'.join(commits['others'])

    return textToPost

if __name__ == '__main__':
    main()
