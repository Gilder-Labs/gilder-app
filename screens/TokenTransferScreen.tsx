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
import splToken from "@solana/spl-token";
import { useAppDispatch, useAppSelector } from "../hooks/redux";

let connection = new Connection(RPC_CONNECTION, "recent");

export default function TokenTransferScreen({ route }: any) {
  const navigation = useNavigation();
  const theme = useTheme();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const { walletId, tokens, nfts } = route?.params;

  const [token, setToken] = useState<any>(null);
  const [amount, setAmount] = useState<any>(0);
  const [amountUsd, setAmountUsd] = useState<any>(0);
  const [recipient, setRecipient] = useState<any>("");
  const { tokenPriceData, vaults } = useAppSelector((state) => state.treasury);
  const [isEditing, setIsEditing] = useState<"token" | "usd">("token");

  const [transactionInstructions, setTransactionInstructions] = useState<
    Array<any>
  >([]);

  const handleTokenTransfer = async () => {
    let instruction = await createInstructionData(
      SystemProgram.transfer({
        fromPubkey: new PublicKey(walletId),
        toPubkey: new PublicKey("EVa7c7XBXeRqLnuisfkvpXSw5VtTNVM8MNVJjaSgWm4i"),
        lamports: Number(amount) * LAMPORTS_PER_SOL,
      })
    );

    // put it in this format, so our create proposal handles it same way as browser
    setTransactionInstructions([instruction]);

    console.log("instruction", instruction);
    // const instruction = solanaPayInfo?.splToken
    //   ? await splToken.Token.createTransferInstruction(
    //       splToken.TOKEN_PROGRAM_ID,
    //       fromTokenAccount.address,
    //       solanaPayInfo?.recipient,
    //       new PublicKey(walletId),
    //       [],
    //       solanaPayInfo?.amount
    //     )
    //   : await createInstructionData(
    //       SystemProgram.transfer({
    //         fromPubkey: new PublicKey(walletId),
    //         toPubkey: solanaPayInfo?.recipient,
    //         lamports: solanaPayInfo?.amount * LAMPORTS_PER_SOL,
    //       })
    //     );
    bottomSheetModalRef?.current?.present();
  };

  const handleSetTokenAmount = (value: string) => {
    const parsedValue = Number(value);
    setAmount(value);
    if (isEditing === "token" && token && parsedValue > 0) {
      const coinGeckoId = token?.extensions?.coingeckoId;
      const priceData = tokenPriceData[coinGeckoId];
      console.log("priceData", priceData);
      setAmountUsd(
        String((Number(value) * priceData.current_price).toFixed(2))
      );
    } else {
      setAmountUsd("0");
    }
  };

  const handleSetUsdAmount = (value: string) => {
    const parsedValue = Number(value);
    setAmountUsd(value);
    if (isEditing === "usd" && token && parsedValue > 0) {
      console.log("handling used?");
      const coinGeckoId = token?.extensions?.coingeckoId;
      const priceData = tokenPriceData[coinGeckoId];
      console.log("priceData", priceData);
      setAmount(String((Number(value) / priceData.current_price).toFixed(2)));
    } else {
      setAmount("0");
    }
  };

  const handleTokenSelect = (token: any, tokenPriceData: any) => {
    console.log("selecting", token);
    setAmountUsd("");
    setAmount("");
    const coinGeckoId = token?.extensions?.coingeckoId;
    const priceData = tokenPriceData[coinGeckoId];
    console.log("token price data", priceData);
    setToken(token);
  };

  return (
    <Container>
      <ScrollContainer>
        <Column>
          <Typography text="Select Token" size="h4" bold={true} />
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
          <Typography text="Amount" size="h4" bold={true} />
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
                shade={amountUsd ? "100" : "700"}
              />
              <TextInput
                placeholder="0.00"
                placeholderTextColor={theme.gray[700]}
                onFocus={() => setIsEditing("usd")}
                onChangeText={handleSetUsdAmount}
                value={amountUsd}
                type="number"
                disabled={!token}
                keyboardType="numeric"
              />
              <Typography text={"USD"} bold={true} marginLeft="1" />
            </RowInput>
          </SpacedRow>
        </Column>
        <Column>
          <Typography text="Recipient" size="h4" bold={true} />
          <SpacedRow>
            <TextInput
              placeholder="Wallet address"
              placeholderTextColor={theme.gray[700]}
            />
          </SpacedRow>
        </Column>
        <ActionContainer>
          <Button
            title="Preview Proposal"
            onPress={handleTokenTransfer}
            shade="800"
            color="secondary"
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
  margin-bottom: ${(props: any) => props.theme.spacing[4]};
`;

const SpacedRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-left: -${(props) => props.theme.spacing[1]};
  margin-right: -${(props) => props.theme.spacing[1]};
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
