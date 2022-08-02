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

export default function RealmSettingsScreen({
  navigation,
}: RootStackScreenProps<"RealmSettings">) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { selectedRealm } = useAppSelector((state) => state.realms);
  const [notifyOnCreate, setNotifyOnCreate] = useState(false);

  const { pushToken, notificationSettings, isLoadingNotifications } =
    useAppSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(
      fetchNotificationSettings({
        pushToken: pushToken,
      })
    );
  }, []);

  useEffect(() => {
    if (notificationSettings && selectedRealm) {
      const isSubscribed = notificationSettings[selectedRealm.pubKey];
      setNotifyOnCreate(isSubscribed);
    }
  }, [notificationSettings]);

  const onCreateChange = (value: boolean) => {
    dispatch(
      subscribeToNotifications({
        pushToken: pushToken,
        realmId: selectedRealm?.pubKey,
        isSubscribing: value,
      })
    );
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    setNotifyOnCreate(value);
  };

  if (!selectedRealm || isLoadingNotifications) {
    return <Loading />;
  }

  return (
    <Container>
      <HeaderRow>
        <IconContainer size={64}>
          <RealmIcon size={64} realmId={selectedRealm?.pubKey || ""} />
        </IconContainer>
        <Typography
          bold={true}
          size="h3"
          shade="300"
          text={selectedRealm?.name || ""}
          marginBottom="2"
        />
      </HeaderRow>
      <Divider />
      <Typography
        bold={true}
        size="h4"
        shade="100"
        text={"Notifications"}
        marginBottom="2"
      />
      <Typography
        size="subtitle"
        shade="400"
        // bold={true}
        text={"Proposals"}
        marginBottom="0"
      />
      <Row>
        <Typography size="body" bold shade="300" text={"On Create"} />
        <Switch
          value={notifyOnCreate}
          onColor={theme.secondary[800]}
          offColor={theme.gray[700]}
          disabledColor={theme.gray[700]}
          height={32}
          thumbSize={28}
          width={60}
          disabled={!pushToken}
          thumbColor={
            !pushToken
              ? theme.gray[800]
              : notifyOnCreate
              ? theme.gray[300]
              : theme.gray[300]
          }
          onValueChange={onCreateChange}
        />
      </Row>
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
