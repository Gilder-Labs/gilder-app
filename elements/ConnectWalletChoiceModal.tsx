import styled from "styled-components/native";
import {
  Typography,
  ConnectWeb3AuthButton,
  ConnectPhantomButton,
  ConnectSolanaWalletAdapter,
} from "../components";
import { useTheme } from "styled-components";
import { useAppDispatch, useAppSelector } from "../hooks/redux";

export const ConnectWalletChoiceModal = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  return (
    <ModalContainer>
      <Container>
        <FloatingBarContainer>
          <FloatingBar />
        </FloatingBarContainer>
        <Typography
          text="Connect Wallet"
          marginTop="5"
          marginBottom="0"
          size="h4"
          bold={true}
        />
        <Row>
          <ConnectWeb3AuthButton />
          <ConnectPhantomButton />
          <ConnectSolanaWalletAdapter />
        </Row>
      </Container>
    </ModalContainer>
  );
};

const ModalContainer = styled.View`
  background: transparent;
  flex: 1;
  height: 100%;
  justify-content: flex-end;
`;

const Container = styled.View`
  position: relative;
  background: ${(props) => props.theme.gray[800]};
  height: 50%;

  align-items: center;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: ${(props) => props.theme.spacing[4]};
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
