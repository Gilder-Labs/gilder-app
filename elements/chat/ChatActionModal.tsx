import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { View } from "react-native";
import { useTheme } from "styled-components";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import * as Haptics from "expo-haptics";
import { useWindowDimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  MessageTouchableHandlerPayload,
  useMessageContext,
  useThreadContext,
  useChannelContext,
} from "stream-chat-expo";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faWallet } from "@fortawesome/pro-solid-svg-icons/faWallet";
import { faCopy } from "@fortawesome/pro-solid-svg-icons/faCopy";
import { faReply } from "@fortawesome/pro-solid-svg-icons/faReply";
import { faPenToSquare } from "@fortawesome/pro-solid-svg-icons/faPenToSquare";
import { faTrashCan } from "@fortawesome/pro-solid-svg-icons/faTrashCan";
import { faComments } from "@fortawesome/pro-solid-svg-icons/faComments";
import { faFaceSmilePlus } from "@fortawesome/pro-solid-svg-icons/faFaceSmilePlus";
import Modal from "react-native-modal";

import { Typography } from "../../components";
import { useChatClient } from "../../hooks/useChatClient";
import * as Clipboard from "expo-clipboard";

interface ChatActionModalProps {
  isVisible: boolean;
  setModalVisible: (isOpen: boolean) => any;
  message: MessageTouchableHandlerPayload | null;
  isInThread?: boolean;
}

export const ChatActionModal = ({
  isVisible = false,
  setModalVisible,
  message,
  isInThread = false,
}: ChatActionModalProps) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { height, width } = useWindowDimensions();
  const { publicKey } = useAppSelector((state) => state.wallet);
  const channelContext = useChannelContext();

  const handleAction = (type: string) => {
    const actionHandlers = message?.actionHandlers;
    if (type === "edit") {
      actionHandlers?.editMessage();
    } else if (type === "reply") {
      actionHandlers?.quotedReply();
    } else if (type === "delete") {
      actionHandlers?.deleteMessage();
    } else if (type === "thread") {
      // TODO: handle creating threads
      const { channel } = channelContext;
      if (message?.message) {
        navigation.navigate("ThreadScreen", {
          channel,
          message: message?.message,
        });
      }
    } else if (type === "copy") {
      // TODO: handle copy;
      var strippedHtml = message?.message?.html?.replace(/<[^>]+>/g, "");

      Clipboard.setStringAsync(strippedHtml || "");
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setModalVisible(false);
  };

  const toggleReaction = (reaction: string) => {
    message?.actionHandlers?.toggleReaction(reaction);
    setModalVisible(false);
  };

  return (
    <Modal
      isVisible={isVisible}
      onSwipeComplete={() => setModalVisible(false)}
      swipeDirection="down"
      deviceWidth={width}
      // coverScreen={true}
      onBackButtonPress={() => setModalVisible(false)}
      onBackdropPress={() => setModalVisible(false)}
      style={{ width: "100%", padding: 0, margin: 0 }}
      customBackdrop={
        <BackDropContainer onPress={() => setModalVisible(false)}>
          <View style={{ flex: 1 }} />
        </BackDropContainer>
      }
    >
      <ContentContainer>
        <FloatingBarContainer>
          <FloatingBar />
        </FloatingBarContainer>
        <ReactionRow>
          <EmojiIconContainer onPress={() => toggleReaction("768")}>
            <Typography text="🔥" size="h4" marginBottom="0" />
          </EmojiIconContainer>
          <EmojiIconContainer onPress={() => toggleReaction("365")}>
            <Typography text="❤️" size="h4" marginBottom="0" />
          </EmojiIconContainer>
          <EmojiIconContainer onPress={() => toggleReaction("333")}>
            <Typography text="👍" size="h4" marginBottom="0" />
          </EmojiIconContainer>
          <EmojiIconContainer onPress={() => toggleReaction("209")}>
            <Typography text="😂" size="h4" marginBottom="0" />
          </EmojiIconContainer>
          <EmojiIconContainer onPress={() => toggleReaction("127")}>
            <Typography text="🎉" size="h4" marginBottom="0" />
          </EmojiIconContainer>
          {/* <EmojiIconContainer onPress={() => toggleReaction("something")}>
            <FontAwesomeIcon
              icon={faFaceSmilePlus}
              size={28}
              color={theme.gray[400]}
            />
          </EmojiIconContainer> */}
        </ReactionRow>
        <ActionContainer>
          {publicKey === message?.message?.user?.id && (
            <ActionButton onPress={() => handleAction("edit")}>
              <FontAwesomeIcon
                style={{ marginBottom: 4 }}
                icon={faPenToSquare}
                size={20}
                color={theme.gray[300]}
              />
              <Typography
                size="caption"
                shade="300"
                text="Edit"
                marginBottom="0"
              />
            </ActionButton>
          )}
          <ActionButton onPress={() => handleAction("reply")}>
            <FontAwesomeIcon
              style={{ marginBottom: 4 }}
              icon={faReply}
              size={20}
              color={theme.gray[300]}
            />
            <Typography
              size="caption"
              shade="300"
              text="Reply"
              marginBottom="0"
            />
          </ActionButton>
          <ActionButton onPress={() => handleAction("copy")}>
            <FontAwesomeIcon
              style={{ marginBottom: 4 }}
              icon={faCopy}
              size={20}
              color={theme.gray[300]}
            />
            <Typography
              size="caption"
              shade="300"
              text="Copy"
              marginBottom="0"
            />
          </ActionButton>
          {!isInThread && (
            <ActionButton onPress={() => handleAction("thread")}>
              <FontAwesomeIcon
                style={{ marginBottom: 4 }}
                icon={faComments}
                size={20}
                color={theme.gray[300]}
              />
              <Typography
                size="caption"
                shade="300"
                text="Thread Reply"
                marginBottom="0"
              />
            </ActionButton>
          )}
          {publicKey === message?.message?.user?.id && (
            <ActionButton onPress={() => handleAction("delete")}>
              <FontAwesomeIcon
                style={{ marginBottom: 4 }}
                icon={faTrashCan}
                size={20}
                color={theme.error[400]}
              />
              <Typography
                size="caption"
                color="error"
                shade="400"
                text="Delete"
                marginBottom="0"
              />
            </ActionButton>
          )}
        </ActionContainer>
      </ContentContainer>
    </Modal>
  );
};

const BackDropContainer = styled.TouchableWithoutFeedback`
  flex: 1;
`;

const ContentContainer = styled.View`
  /* flex: 1; */
  margin-top: auto;
  height: 50%;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  background: ${(props: any) => props.theme.gray[800]};
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
  border-radius: 8px;
`;

const ActionContainer = styled.View`
  padding: ${(props: any) => props.theme.spacing[2]};
  flex: 1;
  flex-direction: row;
  justify-content: space-around;
  /* align-items: flex-start; */
  flex-wrap: wrap;
`;

const ActionButton = styled.TouchableOpacity`
  padding: ${(props: any) => props.theme.spacing[4]};
  border-radius: 8px;
  min-height: 100px;
  min-width: 100px;
  align-items: center;
  justify-content: center;
  margin: ${(props: any) => props.theme.spacing[2]};
  background: ${(props: any) => props.theme.gray[1000]};
  flex: 1;
`;

const ReactionRow = styled.View`
  padding-left: ${(props: any) => props.theme.spacing[4]};
  padding-right: ${(props: any) => props.theme.spacing[4]};

  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: ${(props: any) => props.theme.spacing[5]};
`;

const EmojiIconContainer = styled.TouchableOpacity`
  width: 48px;
  height: 48px;

  border-radius: 100;
  justify-content: center;
  align-items: center;
  background: ${(props: any) => props.theme.gray[1000]};
`;
