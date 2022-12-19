import { RootTabScreenProps } from "../types";
import { useEffect, useState } from "react";
import styled from "styled-components/native";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { fetchRealmActivity } from "../store/activitySlice";
import { useTheme } from "styled-components";
import { Typography } from "../components";
import { PostCardList } from "../elements/PostCardList";

// TWO ways to do this.
// Each separator, check if previous item is the same day
// if not, render day

// second
// update data to be in format for sectionlist component

export default function HomeScreen({ navigation }: RootTabScreenProps<"Home">) {
  const { selectedRealm } = useAppSelector((state) => state.realms);
  const theme = useTheme();
  const dispatch = useAppDispatch();

  return (
    <Container>
      <Typography text="Home" />
      <PostCardList />
    </Container>
  );
}

const Container = styled.View`
  background-color: ${(props) => props.theme.gray[900]};
  flex: 1;
`;
