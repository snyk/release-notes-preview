export interface ICommitData {
  feat: string[];
  fix: string[];
  others: string[];
  [key: string]: string[]; // used for the dynamic assigning in processCommits
}
