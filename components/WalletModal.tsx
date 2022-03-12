import React, { useState, useEffect, useCallback } from "react";
import { Modal, FlatList, View } from "react-native";
import styled from "styled-components/native";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import * as Unicons from "@iconscout/react-native-unicons";
import { debounce, filter } from "lodash";
import { useTheme } from "styled-components";
import { RealmCard } from "./RealmCard";
import { closeWallet, disconnectWallet } from "../store/walletSlice";

interface RealmSelectModalProps {}

export const WalletModal = ({}: RealmSelectModalProps) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const { isWalletOpen } = useAppSelector((state) => state.wallet);

  const handleClose = () => {
    dispatch(closeWallet(""));
  };

  const handleDisconnect = () => {
    dispatch(disconnectWallet(""));
  };

  // Remove header title thing
  // Show wallet icon + public key
  // Add copy icon
  // Total balance
  //Tabs:
  //    Shows coins in wallet
  //    show activity
  // send? (later)
  // on transaction - shows details and slider to approve, make modal half size

  return (
    <Modal
      animationType="slide"
      visible={isWalletOpen}
      onRequestClose={handleClose}
      presentationStyle="pageSheet"
      transparent={true}
    >
      <Container>
        <Header>
          <View style={{ width: 48, height: 48 }} />
          <HeaderTitle>Wallet</HeaderTitle>
          <CloseIconButton onPress={handleClose} activeOpacity={0.5}>
            <Unicons.UilTimes size="20" color={theme.gray[200]} />
          </CloseIconButton>
        </Header>
        <DisconnectButton onPress={handleDisconnect}>
          <ButtonText>Disconnect Wallet</ButtonText>
        </DisconnectButton>
      </Container>
    </Modal>
  );
};

const Header = styled.View`
  height: 64px;
  background-color: ${(props) => props.theme.gray[800]};
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  padding-left: ${(props) => props.theme.spacing[2]};
  padding-right: ${(props) => props.theme.spacing[2]};
`;

const HeaderTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${(props) => props.theme.gray[50]};
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
  background: blue;
  border-radius: 20px;
`;

const DisconnectButton = styled.TouchableOpacity`
  flex-direction: row;
  height: 48px;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  margin-bottom: 80px;

  background: ${(props) => props.theme.gray[800]};
`;

const ButtonText = styled.Text`
  color: ${(props) => props.theme.gray[400]};
`;
