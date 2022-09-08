import React from "react";
import styled from "styled-components/native";
import { abbreviatePublicKey } from "../utils";
import { useTheme } from "styled-components";
import * as Clipboard from "expo-clipboard";
import { Typography } from "./Typography";
import { useAppDispatch } from "../hooks/redux";
import { setShowToast } from "../store/utilitySlice";
import * as Haptics from "expo-haptics";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCopy } from "@fortawesome/pro-regular-svg-icons/faCopy";

interface PublicKeyTextCopyProps {
  fontSize?: number;
  publicKey: string;
  noPadding?: boolean;
  shade?: "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";
  size?: "h1" | "h2" | "h3" | "h4" | "body" | "subtitle" | "caption";
  hideIcon?: boolean;
  bold?: boolean;
  backgroundShade?:
    | "100"
    | "200"
    | "300"
    | "400"
    | "500"
    | "600"
    | "700"
    | "800"
    | "900";
}

export const PublicKeyTextCopy = ({
  fontSize = 16,
  size = "subtitle",
  publicKey,
  noPadding = false,
  shade = "300",
  hideIcon = false,
  bold = false,
  backgroundShade = "800",
}: PublicKeyTextCopyProps) => {
  const theme = useTheme();

  const dispatch = useAppDispatch();

  const copyToClipboard = () => {
    Clipboard.setStringAsync(publicKey);
    dispatch(setShowToast(true));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <Container
      activeOpacity={0.4}
      onPress={copyToClipboard}
      noPadding={noPadding}
      backgroundShade={backgroundShade}
    >
      <Typography
        shade={shade}
        size={size}
        text={abbreviatePublicKey(publicKey)}
        textAlign="left"
        bold={bold}
        marginBottom={"0"}
      ></Typography>
      {!hideIcon && (
        <IconContainer>
          <FontAwesomeIcon
            icon={faCopy}
            size={fontSize}
            color={theme.gray[shade]}
          />
        </IconContainer>
      )}
    </Container>
  );
};

const Container = styled.TouchableOpacity<{
  noPadding: boolean;
  backgroundShade:
    | "100"
    | "200"
    | "300"
    | "400"
    | "500"
    | "600"
    | "700"
    | "800"
    | "900";
}>`
  justify-content: center;
  align-items: center;
  flex-direction: row;
  background: ${(props) => props.theme.gray[props.backgroundShade]};
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
  padding-left: ${(props) => props.theme.spacing[1]};
`;
