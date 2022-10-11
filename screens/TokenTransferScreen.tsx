import { useEffect, useRef, useState } from "react";
import styled from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "styled-components";
import { BarCodeScanner } from "expo-barcode-scanner";
import { parseURL, TransferRequestURL } from "@solana/pay";
import { Typography, Button, TokenList } from "../components";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { createInstructionData } from "@solana/spl-governance";
import { CreateProposalTransactionModal } from "../elements/CreateProposalTransactionModal";
import {
  Connection,
  PublicKey,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { RPC_CONNECTION } from "../constants/Solana";
import {
  getAssociatedTokenAddress,
  createAssociatedTokenAccountInstruction,
  createTransferCheckedInstruction,
} from "@solana/spl-token";

import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { tryParseKey } from "../utils";

let connection = new Connection(RPC_CONNECTION, "recent");

export default function TokenTransferScreen({ route }: any) {
  const navigation = useNavigation();
  const theme = useTheme();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const { walletId, tokens, nfts } = route?.params;

  const [token, setToken] = useState<any>(null);
  const [amount, setAmount] = useState<any>(0);
  const [amountUsd, setAmountUsd] = useState<any>(0);
  const [recipient, setRecipient] = useState<any>(
    "EVa7c7XBXeRqLnuisfkvpXSw5VtTNVM8MNVJjaSgWm4i"
  );
  const { tokenPriceData, vaults } = useAppSelector((state) => state.treasury);
  const [isEditing, setIsEditing] = useState<"token" | "usd">("token");
  const [tokenError, setTokenError] = useState<any>(false);
  const [recipientError, setRecipientError] = useState<any>(false);

  const [transactionInstructions, setTransactionInstructions] = useState<
    Array<any>
  >([]);

  const handleTokenTransfer = async () => {
    let instructions = [];

    if (token.mint === "sol") {
      console.log("making a sol transaction of amount:", parseFloat(amount));
      let solInstruction = await createInstructionData(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(walletId),
          toPubkey: new PublicKey(recipient),
          lamports: parseFloat(amount) * LAMPORTS_PER_SOL,
        })
      );
      instructions.push(solInstruction);
    } else {
      console.log("mint:", token.mint);
      console.log("recipient:", recipient);
      // Token  token account of token we are sending for recipient
      const senderTokenAddress = await getAssociatedTokenAddress(
        new PublicKey(token.mint),
        new PublicKey(walletId),
        true
      );

      const recipientTokenAddress = await getAssociatedTokenAddress(
        new PublicKey(token.mint),
        new PublicKey(recipient)
      );

      const recipientTokenInfo = await connection.getAccountInfo(
        recipientTokenAddress
      );
      console.log("token address", recipientTokenAddress);
      console.log("recipientTokenInfo", recipientTokenInfo);

      !recipientTokenInfo &&
        instructions.push(
          createAssociatedTokenAccountInstruction(
            new PublicKey(walletId),
            recipientTokenAddress,
            new PublicKey(recipient),
            new PublicKey(token.mint)
          )
        );

      const instruction = await createInstructionData(
        createTransferCheckedInstruction(
          senderTokenAddress,
          new PublicKey(token.mint),
          recipientTokenAddress,
          new PublicKey(walletId),
          100, //  1 usdc = 1000000
          token.decimals
        )
      );
      instructions.push(instruction);
    }

    // put it in this format, so our create proposal handles it same way as browser
    console.log("Instructions:", instructions);
    setTransactionInstructions(instructions);

    bottomSheetModalRef?.current?.present();
  };

  const handleSetTokenAmount = (value: string) => {
    const parsedValue = parseFloat(value);
    setAmount(value);
    if (isEditing === "token" && token && parsedValue > 0) {
      const coinGeckoId = token?.extensions?.coingeckoId;
      const priceData = tokenPriceData[coinGeckoId];
      console.log("priceData", priceData);
      setAmountUsd(
        String((parseFloat(value) * priceData.current_price).toFixed(2))
      );
    } else {
      setAmountUsd("0");
    }

    if (token.tokenAmount.uiAmount < parseFloat(value)) {
      setTokenError(true);
    } else {
      setTokenError(false);
    }
  };

  const handleSetUsdAmount = (value: string) => {
    const parsedValue = parseFloat(value);
    setAmountUsd(value);
    if (isEditing === "usd" && token && parsedValue > 0) {
      const coinGeckoId = token?.extensions?.coingeckoId;
      const priceData = tokenPriceData[coinGeckoId];
      setAmount(
        String((parseFloat(value) / priceData.current_price).toFixed(2))
      );
    } else {
      setAmount("0");
    }

    if (token.tokenAmount.uiAmount < parseFloat(value)) {
      setTokenError(true);
    } else {
      setTokenError(false);
    }
  };

  const handleTokenSelect = (token: any, tokenPriceData: any) => {
    console.log("selecting", token);
    setAmountUsd("");
    setAmount("");
    const coinGeckoId = token?.extensions?.coingeckoId;
    const priceData = tokenPriceData[coinGeckoId];
    setToken(token);
  };

  const handleRecipientChange = (value: string) => {
    setRecipient(value);
    if (tryParseKey(value)) {
      setRecipientError(false);
    } else {
      setRecipientError(true);
    }
  };

  return (
    <Container>
      <ScrollContainer>
        <Column>
          <Typography text="Select Token" size="h4" bold={true} shade="400" />
          <TokenList
            tokens={tokens}
            tokenPriceData={tokenPriceData}
            walletId={walletId}
            // hideUnknownTokens={true}
            hideLowNumberTokens={true}
            canSelect={true}
            onTokenSelect={handleTokenSelect}
            selectedToken={token}
          />
        </Column>
        <Column>
          <Typography text="Amount" size="h4" bold={true} shade="400" />
          <SpacedRow>
            <RowInput>
              <TextInput
                placeholder={`0`}
                placeholderTextColor={theme.gray[700]}
                onFocus={() => setIsEditing("token")}
                onChangeText={handleSetTokenAmount}
                value={amount}
                type="number"
                disabled={!token}
                editable={!!token}
                keyboardType="numeric"
              />
              <Typography
                text={token?.symbol || "SOL"}
                bold={true}
                marginLeft="1"
              />
            </RowInput>
            <RowInput>
              <Typography
                text={"$"}
                bold={true}
                size="h4"
                shade={amountUsd ? "500" : "700"}
              />
              <TextInput
                placeholder="0.00"
                placeholderTextColor={theme.gray[700]}
                onFocus={() => setIsEditing("usd")}
                onChangeText={handleSetUsdAmount}
                value={amountUsd}
                type="number"
                disabled={!token}
                editable={!!token}
                keyboardType="numeric"
              />
              <Typography text={"USD"} bold={true} marginLeft="1" />
            </RowInput>
          </SpacedRow>
          {tokenError && (
            <Typography
              text="Not enough tokens to send"
              size="subtitle"
              shade="500"
              color="error"
            />
          )}
        </Column>
        <Column>
          <Typography text="Recipient" size="h4" bold={true} shade="400" />
          <SpacedRow>
            <TextInput
              placeholder="Wallet address"
              placeholderTextColor={theme.gray[700]}
              value={recipient}
              onChangeText={(value: string) => handleRecipientChange(value)}
            />
          </SpacedRow>
          {recipientError && (
            <Typography
              text="Invalid wallet address"
              size="subtitle"
              shade="500"
              color="error"
            />
          )}
        </Column>
        <ActionContainer>
          <Button
            title="Preview Proposal"
            onPress={handleTokenTransfer}
            shade="800"
            color="secondary"
            disabled={
              !token ||
              !amount ||
              !amountUsd ||
              recipientError ||
              !recipient ||
              tokenError
            }
          />
        </ActionContainer>
      </ScrollContainer>
      <CreateProposalTransactionModal
        bottomSheetModalRef={bottomSheetModalRef}
        walletId={walletId}
        transactionInstructions={transactionInstructions}
        navState={{
          title: "Send tokens",
          url: "",
          label: "Token Transfer",
        }}
        isTokenTransfer={true}
      />
    </Container>
  );
}

const Container = styled.View``;

const ScrollContainer = styled.ScrollView`
  padding: ${(props) => props.theme.spacing[3]};
  height: 100%;
`;

const Row = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
`;

const RowInput = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-end;
`;

const SpacedRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-left: -${(props) => props.theme.spacing[1]};
  margin-right: -${(props) => props.theme.spacing[1]};
  margin-bottom: ${(props) => props.theme.spacing[2]};
`;

const Column = styled.View``;

const SpacedColumn = styled.View`
  flex-direction: column;
`;

const ActionContainer = styled.View`
  margin-top: 48px;
`;

const TextInput = styled.TextInput`
  /* padding-left: ${(props) => props.theme.spacing[3]}; */
  /* padding-right: ${(props) => props.theme.spacing[3]}; */
  min-height: 40px;
  font-size: 28px;
  background-color: ${(props) => props.theme.gray[1000]};
  color: ${(props) => props.theme.gray[100]};
  border-radius: 8px;
  margin-left: ${(props) => props.theme.spacing[1]};
  margin-right: ${(props) => props.theme.spacing[1]};
`;

const WalletIdTextInput = styled.TextInput`
  /* padding-left: ${(props) => props.theme.spacing[3]}; */
  /* padding-right: ${(props) => props.theme.spacing[3]}; */
  min-height: 40px;
  font-size: 18px;
  background-color: ${(props) => props.theme.gray[1000]};
  color: ${(props) => props.theme.gray[100]};
  border-radius: 8px;
  margin-left: ${(props) => props.theme.spacing[1]};
  margin-right: ${(props) => props.theme.spacing[1]};
`;
