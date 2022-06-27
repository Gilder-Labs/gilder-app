import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { RealmIcon } from "./RealmIcon";
import * as Haptics from "expo-haptics";
import { toggleRealmInWatchlist } from "../store/realmSlice";
import { subscribeToNotifications } from "../store/notificationSlice";

interface RealmCardProps {
  realm: any;
  onClick: any;
}

export const RealmCard = ({ realm, onClick }: RealmCardProps) => {
  const { realmsData, realmWatchlist } = useAppSelector(
    (state) => state.realms
  );
  const dispatch = useAppDispatch();
  const { pushToken } = useAppSelector((state) => state.notifications);

  const realmInfo = realmsData[realm.pubKey];
  const isSelected = realmWatchlist.includes(realm.pubKey);

  const handleRealmClick = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    dispatch(toggleRealmInWatchlist(realm.realmId));
    if (pushToken) {
      dispatch(
        subscribeToNotifications({
          pushToken: pushToken,
          realmId: realm.realmId,
          isSubscribing: !isSelected,
        })
      );
    }
  };

  return (
    <ContainerButton
      onPress={handleRealmClick}
      key={realm.realmId}
      activeOpacity={0.4}
      isSelected={isSelected}
    >
      <Container>
        <IconContainer>
          <RealmIcon realmId={realm.realmId} />
        </IconContainer>
        <RealmName>{realmInfo?.displayName || realm.name}</RealmName>
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

const IconContainer = styled.View`
  margin-bottom: ${(props: any) => props.theme.spacing[4]};
  border-radius: 100px;
  padding: ${(props: any) => props.theme.spacing[2]};
  background: ${(props: any) => props.theme.gray[900]};
`;
