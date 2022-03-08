import React, { useState, useEffect } from "react";
import { FlatList } from "react-native";
import styled from "styled-components/native";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { useTheme } from "styled-components";

interface ProposalDetailScreen {
  route: any;
  navigation: any;
}

export const ProposalDetailScreen = ({ route }: ProposalDetailScreen) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { selectedRealm } = useAppSelector((state) => state.realms);
  const { proposalsMap } = useAppSelector((state) => state.proposals);
  const { proposal } = route?.params;

  return (
    <Container>
      <EmptyView> asdfadsf</EmptyView>
    </Container>
  );
};

const Container = styled.View``;

const EmptyView = styled.Text`
  height: 200px;
  background: red;
`;
