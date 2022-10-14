import { RootTabScreenProps } from "../types";
import styled from "styled-components/native";
import { VoteCard, Typography } from "../components";
import { FlatList } from "react-native";
import { useAppSelector } from "../hooks/redux";

export default function ProposalVotesScreen({
  navigation,
}: RootTabScreenProps<"Activity">) {
  const { selectedRealm } = useAppSelector((state) => state.realms);
  const { votes, proposalsMap } = useAppSelector((state) => state.proposals);
  const { membersMap } = useAppSelector((state) => state.members);

  const sortedVotes = () => {
    if (votes?.length) {
      const preSortedVotes = [...votes];
      preSortedVotes?.sort(
        (vote1, vote2) =>
          (vote2.voteWeightYes ? vote2.voteWeightYes : vote2.voteWeightNo) -
          (vote1.voteWeightYes ? vote1.voteWeightYes : vote1.voteWeightNo)
      );

      return preSortedVotes;
    } else {
      return [];
    }
  };

  const renderVote = ({ item }: any) => {
    return (
      <VoteCard
        vote={item}
        proposal={proposalsMap[item?.proposalId]}
        member={membersMap[item.walletId]}
        realm={selectedRealm}
        isProposalView={true}
      />
    );
  };

  return (
    <Container>
      <FlatList
        data={sortedVotes()}
        renderItem={renderVote}
        keyExtractor={(item, index) => item?.signature}
        style={{ padding: 16, minWidth: "100%" }}
        scrollIndicatorInsets={{ right: 1 }}
        removeClippedSubviews={true}
        initialNumToRender={15}
        onEndReachedThreshold={1}
        ListFooterComponent={<EmptyView />}
      />
    </Container>
  );
}

const Container = styled.View`
  background-color: ${(props) => props.theme.gray[900]};
  flex: 1;
`;

const EmptyView = styled.View`
  height: 150px;
`;
