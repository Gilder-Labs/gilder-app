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
  getGovernanceAccounts,
  VoteType,
  withCreateProposal,
  getSignatoryRecordAddress,
  withAddSignatory,
  withInsertTransaction,
  serializeInstructionToBase64,
  getInstructionDataFromBase64,
  withSignOffProposal,
  InstructionData,
  pubkeyFilter,
  createInstructionData,
  Governance,
} from "@solana/spl-governance";
import bs58 from "bs58";

//https://github.com/marinade-finance/solana-js-utils/blob/72a191101a5d6ddd8e011f403095e542c603a906/packages/solana-cli-utils/middleware/multisig/SplGovernanceMiddleware.ts

let connection = new Connection(RPC_CONNECTION, "recent");

export const createNewProposalTransaction = async ({
  selectedRealm,
  walletAddress,
  proposalData,
  membersMap,
  selectedDelegate,
  isCommunityVote,
  vault,
  transactionInstructions,
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
  transactionInstructions?: any;
}) => {
  const walletPublicKey = new PublicKey(walletAddress);
  const instructions: TransactionInstruction[] = [];
  const insertInstructions: TransactionInstruction[] = [];

  const payer = walletPublicKey;
  const signatory = walletPublicKey;

  let member;

  const prerequisiteInstructions: TransactionInstruction[] = [];
  const prerequisiteInstructionsSigners: Keypair[] = [];

  if (membersMap[walletAddress] && !selectedDelegate) {
    member = membersMap[walletAddress];
  } else {
    member = membersMap[selectedDelegate];
  }

  // const signatory = new PublicKey(member.walletId);

  const programVersion = await getGovernanceProgramVersion(
    connection,
    new PublicKey(selectedRealm?.governanceId)
  );

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
  const governanceAuthority = walletPublicKey; // maybe walletPublicKey?
  const realmPublicKey = new PublicKey(selectedRealm!.pubKey);

  const walletOfMember = new PublicKey(member.walletId);

  // get most recent version of governance account
  const governanceInfo = await getGovernanceAccounts(
    connection,
    programId,
    Governance,
    [pubkeyFilter(33, governingTokenMint)!]
  );

  const proposalIndex = governanceInfo[0].account.proposalCount; // proposalIndex - todo? maybe the actual number in the proposal, change to governance.proposalCount
  const governancePublicKey = governanceInfo[0].pubkey;

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
    governanceAuthority, // wallet making proposal
    proposalIndex,
    voteType,
    options,
    useDenyOption,
    payer,
    undefined // TODO: plugin
  );

  // temp instructions to
  const exampleData = await createInstructionData(
    SystemProgram.transfer({
      fromPubkey: new PublicKey(vault?.pubKey),
      toPubkey: new PublicKey("EVa7c7XBXeRqLnuisfkvpXSw5VtTNVM8MNVJjaSgWm4i"),
      lamports: 100,
    })
  );

  console.log("example instruction", exampleData);

  await withAddSignatory(
    instructions,
    programId,
    programVersion,
    proposalAddress,
    tokenOwnerPublicKey,
    governanceAuthority,
    signatory,
    payer
  );

  // inserts instructions into proposal
  // if we havbe instruction data, insert it into proposal transaction
  let index = 1;
  if (transactionInstructions) {
    const newInstructions = transactionInstructions[0].instructions;
    console.log("ADDING INSTRUCTIONS", newInstructions);
    for await (const instruct of newInstructions) {
      let keys = instruct.keys.map((key) => {
        return {
          pubkey: new PublicKey(key.pubkey),
          isSigner: key.isSigner,
          isWritable: key.isWritable,
        };
      });

      const test = new TransactionInstruction({
        keys: keys,
        programId: new PublicKey(instruct.programId),
        data: Buffer.from(instruct.data),
      });
      console.log("test", test);

      const base64instruction = serializeInstructionToBase64(test);
      console.log("base 64 instruction", base64instruction);
      let data = getInstructionDataFromBase64(base64instruction);
      console.log("instruction from 64", data);

      await withInsertTransaction(
        insertInstructions,
        programId,
        programVersion,
        governancePublicKey,
        proposalAddress,
        tokenOwnerPublicKey,
        payer,
        index,
        0,
        0,
        [data],
        payer
      );
      index++;
    }

    console.log("PAST ADDING NEW INSTRUCTIONS");

    // await withInsertTransaction(
    //   instructions,
    //   programId,
    //   programVersion,
    //   governancePublicKey,
    //   proposalAddress,
    //   tokenOwnerPublicKey,
    //   payer,
    //   0,
    //   0,
    //   0,
    //   [],
    //   payer
    // );
  }

  // adding signatory + sign off makes proposal go to voting state

  const signatoryRecordAddress = await getSignatoryRecordAddress(
    programId,
    proposalAddress,
    signatory
  );

  await withSignOffProposal(
    insertInstructions,
    programId,
    programVersion,
    realmPublicKey,
    governancePublicKey,
    proposalAddress,
    signatory,
    signatoryRecordAddress,
    undefined
  );

  const combinedInstructions = [
    // ...prerequisiteInstructions,
    ...instructions,
    ...insertInstructions,
  ];
  const recentBlock = await connection.getLatestBlockhash();
  const transaction = new Transaction({ feePayer: walletPublicKey });
  transaction.recentBlockhash = recentBlock.blockhash;
  transaction.add(...combinedInstructions);

  return transaction;
};
