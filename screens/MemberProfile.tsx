import React, { useState, useEffect, useCallback } from "react";
import { Modal, FlatList, View } from "react-native";
import styled from "styled-components/native";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import * as Unicons from "@iconscout/react-native-unicons";
import { SvgXml } from "react-native-svg";
import { useTheme } from "styled-components";
import { createAvatar } from "@dicebear/avatars";
import * as style from "@dicebear/avatars-jdenticon-sprites";

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
          <HeaderContainer>
            <LinearGradient
              colors={[`${theme[color][600]}66`, `${theme[color][800]}66`]}
              style={{
                height: 80,
                flex: 1,
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
              start={{ x: 0.1, y: 0.2 }}
            >
              <BackIconButton onPress={handleBack} activeOpacity={0.5}>
                <Unicons.UilAngleLeft size="28" color={theme.gray[200]} />
              </BackIconButton>
            </LinearGradient>
            <IconContainer color={color}>
              <SvgXml xml={jdenticonSvg} width="60px" height="60px" />
            </IconContainer>
            <MemberInfoSwitcherContainer>
              <NavIconButton color={color} isSelected={true}>
                <Unicons.UilEnvelopeEdit
                  size="20"
                  style={{ marginRight: 4 }}
                  color={theme[color][200]}
                />
                <ButtonText color={color}>Info</ButtonText>
              </NavIconButton>
              <NavIconButton color={color} isSelected={false}>
                <Unicons.UilEnvelopeEdit
                  size="20"
                  style={{ marginRight: 4 }}
                  color={theme[color][200]}
                />
                <ButtonText color={color}>Messages</ButtonText>
              </NavIconButton>
              <NavIconButton color={color} isSelected={false}>
                <Unicons.UilCommentDots
                  size="20"
                  style={{ marginRight: 4 }}
                  color={theme[color][200]}
                />
                <ButtonText color={color}>Votes</ButtonText>
              </NavIconButton>
            </MemberInfoSwitcherContainer>
          </HeaderContainer>
        }
      />
    </Container>
  );
};

const Container = styled.View``;

const BackIconButton = styled.TouchableOpacity`
  width: 48px;
  height: 48px;
  justify-content: center;
  align-items: center;
`;

const IconButton = styled.TouchableOpacity`
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

const EmptyView = styled.View`
  height: 200px;
`;

const HeaderContainer = styled.View`
  /* height: 80px; */
  margin-bottom: ${(props: any) => props.theme.spacing[4]};
  border-bottom-width: 1px;
  border-color: ${(props) => props.theme.gray[1000]};
  flex-direction: column;
`;

const IconContainer = styled.View<{ color: string }>`
  /* border-radius: 100px, */
  background: ${(props: any) => props.theme[props.color][800]};
  flex-direction: row;
  align-items: center;
  position: absolute;
  left: 30px;
  top: 48px;
  overflow: hidden;
  border: 2px solid ${(props: any) => props.theme.gray[900]};
  border-radius: 100px;
`;

const MemberInfoSwitcherContainer = styled.View`
  /* background: red; */
  flex-direction: row;
  justify-content: flex-end;
  margin-top: ${(props: any) => props.theme.spacing[2]};
  padding-right: ${(props: any) => props.theme.spacing[2]};

  /* align-items: center; */
  /* height: 80px; */
  /* width: 100px; */
`;

const NavIconButton = styled.TouchableOpacity<{
  color: string;
  isSelected: boolean;
}>`
  background: ${(props: any) =>
    props.isSelected ? `${props.theme[props.color][900]}aa` : "transparent"};
  border-radius: 8px;
  /* padding: ${(props: any) => props.theme.spacing[1]}; */
  padding-top: ${(props: any) => props.theme.spacing[1]};
  padding-bottom: ${(props: any) => props.theme.spacing[1]};

  padding-left: ${(props: any) => props.theme.spacing[2]};
  padding-right: ${(props: any) => props.theme.spacing[2]};
  margin-left: ${(props: any) => props.theme.spacing[1]};
  margin-right: ${(props: any) => props.theme.spacing[1]};

  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const ButtonText = styled.Text<{ color: string }>`
  color: ${(props: any) => props.theme[props.color][200]};
`;
