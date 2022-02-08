import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import numeral from "numeral";
import { TokenCard } from "./TokenCard";

interface TokenCardProps {
  tokens: Array<any>;
}

export const TokenList = ({ tokens }: TokenCardProps) => {
  return (
    <Container>
      {tokens.map((token) => (
        <TokenCard token={token} key={token.mint + token.vaultId} />
      ))}
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
`;
