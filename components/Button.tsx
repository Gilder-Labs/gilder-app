import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { Typography } from "./Typography";
import { useTheme } from "styled-components";
import { LinearGradient } from "expo-linear-gradient";

interface ButtonProps {
  title: string;
  size?: "default" | "small";
  onPress: any;
  marginRight?: boolean;
  shade?: "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";
  color?:
    | "gray"
    | "primary"
    | "secondary"
    | "aqua"
    | "purple"
    | "error"
    | "warning";
  color2?:
    | "gray"
    | "primary"
    | "secondary"
    | "aqua"
    | "purple"
    | "error"
    | "warning";
  shade2?:
    | "100"
    | "200"
    | "300"
    | "400"
    | "500"
    | "600"
    | "700"
    | "800"
    | "900";
  hasGradient?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
}

export const Button = ({
  title,
  size = "default",
  onPress,
  marginRight = false,
  shade = "800",
  color = "gray",
  shade2 = "800",
  color2 = "gray",
  isLoading = false,
  disabled = false,
  hasGradient = false,
}: ButtonProps) => {
  const theme = useTheme();
  return (
    <ButtonContainer
      onPress={onPress}
      marginRight={marginRight}
      shade={shade}
      color={color}
      disabled={disabled}
    >
      <LinearGradient
        colors={[
          hasGradient ? theme[color][shade] : theme[color][shade],
          hasGradient ? theme[color2][shade2] : theme[color][shade],
        ]}
        style={{
          height: "100%",
          padding: 8,
          borderRadius: 4,
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isLoading ? (
          <Loading color={theme.gray[300]} />
        ) : (
          <Typography text={title} bold={true} marginBottom="0" />
        )}
      </LinearGradient>
    </ButtonContainer>
  );
};

const ButtonContainer = styled.TouchableOpacity<{
  marginRight: boolean;
  disabled: boolean;
  shade: "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";
  color:
    | "gray"
    | "primary"
    | "secondary"
    | "aqua"
    | "purple"
    | "error"
    | "warning";
}>`
  flex-direction: row;
  min-height: 48px;
  max-height: 48px;
  flex: 1;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  margin-right: ${(props) => (props.marginRight ? props.theme.spacing[3] : 0)};

  background: ${(props) => props.theme[props.color][props.shade]};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
`;

const Loading = styled.ActivityIndicator``;
