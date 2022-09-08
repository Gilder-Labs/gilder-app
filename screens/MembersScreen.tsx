import { RootTabScreenProps } from "../types";
import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import styled from "styled-components/native";
import { useAppSelector, useAppDispatch } from "../hooks/redux";
import { MemberCard, Loading, Typography } from "../components";
import { FlatList } from "react-native";
import { RefreshControl } from "react-native";
import { useTheme } from "styled-components";
import { fetchRealmMembers } from "../store/memberSlice";
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
import { RadioButton, RadioGroup } from "react-native-ui-lib";

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

  const [searchText, setSearchText] = useState("");
  const [sortType, setSortType] = useState<
    | "totalVotesCommunity"
    | "totalVotesCouncil"
    | "voteWeightCouncil"
    | "voteWeightCommunity"
  >("totalVotesCommunity");
  const [filteredAndSortedMembers, setFilteredAndSortedMembers] =
    useState(members);

  const dispatch = useAppDispatch();
  const theme = useTheme();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["25%", "50%"], []);

  useEffect(() => {
    setFilteredAndSortedMembers(members);
  }, [members]);

  const handleMemberSelect = (walletId: string) => {
    //@ts-ignore
    navigation.push("MemberDetails", {
      walletId: walletId,
    });
  };

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSortChange = (value: any) => {
    let sortedMembers = [...filteredAndSortedMembers];

    if (value === "totalVotesCommunity") {
      // console.log("Trying to sort by totalVotesCommunity");
      sortedMembers.sort(
        (member1, member2) =>
          (member2?.totalVotesCommunity || 0) -
          (member1?.totalVotesCommunity || 0)
      );
    } else if (value === "totalVotesCouncil") {
      sortedMembers.sort(
        (member1, member2) =>
          (member2?.totalVotesCouncil || 0) - (member1?.totalVotesCouncil || 0)
      );
    } else if (value === "voteWeightCommunity") {
      sortedMembers.sort(
        (member1, member2) =>
          Number(member2?.communityDepositAmount || 0) -
          Number(member1?.communityDepositAmount || 0)
      );
    } else if (value === "voteWeightCouncil") {
      sortedMembers.sort(
        (member1, member2) =>
          Number(member2?.councilDepositAmount || 0) -
          Number(member1?.councilDepositAmount || 0)
      );
    }

    setFilteredAndSortedMembers(sortedMembers);
    setSortType(value);
  };

  const handleSearchChange = (newText: string) => {
    const normalizedText = newText.toLowerCase();

    if (!newText) {
      setFilteredAndSortedMembers(members);
    } else {
      const filteredMembers = members?.filter(
        (member) =>
          member.walletId.toLowerCase().includes(normalizedText) ||
          member.walletId.toLowerCase() === normalizedText
      );

      setFilteredAndSortedMembers(filteredMembers);
    }
  };

  const handleSearchInputChange = (newText: string) => {
    setSearchText(newText);
    debouncedChangeHandler(newText);
  };

  const debouncedChangeHandler = useCallback(
    debounce(handleSearchChange, 300),
    [members]
  );

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
    <BottomSheetModalProvider>
      <Container>
        {isLoading ? (
          <Loading />
        ) : (
          <FlatList
            data={filteredAndSortedMembers}
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
                <InfoRow>
                  <TextContainer>
                    <SubtitleTextLeft>Votes</SubtitleTextLeft>
                    <HeaderTitleLeft>{getTotalVotes()}</HeaderTitleLeft>
                  </TextContainer>

                  <TextContainer>
                    <SubtitleText>Members</SubtitleText>
                    <HeaderTitle>{members ? members.length : 0}</HeaderTitle>
                  </TextContainer>
                </InfoRow>
                <SearchRow>
                  <SearchBarContainer>
                    <SearchBar
                      placeholder="Search by wallet address"
                      onChangeText={handleSearchInputChange}
                      placeholderTextColor={theme.gray[400]}
                      selectionColor={theme.gray[200]}
                      autoCompleteType={"off"}
                      autoCapitalize={"none"}
                      autoCorrect={false}
                      value={searchText}
                    />
                    <IconContainer
                      disabled={!searchText}
                      onPress={() => handleSearchInputChange("")}
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
      </Container>
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
          <Typography text="Sort by" bold={true} size="h4" marginBottom="4" />
          <RadioGroup
            initialValue={sortType}
            onValueChange={(value: string) => handleSortChange(value)}
          >
            <RadioButton
              value={"totalVotesCommunity"}
              label={"Total community Votes"}
              contentOnLeft={true}
              containerStyle={{
                justifyContent: "space-between",
                alignContent: "space-between",
                marginBottom: 12,
              }}
              labelStyle={{ color: theme.gray[300], fontSize: 16 }}
              color={theme.gray[300]}
            />
            <RadioButton
              value={"totalVotesCouncil"}
              label={"Total council Votes"}
              contentOnLeft={true}
              containerStyle={{
                justifyContent: "space-between",
                alignContent: "space-between",
                marginBottom: 12,
              }}
              labelStyle={{ color: theme.gray[300], fontSize: 16 }}
              color={theme.gray[300]}
            />
            <RadioButton
              value={"voteWeightCommunity"}
              label={"Amount of community tokens"}
              contentOnLeft={true}
              containerStyle={{
                justifyContent: "space-between",
                alignContent: "space-between",
                marginBottom: 12,
              }}
              labelStyle={{ color: theme.gray[300], fontSize: 16 }}
              color={theme.gray[300]}
            />
            <RadioButton
              value={"voteWeightCouncil"}
              label={"Amount of council tokens"}
              contentOnLeft={true}
              containerStyle={{
                justifyContent: "space-between",
                alignContent: "space-between",
                marginBottom: 12,
              }}
              labelStyle={{ color: theme.gray[300], fontSize: 16 }}
              color={theme.gray[300]}
            />
          </RadioGroup>
        </FilterContainer>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
}

// | "totalVotesCommunity"
// | "totalVotesCouncil"
// | "voteWeightCouncil"
// | "voteWeightCommunity"
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
  flex-direction: column;
  justify-content: space-between;
`;

const SubtitleTextLeft = styled.Text`
  color: ${(props: any) => props.theme.gray[400]};
  font-size: 16px;
`;

const EmptyView = styled.View`
  height: 100px;
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

const SearchBarContainer = styled.View`
  flex: 1;
  height: 40px;
`;

const SortButton = styled.TouchableOpacity`
  background: ${(props) => props.theme.gray[800]};
  padding: ${(props) => props.theme.spacing[3]};
  border-radius: 8;
  margin-left: ${(props: any) => props.theme.spacing[2]};
`;

const FilterContainer = styled.View`
  background: ${(props) => props.theme.gray[800]};
  flex: 1;
  padding-left: ${(props: any) => props.theme.spacing[3]};
  padding-right: ${(props: any) => props.theme.spacing[3]};
`;
