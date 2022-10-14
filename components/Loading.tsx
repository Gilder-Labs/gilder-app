import React, { useRef, useEffect } from "react";
import styled from "styled-components/native";
import { useTheme } from "styled-components";
import LottieView from "lottie-react-native";

interface LoadingProps {
  size?: number;
  minHeight?: boolean;
}

export const Loading = ({ size = 120, minHeight = false }: LoadingProps) => {
  const theme = useTheme();
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    animationRef.current?.play();
  }, []);

  return (
    <Container minHeight={minHeight}>
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

const Container = styled.View<{ minHeight: boolean }>`
  flex: 1;
  justify-content: center;
  align-items: center;
  height: ${(props) => (props.minHeight ? "auto" : "100%")};
  background: ${(props) => props.theme.gray[900]};
`;

const Text = styled.Text``;

const Loader = styled.ActivityIndicator``;
