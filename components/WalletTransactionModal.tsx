import React, { useState, useEffect, useCallback } from "react";
import {
  Modal,
  FlatList,
  View,
  StyleSheet,
  Animated,
  Platform,
} from "react-native";
import styled from "styled-components/native";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
// @ts-ignore
import { useTheme } from "styled-components";
import { closeTransactionModal, castVote } from "../store/walletSlice";
import { Typography } from "./Typography";
import { VoteOnProposalTransaction } from "../elements";
import { Incubator } from "react-native-ui-lib";
import { setShowToast } from "../store/utilitySlice";

const { Toast } = Incubator;

interface WalletTransactionModalProps {}

export const WalletTransactionModal = ({}: WalletTransactionModalProps) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { isShowingToast } = useAppSelector((state) => state.utility);

  const { transactionType, isTransactionModalOpen } = useAppSelector(
    (state) => state.wallet
  );

  const handleDismiss = () => {
    dispatch(setShowToast(false));
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
      // transparent={true}
    >
      <Container>
        {Platform.OS === "ios" && (
          <FloatingBarContainer>
            <FloatingBar />
          </FloatingBarContainer>
        )}
        {transactionType === "VoteOnProposal" && <VoteOnProposalTransaction />}
        {false && <Typography text="info info info" />}
        {false && <Typography text="info info info" />}
      </Container>
      <Toast
        visible={isShowingToast}
        position={"bottom"}
        preset="success"
        message="Public key copied."
        onDismiss={handleDismiss}
        autoDismiss={1000}
        backgroundColor={theme.gray[1000]}
        zIndex={10000}
        containerStyle={{
          width: 240,
          marginLeft: "auto",
          marginRight: "auto",
        }}
        messageStyle={{
          color: theme.gray[400],
        }}
        elevation={0}
        centerMessage={true}
      />
    </Modal>
  );
};

const Container = styled.View`
  background: ${(props) => props.theme.gray[900]};
  border-radius: 20px;
  height: 60%;
  margin-top: auto;
  border-radius: 20px;
  align-items: center;
  justify-content: space-between;
`;

const FloatingBarContainer = styled.View`
  position: absolute;

  width: 100%;
  padding-top: ${(props: any) => props.theme.spacing[2]};
  top: 0;
  left: 0;
  z-index: 100;

  justify-content: center;
  align-items: center;
`;

const FloatingBar = styled.View`
  height: 4px;
  width: 40px;
  z-index: 100;
  background: #ffffff66;
  top: 0;
  border-radius: 8px;
`;
