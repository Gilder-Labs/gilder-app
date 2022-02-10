import React from "react";
import styled from "styled-components/native";

interface LoadingProps {}

export const Loading = ({}: LoadingProps) => {
  return <Container></Container>;
};

const Container = styled.View`
  background: red;
`;
