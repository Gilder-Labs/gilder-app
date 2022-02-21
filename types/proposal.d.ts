interface Proposal {
  description: string;
  name: string;
  proposalId: string;
  status: string;
  isVoteFinalized: boolean;
  isFinalState: boolean;
  getStateSortRank: number;
  isPreVotingState: boolean;
  getYesVoteCount: string;
  getNoVoteCount: string;
  getStateTimestamp: number;
  votingAt: number;
  signingOffAt: number;
  votingCompletedAt: number;
  draftAt: number;
  executingAt: number;
}
