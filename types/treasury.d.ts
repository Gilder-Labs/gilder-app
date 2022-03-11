interface Token {
  mint: string;
  owner: string;
  tokenAmount: {
    amount: string;
    decimals: number;
    uiAmount: number;
    uiAmountString: string;
  };
  vaultId: string;
}
