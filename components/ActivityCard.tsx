import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { View } from "react-native";
import { Linking } from "react-native";
import { format } from "date-fns";
import { useTheme } from "styled-components";
import * as Unicons from "@iconscout/react-native-unicons";
import { InstructionToText } from "../utils/cleanData";
/*
  <who made transaction> <type> <type of instruction> in <what governance> <date>

*/

// Looks super promising for api fetchings
// https://github.com/gootools/glasseater

interface ActivityCardProps {
  activity: any;
}

export const ActivityCard = ({ activity }: ActivityCardProps) => {
  const theme = useTheme();
  const { signature, blockTime, logsParsed } = activity;
  const { errorLog, instructionLogs } = logsParsed;

  const transactionDate = blockTime
    ? format(blockTime * 1000, "LLL d, yyyy - p")
    : "";

  // super wonky way to get context till I figure out how to get more details

  const handleActivityClick = () => {
    Linking.openURL(`https://solscan.io/tx/${signature}`);
  };

  const renderActivityIcon = () => {
    const instruction = instructionLogs[0]; // just take initial instruction for now

    const isSuccessful = "Ok" in activity.status ? true : false;

    switch (instruction) {
      case InstructionToText.CastVote:
        return (
          <IconContainer isSuccessful={isSuccessful} color={theme.success[400]}>
            <Unicons.UilEnvelopeEdit
              size="22"
              color={isSuccessful ? theme.success[400] : theme.error[400]}
            />
          </IconContainer>
        );
      case InstructionToText.FinalizeVote:
        return (
          <IconContainer isSuccessful={isSuccessful} color={theme.success[400]}>
            <Unicons.UilEnvelopeCheck
              size="22"
              color={isSuccessful ? theme.success[400] : theme.error[400]}
            />
          </IconContainer>
        );
      case InstructionToText.RelinquishVote:
        return (
          <IconContainer isSuccessful={isSuccessful} color={theme.success[400]}>
            <Unicons.UilEnvelopeRedo
              size="22"
              color={isSuccessful ? theme.success[400] : theme.error[400]}
            />
          </IconContainer>
        );
      case InstructionToText.PostMessage:
        return (
          <IconContainer
            isSuccessful={isSuccessful}
            color={theme.secondary[400]}
          >
            <Unicons.UilCommentAltLines
              size="20"
              color={isSuccessful ? theme.secondary[400] : theme.error[400]}
            />
          </IconContainer>
        );
      case InstructionToText.CreateProposal:
        return (
          <IconContainer isSuccessful={isSuccessful} color={theme.primary[400]}>
            <Unicons.UilFilePlusAlt
              size="20"
              color={isSuccessful ? theme.primary[400] : theme.error[400]}
            />
          </IconContainer>
        );
      case InstructionToText.SetRealmAuthority:
        return (
          <IconContainer isSuccessful={isSuccessful} color={theme.purple[400]}>
            <Unicons.UilFilePlusAlt
              size="20"
              color={isSuccessful ? theme.purple[400] : theme.error[400]}
            />
          </IconContainer>
        );
      case InstructionToText.DepositGoverningTokens:
        return (
          <IconContainer isSuccessful={isSuccessful} color={theme.aqua[400]}>
            <Unicons.UilMoneyWithdraw
              size="20"
              color={isSuccessful ? theme.aqua[400] : theme.error[400]}
            />
          </IconContainer>
        );
      case InstructionToText.WithdrawGoverningTokens:
        return (
          <IconContainer isSuccessful={isSuccessful} color={theme.aqua[400]}>
            <Unicons.UilMoneyInsert
              size="20"
              color={isSuccessful ? theme.aqua[400] : theme.error[400]}
            />
          </IconContainer>
        );
      default:
        return (
          <IconContainer isSuccessful={isSuccessful} color={theme.success[400]}>
            <Unicons.UilCheck
              size="24"
              color={isSuccessful ? theme.success[400] : theme.error[400]}
            />
          </IconContainer>
        );
    }
  };

  return (
    <Container>
      {renderActivityIcon()}
      <TextContainer>
        <TitleContainer>
          {instructionLogs && instructionLogs[0] ? (
            <ActivityTitle>{instructionLogs[0]}</ActivityTitle>
          ) : null}
          <SignatureText>
            {`${signature.slice(0, 4)}...${signature.slice(-4)}`}
          </SignatureText>
        </TitleContainer>
        {errorLog ? <ErrorText>{errorLog}.</ErrorText> : null}
        <ActivityDate>{transactionDate}</ActivityDate>
      </TextContainer>
      <IconButton onPress={handleActivityClick} activeOpacity={0.5}>
        <Unicons.UilAngleDoubleRight size="28" color={theme.gray[400]} />
      </IconButton>
    </Container>
  );
};

const Container = styled.View`
  /* height: 80px; */
  width: 100%;
  margin-bottom: ${(props: any) => props.theme.spacing[3]};
  border-radius: 4px;
  background: ${(props: any) => props.theme.gray[800]};
  padding-left: ${(props: any) => props.theme.spacing[4]};
  padding-right: ${(props: any) => props.theme.spacing[4]};
  padding-top: ${(props: any) => props.theme.spacing[4]};
  padding-bottom: ${(props: any) => props.theme.spacing[4]};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const SignatureText = styled.Text`
  color: ${(props: any) => props.theme.gray[500]};
  font-size: 12px;
  font-weight: bold;
  text-align: left;
`;

const ActivityDate = styled.Text`
  color: ${(props: any) => props.theme.gray[400]};
  font-size: 12px;
  font-weight: bold;
  text-align: left;
`;

const ActivityTitle = styled.Text`
  color: ${(props: any) => props.theme.gray[100]};
  font-size: 16px;
  margin-bottom: ${(props: any) => props.theme.spacing[1]};
  font-weight: bold;
  text-align: left;
`;

const ErrorText = styled.Text`
  color: ${(props: any) => props.theme.error[400]};
  font-size: 14px;
  line-height: 20px;
  margin-bottom: ${(props: any) => props.theme.spacing[2]};
  text-align: left;
`;

const IconButton = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 100px;
  background: ${(props: any) => props.theme.gray[700]};
  margin-left: ${(props: any) => props.theme.spacing[3]};
`;

const TextContainer = styled.View`
  flex: 1;
`;

const IconContainer = styled.View<{ isSuccessful: boolean; color: string }>`
  flex: 1;
  justify-content: center;
  align-items: center;
  width: 40px;
  max-width: 40px;
  height: 40px;
  max-height: 40px;
  border-radius: 100px;
  margin-right: ${(props: any) => props.theme.spacing[3]};
  background: ${(props: any) =>
    props.isSuccessful ? props.color : props.theme.error[400]}44;
`;

const TitleContainer = styled.View`
  margin-bottom: ${(props: any) => props.theme.spacing[3]};
`;
