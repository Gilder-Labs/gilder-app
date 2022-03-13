import React, { useState, useEffect, useCallback } from "react";
import { Modal, FlatList, View } from "react-native";
import styled from "styled-components/native";
import { getColorType } from "../utils";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import * as Unicons from "@iconscout/react-native-unicons";
import { closeWallet, disconnectWallet } from "../store/walletSlice";
import * as style from "@dicebear/avatars-jdenticon-sprites";
import { PublicKeyTextCopy } from "./PublicKeyTextCopy";
import { SvgXml } from "react-native-svg";
import { useTheme } from "styled-components";
import { createAvatar } from "@dicebear/avatars";
import { fetchTokens } from "../store/walletSlice";
import { TokenList } from "./TokenList";
import numeral from "numeral";

interface RealmSelectModalProps {}

export const WalletModal = ({}: RealmSelectModalProps) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const { isWalletOpen, publicKey, tokenPriceData, tokens } = useAppSelector(
    (state) => state.wallet
  );

  const handleClose = () => {
    dispatch(closeWallet(""));
  };

  const handleDisconnect = () => {
    dispatch(disconnectWallet(""));
  };

  useEffect(() => {
    if (isWalletOpen && publicKey) {
      dispatch(fetchTokens(publicKey));
    }
  }, [isWalletOpen]);

  let jdenticonSvg = createAvatar(style, {
    seed: publicKey,
    // ... and other options
  });
  const color = getColorType(publicKey);

  const getTotalValue = () => {
    let totalValue = 0;
    tokens.forEach((token) => {
      const coinGeckoId = token?.extensions?.coingeckoId;
      totalValue +=
        tokenPriceData[coinGeckoId]?.current_price *
          token.tokenAmount.uiAmount || 0;
    });
    return numeral(totalValue).format("$0,0.00");
  };

  return (
    <Modal
      animationType="slide"
      visible={isWalletOpen}
      onRequestClose={handleClose}
      onDismiss={handleClose}
      presentationStyle="pageSheet"
      // transparent={true}
    >
      <Container>
        <Header>
          <DisconnectButton onPress={handleDisconnect}>
            <ButtonText>Disconnect</ButtonText>
          </DisconnectButton>
          <CloseIconButton onPress={handleClose} activeOpacity={0.5}>
            <Unicons.UilTimes size="20" color={theme.gray[200]} />
          </CloseIconButton>
        </Header>
        <IconContainer color={color}>
          <SvgXml xml={jdenticonSvg} width="52px" height="52px" />
        </IconContainer>
        <PublicKeyTextCopy publicKey={publicKey} />

        <WalletValue>{getTotalValue()}</WalletValue>

        <TokenContainer>
          <TokenList
            tokens={tokens}
            tokenPriceData={tokenPriceData}
            hideUnknownTokens={true}
          />
        </TokenContainer>
      </Container>
    </Modal>
  );
};

const Header = styled.View`
  height: 64px;
  background-color: ${(props) => props.theme.gray[800]};
  justify-content: space-between;
  width: 100%;
  align-items: center;
  flex-direction: row;
  padding-left: ${(props) => props.theme.spacing[2]};
  padding-right: ${(props) => props.theme.spacing[2]};
  margin-bottom: ${(props) => props.theme.spacing[3]};
`;

const CloseIconButton = styled.TouchableOpacity`
  width: 48px;
  height: 48px;
  justify-content: center;
  align-items: center;
`;

const EmptyView = styled.View`
  height: 150px;
`;

const Container = styled.View`
  /*  Styles for half size modal */
  /* height: 50%; */
  /* margin-top: auto; */
  height: 100%;
  background: ${(props) => props.theme.gray[900]};
  border-radius: 20px;
  align-items: center;
`;

const DisconnectButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  padding: ${(props) => props.theme.spacing[2]};
`;

const ButtonText = styled.Text`
  color: ${(props) => props.theme.gray[400]};
`;

const IconContainer = styled.View<{ color: string }>`
  /* border-radius: 100px, */
  background: ${(props: any) => props.theme[props.color][800]};
  flex-direction: row;
  align-items: center;
  overflow: hidden;
  border: 2px solid ${(props: any) => props.theme.gray[900]};
  border-radius: 100px;
  margin-bottom: ${(props) => props.theme.spacing[2]};
`;

const TokenContainer = styled.ScrollView`
  width: 100%;
  margin-top: ${(props: any) => props.theme.spacing[3]};

  margin-bottom: ${(props: any) => props.theme.spacing[3]};
  border-radius: 4px;
  padding: ${(props: any) => props.theme.spacing[4]};
  flex-direction: column;
  background: ${(props: any) => props.theme.gray[800]};
  height: 100%;
`;

const WalletValue = styled.Text`
  color: ${(props: any) => props.theme.gray[100]}
  font-weight: bold;
  font-size: 32px;
  margin-top: ${(props: any) => props.theme.spacing[3]};

`;
