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
        style={{ padding: 16 }}
        ListHeaderComponent={
          <HeaderContainer>
            <TreasuryValueContainer>
              <SubtitleText> Total Proposals </SubtitleText>
              <TreasuryText>{realmProposals.length}</TreasuryText>
            </TreasuryValueContainer>
          </HeaderContainer>
        }
      />
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
