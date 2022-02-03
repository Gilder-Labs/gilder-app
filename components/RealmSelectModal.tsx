import React, { useState } from "react";
import { StyleSheet, Modal, Text, Pressable, View } from "react-native";
import styled from "styled-components/native";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { FontAwesome5 as FontAwesome } from "@expo/vector-icons";
import { useTheme } from "styled-components";

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

  return (
    <Modal
      animationType="slide"
      visible={open}
      onRequestClose={handleOnClose}
      presentationStyle="pageSheet"
    >
      {/* Header - Title + close */}
      {/* Input to filter by name or public key */}
      {/* List Realms + icon */}
      <Container>
        <Pressable
          style={[styles.button, styles.buttonClose]}
          onPress={handleOnClose}
        >
          <Text>Hide Modal</Text>
        </Pressable>
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

const Container = styled.View`
  background-color: ${(props) => props.theme.gray[800]};
  flex: 1;
`;
