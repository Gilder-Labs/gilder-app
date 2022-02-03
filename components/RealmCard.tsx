import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { SvgUri } from "react-native-svg";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { fetchRealm } from "../store/realmSlice";
import { RealmIcon } from ".";

interface RealmCardProps {
  realmId: string;
}

export const RealmCard = ({ realmId }: RealmCardProps) => {
  const { realmsData, realmWatchlist } = useAppSelector(
    (state) => state.realms
  );
  const dispatch = useAppDispatch();

  const handleRealmClick = () => {
    // dispatch(fetchRealm(realmId));
    console.log("realm", realmId);
  };

  return (
    <ContainerButton
      onPress={handleRealmClick}
      key={realmId}
      activeOpacity={0.4}
    >
      <RealmIcon realmId={realmId} />
      <RealmName>{realmsData[realmId].name}</RealmName>
    </ContainerButton>
  );
};

const ContainerButton = styled.TouchableOpacity`
  height: 140px;
  width: 45%;
  margin-bottom: ${(props: any) => props.theme.spacing[3]};
  border-radius: 4px;
  background: ${(props: any) => props.theme.gray[600]};
`;

const RealmName = styled.Text``;
