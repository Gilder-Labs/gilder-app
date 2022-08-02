import React, { useState, useEffect } from "react";
import { StyleSheet, Platform } from "react-native";
import styled from "styled-components/native";
import { getColorType, getFilteredTokens } from "../utils";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
  disconnectWallet,
  fetchTransactions,
  fetchTokens,
} from "../store/walletSlice";
import { setShowToast } from "../store/utilitySlice";
import { AnimatedImage } from "react-native-ui-lib";

import { PublicKeyTextCopy } from "./PublicKeyTextCopy";
import { useTheme } from "styled-components";
import { TokenList } from "./TokenList";
import { NftList } from "./NftList";
import numeral from "numeral";
import PagerView, {
  PagerViewOnPageSelectedEvent,
} from "react-native-pager-view";
import { Typography } from "./Typography";
import { TransactionList } from "../elements";
import { PageControl } from "react-native-ui-lib";
import * as Haptics from "expo-haptics";
import { useNavigation } from "@react-navigation/native";
import { useCardinalIdentity } from "../hooks/useCardinaldentity";

import { Incubator } from "react-native-ui-lib";
const { Toast } = Incubator;
import { useQuery, gql } from "@apollo/client";

interface RealmSelectModalProps {}

const GET_WALLET_NFTS = gql`
  query nfts($owners: [PublicKey!]) {
    nfts(owners: $owners, limit: 10000, offset: 0) {
      name
      mintAddress
      address
      image
      updateAuthorityAddress
      collection {
        creators {
          verified
          address
        }
        mintAddress
      }
    }
  }
`;

export const WalletModal = ({}: RealmSelectModalProps) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const [selectedPage, setSelectedPage] = useState(0);
  const navigation = useNavigation();

  const { publicKey, tokenPriceData, tokens, userInfo, transactions } =
    useAppSelector((state) => state.wallet);
  const { loading, error, data } = useQuery(GET_WALLET_NFTS, {
    variables: { owners: [publicKey] },
  });
  const { isShowingToast } = useAppSelector((state) => state.utility);
  const [twitterURL, twitterHandle] = useCardinalIdentity(publicKey);

  const handleDisconnect = () => {
    navigation.pop(1);
    dispatch(disconnectWallet());
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  };

  useEffect(() => {
    if (publicKey) {
      dispatch(fetchTokens(publicKey));
      dispatch(fetchTransactions(publicKey));
    }
  }, []);

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

  const handleDismiss = () => {
    dispatch(setShowToast(false));
  };

  const handlePageScroll = (event: PagerViewOnPageSelectedEvent) => {
    const index = event.nativeEvent.position;
    setSelectedPage(index);
  };

  const nfts = data?.nfts ? data?.nfts : [];

  const filteredTokens = getFilteredTokens(data?.nfts, tokens);

  return (
    <>
      <Container>
        {Platform.OS === "ios" && (
          <FloatingBarContainer>
            <FloatingBar />
          </FloatingBarContainer>
        )}

        <Header>
          <DisconnectButton onPress={handleDisconnect}>
            <ButtonText>Disconnect</ButtonText>
          </DisconnectButton>
        </Header>
        <IconContainer color={color}>
          <AnimatedImage
            style={{
              width: 52,
              height: 52,
              overflow: "hidden",
            }}
            source={{
              uri: twitterURL ? twitterURL : userInfo?.profileImage,
            }}
          />
        </IconContainer>
        <PublicKeyTextCopy publicKey={publicKey} fontSize={14} />

        <WalletValue>{getTotalValue()}</WalletValue>

        <PageControl
          numOfPages={3}
          currentPage={selectedPage}
          inactiveColor={theme.gray[600]}
          color={theme.gray[200]}
          containerStyle={{ marginBottom: 16 }}
          enlargeActive={true}
        />

        <PagerView
          style={styles.viewPager}
          initialPage={selectedPage}
          pageMargin={20}
          onPageSelected={handlePageScroll}
        >
          <TokenContainer key="1">
            <Typography
              size="h3"
              text="Tokens"
              bold={true}
              marginLeft="4"
              marginTop="4"
            />
            <TokenList
              tokens={filteredTokens}
              tokenPriceData={tokenPriceData}
              hideUnknownTokens={true}
              isScrollable={true}
              walletId={publicKey}
              hideLowNumberTokens={true}
              addSpacing={true}
            />
          </TokenContainer>
          <TokenContainer key="2">
            <Typography
              size="h3"
              text="Nfts"
              bold={true}
              marginLeft="4"
              marginTop="4"
            />
            <NftList
              nfts={nfts}
              isScrollable={true}
              addSpacing={true}
              walletId={publicKey}
            />
          </TokenContainer>
          <TokenContainer key="3">
            <Typography
              size="h3"
              text="Activity"
              bold={true}
              marginBottom="3"
              marginLeft="4"
              marginTop="4"
            />
            <TransactionList />
          </TokenContainer>
        </PagerView>
      </Container>
      <Toast
        visible={isShowingToast}
        position={"bottom"}
        preset="success"
        message="Public key copied."
        onDismiss={handleDismiss}
        autoDismiss={1000}
        backgroundColor={theme.gray[1000]}
        zIndex={10000}
        containerStyle={{
          width: 240,
          marginLeft: "auto",
          marginRight: "auto",
        }}
        messageStyle={{
          color: theme.gray[400],
        }}
        elevation={0}
        centerMessage={true}
      />
    </>
  );
};

const styles = StyleSheet.create({
  viewPager: {
    // flex: 1,
    width: "100%",
    height: "100%",
  },
});

const Header = styled.View`
  height: 64px;
  background-color: ${(props) => props.theme.gray[900]};
  justify-content: flex-end;
  width: 100%;
  align-items: center;
  flex-direction: row;
  padding-left: ${(props) => props.theme.spacing[2]};
  padding-right: ${(props) => props.theme.spacing[2]};
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
  z-index: 10;
  padding: ${(props) => props.theme.spacing[2]};
  background: ${(props) => props.theme.gray[1000]};
`;

const ButtonText = styled.Text`
  color: ${(props) => props.theme.gray[400]};
`;

const IconContainer = styled.View<{ color: string }>`
  /* border-radius: 100px, */
  background: ${(props: any) => props.theme.gray[800]};
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
  flex-direction: column;
  background: ${(props: any) => props.theme.gray[800]};
  padding-bottom: 240px;
  flex: 1;
  height: 100%;
`;

const WalletValue = styled.Text`
  color: ${(props: any) => props.theme.gray[100]}
  font-weight: bold;
  font-size: 32px;
  margin-top: ${(props: any) => props.theme.spacing[3]};
  margin-bottom: ${(props: any) => props.theme.spacing[3]};
`;

const FloatingBarContainer = styled.View`
  position: absolute;

  width: 100%;
  padding-top: ${(props: any) => props.theme.spacing[2]};
  top: 0;
  left: 0;
  z-index: 100;

  justify-content: center;
  align-items: center;
`;

const FloatingBar = styled.View`
  height: 4px;
  width: 40px;
  z-index: 100;
  background: #ffffff88;
  top: 0;
  border-radius: 8px;
`;
