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

import { useTheme } from "styled-components";
import { SafeAreaView, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";

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

  const dispatch = useDispatch();
  const { vaults } = useAppSelector((state) => state.treasury);

  const { walletId } = route?.params;

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
          publicKey: new PublicKey(
            "EVa7c7XBXeRqLnuisfkvpXSw5VtTNVM8MNVJjaSgWm4i"
          ),
        });
        break;
      }
      case "signTransaction": {
        // Payload should be the transaction
        console.log("SIGN TRANSACTION: parsed.payload", data);
        // promptUserForTX({
        //   host: parsed.payload.info.host,
        //   title: parsed.payload.info.title,
        //   action: 'signTransaction',
        //   onSuccess: async () => {
        //     const signedTxData = await SolspaceWallet.signTransactionWeb(
        //       parsed.payload.transaction,
        //     );
        //     returnDataToWebview('signTransaction', signedTxData);
        //   },
        // });
        break;
      }
      case "signAndSendTransaction": {
        // Payload should be the transaction
        console.log("SIGN and SEND transaction: parsed", data);
        const transaction = data.payload.transaction;
        const vault = vaults.find((vault) => vault.pubKey === walletId);
        dispatch(
          createProposalAttempt({
            vault,
            transactionInstructions: [transaction],
          })
        );
        // promptUserForTX({
        //   host: parsed.payload.info.host,
        //   title: parsed.payload.info.title,
        //   action: 'signTransaction',
        //   onSuccess: async () => {
        //     const signedTxData = await SolspaceWallet.signTransactionWeb(
        //       parsed.payload.transaction,
        //     );
        //     returnDataToWebview('signTransaction', signedTxData);
        //   },
        // });
        break;
      }
      case "signAllTransactions": {
        // Payload should be the transaction
        console.log("SIGN ALL TRANSACTIONS: parsed.payload", data);
        const transaction = data.payload.transaction;
        const vault = vaults.find((vault) => vault.pubKey === walletId);
        dispatch(
          createProposalAttempt({ vault, transactionInstructions: transaction })
        );
        break;
      }
      case "signMessage": {
        // Payload should be the transaction
        console.log("SIGN MESSAGE:", data);

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

    const phantom = {
      isPhantom: true,
      isConnected: true,
      publicKey: {
        toBytes: () => {
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
    };
    window.phantom = phantom;
    window.phantom.solana = phantom;
    window.solana = phantom;


    document = "something";
    } catch(e) {
      alert(e)
    }
    true;
    `;

  console.log("wallet id", walletId);

  return (
    <Container>
      <SafeAreaView style={styles.container}>
        <WebView
          // source={{ uri: "https://trade.mango.markets" }}
          // source={{ uri: "https://friktion.fi/" }}
          // source={{ uri: "https://dialect.to" }}
          // source={{ uri: "https://v3.squads.so" }}
          // source={{ uri: "https://solanart.io/" }}
          // source={{
          //   uri: "https://app.castle.finance/vaults/3tBqjyYtf9Utb1NNsx4o7AV1qtzHoxsMXgkmat3rZ3y6",
          // }}
          // source={{ uri: "https://orca.so" }}
          // source={{ uri: "https://jup.ag" }}
          // source={{
          //   uri: "https://app.dispatch.forum/forum/2gPb8UPw5n5gpUpnRD4h9nG254dY5JdVxmkYJxsZPbDr",
          // }}
          // source={{ uri: "https://app.realms.today" }}
          source={{ uri: "https://marinade.finance/app/staking/" }}
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
