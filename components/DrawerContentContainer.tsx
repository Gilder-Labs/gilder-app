import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContent,
} from "@react-navigation/drawer";
import { FlatList, View } from "react-native";
import styled from "styled-components/native";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { RealmIconButton } from "./RealmIconButton";
import { RealmSelectModal } from "./RealmSelectModal";
import { ConnectWalletButton } from "./ConnectWalletButton";
import { useTheme } from "styled-components";
import Logo from "../assets/images/GilderLogo.png";
import * as Unicons from "@iconscout/react-native-unicons";

export function DrawerContentContainer(props: any) {
  const theme = useTheme();
  const [realmSelectisOpen, setRealmSelectIsOpen] = useState(false);

  const { selectedRealm, realmsData, realmWatchlist } = useAppSelector(
    (state) => state.realms
  );

  const realmDisplayName = realmsData[selectedRealm?.pubKey]?.displayName;

  const renderRealmIcon = ({ item }: any) => {
    return <RealmIconButton realmId={item} key={item} />;
  };

  return (
    <DrawerRootContainer {...props} style={{ backgroundColor: "#131313" }}>
      <StyledHeader>
        <GilderLogo source={Logo} />
      </StyledHeader>
      <StyledContainer>
        <RealmScrollContainer>
          <FlatList
            data={realmWatchlist}
            renderItem={renderRealmIcon}
            keyExtractor={(item) => item}
            style={{ padding: 8 }}
            scrollIndicatorInsets={{ right: 1 }}
            ListFooterComponent={
              <View>
                <Divider />
                <AddRealmButtonContainer
                  onPress={() => setRealmSelectIsOpen(true)}
                  activeOpacity={0.4}
                >
                  <Unicons.UilPlus size="20" color={theme.gray[400]} />
                </AddRealmButtonContainer>
              </View>
            }
          />
        </RealmScrollContainer>
        <DrawerContentContainerWrapper>
          <Content>
            <RealmNameContainer>
              <StyledRealmName>
                {realmDisplayName ? realmDisplayName : selectedRealm?.name}
              </StyledRealmName>
            </RealmNameContainer>
            <DrawerItemList {...props} />
          </Content>
          {/* <ConnectWalletButton /> */}
        </DrawerContentContainerWrapper>
      </StyledContainer>
      <RealmSelectModal
        open={realmSelectisOpen}
        handleOnClose={() => setRealmSelectIsOpen(false)}
      />
    </DrawerRootContainer>
  );
}

const DrawerRootContainer = styled.View`
  padding-top: 52px;
`;

const StyledRealmName = styled.Text`
  color: ${(props) => props.theme.gray[200]};
  font-size: 20px;
  font-weight: 700;
`;

const RealmNameContainer = styled.View`
  margin-left: ${(props) => props.theme.spacing[4]};
  margin-right: ${(props) => props.theme.spacing[4]};
  padding-top: ${(props) => props.theme.spacing[3]};
  padding-bottom: ${(props) => props.theme.spacing[2]};
  margin-bottom: ${(props) => props.theme.spacing[2]};

  border-bottom-color: ${(props) => props.theme.gray[800]};
  border-bottom-width: 1px;
`;

const StyledContainer = styled.View`
  height: 100%;
  flex-direction: row;
  align-content: stretch;
  align-self: stretch;
  background-color: ${(props) => props.theme.gray[900]};
`;

const RealmScrollContainer = styled.View`
  max-width: 74px;
  height: 100%;
  background: ${(props) => props.theme.gray[800]};
  justify-content: center;
  align-items: center;
`;

const AddRealmButtonContainer = styled.TouchableOpacity`
  width: 44px;
  height: 44px;
  border-radius: 100px;
  align-items: center;
  justify-content: center;
  border: 2px dashed ${(props) => props.theme.gray[500]};
`;

const Divider = styled.View`
  /* width: 48px; */
  height: 2px;
  max-height: 2px;
  background-color: ${(props) => props.theme.gray[600]};
  margin-bottom: ${(props) => props.theme.spacing[4]};
`;

const DrawerContentContainerWrapper = styled.View`
  flex: 1;
  justify-content: space-between;
  /* height: 100%; */
  /* padding-bottom: 100px; */
`;

const GilderLogo = styled.Image`
  height: 30px;
  width: 120px;
`;

const StyledHeader = styled.View`
  background-color: ${(props) => props.theme.gray[1000]};
  align-items: center;
  padding-left: ${(props) => props.theme.spacing[4]};
  padding-bottom: ${(props) => props.theme.spacing[2]};
  /* border-bottom-color: ${(props) => props.theme.gray[800]}; */
  border-bottom-width: 1px;
  flex-direction: row;
  /* max-height: 40px; */
`;

const Content = styled.View``;
