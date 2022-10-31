import React, { useRef, useMemo, useState, useEffect } from "react";
import styled from "styled-components/native";
import { View } from "react-native";
import { useTheme } from "styled-components";

import * as Haptics from "expo-haptics";
import { useNavigation } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { Button, DelegateButton, Loading } from "../components";
import { fetchRealmProposals } from "../store/proposalsSlice";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCheck } from "@fortawesome/pro-solid-svg-icons/faCheck";
import { faXmark } from "@fortawesome/pro-solid-svg-icons/faXmark";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import CustomBackdrop from "../components/FadeBackdropModal";
import {
  createProposalAttempt,
  setProgress,
} from "../store/proposalActionsSlice";
import { createNewProposalTransaction } from "../utils/createProposal";

import { Typography, PublicKeyTextCopy } from "../components";
import { fetchVaults } from "../store/treasurySlice";
import { usePhantom } from "../hooks/usePhantom";
import { castVote } from "../store/walletSlice";

interface CreateProposalTransactionModalProps {
  bottomSheetModalRef: any;
  walletId: string;
  transactionInstructions: Array<any>;
  // prereqInstructions?: Array<any>;
  isSpeedMode: boolean;
  navState: {
    title: string;
    url: string;
    label?: string;
  };
  isTokenTransfer: boolean;
  solanaPayDetails: {
    label: string;
    message: string;
    memo: string;
  };
}

export const CreateProposalTransactionModal = ({
  bottomSheetModalRef,
  transactionInstructions,
  walletId,
  navState,
  isTokenTransfer = false,
  isSpeedMode = false,
  solanaPayDetails,
}: // prereqInstructions,
CreateProposalTransactionModalProps) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { publicKey } = useAppSelector((state) => state.wallet);
  const snapPoints = useMemo(() => ["25", "50%", "95%"], []);
  const dispatch = useAppDispatch();
  const { vaults, governancesMap, governances } = useAppSelector(
    (state) => state.treasury
  );
  const { selectedRealm } = useAppSelector((state) => state.realms);
  const { walletType } = useAppSelector((state) => state.wallet);
  const { isLoading, error, transactionProgress } = useAppSelector(
    (state) => state.proposalActions
  );
  const { delegateMap, membersMap } = useAppSelector((state) => state.members);
  const { proposals } = useAppSelector((state) => state.proposals);

  const [selectedDelegate, setSelectedDelegate] = useState("");
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [voteType, setVoteType] = useState("community");
  const [proposalState, setProposalState] = useState<
    "pending" | "creating" | "resolved"
  >("pending");
  const { signAllTransactions, isSendingTransactions, progress } = usePhantom();
  const [loadingPhantom, setLoadingPhantom] = useState(false);

  const isCommunityVote = voteType === "community"; // else its council

  useEffect(() => {
    if (solanaPayDetails?.label) {
      setTitle(solanaPayDetails?.label);
    }
    if (solanaPayDetails?.message) {
      setDescription(solanaPayDetails?.message);
    }
  }, [solanaPayDetails]);

  const closeModal = () => {
    bottomSheetModalRef.current?.close();
  };

  // TEMP for hackerhouse
  const handleSpeedProposalCreation = async () => {
    const vault = vaults.find((vault) => vault.pubKey === walletId);
    setProposalState("creating");
    setProgress(0);

    const proposalData = {
      name: title,
      description: description,
    };

    // if its the wallet of the governance, vault.governanceId is the pubkey of the governance
    // else, if its a wallet the governance own, vaultId is the index of the governance that owns the wallet
    const governance = vault.isGovernanceVault
      ? governancesMap[vault.governanceId]
      : governances[vault.vaultId];

    const transactions = await createNewProposalTransaction({
      selectedRealm,
      walletAddress: publicKey,
      proposalData,
      membersMap,
      selectedDelegate,
      isCommunityVote,
      vault,
      governance: governance,
      transactionInstructions,
      isTokenTransfer,
    });

    if (walletType === "phantom") {
      setLoadingPhantom(true);

      await signAllTransactions(transactions);
      setLoadingPhantom(false);
    } else {
      await dispatch(
        createProposalAttempt({
          transactions,
        })
      );

      const proposalData = await dispatch(
        fetchRealmProposals({ realm: selectedRealm, isRefreshing: false })
      );

      const newProposals = proposalData.payload.proposals;

      console.log("new proposals data", newProposals);

      await dispatch(
        castVote({
          transactionData: {
            proposal: newProposals[0],
            action: 0, // 0 is yes, 1 is no
          },
          selectedDelegate,
          isCommunityVote,
        })
      );

      setProposalState("resolved");
    }
  };

  const handleProposalCreation = async () => {
    const vault = vaults.find((vault) => vault.pubKey === walletId);
    setProposalState("creating");
    setProgress(0);

    const proposalData = {
      name: title,
      description: description,
    };

    // if its the wallet of the governance, vault.governanceId is the pubkey of the governance
    // else, if its a wallet the governance own, vaultId is the index of the governance that owns the wallet
    const governance = vault.isGovernanceVault
      ? governancesMap[vault.governanceId]
      : governances[vault.vaultId];

    const transactions = await createNewProposalTransaction({
      selectedRealm,
      walletAddress: publicKey,
      proposalData,
      membersMap,
      selectedDelegate,
      isCommunityVote,
      vault,
      governance: governance,
      transactionInstructions,
      isTokenTransfer,
    });

    if (walletType === "phantom") {
      setLoadingPhantom(true);

      await signAllTransactions(transactions);
      setLoadingPhantom(false);
    } else {
      await dispatch(
        createProposalAttempt({
          transactions,
        })
      );
    }

    setProposalState("resolved");
  };

  // const handlePhantomProposalCreation = async () => {
  //   const transactions = await createNewProposalTransaction({
  //     selectedRealm,
  //     walletAddress: publicKey,
  //     proposalData,
  //     membersMap,
  //     selectedDelegate,
  //     isCommunityVote,
  //     vault,
  //     governance: governancesMap[vault.governanceId],
  //     transactionInstructions,
  //     isTokenTransfer,
  //   });
  // };

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

  const handleViewProposals = () => {
    closeModal();
    dispatch(fetchRealmProposals({ realm: selectedRealm, isRefreshing: true }));
    // dispatch(fetchVaults(selectedRealm));
    navigation.navigate("Proposals");
  };

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={2}
        snapPoints={snapPoints}
        handleStyle={{
          backgroundColor: theme.gray[900],
          borderTopRightRadius: 8,
          borderTopLeftRadius: 8,
        }}
        handleIndicatorStyle={{
          backgroundColor: theme.gray[500],
        }}
        backgroundStyle={{
          backgroundColor: theme.gray[900],
        }}
        backdropComponent={CustomBackdrop}
      >
        <ContentContainer>
          <BottomSheetScrollView>
            {proposalState === "pending" ? (
              <>
                <Row>
                  {isTokenTransfer ? (
                    <SiteImage
                      source={{
                        uri: "https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png",
                      }}
                    />
                  ) : (
                    <SiteImage
                      source={{
                        uri: myUrl ? `https://${myUrl.host}/favicon.ico` : "",
                      }}
                    />
                  )}
                  <RegularView>
                    <Typography
                      text={navState.title}
                      size="h4"
                      bold={true}
                      marginBottom="0"
                    />
                    {isTokenTransfer ? (
                      <Typography
                        text={navState?.label || "Token Transfer"}
                        shade="500"
                        marginBottom="4"
                      />
                    ) : (
                      <Typography
                        text={myUrl ? myUrl.host : ""}
                        shade="500"
                        marginBottom="4"
                      />
                    )}
                  </RegularView>
                </Row>

                <Column>
                  {/* <Typography text={"Proposal name"} shade="500" /> */}
                  <TextInput
                    placeholder="Proposal name"
                    placeholderTextColor={theme.gray[400]}
                    value={title}
                    onChangeText={(text: string) => setTitle(text)}
                  />
                </Column>

                <SpacedRow>
                  <DescriptionTextInput
                    placeholder="Proposal description (optional)"
                    placeholderTextColor={theme.gray[400]}
                    multiline={true}
                    numberOfLines={4}
                    value={description}
                    onChangeText={(text: string) => setDescription(text)}
                    onBlur={() => {}}
                  />
                </SpacedRow>

                <Divider />

                <SpacedRow>
                  <Typography text={"DAO wallet:"} shade="500" />
                  <PublicKeyTextCopy
                    publicKey={walletId}
                    noPadding={true}
                    backgroundShade="900"
                  />
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
                    // something brtoken here for android
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
                        isProposalFlow={true}
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
                        isProposalFlow={true}
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
                    isLoading={
                      isLoading || loadingPhantom || isSendingTransactions
                    }
                    disabled={
                      isLoading || !publicKey || !selectedDelegate || !title
                    }
                    title="Create Proposal"
                    onPress={
                      isSpeedMode
                        ? handleSpeedProposalCreation
                        : handleProposalCreation
                    }
                    shade="800"
                    color="secondary"
                  />
                </ActionRow>
              </>
            ) : proposalState === "resolved" &&
              !isSendingTransactions &&
              !error ? (
              <StatusContainer>
                <Typography
                  text={"Proposal Created Successfully!"}
                  shade="200"
                  textAlign="center"
                  bold={true}
                  size="h3"
                />
                <Typography
                  text={"View and vote now in proposals"}
                  shade="400"
                  textAlign="center"
                />
                <IconContainer isSuccessful={true}>
                  <FontAwesomeIcon
                    icon={faCheck}
                    size={32}
                    color={theme.success[400]}
                  />
                </IconContainer>

                <ButtonContainer>
                  <Button
                    title="Go to Proposals"
                    onPress={handleViewProposals}
                    shade="800"
                    color="gray"
                  />
                </ButtonContainer>
              </StatusContainer>
            ) : proposalState === "creating" ||
              (isSendingTransactions && !error) ? (
              <StatusContainer>
                <Typography
                  text={"Sending transactions"}
                  shade="200"
                  textAlign="center"
                  bold={true}
                  size="h3"
                />
                <Typography
                  text={
                    "Please keep modal and app open while transactions are processing."
                  }
                  textAlign="center"
                  shade="400"
                />
                <Loading collapseHeight={true} />

                <Typography
                  // add 2 for creating proposal + signing off
                  text={`Progress: ${
                    walletType === "phantom" ? progress : transactionProgress
                  } / ${
                    transactionInstructions?.[0]?.instructions
                      ? transactionInstructions?.[0]?.instructions.length + 2
                      : transactionInstructions?.length + 2
                  }  `}
                />
              </StatusContainer>
            ) : (
              <StatusContainer>
                <Typography
                  text={"Error Creating Proposal"}
                  shade="200"
                  textAlign="center"
                  bold={true}
                  size="h3"
                />
                <Typography
                  text={
                    "Something may have gone wrong during proposal creation. Check proposals or try again."
                  }
                  textAlign="center"
                  shade="400"
                />
                <IconContainer isSuccessful={false}>
                  <FontAwesomeIcon
                    icon={faXmark}
                    size={32}
                    color={theme.error[400]}
                  />
                </IconContainer>

                <ButtonContainer>
                  <Button
                    title="View Proposals"
                    onPress={handleViewProposals}
                    shade="800"
                    color="gray"
                  />
                </ButtonContainer>
              </StatusContainer>
            )}
          </BottomSheetScrollView>
        </ContentContainer>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

const ContentContainer = styled.View`
  flex: 1;
  height: 100%;
  background: ${(props: any) => props.theme.gray[900]};
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

const RegularView = styled.View`
  flex: 1;
`;

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
  background: ${(props) => props.theme.gray[800]};
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
  background-color: ${(props) => props.theme.gray[900]}44;
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

const StatusContainer = styled.View`
  justify-content: center;
  align-items: center;
  margin-top: 100px;
  padding-left: 24px;
  padding-right: 24px;
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
  margin-bottom: ${(props: any) => props.theme.spacing[5]};

  background: ${(props: any) =>
    props.isSuccessful ? props.theme.success[400] : props.theme.error[400]}44;
`;

const ButtonContainer = styled.View`
  width: 200px;
`;
