import React, { useState, useEffect, useCallback } from "react";
import { Modal, FlatList, View, StyleSheet, Animated } from "react-native";
import styled from "styled-components/native";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
// @ts-ignore
import * as Unicons from "@iconscout/react-native-unicons";
import { useTheme } from "styled-components";
import { closeTransactionModal, castVote } from "../store/walletSlice";
import { Typography } from "./Typography";
import { VoteOnProposalTransaction } from "../elements";

interface WalletTransactionModalProps {}

export const WalletTransactionModal = ({}: WalletTransactionModalProps) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const { transactionType, isTransactionModalOpen } = useAppSelector(
    (state) => state.wallet
  );

  const handleClose = () => {
    dispatch(closeTransactionModal(""));
  };

  return (
    <Modal
      animationType="slide"
      visible={isTransactionModalOpen}
      onRequestClose={handleClose}
      onDismiss={handleClose}
      presentationStyle="pageSheet" // overFullScreen
      transparent={true}
    >
      <Container>
        {/* <Header>
          <CloseIconButton onPress={handleClose} activeOpacity={0.5}>
            <Unicons.UilTimes size="20" color={theme.gray[200]} />
          </CloseIconButton>
        </Header> */}
        {transactionType === "VoteOnProposal" && <VoteOnProposalTransaction />}
        {false && <Typography text="info info info" />}
        {false && <Typography text="info info info" />}
      </Container>
    </Modal>
  );
};

const Container = styled.View`
  background: ${(props) => props.theme.gray[900]};
  border-radius: 20px;
  height: 50%;
  margin-top: auto;
  border-radius: 20px;
  align-items: center;
  justify-content: space-between;
`;
