import React from "react";
import styled from "styled-components/native";
import { useTheme } from "styled-components";
interface LoadingProps {}

export const Loading = ({}: LoadingProps) => {
  const theme = useTheme();

  return (
    <Container>
      <Loader size="large" color={theme.gray[400]} />
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Text = styled.Text``;

const Loader = styled.ActivityIndicator`
  color: red;
`;
