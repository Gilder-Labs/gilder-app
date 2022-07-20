import React, { useRef, useEffect } from "react";
import styled from "styled-components/native";
import { useTheme } from "styled-components";
import LottieView from "lottie-react-native";

interface LoadingProps {
  size?: number;
}

export const Loading = ({ size = 120 }: LoadingProps) => {
  const theme = useTheme();
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    animationRef.current?.play();
  }, []);

  return (
    <Container>
      {/* <Loader size="large" color={theme.gray[400]} /> */}
      <LottieView
        source={require("../assets/lottie/CryptoLoader.json")}
        // autoPlay={true}
        ref={animationRef}
        loop={true}
        style={{ width: size, height: size }}
      />
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  height: 100%;
  background: ${(props) => props.theme.gray[900]};
`;

const Text = styled.Text``;

const Loader = styled.ActivityIndicator``;
