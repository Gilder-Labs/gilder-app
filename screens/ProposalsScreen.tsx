import { RootTabScreenProps } from "../types";
import styled from "styled-components/native";
import { useAppSelector, useAppDispatch } from "../hooks/redux";
import { ProposalCard, Loading } from "../components";
import { FlatList } from "react-native";
import { fetchRealmProposals } from "../store/proposalsSlice";
import { RefreshControl } from "react-native";
import { useTheme } from "styled-components";

export default function ProposalScreen({
  navigation,
}: RootTabScreenProps<"Proposals">) {
  const { proposals, isLoadingProposals, isRefreshingProposals } =
    useAppSelector((state) => state.proposals);

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
      proposal: proposal,
    });
  };

  const handleRefresh = () => {
    dispatch(fetchRealmProposals({ realm: selectedRealm, isRefreshing: true }));
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
              <TreasuryValueContainer>
                <SubtitleText> Total Proposals </SubtitleText>
                <TreasuryText>{proposals.length}</TreasuryText>
              </TreasuryValueContainer>
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

const TreasuryText = styled.Text`
  color: ${(props: any) => props.theme.gray[100]};
  font-size: 40px;
  font-weight: bold;
  text-align: right;
`;

const TreasuryValueContainer = styled.View``;

const SubtitleText = styled.Text`
  text-align: right;

  color: ${(props: any) => props.theme.gray[400]};
  font-size: 16px;
`;

const HeaderContainer = styled.View`
  margin-bottom: ${(props: any) => props.theme.spacing[4]};
`;

const EmptyView = styled.View`
  height: 100px;
`;
