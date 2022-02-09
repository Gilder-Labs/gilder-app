import realmsMainnet from "../constants/realms/mainnet-beta.json";
import { TokenListProvider, TokenInfo } from "@solana/spl-token-registry";
import { GovernanceInstruction } from "@solana/spl-governance";

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

export const extractLogInfo = (informationLogs: any) => {
  let errorLog = "";
  const instructionLogs = [];

  informationLogs.forEach((log: string) => {
    if (log.includes("GOVERNANCE-ERROR")) {
      console.log("FOUND AN ERROR", log);
      const errorString = log.split("Program log: GOVERNANCE-ERROR: ")[1];
      errorLog = errorString;
    }
    if (log.includes("GOVERNANCE-INSTRUCTION")) {
      const instructionString = log.split(
        "Program log: GOVERNANCE-INSTRUCTION: "
      )[1];
      // sometimes, logs have more info after the instruction keyword
      const actualInstruction = instructionString.split(" ")[0];
      instructionLogs.push(actualInstruction);
    }
  });

  const uniqueInstructionLogs = new Set(instructionLogs);
  const uniqueInstructionLogsArray = Array.from(uniqueInstructionLogs);

  // clean instruction logs to only get unique values
  return { errorLog: errorLog, instructionLogs: uniqueInstructionLogsArray };
};
