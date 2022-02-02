import { Text, TextProps } from "./Themed";
import styled from "styled-components/native";

interface TokenCardProps {
  name: string;
}

export const TokenCard = ({ name }: TokenCardProps) => {
  return <Text>{name}</Text>;
};
