import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { toggleRealmInWatchlist } from "../store/realmSlice";
import { RealmIcon } from "./RealmIcon";

interface RealmCardProps {
  realmId: string;
  onClick: any;
}

export const RealmCard = ({ realmId, onClick }: RealmCardProps) => {
  const { realmsData, realmWatchlist } = useAppSelector(
    (state) => state.realms
  );
  const dispatch = useAppDispatch();

  const handleRealmClick = () => {
    dispatch(toggleRealmInWatchlist(realmId));
    // onClick();
  };

  const realmInfo = realmsData[realmId];
  const isSelected = realmWatchlist.includes(realmId);

  return (
    <ContainerButton
      onPress={handleRealmClick}
      key={realmId}
      activeOpacity={0.4}
      isSelected={isSelected}
    >
      <Container>
        <RealmIcon realmId={realmId} />
        <RealmName>{realmInfo.displayName || realmInfo.symbol}</RealmName>
      </Container>
    </ContainerButton>
  );
};

const ContainerButton = styled.TouchableOpacity<{ isSelected: boolean }>`
  height: 140px;
  flex: 1;
  margin-bottom: ${(props: any) => props.theme.spacing[3]};
  margin-left: ${(props: any) => props.theme.spacing[2]};
  margin-right: ${(props: any) => props.theme.spacing[2]};
  border-radius: 4px;
  background: ${(props: any) => props.theme.gray[800]};
  padding-left: ${(props: any) => props.theme.spacing[3]};
  padding-right: ${(props: any) => props.theme.spacing[3]};
  border: ${(props: any) =>
    props.isSelected
      ? `2px solid  ${props.theme.primary[400]}`
      : "2px solid transparent"};
`;

const RealmName = styled.Text`
  margin-top: ${(props: any) => props.theme.spacing[3]}
  color: ${(props: any) => props.theme.gray[100]};
  font-size: 16px;
  font-weight: bold;
  text-align: center;
`;

const Container = styled.View`
  justify-content: center;
  align-items: center;
  height: 140px;
`;
