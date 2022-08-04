import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { useTheme } from "styled-components";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { abbreviatePublicKey } from "../utils";
import * as Haptics from "expo-haptics";
import { useWindowDimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faWallet } from "@fortawesome/pro-solid-svg-icons/faWallet";
import { ConnectWalletChoiceModal } from "../elements/ConnectWalletChoiceModal";
import Modal from "react-native-modal";

interface ConnectWalletProps {}

export const ConnectWalletButton = ({}: ConnectWalletProps) => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { publicKey } = useAppSelector((state) => state.wallet);
  const [key, setKey] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const { height, width } = useWindowDimensions();

  useEffect(() => {
    if (publicKey && modalVisible) {
      setModalVisible(false);
      // wait to clear out current modal, then open the wallet one
      const timer = setTimeout(() => {
        navigation.push("WalletModal");
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [publicKey]);

  const handleOpenWallet = () => {
    // dispatch(openWallet(""));
    navigation.push("WalletModal");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleModalOpen = () => {
    setModalVisible(true);
  };

  return (
    <ConnectWalletContainer>
      <ConnectButton onPress={publicKey ? handleOpenWallet : handleModalOpen}>
        <FontAwesomeIcon
          icon={faWallet}
          size={16}
          color={theme?.gray[500]}
          style={{ marginRight: 8 }}
        />
        <WalletConnectText>
          {publicKey ? abbreviatePublicKey(publicKey) : "Connect Wallet"}
        </WalletConnectText>
      </ConnectButton>
      <Modal
        isVisible={modalVisible}
        onSwipeComplete={() => setModalVisible(false)}
        swipeDirection="down"
        deviceWidth={width}
        // coverScreen={true}
        onBackButtonPress={() => setModalVisible(false)}
        onBackdropPress={() => setModalVisible(false)}
        style={{ width: "100%", padding: 0, margin: 0, height: "100%" }}
      >
        <ConnectWalletChoiceModal />
      </Modal>
    </ConnectWalletContainer>
  );
};

const ConnectWalletContainer = styled.View`
  background: ${(props) => props.theme.gray[900]};

  padding: ${(props) => props.theme.spacing[3]};
  padding-bottom: ${(props) => props.theme.spacing[5]};
  border-top-width: 1px;
  border-color: ${(props) => props.theme.gray[900]};
`;

const WalletConnectText = styled.Text`
  color: ${(props) => props.theme.gray[400]};
`;

const ConnectButton = styled.TouchableOpacity`
  flex-direction: row;
  height: 48px;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  margin-bottom: 80px;

  background: ${(props) => props.theme.gray[800]};
`;
