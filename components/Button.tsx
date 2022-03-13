import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { Typography } from "./Typography";
// import * as Unicons from "@iconscout/react-native-unicons";

interface ButtonProps {
  title: string;
  size?: "default" | "small";
  onPress: any;
  marginRight?: boolean;
}

export const Button = ({
  title,
  size = "default",
  onPress,
  marginRight = false,
}: ButtonProps) => {
  return (
    <ButtonContainer onPress={onPress} marginRight={marginRight}>
      {/* <Unicons.UilWallet
          size="20"
          color={theme.gray[400]}
          style={{ marginRight: 8 }}
        /> */}
      <Typography text={title} bold={true} />
    </ButtonContainer>
  );
};

const ButtonText = styled.Text`
  color: ${(props) => props.theme.gray[200]};
`;

const ButtonContainer = styled.TouchableOpacity<{ marginRight: boolean }>`
  flex-direction: row;
  height: 48px;
  flex: 1;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  margin-right: ${(props) => (props.marginRight ? props.theme.spacing[2] : 0)};

  background: ${(props) => props.theme.gray[800]};
`;
