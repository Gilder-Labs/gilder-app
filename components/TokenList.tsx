import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import numeral from "numeral";
import { TokenCard } from "./TokenCard";

interface TokenCardProps {
  tokens: Array<any>;
  tokenPriceData: any;
  hideUnknownTokens?: boolean;
}

export const TokenList = ({
  tokens,
  tokenPriceData,
  hideUnknownTokens = false,
}: TokenCardProps) => {
  return (
    <Container>
      {tokens.map((token) => (
        <TokenCard
          token={token}
          key={token.mint + token.vaultId}
          tokenPriceData={tokenPriceData}
          hideUnknownTokens={hideUnknownTokens}
        />
      ))}
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
`;
