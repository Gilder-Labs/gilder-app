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
import * as Unicons from "@iconscout/react-native-unicons";

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

  return (
    <ContainerButton
      onPress={handleRealmClick}
      key={realm.realmId}
      activeOpacity={0.4}
      isSelected={isSelected}
    >
      <LinearGradient
        colors={[
          color1 ? color1 : theme.gray[800],
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
          size="body"
          shade="100"
          textAlign="center"
          bold={true}
          marginBottom={"0"}
          hasTextShadow={true}
        />
      </LinearGradient>
      {isSelected && (
        <SelectedContainer>
          <Unicons.UilCheck size="20" color={`${theme.gray[200]}`} />
        </SelectedContainer>
      )}
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
  /* border: ${(props: any) =>
    props.isSelected
      ? `2px solid  ${props.theme.gray[400]}`
      : "2px solid transparent"}; */
`;

const IconContainer = styled.View`
  margin-bottom: ${(props: any) => props.theme.spacing[1]};
  border-radius: 100px;
  padding: ${(props: any) => props.theme.spacing[2]};
  background: ${(props: any) => props.theme.gray[900]};
`;

const SelectedContainer = styled.View`
  background: ${(props: any) => props.theme.gray[600]}88;
  border-radius: 100px;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 8;
  padding: 2px;

  top: 8;
`;
