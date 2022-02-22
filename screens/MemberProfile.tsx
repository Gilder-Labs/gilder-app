import React, { useState, useEffect, useCallback } from "react";
import { Modal, FlatList, View } from "react-native";
import styled from "styled-components/native";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import * as Unicons from "@iconscout/react-native-unicons";
import { useTheme } from "styled-components";
import { fetchMemberChat, fetchMemberVotes } from "../store/memberSlice";
import { ChatMessage } from "../components/ChatMessage";
import { LinearGradient } from "expo-linear-gradient";
import { getColorType } from "../utils";

interface MemberProfileProps {
  open: boolean;
  member: Member;
  route: any;
  navigation: any;
}

export const MemberProfile = ({ route, navigation }: MemberProfileProps) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { memberChat, isLoadingChat, isLoadingVotes } = useAppSelector(
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

  const renderChatMessage = ({ item }: any) => {
    return (
      <ChatMessage
        message={item}
        key={item.postedAt}
        proposal={proposalsMap[item.proposalId]}
      />
    );
  };

  return (
    // <Modal
    //   animationType="slide"
    //   visible={open}
    //   onRequestClose={handleOnClose}
    //   presentationStyle="pageSheet"
    // >
    <Container>
      <HeaderContainer>
        <BackIconButton onPress={handleBack} activeOpacity={0.5}>
          <Unicons.UilAngleLeft size="28" color={theme.gray[200]} />
        </BackIconButton>
      </HeaderContainer>

      <FlatList
        data={memberChat}
        renderItem={renderChatMessage}
        keyExtractor={(item) => item.postedAt.toString()}
        style={{ padding: 16 }}
        ListFooterComponent={<EmptyView />}
        scrollIndicatorInsets={{ right: 1 }}
        removeClippedSubviews={true}
        initialNumToRender={10}
      />
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

const HeaderContainer = styled.View``;
