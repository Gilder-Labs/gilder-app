import { useEffect, useRef, useState } from "react";
import styled from "styled-components/native";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { fetchRealmActivity } from "../store/activitySlice";
import { Text, View, Dimensions } from "react-native";
import { faArrowRight } from "@fortawesome/pro-solid-svg-icons/faArrowRight";
import { faMagnifyingGlass } from "@fortawesome/pro-regular-svg-icons/faMagnifyingGlass";
import { PublicKeyTextCopy, Typography, Badge } from "../components";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "styled-components";
import { BarCodeScanner } from "expo-barcode-scanner";
import axios from "axios";
import {
  parseURL,
  createTransfer,
  TransferRequestURL,
  TransactionRequestURL,
} from "@solana/pay";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { createInstructionData } from "@solana/spl-governance";
import { CreateProposalTransactionModal } from "../elements/CreateProposalTransactionModal";
import {
  Connection,
  PublicKey,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Transaction,
} from "@solana/web3.js";
import { RPC_CONNECTION } from "../constants/Solana";
import QRSvg from "../assets/images/qr.svg";

let connection = new Connection(RPC_CONNECTION, "recent");

export default function SolanaPayScanScreen({ route }: any) {
  const navigation = useNavigation();
  const theme = useTheme();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const { walletId, isSpeedMode } = route?.params;

  const [hasPermission, setHasPermission] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [transactionInstructions, setTransactionInstructions] = useState<
    Array<any>
  >([]);
  const [solanaPayDetails, setSolanaPayDetails] = useState<any>(null);
  const { publicKey } = useAppSelector((state) => state.wallet);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }: any) => {
    setScanned(true);
    console.log("PARSING DATA", data);

    // recipent = who we are sending to
    // ammount of the token we are sending
    // splTokenMint = the token we are sending
    // reference = who is sending, ie the wallet address
    // label = title of the transaction/vendor
    // message = can be undefined
    // memo = can be undefined
    let solanaPayInfoParsed = parseURL(data) as
      | TransferRequestURL
      | TransactionRequestURL;

    // transaction request for solana pay
    if (solanaPayInfoParsed.link) {
      // https://github.com/solana-labs/solana-pay/blob/master/SPEC.md
      // transaction request
      // start handshake
      console.log("solanaPayInfoParsed", solanaPayInfoParsed.link.href);
      let response = await axios.get(solanaPayInfoParsed.link.href);
      console.log("response", response.data);
      console.log("wallet id", walletId);
      // get transaction instructions from merchant
      const postResponse = await axios.post(solanaPayInfoParsed.link.href, {
        account: walletId,
      });

      // deserialize transaction instructions
      // TODO: handle transaction here
      const base64Transaction = postResponse.data.transaction;
      console.log("base64Transaction", base64Transaction);
      const parsedTransaction = Buffer.from(base64Transaction, "base64");
      console.log("post response", parsedTransaction);
      let myTransaction = Transaction.from(parsedTransaction);
      console.log("my transaction", myTransaction);

      // TODO: set transaction instructions
    } else {
      console.log("solanaPayInfoParsed", solanaPayInfoParsed);
      let { recipient, amount, reference, label, message, memo, splToken } =
        solanaPayInfoParsed;
      console.log(
        "solanaPayInfoParsed json",
        JSON.stringify(solanaPayInfoParsed)
      );
      setSolanaPayDetails({ label, memo, message });

      const tx = await createTransfer(connection, new PublicKey(walletId), {
        recipient,
        amount: amount,
        splToken: splToken,
        reference,
        memo,
      });

      const instructions = tx.instructions.map((instruction) =>
        createInstructionData(instruction)
      );

      setTransactionInstructions(instructions);
    }

    bottomSheetModalRef?.current?.present();
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <Container>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={{
          //   flex: 1,
          height: Dimensions.get("window").height - 24,
          width: "100%",
        }}
      >
        <BarCodeContainer>
          <QRSvg width={200} height={200} />
          <Typography text="Scan QR to start purchase flow" marginTop="4" />
        </BarCodeContainer>
      </BarCodeScanner>
      <CreateProposalTransactionModal
        bottomSheetModalRef={bottomSheetModalRef}
        walletId={walletId}
        transactionInstructions={transactionInstructions}
        navState={{
          title: "Solana pay",
          url: "",
          label: "Token Transfer",
        }}
        isTokenTransfer={true}
        isSpeedMode={isSpeedMode}
        solanaPayDetails={solanaPayDetails}
      />
    </Container>
  );
}

const Container = styled.View`
  background-color: ${(props) => props.theme.gray[900]};
  /* flex: 1;
  height: 100%; */
  /* flex-direction: column; */
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

const BarCodeContainer = styled.View`
  justify-content: center;
  align-items: center;
  height: 100%;
  padding-bottom: 48px;
`;
