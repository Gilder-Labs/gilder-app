import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { Typography } from "./Typography";
// import * as Unicons from "@iconscout/react-native-unicons";
import { useTheme } from "styled-components";

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
  isLoading?: boolean;
}

export const Button = ({
  title,
  size = "default",
  onPress,
  marginRight = false,
  shade = "800",
  color = "gray",
  isLoading = false,
}: ButtonProps) => {
  const theme = useTheme();
  return (
    <ButtonContainer
      onPress={onPress}
      marginRight={marginRight}
      shade={shade}
      color={color}
    >
      {/* <Unicons.UilWallet
          size="20"
          color={theme.gray[400]}
          style={{ marginRight: 8 }}
        /> */}
      {isLoading ? (
        <Loading color={theme.gray[300]} />
      ) : (
        <Typography text={title} bold={true} />
      )}
    </ButtonContainer>
  );
};

const ButtonText = styled.Text`
  color: ${(props) => props.theme.gray[200]};
`;

const ButtonContainer = styled.TouchableOpacity<{
  marginRight: boolean;
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
  height: 48px;
  flex: 1;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  margin-right: ${(props) => (props.marginRight ? props.theme.spacing[3] : 0)};

  background: ${(props) => props.theme[props.color][props.shade]};
`;

const Loading = styled.ActivityIndicator``;
