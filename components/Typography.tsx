import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
// import * as Unicons from "@iconscout/react-native-unicons";

interface TypographyProps {
  text: string;
  size?: "h1" | "h2" | "h3" | "h4" | "body" | "subtitle" | "caption";
  textAlign?: "center" | "left" | "right";
  bold?: boolean;
  shade?: "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";
}

const sizeMapping = {
  h1: "48px",
  h2: "36px",
  h3: "28px",
  h4: "22px",
  body: "16px",
  subtitle: "12px",
  caption: "10px",
};

export const Typography = ({
  text,
  size = "body",
  textAlign = "left",
  bold = false,
  shade = "100",
}: TypographyProps) => {
  return (
    <Text textAlign={textAlign} size={size} bold={bold} shade={shade}>
      {text}
    </Text>
  );
};

const Text = styled.Text<{
  textAlign: "center" | "left" | "right";
  size: "h1" | "h2" | "h3" | "h4" | "body" | "subtitle" | "caption";
  bold: boolean;
  shade: "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";
}>`
  flex-direction: row;
  font-size: ${(props) => sizeMapping[props.size]};
  font-weight: ${(props) => (props.bold ? "bold" : "default")};
  color: ${(props) => props.theme.gray[props.shade]};
`;
