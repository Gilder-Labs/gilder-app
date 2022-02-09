import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { View } from "react-native";
import { Linking } from "react-native";
import { format } from "date-fns";
import { useTheme } from "styled-components";
import * as Unicons from "@iconscout/react-native-unicons";
import { GovernanceInstruction } from "@solana/spl-governance";
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
    const successStatus = "Ok" in activity.status;
    const errorStatus = "Err" in activity.status;
    let ic;

    // TODO: render as switch statement for different governance instructions
    if (successStatus) {
      return (
        <IconContainer type="success">
          <Unicons.UilCheck size="24" color={theme.success[400]} />
        </IconContainer>
      );
    }

    if (errorStatus) {
      return (
        <IconContainer type="error">
          <Unicons.UilExclamation size="28" color={theme.error[400]} />
        </IconContainer>
      );
    }

    // switch (expr) {
    //   case successStatus:
    //     console.log('Oranges are $0.59 a pound.');
    //     break;
    //   case errorStatus:
    //     console.log('Mangoes and papayas are $2.79 a pound.');
    //     // expected output: "Mangoes and papayas are $2.79 a pound."
    //     break;
    //   default:
    //     console.log(`Sorry, we are out.`);
    // }

    return <View />;
  };

  return (
    <Container>
      {renderActivityIcon()}
      <TextContainer>
        {instructionLogs && instructionLogs[0] ? (
          <ErrorText>{instructionLogs[0]}</ErrorText>
        ) : null}
        {errorLog ? <ErrorText>{errorLog}.</ErrorText> : null}
        <ActivityDate>{transactionDate}</ActivityDate>
        <SignatureText>
          {`${signature.slice(0, 4)}...${signature.slice(-4)}`}
        </SignatureText>
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
  color: ${(props: any) => props.theme.gray[300]};
  font-size: 16px;
  font-weight: bold;
  text-align: left;
  margin-top: ${(props: any) => props.theme.spacing[1]};
`;

const ActivityDate = styled.Text`
  color: ${(props: any) => props.theme.gray[400]};
  font-size: 12px;
  font-weight: bold;
  text-align: left;
`;

const ErrorText = styled.Text`
  color: ${(props: any) => props.theme.gray[100]};
  font-size: 14px;
  line-height: 20px;
  margin-bottom: ${(props: any) => props.theme.spacing[2]};
  font-weight: bold;
  text-align: left;
`;

const IconButton = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 100px;
  background: ${(props: any) => props.theme.gray[700]};
`;

const TextContainer = styled.View`
  flex: 1;
`;

const IconContainer = styled.View<{ type: "success" | "error" }>`
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
    props.type === "success"
      ? props.theme.success[400]
      : props.theme.error[400]}44;
`;
