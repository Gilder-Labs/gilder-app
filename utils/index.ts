import numeral from "numeral";

export * from "./cleanData";
export * from "./setupWalletConnect";
export * from "./member";

export const abbreviatePublicKey = (publicKey: string) => {
  return `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`;
};

export const formatVoteWeight = (tokenAmt: string, decimal: number): string => {
  const formattedWeight = decimal > 0 ? tokenAmt.slice(0, -decimal) : tokenAmt;

  return numeral(Number(formattedWeight)).format("0,0");
};

export const getFilteredTokens = (nfts: Array<any>, tokens: Array<Token>) => {
  let filteredTokens = [];
  let nftsMintMap = {};

  // if we have no nfts, just return all tokens
  if (!nfts || nfts.length === 0) {
    return tokens;
  }

  nfts.forEach((nft: any) => {
    // @ts-ignore
    nftsMintMap[nft.mintAddress] = nft;
  });

  // @ts-ignore
  filteredTokens = tokens.filter((token) => !nftsMintMap[token.mint]);

  return filteredTokens;
};
