"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_promise_1 = require("child-process-promise");
const config = require("./config");
async function getCommits() {
    const lastVersion = await getLastReleasedVersion();
    const commitHeaders = await commitHeadersSinceVersion(lastVersion);
    return processCommits(commitHeaders);
}
exports.getCommits = getCommits;
async function getLastReleasedVersion() {
    const releaseBranch = `origin/${config.RELEASE_BRANCH}`;
    const lastVersionOutput = await child_process_promise_1.spawn('git', ['describe', '--abbrev=0', '--tags', releaseBranch], { capture: ['stdout', 'stderr'] });
    return lastVersionOutput.stdout.trim();
}
async function commitHeadersSinceVersion(version) {
    const commitsSinceLastVersionOutput = await child_process_promise_1.spawn('git', ['log', '--no-decorate', `${version}..HEAD`, '--oneline'], { capture: ['stdout', 'stderr'] });
    return commitsSinceLastVersionOutput.stdout.trim().split('\n');
}
// TODO: handle merges and reverts
function processCommits(commitHeaders) {
    const processedCommits = {
        feat: [],
        fix: [],
        others: [],
    };
    for (const commitHeader of commitHeaders) {
        const line = commitHeader.trim();
        const words = line.split(' ');
        const hash = words[0];
        const prefix = `${words[1]}:`;
        const rest = words.slice(2).join(' ');
        const lineDescription = `${rest} (${hash})`;
        if (prefix in Object.keys(processedCommits)) {
            processedCommits[prefix].push(lineDescription);
        }
        else {
            processedCommits['others'].push(lineDescription);
        }
    }
    return processedCommits;
}
//# sourceMappingURL=commits.js.map