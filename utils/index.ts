export * from "./cleanData";
export * from "./setupWalletConnect";
export * from "./member";

export const abbreviatePublicKey = (publicKey: string) => {
  return `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`;
};
