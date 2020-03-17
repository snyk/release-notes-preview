"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = require("./config");
function previewFromCommits(commitsData) {
    if (commitsData.feat.length === 0 && commitsData.fix.length === 0) {
        return '';
    }
    let title = '**Expected release notes';
    if (config.GITHUB_PR_USERNAME) {
        title += ` (by @${config.GITHUB_PR_USERNAME})`;
    }
    title += '**';
    let body = '';
    if (commitsData.feat.length > 0) {
        body += '\n_features_:\n' + commitsData.feat.join('\n') + '\n';
    }
    if (commitsData.fix.length > 0) {
        body += '\n_fixes_:\n' + commitsData.fix.join('\n') + '\n';
    }
    if (commitsData.others.length > 0) {
        body += '\n_others (will not be included in Semantic-Release notes)_:\n' + commitsData.feat.join('\n');
    }
    return `${title}\n${body}`;
}
exports.previewFromCommits = previewFromCommits;
//# sourceMappingURL=compose.js.map