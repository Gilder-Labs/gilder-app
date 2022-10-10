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
  const [recipient, setRecipient] = useState<any>("");
  const { tokenPriceData, vaults } = useAppSelector((state) => state.treasury);

  const [transactionInstructions, setTransactionInstructions] = useState<
    Array<any>
  >([]);

  const handleTokenTransfer = async () => {
    let instruction = await createInstructionData(
      SystemProgram.transfer({
        fromPubkey: new PublicKey(walletId),
        toPubkey: new PublicKey("EVa7c7XBXeRqLnuisfkvpXSw5VtTNVM8MNVJjaSgWm4i"),
        lamports: 0.1 * LAMPORTS_PER_SOL,
      })
    );
    setTransactionInstructions([instruction]);

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

  const handleTokenSelect = (token: any, tokenPriceData: any) => {
    console.log("selecting", token);
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
        </Column>
        <Column>
          <Typography text="Recipient" size="h4" bold={true} />
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

const SpacedRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Column = styled.View``;

const SpacedColumn = styled.View`
  flex-direction: column;
`;

const ActionContainer = styled.View`
  margin-top: ${(props) => props.theme.spacing[3]};
`;
