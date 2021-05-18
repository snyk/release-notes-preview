import { spawn } from 'child-process-promise';

import * as config from './config';
import { ICommitData } from './types';

export async function getCommits(): Promise<ICommitData> {
  const lastVersion = await getLastReleasedVersion();
  const commitHeaders = await commitHeadersSinceVersion(lastVersion);
  return processCommits(commitHeaders);
}

async function getLastReleasedVersion(): Promise<string> {
  const releaseBranch = `origin/${config.RELEASE_BRANCH}`;

  const lastVersionOutput = await spawn(
    'git', ['describe', '--abbrev=0', '--tags', releaseBranch],
    {capture: [ 'stdout', 'stderr' ]},
  );
  return lastVersionOutput.stdout.trim();
}

async function commitHeadersSinceVersion(version: string): Promise<string[]> {
  const commitsSinceLastVersionOutput = await spawn(
    'git', ['log', '--no-decorate', `${version}..HEAD`, '--oneline'],
    {capture: [ 'stdout', 'stderr' ]},
  )
  return commitsSinceLastVersionOutput.stdout.trim().split('\n');
}

function getTypeAndScope(prefix: string): { type: string, scope?: string } {
  const matches = /^([^(]*)(?:\(([^)]+)\))?:/.exec(prefix);
  if (!matches) {
    // Malformed commit prefix. Try our best.
    return { 
      type: prefix.split(':')[0] || ''
    };
  }
  return {
    type: matches[0],
    scope: matches[1]
  };
}

// TODO: handle merges and reverts
function processCommits(commitHeaders: string[]): ICommitData {
  const processedCommits: ICommitData = {
    feat: [],
    fix: [],
    others: [],
  };

  for (const commitHeader of commitHeaders) {
    try {
      const line = commitHeader.trim();
      console.log('processing line:', line);
      const words = line.split(' ');
  
      if (words.length <= 1) {
        console.log('missing commit message, not processing it');
        continue;
      }
  
      if (words[1] === 'Merge') { // hack
        console.log('treating line as a merge commit, not processing it');
        continue;
      }
  
      if (!words[1].endsWith(':')) {
        console.log('unknown prefix', words[1], 'treating it as misc');
        processedCommits['others'].push(line);
        continue;
      }
  
      const hash = words[0];
      const { type, scope } = getTypeAndScope(words[1]);
      const rest = words.slice(2).join(' ');
  
      const lineDescription = [
        scope ? `${scope}:` : undefined,
        rest,
        `(${hash})`
      ].filter(part => !!part).join(' ');
      
      if (type in processedCommits) {
        console.log(`adding "${lineDescription}" to ${type}`);
        processedCommits[type].push(lineDescription);
      } else {
        console.log(`adding "${lineDescription}" to others`);
        processedCommits['others'].push(lineDescription);
      }
    } catch (err) {
      console.log(`couldn't handle commit title ${commitHeader}: ${err}`);
    }
  }

  return processedCommits;
}
