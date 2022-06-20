import { RootStackScreenProps } from "../types";
import styled from "styled-components/native";
import { useState, useRef, useEffect } from "react";
import { Button, Typography, RealmIcon, Loading } from "../components";
import { Switch } from "react-native-ui-lib";
import { useTheme } from "styled-components";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
  fetchNotificationSettings,
  subscribeToNotifications,
} from "../store/notificationSlice";
import * as Haptics from "expo-haptics";
import { TouchableOpacity } from "react-native";

export default function DiscoverDetailsScreen({
  navigation,
}: RootStackScreenProps<"RealmSettings">) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { selectedRealm } = useAppSelector((state) => state.realms);

  return (
    <Container>
      <Typography
        bold={true}
        size="h4"
        shade="100"
        text={"TITLE"}
        marginBottom="4"
      />
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background: ${(props: any) => props.theme.gray[900]};
  padding: ${(props) => props.theme.spacing[3]};
`;

const HeaderRow = styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${(props) => props.theme.spacing[3]};
`;

const Divider = styled.View`
  /* width: 48px; */
  height: 2px;
  max-height: 2px;
  background-color: ${(props) => props.theme.gray[800]};
  margin-bottom: ${(props) => props.theme.spacing[3]};
`;

const IconContainer = styled.View<{
  size: number;
}>`
  height: 64px;
  width: 64px;
  margin-bottom: ${(props: any) => props.theme.spacing[2]};
  border-radius: 100px;
  padding: ${(props: any) => props.theme.spacing[1]};
  background: ${(props: any) => props.theme.gray[800]};
  border: ${(props: any) => "1px solid transparent"};
`;
