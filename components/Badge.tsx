import React, { useEffect, useState } from "react";
import styled from "styled-components/native";

interface BadgeProps {
  title: string;
  type: "success" | "pending" | "error";
}

export const Badge = ({ title, type }: BadgeProps) => {
  return (
    <BadgeFlexContainer>
      <BadgeContainer type={type}>
        <BadgeText type={type}> {title} </BadgeText>
      </BadgeContainer>
    </BadgeFlexContainer>
  );
};

const BadgeFlexContainer = styled.View`
  align-items: flex-start;
  margin-bottom: ${(props: any) => props.theme.spacing[2]};
`;

const BadgeContainer = styled.View<{ type: "success" | "pending" | "error" }>`
  ${(props: any) => {
    if (props.type === "success") {
      return `background:  ${props.theme.success[800]}44`;
    }
    if (props.type === "pending") {
      return `background:  ${props.theme.warning[800]}44`;
    }
    if (props.type === "error") {
      return `background:  ${props.theme.error[800]}44;`;
    }
  }}

${(props: any) => {
  if (props.type === "success") {
    return `border:  ${props.theme.success[400]}`;
  }
  if (props.type === "pending") {
    return `border:  ${props.theme.warning[400]}`;
  }
  if (props.type === "error") {
    return `border:  ${props.theme.error[400]};`;
  }
}}

  border-radius: 8px;
  padding: ${(props: any) => props.theme.spacing[1]}
  align-items: center;
`;

const BadgeText = styled.Text<{ type: "success" | "pending" | "error" }>`
  font-size: 14px;
  ${(props: any) => {
    if (props.type === "success") {
      return `color:  ${props.theme.success[400]}`;
    }
    if (props.type === "pending") {
      return `color:  ${props.theme.warning[400]}`;
    }
    if (props.type === "error") {
      return `color:  ${props.theme.error[400]};`;
    }
  }}
`;
