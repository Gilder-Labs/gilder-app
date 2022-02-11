import React, { useState } from "react";
import { Modal, FlatList, View } from "react-native";
import styled from "styled-components/native";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import * as Unicons from "@iconscout/react-native-unicons";

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
  const { selectedRealm, realmsData, realmWatchlist } = useAppSelector(
    (state) => state.realms
  );

  if (!realmsData) {
    return <View />;
  }

  const handleRealmClick = () => {
    handleOnClose();
  };

  const renderRealmCard = ({ item }) => {
    return <RealmCard realmId={item} onClick={() => handleRealmClick()} />;
  };

  console.log("realmsData", realmsData);

  return (
    <Modal
      animationType="slide"
      visible={open}
      onRequestClose={handleOnClose}
      presentationStyle="pageSheet"
    >
      {/* Header - Title + close */}
      <Header>
        <View style={{ width: 48, height: 48 }} />
        <HeaderTitle> Add Realm</HeaderTitle>
        <CloseIconButton onPress={handleOnClose} activeOpacity={0.5}>
          <Unicons.UilTimes size="20" color={theme.gray[200]} />
        </CloseIconButton>
      </Header>

      {/* Input to filter by name or public key */}
      {/* <SearchBar /> */}

      <RealmContainer>
        <FlatList
          data={Object.keys(realmsData)}
          renderItem={renderRealmCard}
          numColumns={2}
          keyExtractor={(item) => item}
          style={{ paddingTop: 16 }}
          scrollIndicatorInsets={{ right: 1 }}
        />
      </RealmContainer>
    </Modal>
  );
};

const RealmContainer = styled.View`
  background-color: ${(props) => props.theme.gray[900]};
  width: 100%;
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

const SearchBar = styled.TextInput``;
