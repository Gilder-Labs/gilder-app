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
import * as Unicons from "@iconscout/react-native-unicons";
import { debounce, filter } from "lodash";
import * as Haptics from "expo-haptics";
import { toggleRealmInWatchlist } from "../store/realmSlice";
import { subscribeToNotifications } from "../store/notificationSlice";
import DiscoverData from "../assets/Discover.json";

interface DaoWatchlistSelection {}

export const DaoWatchlistSelection = ({}: DaoWatchlistSelection) => {
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
    // setSearchText(newText);
    const normalizedText = newText.toLowerCase();

    if (!newText) {
      setFilteredRealms(realms);
    } else {
      const filtRealms = realms.filter(
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
    return <RealmCard realm={item} />;
  };

  return (
    <Container>
      {isLoadingRealms ? (
        <Loading />
      ) : (
        <ContentContainer>
          <Row>
            <Typography
              text="Add DAOs"
              size="h2"
              bold={true}
              marginLeft={"4"}
            />
            <Button
              title="Approve"
              onPress={handleFinishOnboarding}
              shade="900"
              color="secondary"
            />
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
                <Unicons.UilTimes size="20" color={theme.gray[300]} />
              ) : (
                <Unicons.UilSearch size="20" color={theme.gray[300]} />
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
              <RealmIconContainer>
                <RealmIcon size={54} realmId={realmId} />
                <RemoveContainer
                  onPress={() => handleRealmToggle(realmId, false)}
                >
                  <Unicons.UilTimes size="20" color={theme.gray[500]} />
                </RemoveContainer>
              </RealmIconContainer>
            ))}
          </WatchlistContainer>

          {/* TODO: Featured daos in block list */}
          <Typography
            text="Featured"
            size="h4"
            bold={true}
            marginLeft={"4"}
            shade="300"
          />
          <FlatList
            data={featured}
            renderItem={renderRealmCard}
            numColumns={2}
            keyExtractor={(item) => item.pubKey}
            style={{
              paddingTop: 0,
              paddingLeft: 8,
              paddingRight: 8,
              // height: "100%",
            }}
            scrollIndicatorInsets={{ right: 1 }}
          />

          {/* TODO: DAO's in realmsdata list */}
          <Typography
            text="DAOs"
            size="h4"
            bold={true}
            marginLeft={"4"}
            shade="300"
          />
          {/* TODO: Rest of the daos */}
          <Typography
            text="Unchartered DAOs"
            size="h4"
            bold={true}
            marginLeft={"4"}
            shade="300"
          />

          {/* Only show if a user is searching for daos */}
          <Typography
            text="Search"
            size="h4"
            bold={true}
            marginLeft={"4"}
            shade="300"
          />
        </ContentContainer>
      )}
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
  border-radius: 8px;
  margin-bottom: ${(props) => props.theme.spacing[2]};
`;

const SearchBar = styled.TextInput`
  margin: ${(props) => props.theme.spacing[2]};
  padding: ${(props) => props.theme.spacing[3]};
  font-size: 14px;
  background-color: ${(props) => props.theme.gray[800]}44;
  border-radius: 4px;
  border: 1px solid ${(props) => props.theme.gray[600]};
  color: ${(props) => props.theme.gray[100]};
`;

const SearchBarContainer = styled.View`
  padding-left: ${(props) => props.theme.spacing[2]};
  padding-right: ${(props) => props.theme.spacing[2]};
  background-color: ${(props) => props.theme.gray[900]};
  margin-bottom: ${(props) => props.theme.spacing[2]};
`;

const IconContainer = styled.TouchableOpacity`
  position: absolute;
  right: 24;
  top: 12;
  padding: ${(props: any) => props.theme.spacing[2]};
`;

const ContentContainer = styled.View`
  flex: 1;
  width: 100%;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const RealmIconContainer = styled.View`
  background: ${(props: any) => props.theme.gray[1000]};
  padding: ${(props: any) => props.theme.spacing[2]};
  margin-right: ${(props: any) => props.theme.spacing[2]};
  border-radius: 100px;
`;

const RemoveContainer = styled.TouchableOpacity`
  position: absolute;
  right: 0;
  background: ${(props: any) => props.theme.gray[800]};
  border-radius: 100px;
`;
