import React, { useState, useEffect, useCallback } from "react";
import { Modal, FlatList, View, StyleSheet, Animated } from "react-native";
import styled from "styled-components/native";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
// @ts-ignore
import * as Unicons from "@iconscout/react-native-unicons";
import { useTheme } from "styled-components";
import { closeTransactionModal } from "../store/walletSlice";
import { Typography } from "./Typography";
import { Button } from "./Button";
import { VoteOnProposalTransaction } from "../elements";

interface WalletTransactionModalProps {}

export const WalletTransactionModal = ({}: WalletTransactionModalProps) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  const {
    isWalletOpen,
    publicKey,
    tokenPriceData,
    tokens,
    transactionData,
    transactionType,
    isTransactionModalOpen,
  } = useAppSelector((state) => state.wallet);

  // If a user hasn't side approve slider all the way, reset it
  const handleApprove = () => {
    console.log("approving");
  };

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
        <ContentContainer>
          {transactionType === "VoteOnProposal" && (
            <VoteOnProposalTransaction />
          )}
          {false && <Typography text="info info info" />}
          {false && <Typography text="info info info" />}
        </ContentContainer>

        {/* TODO: move action container to be imported into each transaction type */}
        <ActionContainer>
          <Button
            title="Cancel"
            onPress={handleClose}
            shade="800"
            marginRight={true}
          />
          <Button
            title="Approve"
            onPress={handleApprove}
            shade="800"
            color="secondary"
          />
        </ActionContainer>
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

const ContentContainer = styled.ScrollView`
  padding: ${(props) => props.theme.spacing[3]};
  background: ${(props) => props.theme.gray[800]};
  width: 100%;
  flex: 1;
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
`;

const ActionContainer = styled.View`
  flex-direction: row;
  margin-bottom: ${(props) => props.theme.spacing[4]};
  padding-left: ${(props) => props.theme.spacing[3]};
  padding-right: ${(props) => props.theme.spacing[3]};
  padding: ${(props) => props.theme.spacing[3]};
  background: ${(props) => props.theme.gray[900]};
`;
