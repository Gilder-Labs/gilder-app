import { RootTabScreenProps } from "../types";
import styled from "styled-components/native";
import { useAppSelector, useAppDispatch } from "../hooks/redux";
import { MemberCard, Loading } from "../components";
import { FlatList } from "react-native";
import { RefreshControl } from "react-native";
import { useTheme } from "styled-components";
import { fetchRealmMembers } from "../store/memberSlice";

export default function MemberScreen({
  navigation,
}: RootTabScreenProps<"Activity">) {
  const { members, isLoadingMembers, isRefreshingMembers } = useAppSelector(
    (state) => state.members
  );
  const { isLoadingVaults } = useAppSelector((state) => state.treasury);
  const { selectedRealm, isLoadingSelectedRealm } = useAppSelector(
    (state) => state.realms
  );

  const dispatch = useAppDispatch();
  const theme = useTheme();

  const handleMemberSelect = (walletId: string) => {
    //@ts-ignore
    navigation.push("MemberDetails", {
      walletId: walletId,
    });
  };

  const renderMember = ({ item }: any) => {
    return (
      <MemberCard
        key={item.walletId}
        member={item}
        onSelect={() => handleMemberSelect(item.walletId)}
      />
    );
  };

  const handleRefresh = () => {
    dispatch(fetchRealmMembers({ realm: selectedRealm, isRefreshing: true }));
  };

  const getTotalVotes = () => {
    let totalVotes = 0;

    if (members?.length) {
      members.forEach((member: Member) => {
        totalVotes += member?.totalVotesCommunity
          ? member.totalVotesCommunity
          : 0;
        totalVotes += member?.totalVotesCouncil ? member.totalVotesCouncil : 0;
      });
    }
    return totalVotes;
  };

  const isLoading =
    isLoadingMembers || isLoadingSelectedRealm || isLoadingVaults;

  return (
    <Container>
      {isLoading ? (
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
          refreshControl={
            <RefreshControl
              refreshing={isRefreshingMembers}
              tintColor={theme.gray[300]}
              onRefresh={handleRefresh}
            />
          }
          ListHeaderComponent={
            <HeaderContainer>
              <TextContainer>
                <SubtitleTextLeft>Votes</SubtitleTextLeft>
                <HeaderTitleLeft>{getTotalVotes()}</HeaderTitleLeft>
              </TextContainer>

              <TextContainer>
                <SubtitleText>Members</SubtitleText>
                <HeaderTitle>{members ? members.length : 0}</HeaderTitle>
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
