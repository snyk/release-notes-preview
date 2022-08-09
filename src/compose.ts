import * as config from './config';
import { ICommitData } from './types';

const listSeperator = '* ';

export function previewFromCommits(commitsData: ICommitData): string {
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
    body += '\n_Features_:\n' + commitsData.feat.join(listSeperator) + '\n';
  }
  if (commitsData.fix.length > 0) {
    body += '\n_Fixes_:\n' + commitsData.fix.join(listSeperator) + '\n';
  }
  if (commitsData.others.length > 0) {
    body += '\n_Others (will not be included in Semantic-Release notes)_:\n' + commitsData.others.join(listSeperator);
  }

  // TODO probably make this configurable
  body += '\n' + config.ACKNOWLEDGEMENT.UNCHECKED;

  return `${title}\n${body}`;
}
