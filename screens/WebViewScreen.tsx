import { RootTabScreenProps } from "../types";
import { useEffect, useState } from "react";
import styled from "styled-components/native";
import { ActivityCard, Loading } from "../components";
import { FlatList, RefreshControl } from "react-native";
import { format, differenceInDays } from "date-fns";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { fetchRealmActivity } from "../store/activitySlice";
import { useTheme } from "styled-components";
import { WebView } from "react-native-webview";
import { PublicKey } from "@solana/web3.js";

interface Wallet {
  signTransaction(tx: Transaction): Promise<Transaction>;
  signAllTransactions(txs: Transaction[]): Promise<Transaction[]>;
  publicKey: PublicKey;
}

export default function WebViewScreen() {
  const onMessage = (event: any) => {
    console.log("onMessage", event);
    alert(event.nativeEvent.data);
  };

  let publicKey = new PublicKey("EVa7c7XBXeRqLnuisfkvpXSw5VtTNVM8MNVJjaSgWm4i");

  const runFirst = `
      window.phantom = {
        solana: {
          isPhantom: true,
          publicKey: "EVa7c7XBXeRqLnuisfkvpXSw5VtTNVM8MNVJjaSgWm4i",
          connect: async () => {
            window.ReactNativeWebView.postMessage("connect");
            this._publicKey = ${publicKey};
            this.emit('connect', ${publicKey});
          },
          signTransaction: async () => {},
        }
      };
      true; // note: this is required, or you'll sometimes get silent failures
    `;

  return (
    <Container>
      <WebView
        source={{ uri: "https://trade.mango.markets/" }}
        javaScriptEnabled={true}
        onMessage={onMessage}
        injectedJavaScript={runFirst}
        pullToRefreshEnabled={true}
      />
    </Container>
  );
}

const Container = styled.View`
  background-color: ${(props) => props.theme.gray[900]};
  flex: 1;
`;
