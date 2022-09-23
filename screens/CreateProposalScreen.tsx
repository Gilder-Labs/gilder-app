import { useEffect, useRef, useState } from "react";
import styled from "styled-components/native";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { fetchRealmActivity } from "../store/activitySlice";
import { WebView } from "react-native-webview";
import { PublicKey } from "@solana/web3.js";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faXmark } from "@fortawesome/pro-solid-svg-icons/faXmark";
import { faArrowLeft } from "@fortawesome/pro-solid-svg-icons/faArrowLeft";
import { faMoneyBillTransfer } from "@fortawesome/pro-regular-svg-icons/faMoneyBillTransfer";
import { faWallet } from "@fortawesome/pro-regular-svg-icons/faWallet";

import { faArrowRight } from "@fortawesome/pro-solid-svg-icons/faArrowRight";
import { faMagnifyingGlass } from "@fortawesome/pro-regular-svg-icons/faMagnifyingGlass";
import { PublicKeyTextCopy, Typography } from "../components";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "styled-components";

import { parseURL } from "@solana/pay";

export default function CreateProposalScreen({ route }: any) {
  const navigation = useNavigation();
  const { walletId } = route?.params;
  const [url, setUrl] = useState("");
  const theme = useTheme();

  const handleOpenBrowser = (webUrl: string) => {
    navigation.navigate("WebViewScreen", {
      walletId,
      url: webUrl,
    });
  };

  // const testUrl =
  //   "solana:mvines9iiHiQTysrwkJjGf2gb9Ex9jXJX8ns3qwf2kN?amount=0.01&reference=82ZJ7nbGpixjeDCmEhUcmwXYfvurzAgGdtSMuHnUgyny&label=Michael&message=Thanks%20for%20all%20the%20fish&memo=OrderId5678";
  // const data = parseURL(url);
  // console.log("data");

  return (
    <Container>
      <SpacedRow>
        <Typography
          text="Browser"
          size="h3"
          bold={true}
          marginLeft="2"
          marginRight="2"
        />
        <Row>
          <FontAwesomeIcon
            icon={faWallet}
            size={14}
            color={theme.gray[500]}
            style={{ marginRight: 4 }}
          />
          <PublicKeyTextCopy
            noPadding={true}
            publicKey={walletId}
            hideIcon={true}
            backgroundShade="900"
            shade="500"
          />
        </Row>
      </SpacedRow>
      <SearchRow>
        <SearchBarContainer>
          <SearchBar
            placeholder="Explore solana sites as wallet"
            onChangeText={(text: string) => setUrl(text)}
            placeholderTextColor={theme.gray[400]}
            selectionColor={theme.gray[200]}
            autoCompleteType={"off"}
            autoCapitalize={"none"}
            autoCorrect={false}
            value={url}
          />
          <IconContainer disabled={!url} onPress={() => setUrl("")}>
            {url ? (
              <FontAwesomeIcon
                icon={faXmark}
                size={16}
                color={theme.gray[300]}
              />
            ) : (
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                size={16}
                color={theme.gray[300]}
              />
            )}
          </IconContainer>
        </SearchBarContainer>
        <SearchButton onPress={() => handleOpenBrowser(url)} disabled={!url}>
          <FontAwesomeIcon
            icon={faArrowRight}
            size={18}
            color={!url ? theme.gray[400] : theme.gray[100]}
          />
        </SearchButton>
      </SearchRow>

      <Typography
        text="Staking"
        size="body"
        bold={true}
        marginLeft="2"
        shade="400"
        marginBottom="0"
      />
      <Row>
        <ProposalCreationButtonOuter>
          <ProposalCreationButton
            onPress={() =>
              handleOpenBrowser("https://marinade.finance/app/staking/")
            }
          >
            <DappIcon
              source={{
                uri: "https://solana.com/_next/image?url=%2Fapi%2Fprojectimg%2Fckwgwh6su28617eysxuaubvt93%3Ftype%3DLOGO&w=1920&q=75",
              }}
            />

            <Typography
              text={"Marinade"}
              marginBottom="0"
              size="subtitle"
              shade="100"
            />
          </ProposalCreationButton>
        </ProposalCreationButtonOuter>
        {/* <ProposalCreationButtonOuter>
          <ProposalCreationButton
            onPress={() =>
              handleOpenBrowser("https://www.socean.fi/en/app/stake/")
            }
          >
            <DappIcon
              source={{
                uri: "https://d1fdloi71mui9q.cloudfront.net/ADnGfPXUQqe5Rl2VgEVw_94Ahn7yRcgXP0P44",
              }}
            />
            <Typography
              text={"Socean"}
              marginBottom="0"
              size="subtitle"
              shade="100"
            />
          </ProposalCreationButton>
        </ProposalCreationButtonOuter> */}
        {/* <ProposalCreationButtonOuter>
          <ProposalCreationButton
            onPress={() =>
              handleOpenBrowser(
                "https://app.castle.finance/vaults/3tBqjyYtf9Utb1NNsx4o7AV1qtzHoxsMXgkmat3rZ3y6"
              )
            }
          >
            <DappIcon
              source={{
                uri: "https://app.castle.finance/static/media/lockup.3c5a7bf0.svg",
              }}
            />
            <Typography
              text={"Castle Finance"}
              marginBottom="0"
              size="subtitle"
              shade="100"
            />
          </ProposalCreationButton>
        </ProposalCreationButtonOuter> */}
      </Row>

      <Typography
        text="Defi"
        size="body"
        bold={true}
        marginLeft="2"
        shade="400"
        marginBottom="0"
      />
      <Row>
        <ProposalCreationButtonOuter>
          <ProposalCreationButton
            onPress={() => handleOpenBrowser("https://trade.mango.markets/")}
          >
            <DappIcon
              source={{
                uri: "https://pbs.twimg.com/profile_images/1461014736674435079/w83QozhN_400x400.jpg",
              }}
            />
            <Typography
              text={"Mango Markets"}
              marginBottom="0"
              size="subtitle"
              shade="100"
            />
          </ProposalCreationButton>
        </ProposalCreationButtonOuter>
        <ProposalCreationButtonOuter>
          <ProposalCreationButton
            onPress={() => handleOpenBrowser("https://friktion.fi/volts")}
          >
            <DappIcon
              source={{
                uri: "https://solana.com/_next/image?url=%2Fapi%2Fprojectimg%2Fckwgwh7gt29278eysxa7rb5sl8%3Ftype%3DLOGO&w=1200&q=75",
              }}
            />

            <Typography
              text={"Friktion"}
              marginBottom="0"
              size="subtitle"
              shade="100"
            />
          </ProposalCreationButton>
        </ProposalCreationButtonOuter>

        <ProposalCreationButtonOuter>
          <ProposalCreationButton
            onPress={() => handleOpenBrowser("https://solend.fi/dashboard")}
          >
            <DappIcon
              source={{
                uri: "https://pbs.twimg.com/profile_images/1479918591718064128/mjL4FpQU_400x400.jpg",
              }}
            />
            <Typography
              text={"Solend"}
              marginBottom="0"
              size="subtitle"
              shade="100"
            />
          </ProposalCreationButton>
        </ProposalCreationButtonOuter>
      </Row>

      <Typography
        text="Token Transfer"
        size="h3"
        bold={true}
        marginLeft="2"
        marginBottom="0"
      />
      <Row>
        <ProposalCreationButtonOuter>
          <ProposalCreationButton>
            <ProposalIconContainer>
              <FontAwesomeIcon
                icon={faMoneyBillTransfer}
                size={18}
                color={theme.primary[400]}
              />
            </ProposalIconContainer>

            <Typography
              text={"Send"}
              marginBottom="0"
              size="subtitle"
              shade="100"
            />
          </ProposalCreationButton>
        </ProposalCreationButtonOuter>
        <ProposalCreationButtonOuter>
          <ProposalCreationButton>
            <DappIcon
              source={{
                uri: "https://pbs.twimg.com/profile_images/1472933274209107976/6u-LQfjG_400x400.jpg",
              }}
            />

            <Typography
              text={"Solana Pay"}
              marginBottom="0"
              size="subtitle"
              shade="100"
            />
          </ProposalCreationButton>
        </ProposalCreationButtonOuter>
      </Row>

      {/* <Typography
        text="Swap"
        size="h3"
        bold={true}
        marginLeft="2"
        marginBottom="0"
      />
      <Row>
        <ProposalCreationButtonOuter>
          <ProposalCreationButton>
            <Typography text={"Jupiter"} />
          </ProposalCreationButton>
        </ProposalCreationButtonOuter>
        <ProposalCreationButtonOuter>
          <ProposalCreationButton>
            <Typography text={"Orca"} />
          </ProposalCreationButton>
        </ProposalCreationButtonOuter>
      </Row> */}
    </Container>
  );
}

const Container = styled.View`
  background-color: ${(props) => props.theme.gray[900]};
  flex: 1;
  flex-direction: column;
  padding: ${(props) => props.theme.spacing[2]};
`;

const ProposalCreationButton = styled.TouchableOpacity`
  /* height: 80px; */
  border-radius: 10px;
  /* width: 80px; */
  background: ${(props: any) => props.theme.gray[800]};
  justify-content: center;
  align-items: center;
  padding: ${(props) => props.theme.spacing[3]};
`;

const ProposalCreationButtonOuter = styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: ${(props) => props.theme.spacing[2]};
`;

const Row = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
`;

const SearchBar = styled.TextInput`
  padding-left: ${(props) => props.theme.spacing[3]};
  padding-right: ${(props) => props.theme.spacing[3]};
  height: 40px;
  font-size: 14px;
  flex: 1;
  background-color: ${(props) => props.theme.gray[800]}44;
  border-radius: 8px;
  border: 1px solid ${(props) => props.theme.gray[600]};
  color: ${(props) => props.theme.gray[100]};
`;
const SearchBarContainer = styled.View`
  height: 40px;
  flex: 1;
  margin-left: ${(props) => props.theme.spacing[2]};
  margin-right: ${(props) => props.theme.spacing[2]};
`;

const IconContainer = styled.TouchableOpacity`
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  justify-content: center;
  align-items: flex-end;
  margin-right: 12px;
  padding: ${(props: any) => props.theme.spacing[2]};
`;

const DappIcon = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 100px;
  background: ${(props) => props.theme.gray[1000]};
  margin-bottom: ${(props) => props.theme.spacing[1]};
`;

const ProposalIconContainer = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 100px;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.theme.gray[1000]};
  margin-bottom: ${(props) => props.theme.spacing[1]};
  background-color: ${(props) => props.theme.primary[600]}22;
`;

const SearchRow = styled.View`
  flex-direction: row;
  width: 100%;
  padding-bottom: ${(props: any) => props.theme.spacing[3]};
`;

const SearchButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  background: ${(props) =>
    props.disabled ? props.theme.gray[800] : props.theme.secondary[700]};
  padding: ${(props) => props.theme.spacing[3]};
  padding-left: ${(props) => props.theme.spacing[4]};
  padding-right: ${(props) => props.theme.spacing[4]};

  border-radius: 8;
  margin-left: ${(props: any) => props.theme.spacing[1]};
`;

const SpacedRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
