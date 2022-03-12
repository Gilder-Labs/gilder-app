import React, { useState, useEffect, useCallback } from "react";
import { Modal, FlatList, View } from "react-native";
import styled from "styled-components/native";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import * as Unicons from "@iconscout/react-native-unicons";
import { debounce, filter } from "lodash";
import { useTheme } from "styled-components";
import { RealmCard } from "./RealmCard";
import { closeWallet } from "../store/walletSlice";

interface RealmSelectModalProps {}

export const WalletModal = ({}: RealmSelectModalProps) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const { isWalletOpen } = useAppSelector((state) => state.wallet);

  const handleClose = () => {
    dispatch(closeWallet(""));
  };

  return (
    <Modal
      animationType="slide"
      visible={isWalletOpen}
      onRequestClose={() => {}}
      presentationStyle="pageSheet"
    >
      <Header>
        <View style={{ width: 48, height: 48 }} />
        <HeaderTitle> Add Realm</HeaderTitle>
        <CloseIconButton onPress={handleClose} activeOpacity={0.5}>
          <Unicons.UilTimes size="20" color={theme.gray[200]} />
        </CloseIconButton>
      </Header>
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

const Container = styled.View``;
