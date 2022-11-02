import numeral from "numeral";
import { PublicKey } from "@solana/web3.js";

export * from "./cleanData";
export * from "./member";

export const abbreviatePublicKey = (
  publicKey: string,
  numberOfLetter: number = 4
) => {
  return `${publicKey?.slice(0, numberOfLetter)}...${publicKey?.slice(
    -numberOfLetter
  )}`;
};

export const formatVoteWeight = (
  tokenAmt: string,
  decimal: number,
  customFormat: string = "0,0"
): string => {
  const formattedWeight = decimal > 0 ? tokenAmt?.slice(0, -decimal) : tokenAmt;

  return numeral(Number(formattedWeight)).format(customFormat);
};

export const getFilteredTokens = (nfts: Array<any>, tokens: Array<Token>) => {
  let filteredTokens = [];
  let nftsMintMap = {};

  // if we have no nfts, just return all tokens
  if (!nfts || nfts?.length === 0) {
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

export const tryParseKey = (key: string): PublicKey | null => {
  try {
    return new PublicKey(key);
  } catch (error) {
    return null;
  }
};

export * from "./gql";
