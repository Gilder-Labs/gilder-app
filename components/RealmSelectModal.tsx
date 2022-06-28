import React, { useState, useEffect, useCallback } from "react";
import { Modal, FlatList, View } from "react-native";
import styled from "styled-components/native";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import * as Unicons from "@iconscout/react-native-unicons";
import { debounce, filter } from "lodash";
import { useTheme } from "styled-components";
import { RealmCard } from "./RealmCard";
import { Loading } from "./Loading";
import { Typography } from "../components";
import { DaoWatchlistSelection } from "../elements";

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
  const {
    realmsData,
    realms,
    realmWatchlist,
    isLoadingRealms,
    isFetchingStorage,
  } = useAppSelector((state) => state.realms);
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
    return <RealmCard realm={item} />;
  };

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

  return (
    <Modal
      animationType="slide"
      visible={open}
      onRequestClose={handleOnClose}
      presentationStyle="pageSheet"
    >
      <FloatingBarContainer>
        <FloatingBar />
      </FloatingBarContainer>

      {isLoadingRealms || isFetchingStorage ? (
        <Loading />
      ) : (
        <RealmContainer>
          <DaoWatchlistSelection />
        </RealmContainer>
      )}
    </Modal>
  );
};

const RealmContainer = styled.View`
  padding-top: ${(props: any) => props.theme.spacing[4]};
  background: ${(props) => props.theme.gray[900]};
  height: 100%;
`;

const Header = styled.View`
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;
  background-color: ${(props) => props.theme.gray[900]};

  padding-top: ${(props) => props.theme.spacing[5]};
  padding-left: ${(props) => props.theme.spacing[4]};
  padding-right: ${(props) => props.theme.spacing[2]};
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

const EmptyView = styled.View`
  height: 150px;
`;

const SearchBarContainer = styled.View`
  padding-left: ${(props) => props.theme.spacing[2]};
  padding-right: ${(props) => props.theme.spacing[2]};
  background-color: ${(props) => props.theme.gray[900]};
`;

const EmptyText = styled.Text`
  color: ${(props) => props.theme.gray[100]};
  font-size: 26px;
  line-height: 40px;
  font-weight: bold;
  margin: ${(props) => props.theme.spacing[4]};
`;

const FloatingBarContainer = styled.View`
  position: absolute;

  width: 100%;
  padding-top: ${(props: any) => props.theme.spacing[2]};
  top: 0;
  left: 0;
  z-index: 100;

  justify-content: center;
  align-items: center;
`;

const FloatingBar = styled.View`
  height: 4px;
  width: 40px;
  z-index: 100;
  background: #ffffff88;
  top: 0;
  border-radius: 8;
`;

const IconContainer = styled.TouchableOpacity`
  position: absolute;
  right: 24;
  top: 12;
  padding: ${(props: any) => props.theme.spacing[2]};
`;
