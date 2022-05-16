import React from "react";
import styled from "styled-components/native";
import { abbreviatePublicKey } from "../utils";
import * as Unicons from "@iconscout/react-native-unicons";
import { useTheme } from "styled-components";
import * as Clipboard from "expo-clipboard";
import { Typography } from "./Typography";
import { useAppDispatch } from "../hooks/redux";
import { setShowToast } from "../store/utilitySlice";

interface PublicKeyTextCopyProps {
  fontSize?: number;
  publicKey: string;
  noPadding?: boolean;
  shade?: "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";
  size?: "h1" | "h2" | "h3" | "h4" | "body" | "subtitle" | "caption";
  hideIcon?: boolean;
  bold?: boolean;
}

export const PublicKeyTextCopy = ({
  fontSize = 16,
  size = "subtitle",
  publicKey,
  noPadding = false,
  shade = "300",
  hideIcon = false,
  bold = false,
}: PublicKeyTextCopyProps) => {
  const theme = useTheme();

  const dispatch = useAppDispatch();

  const copyToClipboard = () => {
    Clipboard.setString(publicKey);
    dispatch(setShowToast(true));
  };

  return (
    <Container
      activeOpacity={0.4}
      onPress={copyToClipboard}
      noPadding={noPadding}
    >
      <Typography
        shade={shade}
        size={size}
        text={abbreviatePublicKey(publicKey)}
        textAlign="left"
        bold={bold}
      ></Typography>
      {!hideIcon && (
        <IconContainer>
          <Unicons.UilCopy size={fontSize + 2} color={theme.gray[400]} />
        </IconContainer>
      )}
    </Container>
  );
};

const Container = styled.TouchableOpacity<{ noPadding: boolean }>`
  justify-content: center;
  align-items: center;
  background: ${(props) => props.theme.gray[900]};
  flex-direction: row;
  background: ${(props) => props.theme.gray[800]};
  padding-top: ${(props) =>
    props.noPadding ? props.theme.spacing[0] : props.theme.spacing[1]};
  padding-bottom: ${(props) =>
    props.noPadding ? props.theme.spacing[0] : props.theme.spacing[1]};
  padding-left: ${(props) =>
    props.noPadding ? props.theme.spacing[0] : props.theme.spacing[2]};
  padding-right: ${(props) =>
    props.noPadding ? props.theme.spacing[0] : props.theme.spacing[2]};
  border-radius: 8px;
`;

const IconContainer = styled.View`
  padding: ${(props) => props.theme.spacing[1]};
  margin-top: -${(props) => props.theme.spacing[1]};
`;
