import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { SvgUri } from "react-native-svg";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { Linking } from "react-native";
import { format } from "date-fns";

interface ActivityCardProps {
  signature: string;
  blockTime: number | null | undefined;
}

export const ActivityCard = ({ signature, blockTime }: ActivityCardProps) => {
  const testDate = new Date();

  const transactionDate = blockTime
    ? format(blockTime * 1000, "LLL cc, yyyy")
    : "";
  return (
    <ContainerButton>
      {/* Icon base on status */}
      {/* Status */}
      <ActivityTitle>{transactionDate}</ActivityTitle>
      <ActivityTitle>{`${signature.slice(0, 4)}...${signature.slice(
        -4
      )}`}</ActivityTitle>
      {/* Link to solscan button */}
    </ContainerButton>
  );
};

const ContainerButton = styled.View`
  height: 80px;
  width: 100%%;
  margin-bottom: ${(props: any) => props.theme.spacing[3]};
  border-radius: 4px;
  background: ${(props: any) => props.theme.gray[800]};
  padding-left: ${(props: any) => props.theme.spacing[3]};
  padding-right: ${(props: any) => props.theme.spacing[3]};
`;

const ActivityTitle = styled.Text`
  color: ${(props: any) => props.theme.gray[100]};
  font-size: 16px;
  font-weight: bold;
  text-align: center;
`;

const Container = styled.View`
  justify-content: center;
  align-items: center;
  height: 80px;
`;
