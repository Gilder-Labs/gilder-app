import React, { useState, useEffect, useCallback } from "react";
import { Modal, FlatList, View, StyleSheet, Animated } from "react-native";
import styled from "styled-components/native";
import { getColorType, getFilteredTokens } from "../utils";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import * as Unicons from "@iconscout/react-native-unicons";
import {
  closeWallet,
  disconnectWallet,
  fetchTransactions,
  fetchTokens,
  fetchNfts,
} from "../store/walletSlice";
import * as style from "@dicebear/avatars-jdenticon-sprites";
import { PublicKeyTextCopy } from "./PublicKeyTextCopy";
import { SvgXml } from "react-native-svg";
import { useTheme } from "styled-components";
import { createAvatar } from "@dicebear/avatars";
import { TokenList } from "./TokenList";
import { NftList } from "./NftList";
import numeral from "numeral";
import PagerView, {
  PagerViewOnPageSelectedEvent,
} from "react-native-pager-view";
import { Typography } from "./Typography";
import { TransactionCard } from "../elements";
import { PageControl, SegmentedControl } from "react-native-ui-lib";

interface RealmSelectModalProps {}

export const WalletModal = ({}: RealmSelectModalProps) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const [selectedPage, setSelectedPage] = useState(0);

  const {
    isWalletOpen,
    publicKey,
    tokenPriceData,
    tokens,
    userInfo,
    transactions,
    nfts,
  } = useAppSelector((state) => state.wallet);

  const handleClose = () => {
    dispatch(closeWallet(""));
  };

  const handleDisconnect = () => {
    dispatch(disconnectWallet(""));
  };

  useEffect(() => {
    if (isWalletOpen && publicKey) {
      dispatch(fetchTokens(publicKey));
      dispatch(fetchNfts(publicKey));
      dispatch(fetchTransactions(publicKey));
    }
  }, [isWalletOpen]);

  let jdenticonSvg = createAvatar(style, {
    seed: publicKey,
    // ... and other options
  });
  const color = getColorType(publicKey);

  const getTotalValue = () => {
    let totalValue = 0;
    tokens.forEach((token) => {
      const coinGeckoId = token?.extensions?.coingeckoId;
      totalValue +=
        tokenPriceData[coinGeckoId]?.current_price *
          token.tokenAmount.uiAmount || 0;
    });
    return numeral(totalValue).format("$0,0.00");
  };

  const handlePageScroll = (event: PagerViewOnPageSelectedEvent) => {
    const index = event.nativeEvent.position;
    console.log(index, "PAGE IDX");
    setSelectedPage(index);
  };

  console.log("nfts", nfts);

  const filteredTokens = getFilteredTokens(nfts, tokens);

  return (
    <Modal
      animationType="slide"
      visible={isWalletOpen}
      onRequestClose={handleClose}
      onDismiss={handleClose}
      presentationStyle="pageSheet"
      // transparent={true}
    >
      <Container>
        <Header>
          <CloseIconButton onPress={handleClose} activeOpacity={0.5}>
            <Unicons.UilTimes size="20" color={theme.gray[200]} />
          </CloseIconButton>
          <DisconnectButton onPress={handleDisconnect}>
            <ButtonText>Disconnect</ButtonText>
          </DisconnectButton>
        </Header>
        <IconContainer color={color}>
          {userInfo?.profileImage ? (
            <ProfileImage source={{ uri: userInfo.profileImage }} />
          ) : (
            <SvgXml xml={jdenticonSvg} width="52px" height="52px" />
          )}
        </IconContainer>
        <PublicKeyTextCopy publicKey={publicKey} fontSize={14} />

        <WalletValue>{getTotalValue()}</WalletValue>

        <PageControl
          numOfPages={3}
          currentPage={selectedPage}
          inactiveColor={theme.gray[600]}
          color={theme.gray[200]}
          containerStyle={{ marginBottom: 16 }}
        />

        <PagerView
          style={styles.viewPager}
          initialPage={selectedPage}
          pageMargin={20}
          onPageSelected={handlePageScroll}
        >
          <TokenContainer key="1">
            <Typography size="h3" text="Tokens" bold={true} />
            <TokenList
              tokens={filteredTokens}
              tokenPriceData={tokenPriceData}
              hideUnknownTokens={false}
              isScrollable={true}
            />
          </TokenContainer>
          <TokenContainer key="2">
            <Typography size="h3" text="Nfts" bold={true} />
            <NftList nfts={nfts} isScrollable={true} />
          </TokenContainer>
          <TokenContainer key="3">
            <Typography
              size="h3"
              text="Activity"
              bold={true}
              marginBottom="3"
            />
            {transactions.map((transaction: any) => (
              <TransactionCard
                transaction={transaction}
                key={transaction.signature}
              />
            ))}
          </TokenContainer>
        </PagerView>
      </Container>
    </Modal>
  );
};

const styles = StyleSheet.create({
  viewPager: {
    // flex: 1,
    width: "100%",
    height: "100%",
  },
});

const ProfileImage = styled.Image`
  height: 52px;
  width: 52px;
`;

const Header = styled.View`
  height: 64px;
  background-color: ${(props) => props.theme.gray[800]};
  justify-content: space-between;
  width: 100%;
  align-items: center;
  flex-direction: row;
  padding-left: ${(props) => props.theme.spacing[2]};
  padding-right: ${(props) => props.theme.spacing[2]};
  margin-bottom: ${(props) => props.theme.spacing[3]};
`;

const CloseIconButton = styled.TouchableOpacity`
  width: 48px;
  height: 48px;
  justify-content: center;
  align-items: center;
`;

const EmptyView = styled.View`
  height: 150px;
`;

const Container = styled.View`
  /*  Styles for half size modal */
  /* height: 50%; */
  /* margin-top: auto; */
  height: 100%;
  background: ${(props) => props.theme.gray[900]};
  border-radius: 20px;
  align-items: center;
`;

const DisconnectButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  padding: ${(props) => props.theme.spacing[2]};
`;

const ButtonText = styled.Text`
  color: ${(props) => props.theme.gray[400]};
`;

const IconContainer = styled.View<{ color: string }>`
  /* border-radius: 100px, */
  background: ${(props: any) => props.theme[props.color][800]};
  flex-direction: row;
  align-items: center;
  overflow: hidden;
  border: 2px solid ${(props: any) => props.theme.gray[700]};
  border-radius: 100px;
  margin-bottom: ${(props) => props.theme.spacing[2]};
`;

const TokenContainer = styled.View`
  /* width: 100%; */
  margin-bottom: ${(props: any) => props.theme.spacing[3]};
  border-radius: 4px;
  padding: ${(props: any) => props.theme.spacing[4]};
  flex-direction: column;
  background: ${(props: any) => props.theme.gray[800]};
  /* height: 100%; */
`;

const WalletValue = styled.Text`
  color: ${(props: any) => props.theme.gray[100]}
  font-weight: bold;
  font-size: 32px;
  margin-top: ${(props: any) => props.theme.spacing[3]};
  margin-bottom: ${(props: any) => props.theme.spacing[3]};
`;
