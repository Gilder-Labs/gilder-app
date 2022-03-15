import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import {
  Typography,
  RealmIconButton,
  Badge,
  PublicKeyTextCopy,
} from "../components";
// import * as Unicons from "@iconscout/react-native-unicons";
import { useAppSelector } from "../hooks/redux";

interface VoteOnProposalTransaction {}

export const VoteOnProposalTransaction = ({}: VoteOnProposalTransaction) => {
  const { transactionData, transactionType } = useAppSelector(
    (state) => state.wallet
  );
  const { selectedRealm } = useAppSelector((state) => state.realms);
  const { proposal } = transactionData;
  // Realm image
  // Type: Proposal Vote
  // Approve Vote?
  // Type of Vote (needs to be eye catching)
  // balance change/fees

  const isYesVote = transactionData.action === 0;

  return (
    <TransactionContainer>
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
  );
};

const TransactionContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  padding-top: ${(props) => props.theme.spacing[2]};
  padding-bottom: ${(props) => props.theme.spacing[2]};
  padding-right: ${(props) => props.theme.spacing[3]};
  padding-left: ${(props) => props.theme.spacing[3]};
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
