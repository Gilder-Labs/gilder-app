import React, { useState, useEffect, useCallback } from "react";
import { Modal, FlatList, View, StyleSheet, Animated } from "react-native";
import styled from "styled-components/native";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
// @ts-ignore
import * as Unicons from "@iconscout/react-native-unicons";
import { closeWallet, disconnectWallet } from "../store/walletSlice";
import { useTheme } from "styled-components";
import { fetchTokens, closeTransactionModal } from "../store/walletSlice";
import { Typography } from "./Typography";
import { Button } from "./Button";
import numeral from "numeral";

interface WalletTransactionModalProps {}

export const WalletTransactionModal = ({}: WalletTransactionModalProps) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const {
    isWalletOpen,
    publicKey,
    tokenPriceData,
    tokens,
    isTransactionModalOpen,
  } = useAppSelector((state) => state.wallet);

  const handleClose = () => {
    console.log("trying to close");
    dispatch(closeTransactionModal(""));
  };

  return (
    <Modal
      animationType="slide"
      visible={isTransactionModalOpen}
      onRequestClose={handleClose}
      onDismiss={handleClose}
      presentationStyle="overFullScreen"
      transparent={true}
    >
      <Container>
        <Typography text="hello world" />
        <Button title="Close" onPress={handleClose} />
      </Container>
    </Modal>
  );
};

const Container = styled.View`
  background: ${(props) => props.theme.gray[800]};
  border-radius: 20px;
  height: 50%;
  margin-top: auto;
  border-radius: 20px;
  align-items: center;
`;
