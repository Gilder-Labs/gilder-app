import React from "react";
import { MessageFooterProps } from "stream-chat-expo";
import { Typography, RealmIcon } from "../../components";
import { useTheme } from "styled-components";
import styled from "styled-components/native";
import { abbreviatePublicKey } from "../../utils";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { formatVoteWeight } from "../../utils";

export const MessageHeader = (props: MessageFooterProps) => {
  const theme = useTheme();
  const { membersMap, delegateMap, isLoadingMembers } = useAppSelector(
    (state) => state.members
  );
  const { publicKey } = useAppSelector((state) => state.wallet);
  const { selectedRealm } = useAppSelector((state) => state.realms);

  const getMemberTokens = () => {
    if (membersMap?.[publicKey]) {
      return formatVoteWeight(
        membersMap?.[publicKey]?.communityDepositAmount,
        selectedRealm?.communityMintDecimals || 0,
        "0.0a"
      );
    } else if (delegateMap?.[publicKey]) {
      return formatVoteWeight(
        delegateMap?.[publicKey]?.communityDepositAmount,
        selectedRealm?.communityMintDecimals || 0,
        "0.0a"
      );
    }

    return "";
  };

  return (
    <MessageHeaderContainer>
      <Typography
        text={props?.message?.user?.name || ""}
        size="subtitle"
        color="gray"
        shade="200"
        bold={true}
        marginRight="1"
        marginBottom="0"
      />
      <Typography
        text={`(${abbreviatePublicKey(props?.message?.user?.id || "", 2)})`}
        size="caption"
        color="gray"
        shade="500"
        bold={true}
        marginRight="2"
        marginBottom="0"
      />
      {!isLoadingMembers && (
        <>
          <RealmIcon realmId={selectedRealm?.pubKey || ""} size={20} />
          <Typography
            text={`${getMemberTokens()}`}
            size="caption"
            color="gray"
            shade="500"
            bold={true}
            marginRight="1"
            marginLeft="1"
            marginBottom="0"
          />
        </>
      )}
      <Typography
        text={`${props?.formattedDate}` || ""}
        size="caption"
        color="gray"
        shade="500"
        bold={true}
        marginRight="1"
        marginLeft="1"
        marginBottom="0"
      />
    </MessageHeaderContainer>
  );
};

const MessageHeaderContainer = styled.View`
  flex-direction: row;
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  margin-top: -4px;
`;
