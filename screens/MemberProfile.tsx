import React, { useState, useEffect, useCallback } from "react";
import { Modal, FlatList, View } from "react-native";
import styled from "styled-components/native";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import * as Unicons from "@iconscout/react-native-unicons";
import { useTheme } from "styled-components";
import { fetchMemberChat, fetchMemberVotes } from "../store/memberSlice";
import { ChatMessage } from "../components/ChatMessage";

interface MemberProfileProps {
  open: boolean;
  member: Member;
  route: any;
  navigation: any;
}

export const MemberProfile = ({
  open,
  route,
  navigation,
}: MemberProfileProps) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { memberChat, isLoadingChat } = useAppSelector(
    (state) => state.members
  );
  const { selectedRealm } = useAppSelector((state) => state.realms);
  const { proposalsMap } = useAppSelector((state) => state.proposals);
  const { member } = route?.params;

  useEffect(() => {
    if (member) {
      dispatch(fetchMemberChat(member));
      dispatch(fetchMemberVotes({ member, realm: selectedRealm }));
    }
  }, [member]);

  const handleBack = () => {
    navigation.goBack();
  };

  //
  if (!member) {
    return <EmptyView />;
  }

  return (
    // <Modal
    //   animationType="slide"
    //   visible={open}
    //   onRequestClose={handleOnClose}
    //   presentationStyle="pageSheet"
    // >
    <Container>
      <BackIconButton onPress={handleBack} activeOpacity={0.5}>
        <Unicons.UilArrowLeft size="28" color={theme.gray[200]} />
      </BackIconButton>
      <ContentContainer>
        {memberChat.map((message) => (
          <ChatMessage
            message={message}
            proposal={proposalsMap[message.proposalId]}
          />
        ))}
      </ContentContainer>
    </Container>
    // </Modal>
  );
};

const Container = styled.View``;

const BackIconButton = styled.TouchableOpacity`
  width: 48px;
  height: 48px;
  justify-content: center;
  align-items: center;
`;

const ContentContainer = styled.View`
  background-color: ${(props) => props.theme.gray[900]};
  width: 100%;
  height: 100%;
`;

const EmptyView = styled.View``;
