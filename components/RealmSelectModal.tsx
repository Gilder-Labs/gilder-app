import React, { useState, useEffect, useCallback } from "react";
import { Modal, FlatList, View } from "react-native";
import styled from "styled-components/native";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import * as Unicons from "@iconscout/react-native-unicons";
import { debounce, filter } from "lodash";
import { useTheme } from "styled-components";
import { RealmCard } from "./RealmCard";
import { Loading } from "./Loading";

interface RealmSelectModalProps {
  open: boolean;
  handleOnClose: any;
}

export const RealmSelectModal = ({
  open,
  handleOnClose,
}: RealmSelectModalProps) => {
  const theme = useTheme();
  const [searchText, setSearchText] = useState("");
  const { realmsData, realms, realmWatchlist, isLoadingRealms } =
    useAppSelector((state) => state.realms);
  const [filteredRealms, setFilteredRealms] = useState(realms);

  useEffect(() => {
    setFilteredRealms(realms);
  }, [realms]);

  useEffect(() => {
    if (!searchText) {
      setFilteredRealms(realms);
    }
  }, [searchText]);

  useEffect(() => {
    setSearchText("");
    setFilteredRealms(realms);
  }, [open]);

  if (!realmsData) {
    return <View />;
  }

  const handleRealmClick = () => {
    setSearchText("");
    setFilteredRealms(realms);
    handleOnClose();
  };

  const renderRealmCard = ({ item }) => {
    return <RealmCard realm={item} onClick={() => handleRealmClick()} />;
  };

  const handleSearchChange = (newText: string) => {
    setSearchText(newText);
    const normalizedText = newText.toLowerCase();

    if (!newText) {
      console.log("resetting search");
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

  const debouncedChangeHandler = useCallback(
    debounce(handleSearchChange, 300),
    [realms]
  );

  return (
    <Modal
      animationType="slide"
      visible={open}
      onRequestClose={handleOnClose}
      presentationStyle="pageSheet"
    >
      <Header>
        {/* if a user has no realms, don't let them close modal till they pick one */}
        {realmWatchlist?.length ? (
          <CloseIconButton onPress={handleOnClose} activeOpacity={0.5}>
            <Unicons.UilTimes size="20" color={theme.gray[200]} />
          </CloseIconButton>
        ) : (
          <View style={{ width: 48 }} />
        )}
        <HeaderTitle> Add DAO</HeaderTitle>
        <View style={{ width: 48, height: 48 }} />
      </Header>

      {/* Input to filter by name or public key */}
      {/* <SearchBar /> */}

      {isLoadingRealms ? (
        <Loading />
      ) : (
        <>
          <SearchBarContainer>
            <SearchBar
              placeholder="Search by name or public key"
              onChangeText={debouncedChangeHandler}
              placeholderTextColor={theme.gray[400]}
              selectionColor={theme.gray[200]}
            />
          </SearchBarContainer>

          <RealmContainer>
            <FlatList
              data={filteredRealms}
              renderItem={renderRealmCard}
              numColumns={2}
              keyExtractor={(item) => item.pubKey}
              style={{
                paddingTop: 16,
                paddingLeft: 8,
                paddingRight: 8,
                // height: "100%",
              }}
              scrollIndicatorInsets={{ right: 1 }}
              ListFooterComponent={<EmptyView />}
              ListEmptyComponent={
                <EmptyText>No DAO's match that name or public key.</EmptyText>
              }
            />
          </RealmContainer>
        </>
      )}
    </Modal>
  );
};

const RealmContainer = styled.View`
  background-color: ${(props) => props.theme.gray[900]};
  width: 100%;
  height: 100%;
`;

const Header = styled.View`
  height: 64px;
  background-color: ${(props) => props.theme.gray[800]};
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  padding-left: ${(props) => props.theme.spacing[2]};
  padding-right: ${(props) => props.theme.spacing[2]};
`;

const HeaderTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${(props) => props.theme.gray[50]};
`;

const CloseIconButton = styled.TouchableOpacity`
  width: 48px;
  height: 48px;
  justify-content: center;
  align-items: center;
`;

const SearchBar = styled.TextInput`
  margin: ${(props) => props.theme.spacing[2]};
  padding: ${(props) => props.theme.spacing[3]};
  font-size: 14px;
  background-color: ${(props) => props.theme.gray[800]};
  border-radius: 4px;
  border: 1px solid ${(props) => props.theme.gray[500]};
  color: ${(props) => props.theme.gray[100]};

  :focus {
    background: green;
  }
`;

const EmptyView = styled.View`
  height: 150px;
`;

const SearchBarContainer = styled.View`
  padding: ${(props) => props.theme.spacing[2]};
  background-color: ${(props) => props.theme.gray[900]};
`;

const EmptyText = styled.Text`
  color: ${(props) => props.theme.gray[100]};
  font-size: 26px;
  line-height: 40px;
  font-weight: bold;
  margin: ${(props) => props.theme.spacing[4]};
`;
