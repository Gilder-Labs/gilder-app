import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import {
  Typography,
  RealmIconButton,
  Badge,
  PublicKeyTextCopy,
  Button,
} from "../components";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCheck } from "@fortawesome/pro-solid-svg-icons/faCheck";
import { faXmark } from "@fortawesome/pro-solid-svg-icons/faXmark";

import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
  closeTransactionModal,
  castVote,
  setTransactionLoading,
} from "../store/walletSlice";
import { useTheme } from "styled-components";
import { fetchRealmProposals } from "../store/proposalsSlice";
import { abbreviatePublicKey } from "../utils";
import * as Haptics from "expo-haptics";
import { DelegateButton } from "../components";
import { usePhantom } from "../hooks/usePhantom";
import { createCastVoteTransaction } from "../utils/castVote";

interface VoteOnProposalTransaction {}

export const VoteOnProposalTransaction = ({}: VoteOnProposalTransaction) => {
  const {
    transactionData,
    transactionType,
    transactionState,
    publicKey,
    isSendingTransaction,
    transactionError,
    walletType,
  } = useAppSelector((state) => state.wallet);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const { delegateMap, membersMap } = useAppSelector((state) => state.members);
  const { selectedRealm } = useAppSelector((state) => state.realms);
  const { proposal } = transactionData;
  const [selectedDelegate, setSelectedDelegate] = useState("");
  const isCommunityVote =
    selectedRealm?.communityMint === proposal?.governingTokenMint;
  const { signAndSendTransaction } = usePhantom();

  useEffect(() => {
    // refresh proposals after attempting to vote
    if (transactionState === "success" || transactionState === "error") {
      dispatch(
        fetchRealmProposals({ realm: selectedRealm, isRefreshing: true })
      );
    }
  }, [transactionState]);

  const handleApprove = async () => {
    if (walletType === "phantom") {
      dispatch(setTransactionLoading(true));
      const transaction = await createCastVoteTransaction(
        selectedRealm,
        publicKey,
        transactionData,
        membersMap,
        selectedDelegate,
        isCommunityVote
      );
      await signAndSendTransaction(transaction);
    } else {
      dispatch(
        castVote({
          publicKey,
          transactionData,
          selectedDelegate,
          isCommunityVote,
        })
      );
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleClose = () => {
    dispatch(closeTransactionModal(""));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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

  const getDelegateMembers = () => {
    if (publicKey && selectedRealm && delegateMap && delegateMap[publicKey]) {
      const walletDelegates = isCommunityVote
        ? delegateMap[publicKey].communityMembers
        : delegateMap[publicKey].councilMembers;
      return walletDelegates;
    }

    return [];
  };

  const handleSelectDelegate = (delegateId: string) => {
    setSelectedDelegate(delegateId);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const delegatesToVoteWith = getDelegateMembers();

  return (
    <ContentContainer>
      {transactionState === "pending" && (
        <TransactionContainer
          contentContainerStyle={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TitleRow>
            <RealmIconButton
              realmId={selectedRealm.pubKey}
              isDisabled={true}
              showSelected={false}
              size={48}
            />
            <TitleContainer>
              <Typography text={`${proposal.name}`} bold={true} size="h4" />
            </TitleContainer>
          </TitleRow>
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
            <Typography text={"Realm:"} shade={"500"} />
            <Typography
              maxLength={24}
              text={selectedRealm.name}
              bold={false}
              shade={"300"}
            />
          </Row>
          <Row>
            <Typography text={"Realm ID:"} shade={"500"} />
            <PublicKeyTextCopy
              noPadding={true}
              publicKey={selectedRealm.pubKey}
            />
          </Row>
          <>
            <Row>
              <Typography text={"Vote as:"} shade={"500"} />
            </Row>
            <DelegateScrollView
              horizontal={true}
              contentContainerStyle={{ justifyContent: "center" }}
            >
              {membersMap?.[publicKey] && (
                <DelegateButton
                  isSelected={selectedDelegate === publicKey}
                  onPress={() => handleSelectDelegate(publicKey)}
                  memberPublicKey={publicKey}
                  delegate={membersMap?.[publicKey]}
                  isCommunityVote={isCommunityVote}
                  key={publicKey}
                />
              )}

              {delegatesToVoteWith.map((delegate: Member) => (
                <DelegateButton
                  isSelected={selectedDelegate === delegate?.walletId}
                  onPress={() => handleSelectDelegate(delegate.walletId)}
                  memberPublicKey={delegate.walletId}
                  delegate={delegate}
                  isCommunityVote={isCommunityVote}
                  key={delegate.publicKey}
                />
              ))}
              <EmptyView />
            </DelegateScrollView>
          </>
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
            <Typography
              text={"Vote on proposal"}
              bold={true}
              size="h3"
              marginBottom="0"
            />
          </TitleContainer>
          <Typography text={"Successfully voted!"} shade={"300"} />
          <IconContainer isSuccessful={true}>
            <FontAwesomeIcon
              icon={faCheck}
              size={32}
              color={theme.success[400]}
            />
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
            <FontAwesomeIcon
              icon={faXmark}
              size={32}
              color={theme.error[400]}
            />
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
              disabled={isSendingTransaction || !publicKey || !selectedDelegate}
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
            shade="600"
            color="secondary"
            shade2="800"
            color2="secondary"
            hasGradient={true}
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

  padding-top: ${(props) => props.theme.spacing[4]};
  padding-bottom: ${(props) => props.theme.spacing[5]};
  padding-right: ${(props) => props.theme.spacing[5]};
  padding-left: ${(props) => props.theme.spacing[5]};
`;

const Row = styled.View`
  flex-direction: row;
  margin-bottom: ${(props) => props.theme.spacing[1]};
  justify-content: space-between;
  width: 100%;
  align-items: center;
  min-height: 32px;
`;

const TitleRow = styled.View`
  flex-direction: row;
  margin-bottom: ${(props) => props.theme.spacing[2]};
  width: 100%;
  align-items: center;
  min-height: 32px;
`;

const TitleContainer = styled.View`
  margin-left: ${(props) => props.theme.spacing[3]};
  margin-bottom: ${(props) => props.theme.spacing[2]};
  max-width: 80%;
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

const DelegateScrollView = styled.ScrollView`
  width: 100%;
  padding-bottom: ${(props: any) => props.theme.spacing[3]};
  padding-top: ${(props: any) => props.theme.spacing[3]};
  padding-left: ${(props: any) => props.theme.spacing[2]};
  margin-bottom: 48px;
  padding-right: ${(props: any) => props.theme.spacing[4]};

  border-radius: 8px;
  background: ${(props) => props.theme.gray[700]};
`;

const EmptyView = styled.View`
  width: 80px;
  height: 80px;
  background: transparent;
`;
