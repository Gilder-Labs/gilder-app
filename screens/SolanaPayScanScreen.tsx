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
import { parseURL, createTransfer, TransferRequestURL } from "@solana/pay";
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
import bigInteger from "big-integer";

let connection = new Connection(RPC_CONNECTION, "recent");

export default function SolanaPayScanScreen({ route }: any) {
  const navigation = useNavigation();
  const theme = useTheme();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const { walletId } = route?.params;

  const [solanaPayData, setSolanaPayData] = useState<any>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [transactionInstructions, setTransactionInstructions] = useState<
    Array<any>
  >([]);
  const { publicKey } = useAppSelector((state) => state.wallet);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    console.log("scanned", data);

    // recipent = who we are sending to
    // ammount of the token we are sending
    // splTokenMint = the token we are sending
    // reference = who is sending, ie the wallet address
    // label = title of the transaction/vendor
    // message = can be undefined
    // memo = can be undefined
    const solanaPayInfo = parseURL(data);
    let { recipient, amount, reference, label, message, memo, splToken } =
      parseURL(data) as TransferRequestURL;
    console.log(JSON.stringify(solanaPayInfo));

    const tx = await createTransfer(connection, new PublicKey(publicKey), {
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
    setSolanaPayData(solanaPayInfo);

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
      ></BarCodeScanner>
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
      />
    </Container>
  );
}

const Container = styled.ScrollView`
  background-color: ${(props) => props.theme.gray[900]};
  /* flex: 1;
  height: 100%; */
  background: green;
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
