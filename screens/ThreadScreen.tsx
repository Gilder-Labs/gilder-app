import { useState } from "react";
import {
  Thread,
  Channel,
  useAttachmentPickerContext,
  MessageTouchableHandlerPayload,
} from "stream-chat-expo"; // Or stream-chat-expo
import { useHeaderHeight } from "@react-navigation/elements";
import { useEffect } from "react";
import { ChatActionModal } from "../elements/chat/ChatActionModal";
import * as Haptics from "expo-haptics";
import { ChatMessageFooter } from "../elements/chat/ChatMessageFooter";
import { Messagereply } from "../elements/chat/MessageReply";
import { MessageHeader } from "../elements/chat/MessageHeader";
import { SendButton } from "../elements/chat/ChatSendButton";

export default function ThreadScreen(props: any) {
  const { route } = props;
  const headerHeight = useHeaderHeight();
  const { setTopInset } = useAttachmentPickerContext();
  const [isVisble, setModalVisible] = useState(false);
  const [selectedMessage, setSelectedMessage] =
    useState<MessageTouchableHandlerPayload | null>(null);

  const handleMessageLongPress = (message: MessageTouchableHandlerPayload) => {
    setSelectedMessage(message);
    setModalVisible(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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
      MessageHeader={(props) => <MessageHeader {...props} />}
      SendButton={() => <SendButton />}
    >
      <ChatActionModal
        isVisible={isVisble}
        setModalVisible={(isVisible) => setModalVisible(isVisible)}
        message={selectedMessage}
        isInThread={true}
      />
      <Thread />
    </Channel>
  );
}
