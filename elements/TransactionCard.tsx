import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { View } from "react-native";
import { Linking } from "react-native";
import { format } from "date-fns";
import { useTheme } from "styled-components";
import * as Unicons from "@iconscout/react-native-unicons";
import { InstructionToText } from "../utils/cleanData";
import { Typography } from "../components";
import { abbreviatePublicKey } from "../utils";
/*
  <who made transaction> <type> <type of instruction> in <what governance> <date>

*/

// Looks super promising for api fetchings
// https://github.com/gootools/glasseater

interface TransactionCardProps {
  transaction: any;
}

export const TransactionCard = ({ transaction }: TransactionCardProps) => {
  const theme = useTheme();
  const { signature, blockTime } = transaction;

  const transactionDate = blockTime
    ? format(blockTime * 1000, "LLL d, yyyy - p")
    : "";

  // super wonky way to get context till I figure out how to get more details

  const handleTransactionClick = () => {
    Linking.openURL(`https://solscan.io/tx/${signature}`);
  };

  return (
    <Container>
      <IconContainer color={theme.gray[600]}>
        <Unicons.UilInfo size="22" color={theme.gray[400]} />
      </IconContainer>
      <TextContainer>
        <TitleContainer>
          <Typography text={abbreviatePublicKey(signature)} />
          <SignatureText>{abbreviatePublicKey(signature)}</SignatureText>
        </TitleContainer>
        <ActivityDate>{transactionDate}</ActivityDate>
      </TextContainer>
      <IconButton onPress={handleTransactionClick} activeOpacity={0.5}>
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
  background: ${(props: any) => props.theme.gray[900]};
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

const IconContainer = styled.View<{ color: string }>`
  flex: 1;
  justify-content: center;
  align-items: center;
  width: 40px;
  max-width: 40px;
  height: 40px;
  max-height: 40px;
  border-radius: 100px;
  margin-right: ${(props: any) => props.theme.spacing[3]};
  background: ${(props: any) => props.theme.gray[800]};
`;

const TitleContainer = styled.View`
  margin-bottom: ${(props: any) => props.theme.spacing[3]};
`;
