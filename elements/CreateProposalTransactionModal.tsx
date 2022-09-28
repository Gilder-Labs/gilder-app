import React, { useRef, useMemo, useState } from "react";
import styled from "styled-components/native";
import { View } from "react-native";
import { useTheme } from "styled-components";

import * as Haptics from "expo-haptics";
import { useNavigation } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { Button, DelegateButton } from "../components";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { faCopy } from "@fortawesome/pro-solid-svg-icons/faCopy";
import { faComments } from "@fortawesome/pro-solid-svg-icons/faComments";
import { faFaceSmilePlus } from "@fortawesome/pro-solid-svg-icons/faFaceSmilePlus";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
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
  const snapPoints = useMemo(() => ["25", "50%", "75%", "90%"], []);
  const dispatch = useAppDispatch();
  const { vaults } = useAppSelector((state) => state.treasury);
  const { selectedRealm } = useAppSelector((state) => state.realms);
  const { isLoading } = useAppSelector((state) => state.proposalActions);
  const { delegateMap, membersMap } = useAppSelector((state) => state.members);
  const [selectedDelegate, setSelectedDelegate] = useState("");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [voteType, setVoteType] = useState("community");

  const isCommunityVote = voteType === "community"; // else its council

  const closeModal = () => {
    bottomSheetModalRef.current?.close();
  };

  const handleProposalCreation = () => {
    const vault = vaults.find((vault) => vault.pubKey === walletId);

    dispatch(
      createProposalAttempt({
        vault,
        transactionInstructions: transactionInstructions,
        proposalTitle: title,
        proposalDescription: description,
        isCommunityVote,
        selectedDelegate,
      })
    );
  };

  const myUrl = navState?.url ? new URL(navState?.url) : "";

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

  const handleVoteTypeChange = (type: string) => {
    setSelectedDelegate(""); // clear delegate selection on change vote type
    setVoteType(type);
  };

  const delegatesToVoteWith = getDelegateMembers();

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={2}
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
          <BottomSheetScrollView>
            <Row>
              <SiteImage
                source={{
                  uri: myUrl ? `https://${myUrl.host}/favicon.ico` : "",
                }}
              />
              <RegularView>
                <Typography
                  text={navState.title}
                  size="h4"
                  bold={true}
                  marginBottom="0"
                />
                <Typography
                  text={myUrl ? myUrl.host : ""}
                  shade="500"
                  marginBottom="4"
                />
              </RegularView>
            </Row>

            <Column>
              {/* <Typography text={"Proposal name"} shade="500" /> */}
              <TextInput
                placeholder="Proposal name*"
                placeholderTextColor={theme.gray[400]}
                value={title}
                onChangeText={(text: string) => setTitle(text)}
              />
            </Column>

            <SpacedRow>
              <DescriptionTextInput
                placeholder="Proposal description"
                placeholderTextColor={theme.gray[400]}
                multiline={true}
                numberOfLines={4}
                value={description}
                onChangeText={(text: string) => setDescription(text)}
                onBlur={() => {
                  console.log("trying to blur");
                }}
              />
            </SpacedRow>

            <Divider />

            <SpacedRow>
              <Typography text={"DAO wallet:"} shade="500" />
              <PublicKeyTextCopy publicKey={walletId} noPadding={true} />
            </SpacedRow>
            <SpacedRow>
              <Typography text={"Realm:"} shade="500" />
              <Typography text={selectedRealm?.name} shade="300" />
            </SpacedRow>

            <SpacedRow>
              <Typography text={"Vote Type:"} shade="500" />
              <BadgeRow>
                <VoteTypeBadge
                  onPress={() => handleVoteTypeChange("community")}
                  isSelected={isCommunityVote}
                >
                  <Typography
                    text={"Community"}
                    shade={isCommunityVote ? "400" : "400"}
                    color={isCommunityVote ? "secondary" : "gray"}
                    marginBottom="0"
                  />
                </VoteTypeBadge>
                <VoteTypeBadge
                  onPress={() => handleVoteTypeChange("council")}
                  isSelected={!isCommunityVote}
                >
                  <Typography
                    text={"Council"}
                    shade={!isCommunityVote ? "400" : "400"}
                    color={!isCommunityVote ? "secondary" : "gray"}
                    marginBottom="0"
                  />
                </VoteTypeBadge>
              </BadgeRow>
            </SpacedRow>

            <Column>
              <Typography
                text={"Create proposal as:"}
                shade="500"
                marginBottom="4"
              />
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

                {delegatesToVoteWith?.map((delegate: Member) => (
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
            </Column>

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
                disabled={
                  isLoading || !publicKey || !selectedDelegate || !title
                }
                title="Create Proposal"
                onPress={handleProposalCreation}
                shade="800"
                color="secondary"
              />
            </ActionRow>
          </BottomSheetScrollView>
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
  /* position: absolute; */
  bottom: 24px;
  padding: ${(props: any) => props.theme.spacing[2]};
  padding-left: ${(props: any) => props.theme.spacing[3]};
  padding-right: ${(props: any) => props.theme.spacing[3]};

  width: 100%;
  /* background: green; */
`;

const RegularView = styled.View``;

const Column = styled.View`
  flex-direction: column;
  padding-left: ${(props: any) => props.theme.spacing[3]};
  padding-right: ${(props: any) => props.theme.spacing[3]};
  min-height: 40px;
`;

const SpacedRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-left: ${(props: any) => props.theme.spacing[3]};
  padding-right: ${(props: any) => props.theme.spacing[3]};
  margin-bottom: ${(props: any) => props.theme.spacing[2]};
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

const TextInput = styled.TextInput`
  /* padding-left: ${(props) => props.theme.spacing[3]}; */
  /* padding-right: ${(props) => props.theme.spacing[3]}; */
  min-height: 40px;
  font-size: 24px;
  background-color: ${(props) => props.theme.gray[800]}44;
  color: ${(props) => props.theme.gray[100]};
  flex: 1;

  margin-bottom: ${(props: any) => props.theme.spacing[4]};
`;

const DescriptionTextInput = styled.TextInput`
  /* padding-left: ${(props) => props.theme.spacing[3]}; */
  /* padding-right: ${(props) => props.theme.spacing[3]}; */
  font-size: 16px;
  /* background-color: ${(props) => props.theme.gray[800]}44; */
  flex: 1;
  color: ${(props) => props.theme.gray[200]};
`;

const Divider = styled.View`
  background: ${(props) => props.theme.gray[700]};
  margin-left: ${(props: any) => props.theme.spacing[3]};
  margin-right: ${(props: any) => props.theme.spacing[3]};

  height: 2px;
  margin-top: ${(props: any) => props.theme.spacing[2]};
  margin-bottom: ${(props: any) => props.theme.spacing[4]};
`;

const VoteTypeBadge = styled.TouchableOpacity<{ isSelected: boolean }>`
  padding-left: ${(props: any) => props.theme.spacing[2]};
  padding-right: ${(props: any) => props.theme.spacing[2]};
  padding-top: ${(props: any) => props.theme.spacing[1]};
  padding-bottom: ${(props: any) => props.theme.spacing[1]};

  background: ${(props: any) =>
    props.isSelected ? props.theme.secondary[600] : props.theme.gray[900]}33;
  margin-right: ${(props: any) => props.theme.spacing[2]};
  border-radius: 8;
  margin-bottom: ${(props: any) => props.theme.spacing[1]};
  border: 1px solid
    ${(props: any) =>
      props.isSelected ? props.theme.secondary[600] : props.theme.gray[500]};
`;

const BadgeRow = styled.View`
  flex-direction: row;
  margin-bottom: ${(props: any) => props.theme.spacing[2]};
  margin-right: -${(props: any) => props.theme.spacing[2]};
`;
