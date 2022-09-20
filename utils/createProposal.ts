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
} from "@solana/spl-governance";
import bs58 from "bs58";

// https://github.com/marinade-finance/solana-js-utils/blob/72a191101a5d6ddd8e011f403095e542c603a906/packages/solana-cli-utils/middleware/multisig/SplGovernanceMiddleware.ts

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
  governance: any;
  transactionInstructions?: any;
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
  const prerequisiteInstructions: TransactionInstruction[] = [];
  const prerequisiteInstructionsSigners: Keypair[] = [];

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

  // TODO: fix governance ID - should be either "Fv7N9yvSHyrt53EfPMoMLZCfxGjhd1opC5PGE4ddz7E" or
  // when governance di = 2KkWYpJR1TCrfNXgP4JiuSGewAvurG6f6Maz3VLYHzUH it doesn't work
  const proposalIndex = governance.proposalCount; // proposalIndex - todo? maybe the actual number in the proposal, change to governance.proposalCount
  const governancePublicKey = new PublicKey(governance.governanceId);

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
  // const exampleData = await createInstructionData(
  //   SystemProgram.transfer({
  //     fromPubkey: new PublicKey(vault?.pubKey),
  //     toPubkey: new PublicKey("EVa7c7XBXeRqLnuisfkvpXSw5VtTNVM8MNVJjaSgWm4i"),
  //     lamports: 0.1 * LAMPORTS_PER_SOL,
  //   })
  // );

  // console.log("example instruction", exampleData);

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
  if (transactionInstructions) {
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

      const test = new TransactionInstruction({
        keys: keys,
        programId: new PublicKey(instruct.programId),
        data: Buffer.from(instruct.data),
      });

      const base64instruction = serializeInstructionToBase64(test);
      let data = getInstructionDataFromBase64(base64instruction);

      console.log("data", test);

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

  // await withInsertTransaction(
  //   insertInstructions,
  //   programId,
  //   programVersion,
  //   governancePublicKey,
  //   proposalAddress,
  //   tokenOwnerPublicKey,
  //   payer,
  //   index,
  //   0,
  //   0,
  //   [exampleData],
  //   payer
  // );

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
  // 3. send and confirm each transaction?

  // https://solana.stackexchange.com/questions/2862/what-is-the-best-way-to-handle-multiple-transactions-having-transaction-size-exc
  // https://solana.stackexchange.com/questions/2376/how-to-handle-multiple-transaction-when-transaction-instruction-is-too-long

  // create proposal transaction
  let transactions = [];

  let proposalTransaction = new Transaction({
    feePayer: walletPublicKey,
  });
  proposalTransaction.add(...instructions);
  transactions.push(proposalTransaction);

  // dapp instructions
  insertInstructions.forEach((ix) => {
    let dappTransaction = new Transaction({
      feePayer: walletPublicKey,
    });
    dappTransaction.add(ix);
    transactions.push(dappTransaction);
  });

  let signOffTransaction = new Transaction({
    feePayer: walletPublicKey,
  });
  signOffTransaction.add(...signOffInstruction);
  transactions.push(signOffTransaction);

  // return transaction;
  return transactions;
};
