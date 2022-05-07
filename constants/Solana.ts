import { PublicKey } from "@solana/web3.js";
import Constants from "expo-constants";

export const REALM_GOVERNANCE_PROGRAM_ID =
  "GovER5Lthms3bLBqWub97yVrMmEogzX7xNjdXpPPCVZw";

export const REALM_GOVERNANCE_PKEY = new PublicKey(REALM_GOVERNANCE_PROGRAM_ID);
export const SPL_PUBLIC_KEY = new PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
);

/* 
  main: https://ssc-dao.genesysgo.net/  
  devnet: https://psytrbhymqlkfrhudd.dev.genesysgo.net:8899/
  devent: wss://psytrbhymqlkfrhudd.dev.genesysgo.net:8900/
*/

export const RPC_CONNECTION =
  Constants?.manifest?.extra?.rpcNetwork || "https://ssc-dao.genesysgo.net/";

// backup in case genesysgo has issues
// export const RPC_CONNECTION = "https://solana-api.projectserum.com";
