import React from "react";
import { TouchableOpacity } from "react-native";
import { useMessageInputContext } from "stream-chat-expo";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPaperPlaneTop } from "@fortawesome/pro-solid-svg-icons/faPaperPlaneTop";
import { useTheme } from "styled-components";
import styled from "styled-components/native";

export const SendButton = () => {
  const { fileUploads, imageUploads, sendMessage, text } =
    useMessageInputContext();
  const isMessageEmpty = !text && !imageUploads.length && !fileUploads.length;
  const theme = useTheme();

  return (
    <SendContainer disabled={isMessageEmpty} onPress={sendMessage}>
      <FontAwesomeIcon
        icon={faPaperPlaneTop}
        size={16}
        style={{ marginLeft: 2 }}
        color={!isMessageEmpty ? theme.gray[300] : theme.gray[400]}
      />
    </SendContainer>
  );
};

const SendContainer = styled.TouchableOpacity`
  border-radius: 100;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background: ${(props: any) =>
    props.disabled ? props.theme.gray[800] : props.theme.secondary[700]};
`;
