import { RootTabScreenProps } from "../types";
import styled from "styled-components/native";
import { useAppSelector } from "../hooks/redux";
import { ProposalCard, Loading } from "../components";
import { FlatList } from "react-native";

export default function ProposalScreen({
  navigation,
}: RootTabScreenProps<"Proposals">) {
  const { proposals, isLoadingProposals } = useAppSelector(
    (state) => state.proposals
  );

  const handleProposalSelect = (proposal: Proposal) => {
    //@ts-ignore
    navigation.push("ProposalDetail", {
      proposal: proposal,
    });
  };

  const renderProposal = ({ item }: any) => {
    return <ProposalCard proposal={item} onClick={handleProposalSelect} />;
  };

  return (
    <Container>
      {isLoadingProposals ? (
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
