import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { TokenList } from "./TokenList";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import numeral from "numeral";
import { abbreviatePublicKey } from "../utils";
import { PublicKeyTextCopy } from "./PublicKeyTextCopy";

interface VaultCardProps {
  vaultId: string;
  tokens: Array<any>;
}

export const VaultCard = ({ vaultId, tokens }: VaultCardProps) => {
  const { tokenPriceData } = useAppSelector((state) => state.treasury);

  const getVaultTotalValue = () => {
    let totalValue = 0;
    tokens.forEach((token) => {
      const coinGeckoId = token?.extensions?.coingeckoId;
      totalValue +=
        tokenPriceData[coinGeckoId]?.current_price *
          token.tokenAmount.uiAmount || 0;
    });
    return numeral(totalValue).format("$0,0");
  };

  return (
    <Container>
      <TitleContainer>
        <PublicKeyTextCopy publicKey={vaultId} fontSize={14} />
        <VaultValue>{getVaultTotalValue()}</VaultValue>
      </TitleContainer>
      <TokenList tokens={tokens} tokenPriceData={tokenPriceData} />
    </Container>
  );
};

const Container = styled.View`
  min-height: 80px;
  width: 100%%;
  margin-bottom: ${(props: any) => props.theme.spacing[3]};
  border-radius: 4px;
  background: ${(props: any) => props.theme.gray[800]};
  padding: ${(props: any) => props.theme.spacing[4]};
  flex-direction: column;
`;

const VaultTitle = styled.Text`
  color: ${(props: any) => props.theme.gray[400]}
  font-weight: bold;
  font-size: 14px;
`;

const VaultValue = styled.Text`
color: ${(props: any) => props.theme.gray[100]}
  font-weight: bold;
  font-size: 24px;
`;

const TitleContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${(props: any) => props.theme.spacing[4]};
`;
