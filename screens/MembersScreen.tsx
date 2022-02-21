import { RootTabScreenProps } from "../types";
import styled from "styled-components/native";
import { useAppSelector } from "../hooks/redux";
import { MemberCard, Loading, MemberProfile } from "../components";
import { FlatList } from "react-native";
import { useState } from "react";

export default function ActivityScreen({
  navigation,
}: RootTabScreenProps<"Activity">) {
  const { members, isLoadingMembers } = useAppSelector(
    (state) => state.members
  );
  const [isMemberProfileOpen, setIsMemberProfileOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member>(null);

  const handleMemberSelect = (member: Member) => {
    setSelectedMember(member);
    setIsMemberProfileOpen(true);
  };

  const renderMember = ({ item }: any) => {
    return (
      <MemberCard
        key={item.governingTokenOwner}
        member={item}
        onSelect={() => handleMemberSelect(item)}
      />
    );
  };

  const getTotalVotes = () => {
    let totalVotes = 0;

    members.forEach((member: Member) => {
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
          data={members}
          renderItem={renderMember}
          keyExtractor={(item) => item.publicKey}
          style={{ padding: 16 }}
          ListFooterComponent={<EmptyView />}
          scrollIndicatorInsets={{ right: 1 }}
          removeClippedSubviews={true}
          initialNumToRender={10}
          ListHeaderComponent={
            <HeaderContainer>
              <TextContainer>
                <SubtitleTextLeft>Votes</SubtitleTextLeft>
                <HeaderTitleLeft>{getTotalVotes()}</HeaderTitleLeft>
              </TextContainer>

              <TextContainer>
                <SubtitleText>Members</SubtitleText>
                <HeaderTitle>{members.length}</HeaderTitle>
              </TextContainer>
            </HeaderContainer>
          }
        />
      )}
      <MemberProfile
        open={isMemberProfileOpen}
        handleOnClose={() => setIsMemberProfileOpen(false)}
        member={selectedMember}
      />
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
