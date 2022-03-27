interface Member {
  publicKey: string;
  owner: string;
  totalVotesCount: number;
  outstandingProposalCount: number;
  walletId: string; // wallet address
  totalVotesCommunity: number;
  communityDepositUiAmount: string;
  communityDepositAmount: string;
  communityTokenMint: string;
  totalVotesCouncil: number;
  councilDepositUiAmount: string;
  councilDepositAmount: string;
  councilTokenMint: string;
}

interface ChatMessage {
  postedAt: number;
  replyTo: string | null;
  proposalId: string;
  body: string;
  author: string;
  isReply: boolean;
  isReaction: boolean;
}

interface MemberVote {
  proposalId: string;
  isRelinquished: boolean;
  voterWeightNo: string;
  voteWeightYes: string;
}
