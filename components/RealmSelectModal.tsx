import React, { useState, useEffect, useCallback } from "react";
import { Modal, FlatList, View } from "react-native";
import styled from "styled-components/native";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import * as Unicons from "@iconscout/react-native-unicons";
import { debounce, filter } from "lodash";
import { useTheme } from "styled-components";
import { RealmCard } from "./RealmCard";

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
  const [filteredRealms, setFilteredRealms] = useState(realms);
  const { realmsData, realms } = useAppSelector((state) => state.realms);

  useEffect(() => {
    setFilteredRealms(realms);
  }, [realms]);

  if (!realmsData) {
    return <View />;
  }

  const handleRealmClick = () => {
    handleOnClose();
  };

  const renderRealmCard = ({ item }) => {
    return <RealmCard realm={item} onClick={() => handleRealmClick()} />;
  };

  const handleSearchChange = (newText: string) => {
    setSearchText(newText);

    if (!newText) {
      setFilteredRealms(realms);
    } else {
      const filtRealms = realms.filter(
        (realm) =>
          realm.name.toLowerCase().includes(newText.toLowerCase()) ||
          realm.pubKey === newText
      );

      setFilteredRealms(filtRealms);
    }
  };

  const debouncedChangeHandler = useCallback(
    debounce(handleSearchChange, 300),
    []
  );

  return (
    <Modal
      animationType="slide"
      visible={open}
      onRequestClose={handleOnClose}
      presentationStyle="pageSheet"
    >
      <Header>
        <View style={{ width: 48, height: 48 }} />
        <HeaderTitle> Add Realm</HeaderTitle>
        <CloseIconButton onPress={handleOnClose} activeOpacity={0.5}>
          <Unicons.UilTimes size="20" color={theme.gray[200]} />
        </CloseIconButton>
      </Header>

      {/* Input to filter by name or public key */}
      {/* <SearchBar /> */}
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
