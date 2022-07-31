import React, { useState } from "react";
import styled from "styled-components/native";
import { useTheme } from "styled-components";
import { Keypair } from "@solana/web3.js";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import Constants, { AppOwnership } from "expo-constants";
import * as Linking from "expo-linking";
import bs58 from "bs58";
import { abbreviatePublicKey } from "../utils";
import { setWallet, openWallet } from "../store/walletSlice";
import * as Haptics from "expo-haptics";
import * as WebBrowser from "expo-web-browser";

import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import PhantomGhostLogo from "../assets/images/phantomGhostLogo.svg";
import PhantomTextLogo from "../assets/images/phantomTextLogo.svg";

interface ConnectWalletProps {}

export const ConnectPhantomButton = ({}: ConnectWalletProps) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { publicKey } = useAppSelector((state) => state.wallet);
  const navigation = useNavigation();

  const handleOpenWallet = () => {
    // dispatch(openWallet(""));
    navigation.push("WalletModal");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  return (
    <ConnectButton onPress={() => {}}>
      <LinearGradient
        colors={[`#4E44CE`, `#6D64E0`]}
        style={{
          padding: 16,
          borderRadius: 8,
          marginBottom: 16,
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
  min-width: 120px;
  min-height: 120px;
  max-width: 50%;
  margin-left: ${(props) => props.theme.spacing[1]};
`;

const LogoContainer = styled.View`
  margin-right: 8px;
`;
