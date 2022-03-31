import React, { useState } from "react";
import styled from "styled-components/native";
import { abbreviatePublicKey } from "../utils";
import * as Unicons from "@iconscout/react-native-unicons";
import { useTheme } from "styled-components";
import * as Clipboard from "expo-clipboard";
import { Incubator } from "react-native-ui-lib";
const { Toast } = Incubator;

interface PublicKeyTextCopyProps {
  fontSize?: number;
  publicKey: string;
}

export const PublicKeyTextCopy = ({
  fontSize = 16,
  publicKey,
}: PublicKeyTextCopyProps) => {
  const theme = useTheme();
  const [showToast, setShowToast] = useState(false);

  const copyToClipboard = () => {
    Clipboard.setString(publicKey);
    setShowToast(true);
  };

  return (
    <>
      <Container activeOpacity={0.4} onPress={copyToClipboard}>
        <Text fontSize={fontSize}>{abbreviatePublicKey(publicKey)}</Text>
        <Unicons.UilCopy size={fontSize + 2} color={theme.gray[400]} />
      </Container>
      <Toast
        visible={showToast}
        position={"bottom"}
        preset="success"
        message="Public key copied."
        onDismiss={() => setShowToast(false)}
        autoDismiss={1000}
        backgroundColor={theme.gray[1000]}
        zIndex={100}
        containerStyle={{
          // backgroundColor: "red",
          width: 240,
          marginLeft: "auto",
          marginRight: "auto",
        }}
        messageStyle={{
          color: theme.gray[400],
          marginLeft: -8,
        }}
        elevation={0}
        centerMessage={true}
        // showDismiss={showDismiss}
        // action={{label: 'Undo', onPress: () => console.log('undo')}}
      />
    </>
  );
};

const Container = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  background: ${(props) => props.theme.gray[900]};
  flex-direction: row;
  background: ${(props) => props.theme.gray[800]};
  padding: ${(props) => props.theme.spacing[1]};
  padding-left: ${(props) => props.theme.spacing[2]};
  padding-right: ${(props) => props.theme.spacing[2]};

  border-radius: 8px;
`;

const Text = styled.Text<{ fontSize: number }>`
  font-size: ${(props) => props.fontSize}px;
  color: ${(props) => props.theme.gray[300]};
  margin-right: ${(props) => props.theme.spacing[1]};
`;
