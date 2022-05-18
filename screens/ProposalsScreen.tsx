import { RootTabScreenProps } from "../types";
import styled from "styled-components/native";
import { useAppSelector, useAppDispatch } from "../hooks/redux";
import { ProposalCard, Loading, Typography } from "../components";
import { FlatList } from "react-native";
import { fetchRealmProposals } from "../store/proposalsSlice";
import { RefreshControl } from "react-native";
import { useTheme } from "styled-components";

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

  const handleProposalSelect = (proposal: Proposal) => {
    //@ts-ignore
    navigation.push("ProposalDetail", {
      proposalId: proposal.proposalId,
    });
  };

  const handleRefresh = () => {
    dispatch(fetchRealmProposals({ realm: selectedRealm, isRefreshing: true }));
  };

  const getActiveProposals = () => {
    let activeProposals = 0;

    proposals.forEach((proposal) => {
      if (proposal.status === "Voting") {
        activeProposals += 1;
      }
    });

    return activeProposals;
  };

  const renderProposal = ({ item }: any) => {
    const proposalGovernance = governancesMap[item.governanceId];

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
    <Container>
      {isLoadingProposals ||
      isLoadingVaults ||
      isLoadingSelectedRealm ||
      !selectedRealm ? (
        <Loading />
      ) : (
        <FlatList
          data={proposals}
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
              tintColor={theme.gray[300]}
              onRefresh={handleRefresh}
              size={18}
            />
          }
          ListHeaderComponent={
            <HeaderContainer>
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
                  text={proposals?.length}
                  marginBottom="0"
                />
              </HeaderTextContainer>
            </HeaderContainer>
          }
        />
      )}
    </Container>
  );
}

const Container = styled.View`
  background-color: ${(props) => props.theme.gray[900]};
  flex: 1;
`;

const HeaderTextContainer = styled.View``;

const HeaderContainer = styled.View`
  margin-bottom: ${(props: any) => props.theme.spacing[4]};
  flex-direction: row;
  justify-content: space-between;
`;

const EmptyView = styled.View`
  height: 100px;
`;
