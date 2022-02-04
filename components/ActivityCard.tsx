import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { Linking } from "react-native";
import { format } from "date-fns";
import { FontAwesome5 as FontAwesome } from "@expo/vector-icons";
import { useTheme } from "styled-components";

interface ActivityCardProps {
  signature: string;
  blockTime: number | null | undefined;
}

export const ActivityCard = ({ signature, blockTime }: ActivityCardProps) => {
  const theme = useTheme();

  const transactionDate = blockTime
    ? format(blockTime * 1000, "LLL cc, yyyy")
    : "";

  const handleActivityClick = () => {
    Linking.openURL(`https://solscan.io/tx/${signature}`);
  };

  return (
    <Container>
      <TextContainer>
        <ActivityTitle>
          {`${signature.slice(0, 4)}...${signature.slice(-4)}`}
        </ActivityTitle>
        <ActivityDate>{transactionDate}</ActivityDate>
      </TextContainer>
      <IconButton onPress={handleActivityClick} activeOpacity={0.5}>
        <FontAwesome
          size={16}
          name="external-link-alt"
          color={theme.gray[400]}
        />
      </IconButton>
    </Container>
  );
};

const Container = styled.View`
  height: 80px;
  width: 100%%;
  margin-bottom: ${(props: any) => props.theme.spacing[3]};
  border-radius: 4px;
  background: ${(props: any) => props.theme.gray[800]};
  padding-left: ${(props: any) => props.theme.spacing[4]};
  padding-right: ${(props: any) => props.theme.spacing[4]};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const ActivityTitle = styled.Text`
  color: ${(props: any) => props.theme.gray[100]};
  font-size: 16px;
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
`;

const TextContainer = styled.View``;
