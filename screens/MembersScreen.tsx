import { RootTabScreenProps } from "../types";
import styled from "styled-components/native";
import { useAppSelector } from "../hooks/redux";
import { MemberCard, Loading } from "../components";
import { FlatList } from "react-native";

export default function ActivityScreen({
  navigation,
}: RootTabScreenProps<"Activity">) {
  const { realmMembers, isLoadingMembers } = useAppSelector(
    (state) => state.realms
  );

  const renderMember = ({ item }: any) => {
    return <MemberCard key={item.governingTokenOwner} member={item} />;
  };

  const getTotalVotes = () => {
    let totalVotes = 0;

    realmMembers.forEach((member) => {
      totalVotes += member.totalVotesCount;
    });
    return totalVotes;
  };

  return (
    <Container>
      {isLoadingMembers ? (
        <Loading />
      ) : (
        <FlatList
          data={realmMembers}
          renderItem={renderMember}
          keyExtractor={(item) => item.publicKey}
          style={{ padding: 16 }}
          ListFooterComponent={<EmptyView />}
          scrollIndicatorInsets={{ right: 1 }}
          ListHeaderComponent={
            <HeaderContainer>
              <TextContainer>
                <SubtitleTextLeft>Votes</SubtitleTextLeft>
                <HeaderTitleLeft>{getTotalVotes()}</HeaderTitleLeft>
              </TextContainer>

              <TextContainer>
                <SubtitleText>Members</SubtitleText>
                <HeaderTitle>{realmMembers.length}</HeaderTitle>
              </TextContainer>
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

const HeaderTitle = styled.Text`
  color: ${(props: any) => props.theme.gray[100]};
  font-size: 40px;
  font-weight: bold;
  text-align: right;
`;

const HeaderTitleLeft = styled.Text`
  color: ${(props: any) => props.theme.gray[100]};
  font-size: 40px;
  font-weight: bold;
`;

const TextContainer = styled.View``;

const SubtitleText = styled.Text`
  text-align: right;

  color: ${(props: any) => props.theme.gray[400]};
  font-size: 16px;
`;

const HeaderContainer = styled.View`
  margin-bottom: ${(props: any) => props.theme.spacing[4]};
  flex-direction: row;
  justify-content: space-between;
`;

const SubtitleTextLeft = styled.Text`
  color: ${(props: any) => props.theme.gray[400]};
  font-size: 16px;
`;

const EmptyView = styled.View`
  height: 100px;
`;
