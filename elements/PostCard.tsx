import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import * as Haptics from "expo-haptics";
import { useTheme } from "styled-components";
import { Typography } from "../components";
import { useNavigation } from "@react-navigation/native";

interface PostCardProps {
  post: {};
}

export const PostCard = ({ post }: PostCardProps) => {
  const theme = useTheme();
  const navigation = useNavigation();

  const handleCardClick = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.push("PostDetails", {
      post: post,
    });
  };

  return (
    <ContainerButton onPress={handleCardClick} activeOpacity={0.4}>
      <Typography text="PostCard" />
    </ContainerButton>
  );
};

const ContainerButton = styled.TouchableOpacity`
  min-height: 140px;
  overflow: hidden;
  background: ${(props: any) => props.theme.gray[800]};
  flex: 1;
`;
