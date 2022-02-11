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

export const InstructionToText = {
  CastVote: "Vote Cast",
  PostMessage: "Message Posted",
  DepositGoverningTokens: "Gov. Tokens Deposited",
  WithdrawGoverningTokens: "Gov. Tokens Withdrawn",
  RelinquishVote: "Vote Relinquished",
  CreateRealm: "Create Realm",
  SetGovernanceDelegate: "Gonvernance Delegate Set",
  CreateGovernance: "Governance Created",
  CreateProgramGovernance: "Governance Program Created",
  CreateProposal: "Proposal Created",
  AddSignatory: "Signatory Added",
  RemoveSignatory: "Signatory Removed",
  CancelProposal: "Proposal Canceled",
  SignOffProposal: "Proposal Signed off",
  FinalizeVote: "Vote Finalized",
  ExecuteTransaction: "Transaction Executed",
  CreateMintGovernance: "Created Governance Mint",
  CreateTokenGovernance: "Created Token Governance",
  SetGovernanceConfig: "Set Governance Config",
  FlagTransactionError: "Flagged Transaction Error",
  SetRealmAuthority: "Set Realm Authority",
  SetRealmConfig: "Set Realm Config",
  CreateTokenOwnerRecord: "Created Token Owner Record",
  UpdateProgramMetadata: "Updated Program Metadata",
  CreateNativeTreasury: "Created Native Treasury",
  RemoveTransaction: "Removed Transaction",
  InsertTransaction: "Inserted Transaction",
  InvalidInstructionData: "Invalid Transaction", // not a governance instruction just bad attempt
};

export const extractLogInfo = (informationLogs: any) => {
  let errorLog = "";
  const instructionLogs = [];

  informationLogs.forEach((log: string) => {
    if (log.includes("Program log: Error:")) {
      errorLog = "Data in instruction invalid";
      instructionLogs.push(InstructionToText["InvalidInstructionData"]);
    }
    if (log.includes("GOVERNANCE-ERROR")) {
      errorLog = log.split("Program log: GOVERNANCE-ERROR: ")[1];
    }
    if (log.includes("GOVERNANCE-INSTRUCTION")) {
      const instructionString = log.split(
        "Program log: GOVERNANCE-INSTRUCTION: "
      )[1];
      // sometimes, logs have more info after the instruction keyword
      const actualInstruction = instructionString.split(" ")[0];
      // @ts-ignore
      const plainText = InstructionToText[actualInstruction];
      if (plainText) {
        instructionLogs.push(plainText);
      } else {
        instructionLogs.push(actualInstruction);
      }
    }
    if (log.includes("GOVERNANCE-CHAT-INSTRUCTION")) {
      const instructionString = log.split(
        "Program log: GOVERNANCE-CHAT-INSTRUCTION: "
      )[1];
      // sometimes, logs have more info after the instruction keyword
      const actualInstruction = instructionString.split(" ")[0];
      // @ts-ignore
      const plainText = InstructionToText[actualInstruction];
      if (plainText) {
        instructionLogs.push(plainText);
      } else {
        instructionLogs.push(actualInstruction);
      }
    }
  });

  const uniqueInstructionLogs = new Set(instructionLogs);
  const uniqueInstructionLogsArray = Array.from(uniqueInstructionLogs);

  // clean instruction logs to only get unique values
  return { errorLog: errorLog, instructionLogs: uniqueInstructionLogsArray };
};
