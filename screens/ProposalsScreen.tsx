import { RootTabScreenProps } from "../types";
import styled from "styled-components/native";
import { useAppSelector, useAppDispatch } from "../hooks/redux";
import { ProposalCard, Loading, Typography } from "../components";
import { FlatList } from "react-native";
import { fetchRealmProposals } from "../store/proposalsSlice";
import { RefreshControl } from "react-native";
import { useTheme } from "styled-components";
import * as Haptics from "expo-haptics";
import { useState, useCallback, useEffect, useMemo, useRef } from "react";

import { debounce } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faXmark } from "@fortawesome/pro-solid-svg-icons/faXmark";
import { faMagnifyingGlass } from "@fortawesome/pro-regular-svg-icons/faMagnifyingGlass";
import { faBarsSort } from "@fortawesome/pro-regular-svg-icons/faBarsSort";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import CustomBackdrop from "../components/FadeBackdropModal";

export default function ProposalScreen({
  navigation,
}: RootTabScreenProps<"Proposals">) {
  const { proposals, isLoadingProposals, isRefreshingProposals } =
    useAppSelector((state) => state.proposals);

  const { tokenRecordToWalletMap } = useAppSelector((state) => state.members);

  const theme = useTheme();
  const dispatch = useAppDispatch();

  const { governancesMap, isLoadingVaults } = useAppSelector(
    (state) => state.treasury
  );

  const { selectedRealm, isLoadingSelectedRealm } = useAppSelector(
    (state) => state.realms
  );

  const [filteredStatus, setFilteredStatus] = useState("");
  const [searchText, setSearchText] = useState("");
  const [filteredProposals, setFilteredProposals] = useState(proposals);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["25%", "50%"], []);

  useEffect(() => {
    setFilteredProposals(proposals);
  }, [proposals]);

  const handleProposalSelect = (proposal: Proposal) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    //@ts-ignore
    navigation.push("ProposalDetail", {
      proposalId: proposal.proposalId,
    });
  };

  const handleRefresh = () => {
    dispatch(fetchRealmProposals({ realm: selectedRealm, isRefreshing: true }));
  };

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const getActiveProposals = () => {
    let activeProposals = 0;

    proposals?.forEach((proposal) => {
      if (proposal.status === "Voting") {
        activeProposals += 1;
      }
    });

    return activeProposals.toString();
  };

  const handleFilterChange = (newText: string, filterStatus: string) => {
    const normalizedText = newText.toLowerCase();
    let updatedProposals = proposals;

    if (filteredStatus === filterStatus) {
      setFilteredStatus("");
    } else {
      setFilteredStatus(filterStatus);
      updatedProposals = proposals.filter(
        (proposal) => proposal?.status === filterStatus
      );
    }

    if (!newText) {
      setFilteredProposals(updatedProposals);
    } else {
      const filteredProposals = updatedProposals?.filter((proposal) =>
        proposal.name.toLowerCase().includes(normalizedText)
      );

      setFilteredProposals(filteredProposals);
    }
  };

  const handleSearchInputChange = (newText: string, filter: string) => {
    setSearchText(newText);
    debouncedChangeHandler(newText, filter);
  };

  const debouncedChangeHandler = useCallback(
    debounce(handleFilterChange, 300),
    [proposals]
  );

  const renderProposal = ({ item }: any) => {
    const proposalGovernance = governancesMap?.[item?.governanceId];

    if (!proposalGovernance) {
      return <EmptyView />;
    }

    const { voteThresholdPercentage } = proposalGovernance;
    const {
      communityMint,
      communityMintSupply,
      communityMintDecimals,
      councilMint,
      councilMintSupply,
      councilMintDecimals,
    } = selectedRealm;
    const { governingTokenMint } = item;
    // TODO handle council tokens
    // const councilToken = tokenMap?.[councilMint];

    return (
      <ProposalCard
        proposal={item}
        onClick={() => handleProposalSelect(item)}
        governance={proposalGovernance}
        mintSupply={
          governingTokenMint === communityMint
            ? communityMintSupply
            : councilMintSupply
        }
        mintDecimals={
          governingTokenMint === communityMint
            ? communityMintDecimals
            : councilMintDecimals
        }
        voteThresholdPercentage={voteThresholdPercentage}
        creatorWalletId={tokenRecordToWalletMap[item.tokenOwnerRecord]}
      />
    );
  };

  return (
    <BottomSheetModalProvider>
      <Container>
        {isLoadingProposals ||
        isLoadingVaults ||
        isLoadingSelectedRealm ||
        !selectedRealm ? (
          <Loading />
        ) : (
          <FlatList
            data={filteredProposals}
            renderItem={renderProposal}
            keyExtractor={(item) => item.proposalId}
            style={{ padding: 16 }}
            ListFooterComponent={<EmptyView />}
            scrollIndicatorInsets={{ right: 1 }}
            removeClippedSubviews={true}
            initialNumToRender={10}
            onRefresh={handleRefresh}
            refreshing={isRefreshingProposals}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshingProposals}
                // tintColor={theme.gray[300]}
                onRefresh={handleRefresh}
              />
            }
            ListHeaderComponent={
              <HeaderContainer>
                <InfoRow>
                  <HeaderTextContainer>
                    <Typography
                      size="body"
                      shade="400"
                      text="Active Proposals"
                      marginBottom="0"
                    />
                    <Typography
                      bold={true}
                      size="h2"
                      shade="100"
                      text={getActiveProposals() || "0"}
                      marginBottom="0"
                    />
                  </HeaderTextContainer>
                  <HeaderTextContainer>
                    <Typography
                      size="body"
                      shade="400"
                      text="Total Proposals"
                      marginBottom="0"
                    />
                    <Typography
                      bold={true}
                      size="h2"
                      shade="100"
                      textAlign="right"
                      text={proposals?.length.toString()}
                      marginBottom="0"
                    />
                  </HeaderTextContainer>
                </InfoRow>
                <SearchRow>
                  <SearchBarContainer>
                    <SearchBar
                      placeholder="Search by proposal name"
                      onChangeText={(text: string) =>
                        handleSearchInputChange(text, filteredStatus)
                      }
                      placeholderTextColor={theme.gray[400]}
                      selectionColor={theme.gray[200]}
                      autoCompleteType={"off"}
                      autoCapitalize={"none"}
                      autoCorrect={false}
                      value={searchText}
                    />
                    <IconContainer
                      disabled={!searchText}
                      onPress={() =>
                        handleSearchInputChange("", filteredStatus)
                      }
                    >
                      {searchText ? (
                        <FontAwesomeIcon
                          icon={faXmark}
                          size={16}
                          color={theme.gray[300]}
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={faMagnifyingGlass}
                          size={16}
                          color={theme.gray[300]}
                        />
                      )}
                    </IconContainer>
                  </SearchBarContainer>
                  <SortButton onPress={handlePresentModalPress}>
                    <FontAwesomeIcon
                      icon={faBarsSort}
                      size={18}
                      color={theme.gray[400]}
                    />
                  </SortButton>
                </SearchRow>
              </HeaderContainer>
            }
          />
        )}
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={snapPoints}
          onChange={() => {}}
          handleStyle={{
            backgroundColor: theme.gray[800],
            borderTopRightRadius: 8,
            borderTopLeftRadius: 8,
          }}
          handleIndicatorStyle={{
            backgroundColor: theme.gray[400],
          }}
          backgroundStyle={{
            backgroundColor: theme.gray[800],
          }}
          backdropComponent={CustomBackdrop}
        >
          <FilterContainer>
            <Typography
              text="Filter by"
              bold={true}
              size="h4"
              marginBottom="4"
            />
            <FilterBadgeRow>
              <FilterBadge
                onPress={() => handleFilterChange(searchText, "Succeeded")}
                isSelected={filteredStatus === "Succeeded"}
              >
                <Typography marginBottom="0" text="Succeeded" />
              </FilterBadge>
              <FilterBadge
                onPress={() => handleFilterChange(searchText, "Completed")}
                isSelected={filteredStatus === "Completed"}
              >
                <Typography marginBottom="0" text="Completed" />
              </FilterBadge>
              <FilterBadge
                onPress={() => handleFilterChange(searchText, "Cancelled")}
                isSelected={filteredStatus === "Cancelled"}
              >
                <Typography marginBottom="0" text="Cancelled" />
              </FilterBadge>
              <FilterBadge
                onPress={() => handleFilterChange(searchText, "Executing")}
                isSelected={filteredStatus === "Executing"}
              >
                <Typography marginBottom="0" text="Executing" />
              </FilterBadge>
              <FilterBadge
                onPress={() => handleFilterChange(searchText, "Voting")}
                isSelected={filteredStatus === "Voting"}
              >
                <Typography marginBottom="0" text="Voting" />
              </FilterBadge>
              <FilterBadge
                onPress={() => handleFilterChange(searchText, "Defeated")}
                isSelected={filteredStatus === "Defeated"}
              >
                <Typography marginBottom="0" text="Defeated" />
              </FilterBadge>
              <FilterBadge
                onPress={() =>
                  handleFilterChange(searchText, "ExecutingWithErrors")
                }
                isSelected={filteredStatus === "ExecutingWithErrors"}
              >
                <Typography marginBottom="0" text="Executing with Errors" />
              </FilterBadge>
            </FilterBadgeRow>
          </FilterContainer>
        </BottomSheetModal>
      </Container>
    </BottomSheetModalProvider>
  );
}
const Container = styled.View`
  background-color: ${(props) => props.theme.gray[900]};
  flex: 1;
`;

const HeaderTextContainer = styled.View``;

const HeaderContainer = styled.View`
  margin-bottom: ${(props: any) => props.theme.spacing[4]};
  flex-direction: column;
  justify-content: space-between;
`;

const EmptyView = styled.View`
  height: 100px;
`;

const FilterContainer = styled.View`
  background: ${(props) => props.theme.gray[800]};
  flex: 1;
  padding-left: ${(props: any) => props.theme.spacing[3]};
  padding-right: ${(props: any) => props.theme.spacing[3]};
`;

const SearchRow = styled.View`
  flex-direction: row;
  border-bottom-color: ${(props) => props.theme.gray[800]};
  border-bottom-width: 1px;
  padding-bottom: ${(props: any) => props.theme.spacing[3]};
`;

const InfoRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: ${(props: any) => props.theme.spacing[2]};
`;

const SearchBar = styled.TextInput`
  padding-left: ${(props) => props.theme.spacing[3]};
  padding-right: ${(props) => props.theme.spacing[3]};
  height: 40px;
  font-size: 14px;
  flex: 1;
  background-color: ${(props) => props.theme.gray[800]}44;
  border-radius: 8px;
  border: 1px solid ${(props) => props.theme.gray[600]};
  color: ${(props) => props.theme.gray[100]};
`;
const SearchBarContainer = styled.View`
  flex: 1;
  height: 40px;
`;

const IconContainer = styled.TouchableOpacity`
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  justify-content: center;
  align-items: flex-end;
  margin-right: 12px;
  padding: ${(props: any) => props.theme.spacing[2]};
`;

const SortButton = styled.TouchableOpacity`
  background: ${(props) => props.theme.gray[800]};
  padding: ${(props) => props.theme.spacing[3]};
  border-radius: 8;
  margin-left: ${(props: any) => props.theme.spacing[2]};
`;

const FilterBadgeRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  flex: 1;
`;

const FilterBadge = styled.TouchableOpacity<{ isSelected: boolean }>`
  padding-left: ${(props: any) => props.theme.spacing[2]};
  padding-right: ${(props: any) => props.theme.spacing[2]};
  padding-top: ${(props: any) => props.theme.spacing[1]};
  padding-bottom: ${(props: any) => props.theme.spacing[1]};

  background: ${(props: any) =>
    props.isSelected ? props.theme.secondary[600] : props.theme.gray[900]}55;
  margin-right: ${(props: any) => props.theme.spacing[2]};
  border-radius: 8;
  margin-bottom: ${(props: any) => props.theme.spacing[1]};
  border: 1px solid
    ${(props: any) =>
      props.isSelected ? props.theme.secondary[600] : props.theme.gray[600]};
`;
