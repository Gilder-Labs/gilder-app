import React, { useState } from "react";
import { StyleSheet, Modal, Text, Pressable, View } from "react-native";
import styled from "styled-components/native";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { FontAwesome5 as FontAwesome } from "@expo/vector-icons";
import { useTheme } from "styled-components";
import { RealmCard } from ".";

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
          <FontAwesome size={20} name="times" color={theme.gray[200]} />
        </CloseIconButton>
      </Header>

      {/* Input to filter by name or public key */}

      <Container>
        <RealmContainer>
          {Object.keys(realmsData).map((realmId) => (
            <RealmCard realmId={realmId} key={realmId} />
          ))}
        </RealmContainer>
      </Container>
    </Modal>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
});

const Container = styled.ScrollView`
  background-color: ${(props) => props.theme.gray[900]};
  flex: 1;
  padding-top: ${(props) => props.theme.spacing[2]};
`;

const RealmContainer = styled.View`
  background-color: ${(props) => props.theme.gray[900]};
  flex: 1;
  padding: ${(props) => props.theme.spacing[2]};
  flex-wrap: wrap;
  width: 100%;
  flex-direction: row;
  justify-content: space-around;
  align-items: stretch;
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
  font-size: 18;
  font-weight: bold;
  color: ${(props) => props.theme.gray[50]};
`;

const CloseIconButton = styled.TouchableOpacity`
  width: 48px;
  height: 48px;
  justify-content: center;
  align-items: center;
`;