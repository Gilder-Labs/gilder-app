import React from "react";
import styled from "styled-components/native";
import { abbreviatePublicKey } from "../utils";
import * as Unicons from "@iconscout/react-native-unicons";
import { useTheme } from "styled-components";
import * as Clipboard from "expo-clipboard";

interface PublicKeyTextCopyProps {
  fontSize?: number;
  publicKey: string;
}

export const PublicKeyTextCopy = ({
  fontSize = 16,
  publicKey,
}: PublicKeyTextCopyProps) => {
  const theme = useTheme();

  const copyToClipboard = () => {
    Clipboard.setString(publicKey);
  };

  return (
    <Container onPress={copyToClipboard} activeOpacity={0.4}>
      <Text fontSize={fontSize}>{abbreviatePublicKey(publicKey)}</Text>
      <Unicons.UilCopy size="22" color={theme.gray[400]} />
    </Container>
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
