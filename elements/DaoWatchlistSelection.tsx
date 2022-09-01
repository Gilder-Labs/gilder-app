import React, { useState, useEffect, useCallback } from "react";
import { useTheme } from "styled-components";

import {
  Typography,
  Button,
  Loading,
  RealmIcon,
  RealmCard,
} from "../components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import styled from "styled-components/native";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowRight } from "@fortawesome/pro-solid-svg-icons/faArrowRight";
import { faXmark } from "@fortawesome/pro-solid-svg-icons/faXmark";
import { faMagnifyingGlass } from "@fortawesome/pro-regular-svg-icons/faMagnifyingGlass";

import { debounce, filter } from "lodash";
import * as Haptics from "expo-haptics";
import { toggleRealmInWatchlist, fetchRealm } from "../store/realmSlice";
import { subscribeToNotifications } from "../store/notificationSlice";
import DiscoverData from "../assets/Discover.json";
import { LinearGradient } from "expo-linear-gradient";

interface DaoWatchlistSelection {
  isOnboarding?: boolean;
}

export const DaoWatchlistSelection = ({
  isOnboarding = false,
}: DaoWatchlistSelection) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState("");
  const { realmsData, realms, isLoadingRealms, realmWatchlist } =
    useAppSelector((state) => state.realms);
  const [filteredRealms, setFilteredRealms] = useState(realms);
  const dispatch = useAppDispatch();
  const { pushToken } = useAppSelector((state) => state.notifications);
  const { featured } = DiscoverData;

  const handleFinishOnboarding = () => {
    AsyncStorage.setItem("@hasCompletedOnboarding", "true");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    dispatch(fetchRealm(realmWatchlist[0]));
    navigation.replace("Root");
  };

  useEffect(() => {
    setFilteredRealms(realms);
  }, [realms]);

  useEffect(() => {
    if (!searchText) {
      setFilteredRealms(realms);
    }
  }, [searchText]);

  const handleSearchChange = (newText: string) => {
    const normalizedText = newText.toLowerCase();

    if (!newText) {
      setFilteredRealms(realms);
    } else {
      const filtRealms = realms?.filter(
        (realm) =>
          realm.name.toLowerCase().includes(normalizedText) ||
          realm.pubKey.toLowerCase() === normalizedText
      );

      setFilteredRealms(filtRealms);
    }
  };

  const handleSearchInputChange = (newText: string) => {
    setSearchText(newText);
    debouncedChangeHandler(newText);
  };

  const debouncedChangeHandler = useCallback(
    debounce(handleSearchChange, 300),
    [realms]
  );

  const handleRealmToggle = (realmId: string, isSubscribing: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    dispatch(toggleRealmInWatchlist(realmId));
    if (pushToken) {
      dispatch(
        subscribeToNotifications({
          pushToken: pushToken,
          realmId: realmId,
          isSubscribing: isSubscribing,
        })
      );
    }
  };

  const renderRealmCard = ({ item }) => {
    // TODO: check if featured dao is a item, don't return anything if it is

    return <RealmCard realm={item} />;
  };

  const hasSomeRealmsSelected = realmWatchlist?.length > 0;

  return (
    <Container>
      <ContentContainer>
        <Row>
          <Typography text="Add DAOs" size="h2" bold={true} marginLeft={"4"} />
          {isOnboarding && (
            <CompleteOnboardingButton
              onPress={handleFinishOnboarding}
              disabled={!hasSomeRealmsSelected}
            >
              <LinearGradient
                colors={[
                  hasSomeRealmsSelected
                    ? theme.secondary[600]
                    : theme.gray[700],
                  hasSomeRealmsSelected ? theme.purple[700] : theme.gray[700],
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  height: 36,
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 0,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Typography
                  text="Enter App"
                  marginBottom="0"
                  marginRight="1"
                  shade="50"
                  color="gray"
                  // hasTextShadow={true}
                />
                <FontAwesomeIcon
                  icon={faArrowRight}
                  size={16}
                  color={theme.gray[100]}
                  style={{ marginRight: -4 }}
                />
              </LinearGradient>
            </CompleteOnboardingButton>
          )}
        </Row>
        <SearchBarContainer>
          <SearchBar
            placeholder="Search by name or public key"
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
            onPress={() => setSearchText("")}
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
        <Typography
          text="Watchlist"
          size="h4"
          bold={true}
          shade="300"
          marginLeft={"4"}
        />
        <WatchlistContainer
          horizontal={true}
          scrollIndicatorInsets={{ bottom: -12 }}
          contentContainerStyle={{
            alignContent: "center",
            justifyContent: "center",
            alignItems: "center",
            paddingLeft: 8,
            paddingRight: 24,
          }}
        >
          {realmWatchlist.map((realmId) => (
            <RealmIconContainer key={realmId}>
              <RealmIcon size={54} realmId={realmId} />
              <RemoveContainer
                onPress={() => handleRealmToggle(realmId, false)}
              >
                <FontAwesomeIcon
                  icon={faXmark}
                  size={12}
                  color={theme.gray[500]}
                />
              </RemoveContainer>
            </RealmIconContainer>
          ))}
        </WatchlistContainer>

        {isLoadingRealms ? (
          <Loading />
        ) : (
          <FlatList
            data={filteredRealms}
            renderItem={renderRealmCard}
            numColumns={2}
            keyExtractor={(item) => item.pubKey}
            ListHeaderComponent={
              <>
                {!searchText && (
                  <>
                    <Typography
                      text="Featured"
                      size="h4"
                      bold={true}
                      marginLeft={"2"}
                      marginBottom="2"
                      shade="300"
                    />
                    <FlatList
                      data={featured}
                      renderItem={renderRealmCard}
                      numColumns={2}
                      keyExtractor={(item) => item.realmId}
                      style={{
                        paddingTop: 0,
                        paddingBottom: 8,
                        // paddingLeft: 8,
                        // paddingRight: 8,
                        // height: "100%",
                      }}
                      scrollIndicatorInsets={{ right: 1 }}
                    />
                  </>
                )}
                <Typography
                  text="DAOs"
                  size="h4"
                  bold={true}
                  marginLeft={"2"}
                  shade="300"
                  marginBottom="2"
                />
              </>
            }
            style={{
              paddingTop: 16,
              paddingLeft: 8,
              paddingRight: 8,
              backgroundColor: "#131313",
              // height: "100%",
            }}
            scrollIndicatorInsets={{ right: 1 }}
            // ListFooterComponent={<EmptyView />}
            ListEmptyComponent={
              <Typography
                text={"No DAO's match that name or public key."}
                marginLeft="2"
                shade="400"
              />
            }
          />
        )}
      </ContentContainer>
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  background: ${(props) => props.theme.gray[900]};
`;

const WatchlistContainer = styled.ScrollView`
  max-height: 64px;
  min-height: 64px;
  border-radius: 8px;
  margin-bottom: ${(props) => props.theme.spacing[2]};
`;

const SearchBar = styled.TextInput`
  margin: ${(props) => props.theme.spacing[2]};
  padding-left: ${(props) => props.theme.spacing[3]};
  padding-right: ${(props) => props.theme.spacing[3]};
  height: 40px;
  font-size: 14px;
  background-color: ${(props) => props.theme.gray[800]}44;
  border-radius: 8px;
  border: 1px solid ${(props) => props.theme.gray[600]};
  color: ${(props) => props.theme.gray[100]};
`;

const SearchBarContainer = styled.View`
  padding-left: ${(props) => props.theme.spacing[2]};
  padding-right: ${(props) => props.theme.spacing[2]};
  background-color: ${(props) => props.theme.gray[900]};
  margin-bottom: ${(props) => props.theme.spacing[2]};
  justify-content: space-between;
  height: 64px;
`;

const IconContainer = styled.TouchableOpacity`
  position: absolute;
  /* right: 32;
  top: 20; */
  top: 0px;
  right: 0px;
  bottom: 8px;
  justify-content: center;
  align-items: flex-end;
  margin-right: 24px;
  padding: ${(props: any) => props.theme.spacing[2]};
`;

const ContentContainer = styled.View`
  flex: 1;
  width: 100%;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const RealmIconContainer = styled.View`
  background: ${(props: any) => props.theme.gray[1000]};
  padding: ${(props: any) => props.theme.spacing[2]};
  margin-right: ${(props: any) => props.theme.spacing[2]};
  border-radius: 100px;
  width: 60px;
  height: 60px;
`;

const RemoveContainer = styled.TouchableOpacity`
  position: absolute;
  right: 0;
  background: ${(props: any) => props.theme.gray[800]};
  border-radius: 100px;
  padding: 2px;
`;

const CompleteOnboardingButton = styled.TouchableOpacity`
  flex-direction: row;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  background: ${(props: any) => props.theme.gray[700]};
  height: 36;
  margin-right: ${(props: any) => props.theme.spacing[4]};
`;
