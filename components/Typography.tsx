import React, { useEffect, useState } from "react";
import styled from "styled-components/native";

interface TypographyProps {
  text: string | number;
  size?: "h1" | "h2" | "h3" | "h4" | "body" | "subtitle" | "caption";
  textAlign?: "center" | "left" | "right";
  bold?: boolean;
  shade?:
    | "50"
    | "100"
    | "200"
    | "300"
    | "400"
    | "500"
    | "600"
    | "700"
    | "800"
    | "900";
  color?:
    | "gray"
    | "primary"
    | "secondary"
    | "aqua"
    | "purple"
    | "error"
    | "warning";
  marginBottom?: "0" | "1" | "2" | "3" | "4" | "5";
  marginTop?: "0" | "1" | "2" | "3" | "4" | "5";
  marginRight?: "0" | "1" | "2" | "3" | "4" | "5";
  marginLeft?: "0" | "1" | "2" | "3" | "4" | "5";
  maxLength?: number;
  selectable?: boolean;
  hasTextShadow?: boolean;
}

const sizeMapping = {
  h1: 48,
  h2: 36,
  h3: 28,
  h4: 22,
  body: 16,
  subtitle: 14,
  caption: 12,
};

export const Typography = ({
  text,
  size = "body",
  textAlign = "left",
  bold = false,
  shade = "100",
  color = "gray",
  marginBottom = "1",
  maxLength = 10000,
  selectable = false,
  marginRight = "0",
  marginLeft = "0",
  marginTop = "0",
  hasTextShadow = false,
}: TypographyProps) => {
  const formattedText = () => {
    let strText = text.toString();

    strText =
      strText.length > maxLength
        ? `${strText.slice(0, maxLength)}...`
        : strText;

    return strText;
  };

  return (
    <Text
      textAlign={textAlign}
      size={size}
      bold={bold}
      shade={shade}
      color={color}
      marginBottom={marginBottom}
      selectable={selectable}
      marginRight={marginRight}
      marginLeft={marginLeft}
      hasTextShadow={hasTextShadow}
      marginTop={marginTop}
    >
      {text ? formattedText() : ""}
    </Text>
  );
};

const Text = styled.Text<{
  textAlign: "center" | "left" | "right";
  size: "h1" | "h2" | "h3" | "h4" | "body" | "subtitle" | "caption";
  bold: boolean;
  shade: "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";
  marginBottom: "0" | "1" | "2" | "3" | "4" | "5";
  marginTop: "0" | "1" | "2" | "3" | "4" | "5";
  marginRight: "0" | "1" | "2" | "3" | "4" | "5";
  marginLeft: "0" | "1" | "2" | "3" | "4" | "5";
  color:
    | "gray"
    | "primary"
    | "secondary"
    | "aqua"
    | "purple"
    | "error"
    | "warning";
  hasTextShadow: boolean;
}>`
  flex-direction: row;
  font-size: ${(props) => sizeMapping[props.size]}px;
  line-height: ${(props) => sizeMapping[props.size] * 1.4}px;
  font-weight: ${(props) => (props.bold ? "bold" : "normal")};
  color: ${(props) => props.theme[props.color][props.shade]};
  margin-bottom: ${(props) => props.theme.spacing[props.marginBottom]};
  margin-top: ${(props) => props.theme.spacing[props.marginTop]};
  margin-right: ${(props) => props.theme.spacing[props.marginRight]};
  margin-left: ${(props) => props.theme.spacing[props.marginLeft]};
  text-align: ${(props) => props.textAlign};
  text-shadow: ${(props) =>
    props.hasTextShadow
      ? "0px 1px 4px rgba(0, 0, 0, 0.5);"
      : "0px 1px 2px rgba(0, 0, 0, 0);"};
`;
