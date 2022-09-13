import {
  PublicKey,
  ConfirmedSignatureInfo,
  Connection,
  LAMPORTS_PER_SOL,
  Keypair,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { SPL_PUBLIC_KEY, RPC_CONNECTION } from "../constants/Solana";

import {
  getGovernanceProgramVersion,
  getInstructionDataFromBase64,
  Governance,
  ProgramAccount,
  TokenOwnerRecord,
  VoteType,
  withCreateProposal,
  getSignatoryRecordAddress,
  withAddSignatory,
  withInsertTransaction,
  withSignOffProposal,
} from "@solana/spl-governance";

//https://github.com/marinade-finance/solana-js-utils/blob/72a191101a5d6ddd8e011f403095e542c603a906/packages/solana-cli-utils/middleware/multisig/SplGovernanceMiddleware.ts

let connection = new Connection(RPC_CONNECTION, "confirmed");

export const createNewProposalTransaction = async ({
  selectedRealm,
  walletAddress,
  proposalData,
  membersMap,
  selectedDelegate,
  isCommunityVote,
}: {
  selectedRealm: Realm;
  walletAddress: string;
  proposalData: {
    name: string;
    description: string;
    instructions?: Array<any>;
  };
  membersMap: any;
  selectedDelegate: string;
  isCommunityVote: boolean;
}) => {
  const walletPublicKey = new PublicKey(walletAddress);
  const instructions: TransactionInstruction[] = [];
  const governanceAuthority = walletPublicKey;
  const signatory = walletPublicKey;
  const payer = walletPublicKey;
  let tokenOwnerRecord;

  const prerequisiteInstructions: TransactionInstruction[] = [];
  const prerequisiteInstructionsSigners: Keypair[] = [];

  if (membersMap[walletAddress] && !selectedDelegate) {
    tokenOwnerRecord = membersMap[walletAddress];
  } else {
    tokenOwnerRecord = membersMap[selectedDelegate];
  }

  const programVersion = await getGovernanceProgramVersion(
    connection,
    new PublicKey(selectedRealm?.governanceId)
  );

  // V2 Approve/Deny configuration
  const voteType = VoteType.SINGLE_CHOICE;
  const options = ["Approve"];
  const useDenyOption = true;
  const tokenOwnerPublicKey = isCommunityVote
    ? new PublicKey(tokenOwnerRecord?.communityPublicKey)
    : new PublicKey(tokenOwnerRecord?.councilPublicKey);

  const governingTokenMint = isCommunityVote
    ? new PublicKey(selectedRealm?.communityMint)
    : new PublicKey(selectedRealm?.councilMint);

  const proposalIndex = 38; // TODO: get this, 38 for community,  64 for council
  console.log("token owner record", tokenOwnerRecord);
  const proposalAddress = await withCreateProposal(
    instructions,
    new PublicKey(selectedRealm!.governanceId), // programId
    programVersion,
    new PublicKey(selectedRealm!.pubKey),
    new PublicKey("Fv7N9yvSHyrt53EfPMoMLZCfxGjhd1opC5PGE4ddz7E"), // TODO: change this to dao wallet governance id - pubkey of the governance (wallet) that we are wanting to create a proposal for
    tokenOwnerPublicKey,
    proposalData.name,
    proposalData.description, // TODO description of proposal
    governingTokenMint, // TODO
    governanceAuthority,
    38, // proposalIndex - todo? maybe the actual number in the proposal, change to governance.proposalCount
    voteType,
    options,
    useDenyOption,
    payer,
    undefined // TODO: plugin
  );

  const proposalTransaction = await withInsertTransaction(
    instructions,
    new PublicKey(selectedRealm!.governanceId),
    programVersion,
    new PublicKey(selectedRealm!.pubKey),
    proposalAddress,
    tokenOwnerPublicKey,
    payer,
    0,
    0,
    0,
    [], // instruction data
    payer
  );

  withSignOffProposal(
    instructions,
    new PublicKey(selectedRealm!.governanceId),
    programVersion,
    new PublicKey(selectedRealm!.pubKey),
    new PublicKey("Fv7N9yvSHyrt53EfPMoMLZCfxGjhd1opC5PGE4ddz7E"), // TODO: change this to dao wallet governance id - pubkey of the governance (wallet) that we are wanting to create a proposal for
    proposalAddress,
    payer,
    undefined,
    tokenOwnerPublicKey
  );

  // await withAddSignatory(
  //   instructions,
  //   new PublicKey(selectedRealm!.governanceId), // programId
  //   programVersion,
  //   proposalAddress,
  //   tokenOwnerPublicKey,
  //   governanceAuthority,
  //   signatory,
  //   payer
  // );

  // const signatoryRecordAddress = await getSignatoryRecordAddress(
  //   new PublicKey(selectedRealm!.governanceId), // programId
  //   proposalAddress,
  //   signatory
  // );

  // const insertInstructions: TransactionInstruction[] = []

  const recentBlock = await connection.getLatestBlockhash();
  const transaction = new Transaction({ feePayer: walletPublicKey });
  transaction.recentBlockhash = recentBlock.blockhash;
  transaction.add(...instructions);

  console.log(
    "proposal address, got to execute transaction?",
    proposalAddress.toBase58()
  );
  return transaction;
};
