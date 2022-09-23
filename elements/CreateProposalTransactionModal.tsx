import React, { useRef, useMemo, useCallback } from "react";
import styled from "styled-components/native";
import { View } from "react-native";
import { useTheme } from "styled-components";

import * as Haptics from "expo-haptics";
import { useNavigation } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { Button } from "../components";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { faCopy } from "@fortawesome/pro-solid-svg-icons/faCopy";
import { faComments } from "@fortawesome/pro-solid-svg-icons/faComments";
import { faFaceSmilePlus } from "@fortawesome/pro-solid-svg-icons/faFaceSmilePlus";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import CustomBackdrop from "../components/FadeBackdropModal";
import { createProposalAttempt } from "../store/proposalActionsSlice";

import { Typography, PublicKeyTextCopy } from "../components";

interface CreateProposalTransactionModalProps {
  bottomSheetModalRef: any;
  walletId: string;
  transactionInstructions: Array<any>;
  navState: {
    title: string;
    url: string;
  };
}

export const CreateProposalTransactionModal = ({
  bottomSheetModalRef,
  transactionInstructions,
  walletId,
  navState,
}: CreateProposalTransactionModalProps) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { publicKey } = useAppSelector((state) => state.wallet);
  const snapPoints = useMemo(() => ["25", "50%"], []);
  const dispatch = useAppDispatch();
  const { vaults } = useAppSelector((state) => state.treasury);
  const { selectedRealm } = useAppSelector((state) => state.realms);
  const { isLoading } = useAppSelector((state) => state.proposalActions);

  const closeModal = (reaction: string) => {
    bottomSheetModalRef.current?.close();
  };

  const handleProposalCreation = () => {
    const vault = vaults.find((vault) => vault.pubKey === walletId);
    dispatch(
      createProposalAttempt({
        vault,
        transactionInstructions: transactionInstructions,
      })
    );
  };

  const myUrl = navState?.url ? new URL(navState?.url) : "";

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={snapPoints}
        handleStyle={{
          backgroundColor: theme.gray[800],
          borderTopRightRadius: 8,
          borderTopLeftRadius: 8,
        }}
        handleIndicatorStyle={{
          backgroundColor: theme.gray[500],
        }}
        backgroundStyle={{
          backgroundColor: theme.gray[800],
        }}
        backdropComponent={CustomBackdrop}
      >
        <ContentContainer>
          <Row>
            <SiteImage
              source={{ uri: myUrl ? `https://${myUrl.host}/favicon.ico` : "" }}
            />
            <Column>
              <Typography
                text={navState.title}
                size="h4"
                bold={true}
                marginBottom="0"
              />
              <Typography text={myUrl ? myUrl.host : ""} shade="500" />
            </Column>
          </Row>

          <SpacedRow>
            <Typography text={"Realm ID:"} shade="500" />
            <PublicKeyTextCopy
              publicKey={selectedRealm.realmId}
              noPadding={true}
            />
          </SpacedRow>

          <SpacedRow>
            <Typography text={"DAO wallet:"} shade="500" />
            <PublicKeyTextCopy publicKey={walletId} noPadding={true} />
          </SpacedRow>
          <SpacedRow>
            <Typography text={"Realm:"} shade="500" />
            <Typography text={selectedRealm.name} shade="300" />
          </SpacedRow>

          <ActionRow>
            <Button
              // isLoading={isSendingTransaction}
              // disabled={isSendingTransaction || !publicKey || !selectedDelegate}
              title="Cancel"
              onPress={closeModal}
              shade="700"
              color="gray"
              marginRight={true}
            />
            <Button
              isLoading={isLoading}
              disabled={isLoading}
              title="Create Proposal"
              onPress={handleProposalCreation}
              shade="800"
              color="secondary"
            />
          </ActionRow>
        </ContentContainer>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

const ContentContainer = styled.View`
  flex: 1;
  height: 100%;
  background: ${(props: any) => props.theme.gray[800]};
  min-height: 200px;
  /* padding-left: ${(props: any) => props.theme.spacing[2]};
  padding-right: ${(props: any) => props.theme.spacing[2]}; */
`;

const SiteImage = styled.Image`
  width: 48px;
  height: 48px;
  margin-left: ${(props: any) => props.theme.spacing[2]};
  margin-right: ${(props: any) => props.theme.spacing[2]};
  border-radius: 100px;
  margin-top: ${(props: any) => props.theme.spacing[1]}; ;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: ${(props: any) => props.theme.spacing[2]};
`;

const ActionRow = styled.View`
  flex-direction: row;
  align-items: flex-start;
  position: absolute;
  bottom: 24px;
  padding: ${(props: any) => props.theme.spacing[2]};
  padding-left: ${(props: any) => props.theme.spacing[3]};
  padding-right: ${(props: any) => props.theme.spacing[3]};

  width: 100%;
  /* background: green; */
`;

const Column = styled.View`
  flex-direction: column;
`;

const SpacedRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-left: ${(props: any) => props.theme.spacing[3]};
  padding-right: ${(props: any) => props.theme.spacing[3]};
  margin-bottom: ${(props: any) => props.theme.spacing[2]};
`;
