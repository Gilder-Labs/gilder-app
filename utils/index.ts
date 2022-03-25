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
