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
import { SPL_PUBLIC_KEY, HEAVY_RPC_CONNECTION } from "../constants/Solana";

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
  getGovernance,
} from "@solana/spl-governance";
import bs58 from "bs58";

let connection = new Connection(HEAVY_RPC_CONNECTION, "recent");

export const createNewProposalTransaction = async ({
  selectedRealm,
  walletAddress,
  proposalData,
  membersMap,
  selectedDelegate,
  isCommunityVote,
  vault,
  governance,
  transactionInstructions,
  isTokenTransfer,
}: // prerequisiteInstructions,
{
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
  governance: any;
  transactionInstructions?: any;
  isTokenTransfer?: boolean;
  // prerequisiteInstructions?: any;
}) => {
  const walletPublicKey = new PublicKey(walletAddress);
  const instructions: TransactionInstruction[] = [];
  const insertInstructions: TransactionInstruction[] = [];
  const signOffInstruction: TransactionInstruction[] = [];

  const payer = walletPublicKey;
  const signatory = walletPublicKey;

  let member;

  // TODO... for each transaction, make array of signers
  const signers: TransactionInstruction[] = [];

  if (membersMap[walletAddress] && !selectedDelegate) {
    member = membersMap[walletAddress];
  } else {
    member = membersMap[selectedDelegate];
  }

  const programVersion = await getGovernanceProgramVersion(
    connection,
    new PublicKey(selectedRealm?.governanceId)
  );

  const voteType = VoteType.SINGLE_CHOICE;
  const options = ["Approve"];
  const useDenyOption = true;
  // const tokenOwnerPublicKey = new PublicKey(member?.publicKey);
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

  const proposalIndex = governance.proposalCount; // this needs to correct or proposal will fail
  const governancePublicKey = new PublicKey(governance.governanceId);

  const proposalAddress = await withCreateProposal(
    instructions,
    programId, // programId
    programVersion,
    realmPublicKey, // realmid
    governancePublicKey, // governance of community/council tokens determine vote
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

  // if we have instruction data, insert it into proposal transaction
  let index = 0;

  if (isTokenTransfer) {
    for await (const instruct of transactionInstructions) {
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
        [instruct],
        payer
      );
      index++;
    }
  } else if (transactionInstructions) {
    const newInstructions = transactionInstructions[0].instructions;

    // map data back to public keys, web bridge converts to strings
    for await (const instruct of newInstructions) {
      let keys = instruct.keys.map((key) => {
        return {
          pubkey: new PublicKey(key.pubkey),
          isSigner: key.isSigner,
          isWritable: key.isWritable,
        };
      });

      const tx = new TransactionInstruction({
        keys: keys,
        programId: new PublicKey(instruct.programId),
        data: Buffer.from(instruct.data),
      });

      const base64instruction = serializeInstructionToBase64(tx);
      let data = getInstructionDataFromBase64(base64instruction);

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
  }

  // adding signatory + sign off makes proposal go to voting state

  const signatoryRecordAddress = await getSignatoryRecordAddress(
    programId,
    proposalAddress,
    signatory
  );

  await withSignOffProposal(
    signOffInstruction,
    programId,
    programVersion,
    realmPublicKey,
    governancePublicKey,
    proposalAddress,
    signatory,
    signatoryRecordAddress,
    undefined
  );

  // const createProposalInstructions = [
  //   // ...prerequisiteInstructions,
  //   ...instructions,
  //   insertInstructions,
  // ];

  // const transaction = new Transaction({ feePayer: walletPublicKey });

  // TODO:
  // 1. Create a new transaction for each set of instructions
  // 2. Return array of transactions
  //??3. send and confirm each transaction?

  // https://solana.stackexchange.com/questions/2862/what-is-the-best-way-to-handle-multiple-transactions-having-transaction-size-exc
  // https://solana.stackexchange.com/questions/2376/how-to-handle-multiple-transaction-when-transaction-instruction-is-too-long

  // create proposal transaction
  let transactions = [];
  // if (prerequisiteInstructions?.length > 0) {
  //   const preqTransaction = new Transaction({ feePayer: walletPublicKey });
  //   console.log("making preq transaction");
  //   preqTransaction.add(...prerequisiteInstructions);
  //   transactions.push(preqTransaction);
  // }

  let recentBlock = await connection.getLatestBlockhash();

  let proposalTransaction = new Transaction({
    feePayer: walletPublicKey,
  });
  proposalTransaction.add(...instructions);
  proposalTransaction.recentBlockhash = recentBlock.blockhash;
  transactions.push(proposalTransaction);

  // dapp instructions
  recentBlock = await connection.getLatestBlockhash();
  insertInstructions.forEach((ix) => {
    let dappTransaction = new Transaction({
      feePayer: walletPublicKey,
    });

    dappTransaction.add(ix);
    dappTransaction.recentBlockhash = recentBlock.blockhash;

    transactions.push(dappTransaction);
  });

  let signOffTransaction = new Transaction({
    feePayer: walletPublicKey,
  });
  recentBlock = await connection.getLatestBlockhash();
  signOffTransaction.add(...signOffInstruction);
  signOffTransaction.recentBlockhash = recentBlock.blockhash;
  transactions.push(signOffTransaction);

  return transactions;
};
