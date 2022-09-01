import React from "react";
import { MessageFooterProps } from "stream-chat-expo";
import { Typography, RealmIcon } from "../../components";
import { useTheme } from "styled-components";
import styled from "styled-components/native";
import { abbreviatePublicKey } from "../../utils";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { formatVoteWeight } from "../../utils";
import { useNavigation } from "@react-navigation/native";

export const MessageHeader = (props: MessageFooterProps) => {
  const theme = useTheme();
  const { membersMap, delegateMap, isLoadingMembers } = useAppSelector(
    (state) => state.members
  );
  const navigation = useNavigation();

  const { selectedRealm } = useAppSelector((state) => state.realms);

  const getMemberTokens = () => {
    const message = props.message;
    const walletId = message?.user?.id || "";
    if (membersMap?.[walletId]) {
      return formatVoteWeight(
        membersMap?.[walletId]?.communityDepositAmount,
        selectedRealm?.communityMintDecimals || 0,
        "0.0a"
      );
    } else if (delegateMap?.[walletId]?.communityMembers) {
      return formatVoteWeight(
        delegateMap?.[walletId]?.communityMembers?.[0]?.communityDepositAmount,
        selectedRealm?.communityMintDecimals || 0,
        "0.0a"
      );
    }

    return "";
  };

  const handleMemberSelect = () => {
    let memberWalletId = props?.message?.user?.id;

    // if not an actual member, but delegate, lets take the user to the delegates page
    if (!membersMap?.[memberWalletId]) {
      const delegate = delegateMap?.[memberWalletId];
      memberWalletId = delegate.communityMembers.length
        ? delegate.communityMembers[0].walletId
        : delegate.councilMembers[0].walletId;
    }

    //@ts-ignore
    navigation.push("MemberDetails", {
      walletId: memberWalletId,
    });
  };

  return (
    <MessageHeaderContainer onPress={() => handleMemberSelect()}>
      <Typography
        text={props?.message?.user?.name || ""}
        size="subtitle"
        color="gray"
        shade="200"
        maxLength={16}
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

const MessageHeaderContainer = styled.TouchableOpacity`
  flex-direction: row;
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  margin-top: -4px;
`;
