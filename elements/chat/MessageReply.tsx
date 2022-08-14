import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { Button, Typography } from "../../components";
import styled from "styled-components/native";
import { useMessageContext, Reply } from "stream-chat-expo";

export const Messagereply = () => {
  const { message } = useMessageContext();
  console.log("Message in reply", message);

  return (
    <ReplyContainer>
      <ReplyCurve />
      <ReplySpacing>
        <Reply />
      </ReplySpacing>
    </ReplyContainer>
  );
};

const ReplyContainer = styled.View`
  flex-direction: row;
`;

const ReplyCurve = styled.View`
  border: 2px solid green;
  border-right-width: 0px;
  border-top-width: 0px;
  border-left-color: ${(props) => props.theme.gray[500]};
  border-bottom-color: ${(props) => props.theme.gray[500]};
  margin-right: 4px;
  background: transparent;
  width: 32px;
  height: 14px;
  border-bottom-left-radius: 6;
`;

const ReplySpacing = styled.View`
  /* margin-bottom: ${(props) => props.theme.spacing[2]}; */
`;
