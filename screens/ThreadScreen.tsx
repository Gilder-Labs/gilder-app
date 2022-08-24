import { useState, useRef, useEffect } from "react";
import {
  Thread,
  Channel,
  useAttachmentPickerContext,
  MessageTouchableHandlerPayload,
} from "stream-chat-expo"; // Or stream-chat-expo
import { useHeaderHeight } from "@react-navigation/elements";
import { ChatActionModal } from "../elements/chat/ChatActionModal";
import * as Haptics from "expo-haptics";
import { ChatMessageFooter } from "../elements/chat/ChatMessageFooter";
import { Messagereply } from "../elements/chat/MessageReply";
import { MessageHeader } from "../elements/chat/MessageHeader";
import { SendButton } from "../elements/chat/ChatSendButton";
import { Keyboard } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

export default function ThreadScreen(props: any) {
  const { route } = props;
  const headerHeight = useHeaderHeight();
  const { setTopInset } = useAttachmentPickerContext();
  const [selectedMessage, setSelectedMessage] =
    useState<MessageTouchableHandlerPayload | null>(null);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handleMessageLongPress = (message: MessageTouchableHandlerPayload) => {
    setSelectedMessage(message);
    bottomSheetModalRef?.current?.present();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Keyboard.dismiss();
  };

  useEffect(() => {
    setTopInset(headerHeight);
  }, [headerHeight]);

  return (
    <Channel
      channel={route?.params?.channel}
      thread={route?.params?.message}
      threadList
      keyboardVerticalOffset={headerHeight}
      enableMessageGroupingByUser={false}
      forceAlignMessages={"left"}
      onLongPressMessage={(props) => handleMessageLongPress(props)}
      // ReactionList={ReactionList}
      MessageFooter={() => <ChatMessageFooter />}
      deletedMessagesVisibilityType={"never"}
      Reply={() => <Messagereply />}
      AutoCompleteSuggestionList={() => null} // TODO: make autocomplete popup
      MessageHeader={(props) => <MessageHeader {...props} />}
      SendButton={() => <SendButton />}
    >
      <Thread />
      <ChatActionModal
        message={selectedMessage}
        bottomSheetModalRef={bottomSheetModalRef}
      />
    </Channel>
  );
}
