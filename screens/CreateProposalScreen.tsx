import { useEffect, useRef, useState } from "react";
import styled from "styled-components/native";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { fetchRealmActivity } from "../store/activitySlice";
import { WebView } from "react-native-webview";
import { PublicKey } from "@solana/web3.js";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faXmark } from "@fortawesome/pro-solid-svg-icons/faXmark";
import { faArrowLeft } from "@fortawesome/pro-solid-svg-icons/faArrowLeft";
import { faArrowRight } from "@fortawesome/pro-solid-svg-icons/faArrowRight";
import { faRotateRight } from "@fortawesome/pro-solid-svg-icons/faRotateRight";
import { Typography } from "../components";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "styled-components";

export default function CreateProposalScreen({ route }: any) {
  const webviewRef = useRef<WebView>();
  const navigation = useNavigation();
  const { walletId } = route?.params;

  const handleOpenBrowser = () => {
    navigation.navigate("WebViewScreen", { walletId });
  };

  return (
    <Container>
      <ProposalCreationButtonOuter>
        <ProposalCreationButton onPress={() => handleOpenBrowser()}>
          <Typography text={"Wallet Browser"} />
        </ProposalCreationButton>
      </ProposalCreationButtonOuter>
      <ProposalCreationButtonOuter>
        <ProposalCreationButton>
          <Typography text={"Swap Tokens"} />
        </ProposalCreationButton>
      </ProposalCreationButtonOuter>
      <ProposalCreationButtonOuter>
        <ProposalCreationButton>
          <Typography text={"More coming soon..."} />
        </ProposalCreationButton>
      </ProposalCreationButtonOuter>
    </Container>
  );
}

const Container = styled.View`
  background-color: ${(props) => props.theme.gray[900]};
  flex: 1;
  flex-direction: row;
  flex-wrap: wrap;
  padding: ${(props) => props.theme.spacing[2]};
`;

const ProposalCreationButton = styled.TouchableOpacity`
  height: 140px;
  border-radius: 10px;
  width: 100%;
  background: ${(props: any) => props.theme.gray[800]};
  justify-content: center;
  align-items: center;
`;

const ProposalCreationButtonOuter = styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 50%;
  padding: ${(props) => props.theme.spacing[2]};
`;
