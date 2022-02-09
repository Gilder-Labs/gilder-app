import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { View } from "react-native";
import { Linking } from "react-native";
import { format } from "date-fns";
import { useTheme } from "styled-components";
import * as Unicons from "@iconscout/react-native-unicons";
// success: check or check-circle
// error: exclaimation-octagon

interface ActivityCardProps {
  activity: any;
}

export const ActivityCard = ({ activity }: ActivityCardProps) => {
  const theme = useTheme();
  const { signature, blockTime } = activity;

  const transactionDate = blockTime
    ? format(blockTime * 1000, "LLL d, yyyy - p")
    : "";

  const handleActivityClick = () => {
    Linking.openURL(`https://solscan.io/tx/${signature}`);
  };

  const renderActivityIcon = () => {
    const successStatus = "Ok" in activity.status;
    const errorStatus = "Err" in activity.status;

    if (successStatus) {
      return (
        <IconContainer type="success">
          <Unicons.UilCheck size="24" color={theme.success[400]} />
        </IconContainer>
      );
    }

    if (errorStatus) {
      console.log("error activity", activity);
      return (
        <IconContainer type="error">
          <Unicons.UilExclamation size="28" color={theme.error[400]} />
        </IconContainer>
      );
    }

    console.log("unknown activity", activity);

    return <View />;
  };

  return (
    <Container>
      <TextContainer>{renderActivityIcon()}</TextContainer>
      <TextContainer>
        <ActivityTitle>
          {`${signature.slice(0, 4)}...${signature.slice(-4)}`}
        </ActivityTitle>
        <ActivityDate>{transactionDate}</ActivityDate>
      </TextContainer>
      <IconButton onPress={handleActivityClick} activeOpacity={0.5}>
        <Unicons.UilExternalLinkAlt size="20" color={theme.gray[400]} />
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

const IconContainer = styled.View<{ type: "success" | "error" }>`
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 100px;
  background: ${(props: any) =>
    props.type === "success"
      ? props.theme.success[400]
      : props.theme.error[400]}88;
`;
