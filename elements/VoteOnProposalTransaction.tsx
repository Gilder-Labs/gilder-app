import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import {
  Typography,
  RealmIconButton,
  Badge,
  PublicKeyTextCopy,
  Button,
} from "../components";
import * as Unicons from "@iconscout/react-native-unicons";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { closeTransactionModal, castVote } from "../store/walletSlice";
import { useTheme } from "styled-components";
import { fetchRealmProposals } from "../store/proposalsSlice";

interface VoteOnProposalTransaction {}

export const VoteOnProposalTransaction = ({}: VoteOnProposalTransaction) => {
  const {
    transactionData,
    transactionType,
    transactionState,
    publicKey,
    isSendingTransaction,
    transactionError,
  } = useAppSelector((state) => state.wallet);
  const dispatch = useAppDispatch();
  const theme = useTheme();

  const { selectedRealm } = useAppSelector((state) => state.realms);
  const { proposal } = transactionData;

  useEffect(() => {
    // refresh proposals after attempting to vote
    if (transactionState === "success" || transactionState === "error") {
      dispatch(
        fetchRealmProposals({ realm: selectedRealm, isRefreshing: true })
      );
    }
  }, [transactionState]);

  const handleApprove = () => {
    dispatch(castVote({ publicKey, transactionData }));
  };

  const handleClose = () => {
    dispatch(closeTransactionModal(""));
  };

  const isYesVote = transactionData.action === 0;

  const renderErrorLogs = () => {
    const { logs } = transactionError;
    if (logs) {
      return logs.map((log: string) => (
        <Typography text={log} size="caption" color="error" shade="400" />
      ));
    }
    return;
  };

  return (
    <ContentContainer>
      {transactionState === "pending" && (
        <TransactionContainer
          contentContainerStyle={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <RealmIconButton
            realmId={selectedRealm.pubKey}
            isDisabled={true}
            showSelected={false}
            size={64}
          />
          <TitleContainer>
            <Typography text={"Vote on proposal"} bold={true} size="h3" />
          </TitleContainer>
          <Row>
            <Typography text={"Vote:"} shade={"500"} />
            {/* <Typography
          text={transactionData.action === "VoteYes" ? "Yes" : "No"}
          bold={true}
          shade={"100"}
        /> */}
            <Badge
              title={isYesVote ? "Yes" : "No"}
              type={isYesVote ? "success" : "error"}
            />
          </Row>
          <Row>
            <Typography text={"Proposal Title:"} shade={"500"} />
            <Typography text={proposal.name} bold={false} shade={"300"} />
          </Row>
          <Row>
            <Typography text={"Realm:"} shade={"500"} />
            <Typography text={selectedRealm.name} bold={false} shade={"300"} />
          </Row>
          <Row>
            <Typography text={"Realm ID"} shade={"500"} />
            <PublicKeyTextCopy publicKey={selectedRealm.pubKey} />
          </Row>
        </TransactionContainer>
      )}
      {transactionState === "success" && (
        <TransactionContainer
          contentContainerStyle={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <RealmIconButton
            realmId={selectedRealm.pubKey}
            isDisabled={true}
            showSelected={false}
            size={64}
          />
          <TitleContainer>
            <Typography text={"Vote on proposal"} bold={true} size="h3" />
          </TitleContainer>
          <Typography text={"Successfully voted!"} shade={"300"} />
          <IconContainer isSuccessful={true}>
            <Unicons.UilCheck size="48" color={theme.success[400]} />
          </IconContainer>
        </TransactionContainer>
      )}
      {transactionState === "error" && (
        <TransactionContainer
          contentContainerStyle={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <RealmIconButton
            realmId={selectedRealm.pubKey}
            isDisabled={true}
            showSelected={false}
            size={64}
          />
          <TitleContainer>
            <Typography text={"Vote on proposal"} bold={true} size="h3" />
          </TitleContainer>
          <Typography
            text={"Something went wrong when trying to vote."}
            shade={"300"}
          />
          <IconContainer isSuccessful={false}>
            <Unicons.UilTimes size="48" color={theme.error[400]} />
          </IconContainer>
          {renderErrorLogs()}
        </TransactionContainer>
      )}
      <ActionContainer>
        {transactionState === "pending" && (
          <>
            <Button
              title="Cancel"
              onPress={handleClose}
              shade="800"
              marginRight={true}
            />
            <Button
              isLoading={isSendingTransaction}
              disabled={isSendingTransaction}
              title="Approve"
              onPress={handleApprove}
              shade="800"
              color="secondary"
            />
          </>
        )}
        {transactionState === "success" && (
          <Button
            title="Done"
            onPress={handleClose}
            shade="800"
            color="secondary"
          />
        )}
        {transactionState === "error" && (
          <Button
            title="Done"
            onPress={handleClose}
            shade="800"
            color="secondary"
          />
        )}
      </ActionContainer>
    </ContentContainer>
  );
};

const TransactionContainer = styled.ScrollView`
  /* flex: 1; */

  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
  background: ${(props) => props.theme.gray[800]};

  padding-top: ${(props) => props.theme.spacing[3]};
  padding-bottom: ${(props) => props.theme.spacing[3]};
  padding-right: ${(props) => props.theme.spacing[5]};
  padding-left: ${(props) => props.theme.spacing[5]};
`;

const Row = styled.View`
  flex-direction: row;
  margin-bottom: ${(props) => props.theme.spacing[2]};
  justify-content: space-between;
  width: 100%;
  align-items: center;
  min-height: 32px;
`;

const TitleContainer = styled.View`
  margin-top: -${(props) => props.theme.spacing[2]};
  margin-bottom: ${(props) => props.theme.spacing[2]};
`;

const ActionContainer = styled.View`
  flex-direction: row;
  padding-left: ${(props) => props.theme.spacing[3]};
  padding-right: ${(props) => props.theme.spacing[3]};
  margin-bottom: ${(props) => props.theme.spacing[4]};
  padding: ${(props) => props.theme.spacing[3]};
  background: ${(props) => props.theme.gray[900]};
`;

const ContentContainer = styled.View`
  background: ${(props) => props.theme.gray[900]};
  width: 100%;
  flex: 1;
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
`;

const IconContainer = styled.View<{ isSuccessful: boolean }>`
  flex: 1;
  justify-content: center;
  align-items: center;
  width: 64px;
  max-width: 64px;
  height: 64px;
  max-height: 64px;
  border-radius: 100px;
  margin-top: ${(props: any) => props.theme.spacing[4]};
  margin-bottom: ${(props: any) => props.theme.spacing[4]};

  background: ${(props: any) =>
    props.isSuccessful ? props.theme.success[400] : props.theme.error[400]}44;
`;
