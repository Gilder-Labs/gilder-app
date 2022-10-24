import { useEffect, useRef, useState } from "react";
import styled from "styled-components/native";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { createProposalAttempt } from "../store/proposalActionsSlice";
import { WebView } from "react-native-webview";
import { PublicKey } from "@solana/web3.js";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faXmark } from "@fortawesome/pro-solid-svg-icons/faXmark";
import { faArrowLeft } from "@fortawesome/pro-solid-svg-icons/faArrowLeft";
import { faArrowRight } from "@fortawesome/pro-solid-svg-icons/faArrowRight";
import { faRotateRight } from "@fortawesome/pro-solid-svg-icons/faRotateRight";
import { faGlobe } from "@fortawesome/pro-solid-svg-icons/faGlobe";
import { Linking } from "react-native";
import { ActivityIndicator } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

import { useTheme } from "styled-components";
import { SafeAreaView, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { CreateProposalTransactionModal } from "../elements/CreateProposalTransactionModal";

export default function WebViewScreen({ route }: any) {
  const webviewRef = useRef<WebView>();
  const theme = useTheme();
  const [navState, setNavState] = useState({
    canGoBack: false,
    canGoForward: false,
    loading: false,
    navigationType: "",
    target: "",
    title: "",
    url: "",
  });
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [transactionInstructions, setTransactionInstructions] = useState<
    Array<any>
  >([]);
  const [typeOfTransaction, setTypeOfTransaction] = useState("");

  const { vaults } = useAppSelector((state) => state.treasury);

  const { walletId, url } = route?.params;

  function returnDataToWebview(message: any, data: any) {
    if (webviewRef && webviewRef.current) {
      webviewRef.current.postMessage(JSON.stringify({ message, data }));
    }
  }

  async function commHandler(event: any) {
    const data = JSON.parse(event.nativeEvent.data);

    console.log("parsed", data);
    switch (data?.message) {
      case "connect": {
        console.log("Trying to connect");
        returnDataToWebview("connect", {
          publicKey: new PublicKey(walletId),
        });
        break;
      }
      case "signTransaction": {
        // Payload should be the transaction
        console.log("SIGN TRANSACTION: parsed.payload", data);
        const transaction = data.payload.transaction;
        const vault = vaults.find((vault) => vault.pubKey === walletId);
        setTypeOfTransaction("signTransaction");
        setTransactionInstructions([transaction]);
        // dispatch(
        //   createProposalAttempt({
        //     vault,
        //     transactionInstructions: [transaction],
        //   })
        // );
        bottomSheetModalRef?.current?.present();

        break;
      }
      case "signAndSendTransaction": {
        // Payload should be the transaction
        console.log("SIGN and SEND transaction: parsed", data);
        const transaction = data.payload.transaction;
        const vault = vaults.find((vault) => vault.pubKey === walletId);
        // dispatch(
        //   createProposalAttempt({
        //     vault,
        //     transactionInstructions: [transaction],
        //   })
        // );
        setTypeOfTransaction("signAndSendTransaction");
        setTransactionInstructions([transaction]);
        bottomSheetModalRef?.current?.present();

        break;
      }
      case "signAllTransactions": {
        // Payload should be the transaction
        console.log("SIGN ALL TRANSACTIONS: parsed.payload", data);
        const transactions = data.payload.transaction;
        const vault = vaults.find((vault) => vault.pubKey === walletId);
        // dispatch(
        //   createProposalAttempt({ vault, transactionInstructions: transactions })
        // );
        setTypeOfTransaction("signAllTransctions");
        setTransactionInstructions(transactions);
        bottomSheetModalRef?.current?.present();

        break;
      }
      case "signMessage": {
        // Payload should be the transaction
        console.log("SIGN MESSAGE:", data);
        bottomSheetModalRef?.current?.present();
        setTypeOfTransaction("signMessage");
        setTransactionInstructions([]);

        break;
      }
    }
  }

  const openBrowser = () => {
    if (navState?.url) {
      Linking.openURL(navState.url);
    }
  };

  const phantomTest = `
  try{
    const communicate = async (messageName) => {
      return new Promise(function (resolve, reject) {
        function eventListener(event) {
          try {
            let parsed = JSON.parse(event.data);
            if (parsed.message === messageName) {
              window.removeEventListener('message', eventListener);
              resolve(parsed.data);
            }
          } catch (e) {
            reject(e);
          }
        }
        window.addEventListener('message', eventListener);
      });
    }

    const walletAdapter = {
      isGlow: true,
      isPhantom: true,
      isConnected: false,

      publicKey: {
        toBytes: () => {
          return "${walletId}";
        },
        publicKey: "${walletId}",
        toString: () => {
          return "${walletId}";
        },
      },
      on: (event, callback) => {
        console.log("on", event, callback);
      },
      off: (event, callback) => {
        console.log("off", event, callback);
      },
      signTransaction: async (transaction) => {
        console.log("signTransaction", transaction);
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            message: "signTransaction",
            payload: {
              transaction,
              info: {
                title: document.title,
                host: window.location.host,
              },
            },
          })
        );
        return communicate("signTransaction");
      },
      signAllTransactions: async (transaction) => {
        console.log("signAllTransactions", transaction);
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            message: "signAllTransactions",
            payload: {
              transaction,
              info: {
                title: document.title,
                host: window.location.host,
              },
            },
          })
        );
        return communicate("signAllTransactions");
      },
      signAndSendTransaction: async (transaction, options) => {
        console.log("signAndSendTransaction", transaction);
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            message: "signAndSendTransaction",
            payload: {
              transaction,
              options,
              info: {
                title: document.title,
                host: window.location.host,
              },
            },
          })
        );
        return communicate("signAndSendTransaction");
      },
      sendAndConfirm: async (message) => {
        console.log("send and confirm???", message);
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            message: "signMessage",
            payload: {
              messageToSign: message,
              info: {
                title: document.title,
                host: window.location.host,
              },
            },
          })
        );
        return communicate("sendAndConfirm");
      },
      send: async (message) => {
        console.log("send send send", message);
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            message: "signMessage",
            payload: {
              messageToSign: message,
              info: {
                title: document.title,
                host: window.location.host,
              },
            },
          })
        );
        return communicate("send");
      },
      sendAll: async (message) => {
        console.log("send all???", message);
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            message: "signMessage",
            payload: {
              messageToSign: message,
              info: {
                title: document.title,
                host: window.location.host,
              },
            },
          })
        );
        return communicate("sendAll");
      },
      signMessage: async (message) => {
        console.log("signMessage", message);
        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            message: "signMessage",
            payload: {
              messageToSign: message,
              info: {
                title: document.title,
                host: window.location.host,
              },
            },
          })
        );
        return communicate("signAllTransactions");
      },
      connect: async () => {
        console.log('trying to connect');
        window.phantom.solana.isConnected = true;
        window.solana.isConnected = true;
        window.glowSolana.solana.isConnected = true;
        window.phantom.isConnected = true;
        window.glowSolana.isConnected = true;

        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            message: "connect",
            payload: {
              info: {
                title: document.title,
                host: window.location.host,
              },
            },
          })
        );
      },
     
      disconnect: async () => {
        console.log('trying to disconnect');

        window.solana.isConnected = false;
        window.phantom.solana.isConnected = false;
        window.glowSolana.solana.isConnected = false;
        window.phantom.isConnected = false;
        window.glowSolana.isConnected = false;

        window.ReactNativeWebView.postMessage(
          JSON.stringify({
            message: "disconnect",
            payload: {
              info: {
                title: document.title,
                host: window.location.host,
              },
            },
          })
        );
      },
    };
    window.phantom = walletAdapter;
    window.phantom.solana = walletAdapter;
    window.solana = walletAdapter;
    window.glowSolana = walletAdapter;
    window.glowSolana.solana = walletAdapter;

    } catch(e) {
      alert(e)
    }
    true;
    `;

  return (
    <Container>
      <SafeAreaView style={styles.container}>
        <WebView
          // working dapps so far
          source={{
            uri: url,
          }}
          // source={{ uri: "https://marinade.finance/app/staking/" }}
          // source={{ uri: "https://solend.fi/dashboard" }}
          // source={{ uri: "https://friktion.fi/" }}
          // apps that the tranasction errors out

          // source={{ uri: "https://hyperspace.xyz/collection/bdlc_genesis" }}
          // source={{ uri: "https://orca.so" }}
          // source={{ uri: "https://jup.ag" }}
          // apps that are in testing
          // source={{ uri: "https://app.streamflow.finance/dashboard" }}
          // source={{ uri: "https://app.meanfi.com/" }}
          // apps that I can't connect with wallet or other misc issue
          // source={{ uri: "https://rent.cardinal.so/miniroyale" }}
          // source={{ uri: "https://www.tensor.trade/" }}
          // source={{ uri: "https://rent.cardinal.so/miniroyale" }}
          // source={{ uri: "https://trade.mango.markets" }}
          // source={{ uri: "https://v3.squads.so" }}
          // source={{
          //   uri: "https://app.castle.finance/vaults/3tBqjyYtf9Utb1NNsx4o7AV1qtzHoxsMXgkmat3rZ3y6",
          // }}
          // source={{
          //   uri: "https://app.dispatch.forum/",
          // }}
          // source={{ uri: "https://app.realms.today" }}
          javaScriptEnabled={true}
          ref={webviewRef}
          // handle cors
          originWhitelist={["*"]}
          mixedContentMode="always"
          domStorageEnabled={true}
          // allowFileAccess={true}
          allowUniversalAccessFromFileURLs={true}
          // end handle cors

          onMessage={commHandler}
          injectedJavaScriptBeforeContentLoadedForMainFrameOnly={false}
          injectedJavaScriptForMainFrameOnly={false}
          // injectedJavaScriptBeforeContentLoaded={phantomTest}
          injectedJavaScript={phantomTest}
          pullToRefreshEnabled={true}
          onNavigationStateChange={(navState) => {
            // Keep track of going back navigation within component
            setNavState(navState);
          }}
          startInLoadingState={true}
          renderLoading={() => (
            <LoadingContainer>
              <ActivityIndicator />
            </LoadingContainer>
          )}
        />
        <WebViewActionContainer>
          <IconButton
            onPress={() => webviewRef.current?.goBack()}
            disabled={!navState?.canGoBack}
          >
            <FontAwesomeIcon
              icon={faArrowLeft}
              size={20}
              color={!navState?.canGoBack ? theme.gray[600] : theme.gray[300]}
            />
          </IconButton>
          <IconButton
            onPress={() => webviewRef.current?.goForward()}
            disabled={!navState?.canGoForward}
          >
            <FontAwesomeIcon
              icon={faArrowRight}
              size={20}
              color={
                !navState?.canGoForward ? theme.gray[600] : theme.gray[300]
              }
            />
          </IconButton>
          <IconButton onPress={() => webviewRef.current?.reload()}>
            <FontAwesomeIcon
              icon={faRotateRight}
              size={20}
              color={theme.gray[300]}
            />
          </IconButton>
          <IconButton onPress={() => openBrowser()}>
            <FontAwesomeIcon icon={faGlobe} size={20} color={theme.gray[300]} />
          </IconButton>
        </WebViewActionContainer>
        <CreateProposalTransactionModal
          bottomSheetModalRef={bottomSheetModalRef}
          walletId={walletId}
          transactionInstructions={transactionInstructions}
          navState={navState}
        />
      </SafeAreaView>
    </Container>
  );
}

const Container = styled.View`
  background-color: ${(props) => props.theme.gray[900]};
  flex: 1;
`;

const WebViewActionContainer = styled.View`
  padding-top: ${(props) => props.theme.spacing[2]};
  padding-bottom: ${(props) => props.theme.spacing[2]};

  flex-direction: row;
  justify-content: space-around;
`;

const IconButton = styled.TouchableOpacity`
  padding: ${(props) => props.theme.spacing[2]};
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#131313",
  },
});

const LoadingContainer = styled.View`
  height: 100%;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.gray[900]};
`;
