import realmsMainnet from "../constants/realms/mainnet-beta.json";
import { TokenListProvider, TokenInfo } from "@solana/spl-token-registry";
// For tokens spl-token-registry
const ENV = {
  MainnetBeta: 101,
  Testnet: 102,
  Devnet: 103,
};

// cleans realm data from governance ui repo
export const cleanRealmData = () => {
  let realmsData = {};

  realmsMainnet.map((realm) => {
    // @ts-ignore
    realmsData[`${realm.realmId}`] = realm;
  });

  return realmsData;
};

export const getTokensInfo = async () => {
  let tokensInfo;
  let tokens = await new TokenListProvider().resolve();

  const tokenList = tokens.filterByChainId(ENV.MainnetBeta).getList();

  tokensInfo = await tokenList.reduce((map, item) => {
    map.set(item.address, item);
    return map;
  }, new Map());

  return tokensInfo;
};
