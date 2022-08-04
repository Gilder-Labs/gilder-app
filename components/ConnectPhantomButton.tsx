import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components/native";
import { useTheme } from "styled-components";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import * as Haptics from "expo-haptics";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setWallet, openWallet } from "../store/walletSlice";

import { LinearGradient } from "expo-linear-gradient";
import PhantomGhostLogo from "../assets/images/phantomGhostLogo.svg";
import PhantomTextLogo from "../assets/images/phantomTextLogo.svg";
import * as Linking from "expo-linking";
import nacl from "tweetnacl";
import bs58 from "bs58";
import {
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { RPC_CONNECTION } from "../constants/Solana";
import { usePhantom } from "../hooks/usePhantom";

const onConnectRedirectLink = Linking.createURL("onConnect");

interface ConnectWalletProps {}

export const ConnectPhantomButton = ({}: ConnectWalletProps) => {
  const { connect } = usePhantom();

  return (
    <ConnectButton onPress={() => connect()}>
      <LinearGradient
        colors={[`#4E44CE`, `#6D64E0`]}
        style={{
          padding: 16,
          borderRadius: 8,
          marginBottom: 8,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 140,
          minWidth: 140,
          flex: 1,
        }}
      >
        <LogoContainer>
          <PhantomGhostLogo width={28} height={28} />
        </LogoContainer>
        <PhantomTextLogo width={80} height={80} />
      </LinearGradient>
    </ConnectButton>
  );
};

const ConnectButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex: 1;
  min-width: 140px;
  min-height: 140px;
  max-width: 50%;
  margin-left: ${(props) => props.theme.spacing[1]};
`;

const LogoContainer = styled.View`
  margin-right: 8px;
`;
