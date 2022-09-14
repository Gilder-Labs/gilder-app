import {
  PublicKey,
  ConfirmedSignatureInfo,
  Connection,
  LAMPORTS_PER_SOL,
  Keypair,
  Transaction,
  TransactionInstruction,
  sendAndConfirmTransaction,
  SystemProgram,
} from "@solana/web3.js";
import { SPL_PUBLIC_KEY, RPC_CONNECTION } from "../constants/Solana";

import {
  getGovernanceProgramVersion,
  getInstructionDataFromBase64,
  createInstructionData,
  ProgramAccount,
  TokenOwnerRecord,
  VoteType,
  withCreateProposal,
  getSignatoryRecordAddress,
  withAddSignatory,
  withInsertTransaction,
  withSignOffProposal,
  InstructionData,
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
  vault,
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
  vault: any;
}) => {
  const walletPublicKey = new PublicKey(walletAddress);
  const instructions: TransactionInstruction[] = [];
  const insertInstructions: TransactionInstruction[] = [];

  const payer = walletPublicKey;
  let member;

  const prerequisiteInstructions: TransactionInstruction[] = [];
  const prerequisiteInstructionsSigners: Keypair[] = [];

  if (membersMap[walletAddress] && !selectedDelegate) {
    member = membersMap[walletAddress];
  } else {
    member = membersMap[selectedDelegate];
  }

  const signatory = new PublicKey(member.walletId);

  const programVersion = await getGovernanceProgramVersion(
    connection,
    new PublicKey(selectedRealm?.governanceId)
  );

  // V2 Approve/Deny configuration
  const voteType = VoteType.SINGLE_CHOICE;
  const options = ["Approve"];
  const useDenyOption = true;
  const tokenOwnerPublicKey = isCommunityVote
    ? new PublicKey(member?.communityPublicKey)
    : new PublicKey(member?.councilPublicKey);

  const governingTokenMint = isCommunityVote
    ? new PublicKey(selectedRealm?.communityMint)
    : new PublicKey(selectedRealm?.councilMint);

  const programId = new PublicKey(selectedRealm!.governanceId);
  const governanceAuthority = new PublicKey(member.walletId);
  const realmPublicKey = new PublicKey(selectedRealm!.pubKey);
  const proposalIndex = 41; // proposalIndex - todo? maybe the actual number in the proposal, change to governance.proposalCount
  const governancePublicKey = new PublicKey(
    "ETNjJwHiQBLTtT1QoDEDyj4n3XNmccVMGLejAQpHwydP"
  );

  console.log("propogramId", selectedRealm!.governanceId);
  console.log("governance", vault?.governanceId);
  console.log("realm pubkey", selectedRealm.pubKey);
  console.log("token owner record", tokenOwnerPublicKey.toBase58());
  console.log("governing token mint", governingTokenMint.toBase58());
  console.log("governance authority", member.walletId);
  console.log("member selected", member);

  const proposalAddress = await withCreateProposal(
    instructions,
    programId, // programId
    programVersion,
    realmPublicKey, // realmid
    governancePublicKey, // TODO; this is either the governance for the community or the council
    tokenOwnerPublicKey, // token owner record of member making proposal
    proposalData.name,
    proposalData.description,
    governingTokenMint,
    // governanceAuthority, // governance authority / wallet making proposal
    walletPublicKey,
    proposalIndex,
    voteType,
    options,
    useDenyOption,
    payer,
    undefined // TODO: plugin
  );

  // await withAddSignatory(
  //   instructions,
  //   programId,
  //   programVersion,
  //   proposalAddress,
  //   tokenOwnerPublicKey,
  //   governanceAuthority,
  //   signatory,
  //   payer
  // );

  // withSignOffProposal(
  //   instructions,
  //   programId,
  //   programVersion,
  //   realmPublicKey,
  //   governancePublicKey,
  //   proposalAddress,
  //   signatory,
  //   tokenOwnerPublicKey,
  //   undefined
  // );

  const recentBlock = await connection.getLatestBlockhash();
  const transaction = new Transaction({ feePayer: walletPublicKey });
  transaction.recentBlockhash = recentBlock.blockhash;
  transaction.add(...instructions);

  return transaction;
};
