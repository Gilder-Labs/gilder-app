import React from "react";
import styled from "styled-components/native";
import { useTheme } from "styled-components";
import Logo from "../assets/images/DarkIcon.png";

interface LoadingProps {}

export const SplashScreen = ({}: LoadingProps) => {
  return (
    <Container>
      <SplashImage source={Logo} />
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: black;
`;

// Figma file width/height
const SplashImage = styled.Image`
  width: 100px;
  height: 100px;
`;
