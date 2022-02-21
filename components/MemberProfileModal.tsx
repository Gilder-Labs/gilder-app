import React, { useState, useEffect, useCallback } from "react";
import { Modal, FlatList, View } from "react-native";
import styled from "styled-components/native";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import * as Unicons from "@iconscout/react-native-unicons";
import { useTheme } from "styled-components";
import { fetchMemberChat } from "../store/memberSlice";

interface MemberProfileModalProps {
  open: boolean;
  handleOnClose: any;
  member: Member;
}

export const MemberProfileModal = ({
  open,
  handleOnClose,
  member,
}: MemberProfileModalProps) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { memberChat, isLoadingChat } = useAppSelector(
    (state) => state.members
  );

  useEffect(() => {
    if (member) {
      dispatch(fetchMemberChat(member));
    }
  }, [member]);

  return (
    <Modal
      animationType="slide"
      visible={open}
      onRequestClose={handleOnClose}
      presentationStyle="pageSheet"
    >
      <Header>
        <View style={{ width: 48, height: 48 }} />
        <HeaderTitle> Member 123 </HeaderTitle>
        <CloseIconButton onPress={handleOnClose} activeOpacity={0.5}>
          <Unicons.UilTimes size="20" color={theme.gray[200]} />
        </CloseIconButton>
      </Header>
      {memberChat.map((message) => (
        <MyText>{message.body} </MyText>
      ))}
    </Modal>
  );
};

const MyText = styled.Text``;

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
