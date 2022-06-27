import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { RealmIcon } from "./RealmIcon";
import * as Haptics from "expo-haptics";
import { Typography } from "../components";
import { toggleRealmInWatchlist } from "../store/realmSlice";
import { subscribeToNotifications } from "../store/notificationSlice";
import { LinearGradient } from "expo-linear-gradient";
import TransparentImage from "../assets/images/transparent.png";
import { ImageBackground } from "react-native";
import { useTheme } from "styled-components";

interface RealmCardProps {
  realm: any;
}

export const RealmCard = ({ realm }: RealmCardProps) => {
  const { realmsData, realmWatchlist } = useAppSelector(
    (state) => state.realms
  );
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { pushToken } = useAppSelector((state) => state.notifications);

  const realmInfo = realmsData[realm.pubKey];
  const isSelected = realmWatchlist.includes(realm.realmId);

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

  const color1 = realm?.color1;
  const color2 = realm?.color2;

  console.log("isselected", isSelected);
  return (
    <ContainerButton
      onPress={handleRealmClick}
      key={realm.realmId}
      activeOpacity={0.4}
      isSelected={isSelected}
    >
      <LinearGradient
        colors={[
          color1 ? color1 : theme.gray[600],
          color2 ? color2 : theme.gray[800],
        ]}
        style={{
          flex: 1,
          borderRadius: 8,
          alignItems: "center",
          justifyContent: "center",
        }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <IconContainer>
          <RealmIcon realmId={realm.realmId} />
        </IconContainer>
        <Typography
          text={realmInfo?.displayName || realm?.displayName || realm.name}
          marginLeft={"2"}
          size="h4"
          shade="100"
          textAlign="center"
          bold={true}
          marginBottom={"0"}
          hasTextShadow={true}
        />
      </LinearGradient>
    </ContainerButton>
  );
};

const ContainerButton = styled.TouchableOpacity<{ isSelected: boolean }>`
  height: 140px;
  flex: 1;
  margin-bottom: ${(props: any) => props.theme.spacing[3]};
  margin-left: ${(props: any) => props.theme.spacing[2]};
  margin-right: ${(props: any) => props.theme.spacing[2]};
  border-radius: 10px;
  background: ${(props: any) => props.theme.gray[800]};
  border: ${(props: any) =>
    props.isSelected
      ? `2px solid  ${props.theme.gray[400]}`
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
  margin-bottom: ${(props: any) => props.theme.spacing[1]};
  border-radius: 100px;
  padding: ${(props: any) => props.theme.spacing[2]};
  background: ${(props: any) => props.theme.gray[900]};
`;
