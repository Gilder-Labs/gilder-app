interface Member {
  publicKey: string;
  owner: string;
  totalVotesCount: number;
  outstandingProposalCount: number;
  governingTokenOwner: string;
  depositAmount: string;
  governingTokenMint: string;
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
