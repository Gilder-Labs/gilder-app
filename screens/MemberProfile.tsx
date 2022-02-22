import React, { useState, useEffect } from "react";
import { FlatList } from "react-native";
import styled from "styled-components/native";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { useTheme } from "styled-components";
import { createAvatar } from "@dicebear/avatars";
import * as style from "@dicebear/avatars-jdenticon-sprites";

import { fetchMemberChat, fetchMemberVotes } from "../store/memberSlice";
import { ChatMessage } from "../components/ChatMessage";
import { getColorType } from "../utils";
import { MemberProfileHeader } from "../components/MemberProfileHeader";

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
  const [selectedTab, setSelectedTab] = useState("Info");

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

  let jdenticonSvg = createAvatar(style, {
    seed: member.governingTokenOwner,
    // ... and other options
  });

  const color = getColorType(member.governingTokenOwner);

  return (
    <Container>
      <FlatList
        data={memberChat}
        renderItem={renderChatMessage}
        keyExtractor={(item) => item.postedAt.toString()}
        style={{}}
        ListFooterComponent={<EmptyView />}
        scrollIndicatorInsets={{ right: 1 }}
        removeClippedSubviews={true}
        initialNumToRender={10}
        ListHeaderComponent={
          <MemberProfileHeader
            selectedTab={selectedTab}
            onSelectTab={setSelectedTab}
            color={color}
            icon={jdenticonSvg}
          />
        }
      />
    </Container>
  );
};

const Container = styled.View``;

const EmptyView = styled.View`
  height: 200px;
`;
