interface Realm {
  name: string;
  pubKey: string;
  realmId: string;

  communityMint: string;
  communityMintDecimals: number;
  communityMintSupply: string;
  councilMint: string;
  councilMintDecimals: number;
  councilMintSupply: string;
  governanceId: string;
  accountType: number;
  votingProposalCount: number;
  maxVoteWeight: number;
  minTokensToCreateGov: string;
  fmtSupplyFraction: string;
  supplyFraction: number;
  isFullSupply: boolean;
}
