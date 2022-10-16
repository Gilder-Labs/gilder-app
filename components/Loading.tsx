import React, { useRef, useEffect } from "react";
import styled from "styled-components/native";
import { useTheme } from "styled-components";
import LottieView from "lottie-react-native";

interface LoadingProps {
  size?: number;
  collapseHeight?: boolean;
}

export const Loading = ({
  size = 120,
  collapseHeight = false,
}: LoadingProps) => {
  const theme = useTheme();
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    animationRef.current?.play();
  }, []);

  return (
    <Container collapseHeight={collapseHeight}>
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

const Container = styled.View<{ collapseHeight: boolean }>`
  flex: 1;
  justify-content: center;
  align-items: center;
  height: ${(props) => (props.collapseHeight ? "auto" : "100%")};
  background: ${(props) => props.theme.gray[900]};
`;

const Text = styled.Text``;

const Loader = styled.ActivityIndicator``;
