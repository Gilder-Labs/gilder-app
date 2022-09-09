import { useRef, useState } from "react";
import styled from "styled-components/native";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { fetchRealmActivity } from "../store/activitySlice";
import { WebView } from "react-native-webview";
import { PublicKey } from "@solana/web3.js";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faXmark } from "@fortawesome/pro-solid-svg-icons/faXmark";
import { faArrowLeft } from "@fortawesome/pro-solid-svg-icons/faArrowLeft";
import { faArrowRight } from "@fortawesome/pro-solid-svg-icons/faArrowRight";
import { faRotateRight } from "@fortawesome/pro-solid-svg-icons/faRotateRight";
import { faGlobe } from "@fortawesome/pro-solid-svg-icons/faGlobe";
import { PhantomWalletAdapter } from "../utils/gilder-wallet/walletSpec";
import { Linking } from "react-native";

import { useTheme } from "styled-components";
import { SafeAreaView, StyleSheet } from "react-native";

export default function WebViewScreen() {
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

  const walletAdapter = new PhantomWalletAdapter();

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
        const connectResult = await walletAdapter.connect();
        console.log("connect result", connectResult);
        returnDataToWebview("connect", {
          PublicKey: new PublicKey(
            "EVa7c7XBXeRqLnuisfkvpXSw5VtTNVM8MNVJjaSgWm4i"
          ),
        });

        break;
      }
    }
  }

  const openBrowser = () => {
    if (navState?.url) {
      Linking.openURL(navState.url);
    }
  };

  const runFirst = `

      class Phantom {
        async connect() {
          window.ReactNativeWebView.postMessage(
            JSON.stringify({
              message: 'connect',
              payload: {
                info: {
                  title: document.title, 
                  host: window.location.host
                }
              }
            }),
          );
          let connectData = await this.communicate('connect');
          return connectData;
        }
        isConnected: false;
        isPhantom: true;
      };

      window.phantom.solana = Phantom;
      true; // note: this is required, or you'll sometimes get silent failures
    `;

  const phantomTest = `

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

    window.phantom = {
      solana: {
        isPhantom: true,
        connect: async () => {
          window.ReactNativeWebView.postMessage(
            JSON.stringify({
              message: 'connect',
              payload: {
                info: {
                  title: document.title, 
                  host: window.location.host
                }
              }
            }),
          );
        },
        signTransaction: async () => {},
      }
    };
    alert("phantom injected");
    true;
  `;

  return (
    <Container>
      <SafeAreaView style={styles.container}>
        <WebView
          source={{ uri: "https://trade.mango.markets" }}
          javaScriptEnabled={true}
          ref={webviewRef}
          onMessage={commHandler}
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
