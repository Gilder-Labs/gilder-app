import { Text, View, Platform } from "../components/Themed";
import { RootStackScreenProps } from "../types";
import styled from "styled-components/native";
import { useState, useRef, useEffect } from "react";
import { Button, Typography, RealmIcon } from "../components";
import { Switch } from "react-native-ui-lib";
import { useTheme } from "styled-components";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
export default function RealmSettingsScreen({
  navigation,
}: RootStackScreenProps<"RealmSettings">) {
  const [notifyOnCreate, setNotifyOnCreate] = useState(false);
  const [notifyOnCreate2, setNotifyOnCreate2] = useState(false);

  const theme = useTheme();
  const dispatch = useAppDispatch();

  const { selectedRealm } = useAppSelector((state) => state.realms);

  return (
    <Container>
      <HeaderRow>
        <IconContainer size={64}>
          <RealmIcon size={64} realmId={selectedRealm.pubKey} />
        </IconContainer>
        <Typography
          bold={true}
          size="h3"
          shade="300"
          text={selectedRealm.name}
          marginBottom="2"
        />
      </HeaderRow>
      <Divider />
      <Typography
        bold={true}
        size="h4"
        shade="100"
        text={"Notifications"}
        marginBottom="4"
      />
      <Typography
        size="subtitle"
        shade="400"
        bold={true}
        text={"Proposals"}
        marginBottom="2"
      />
      <Row>
        <Typography size="body" bold shade="300" text={"On Create"} />
        <Switch
          value={notifyOnCreate}
          onColor={theme.secondary[800]}
          offColor={theme.gray[700]}
          height={32}
          thumbSize={28}
          width={60}
          thumbColor={notifyOnCreate2 ? theme.gray[500] : theme.gray[300]}
          onValueChange={() => setNotifyOnCreate(!notifyOnCreate)}
        />
      </Row>
      <Row>
        <Typography size="body" bold shade="300" text={"On Finalize"} />
        <Switch
          value={notifyOnCreate2}
          onColor={theme.secondary[800]}
          offColor={theme.gray[700]}
          height={32}
          thumbSize={28}
          width={60}
          thumbColor={theme.gray[300]}
          onValueChange={() => setNotifyOnCreate2(!notifyOnCreate2)}
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
