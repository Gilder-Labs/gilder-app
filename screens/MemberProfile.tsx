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
import { VoteCard } from "../components/VoteCard";

interface MemberProfileProps {
  open: boolean;
  member: Member;
  route: any;
  navigation: any;
}

export const MemberProfile = ({ route }: MemberProfileProps) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { memberChat, isLoadingChat, isLoadingVotes, memberVotes } =
    useAppSelector((state) => state.members);
  const { selectedRealm } = useAppSelector((state) => state.realms);
  const { proposalsMap } = useAppSelector((state) => state.proposals);
  const { member } = route?.params;
  const [selectedTab, setSelectedTab] = useState("Messages");

  useEffect(() => {
    if (member) {
      dispatch(fetchMemberChat(member));
      dispatch(fetchMemberVotes({ member, realm: selectedRealm }));
    }
  }, [member]);

  const renderChatMessage = ({ item }: any) => {
    return (
      <ChatMessage
        message={item}
        key={item.postedAt}
        proposal={proposalsMap[item.proposalId]}
      />
    );
  };

  const renderVotes = ({ item }: any) => {
    return (
      <VoteCard
        member={member}
        vote={item}
        key={item.proposalId}
        proposal={proposalsMap[item.proposalId]}
      />
    );
  };

  let jdenticonSvg = createAvatar(style, {
    seed: member.walletId,
    // ... and other options
  });

  const color = getColorType(member.walletId);

  return (
    <Container>
      {/* Back burner till i figure out what to put here */}
      {/* {selectedTab === "Info" && (
        <MemberProfileHeader
          selectedTab={selectedTab}
          onSelectTab={setSelectedTab}
          color={color}
          icon={jdenticonSvg}
        />
      )} */}
      {selectedTab === "Messages" && (
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
      )}
      {selectedTab === "Votes" && (
        <FlatList
          data={memberVotes}
          renderItem={renderVotes}
          keyExtractor={(item) => item.proposalId}
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
      )}
    </Container>
  );
};

const Container = styled.View``;

const EmptyView = styled.View`
  height: 200px;
`;
