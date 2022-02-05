import { RootTabScreenProps } from "../types";
import styled from "styled-components/native";
import { useAppSelector } from "../hooks/redux";
import { ProposalCard } from "../components";
import { FlatList } from "react-native";

export default function ProposalScreen({
  navigation,
}: RootTabScreenProps<"Proposals">) {
  const { realmProposals } = useAppSelector((state) => state.realms);

  const renderProposal = ({ item }: any) => {
    return <ProposalCard proposal={item} />;
  };

  return (
    <Container>
      <FlatList
        data={realmProposals}
        renderItem={renderProposal}
        keyExtractor={(item) => item.proposalId}
        style={{ padding: 8 }}
      />
    </Container>
  );
}

const Container = styled.View`
  background-color: ${(props) => props.theme.gray[900]};
  flex: 1;
`;
