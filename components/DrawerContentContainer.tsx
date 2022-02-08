import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContent,
} from "@react-navigation/drawer";
import { View, Modal, Text } from "react-native";
import styled from "styled-components/native";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { RealmIconButton } from "./RealmIconButton";
import { RealmSelectModal } from "./RealmSelectModal";
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
  return (
    <DrawerContentScrollView
      {...props}
      scrollEnabled={false}
      contentContainerStyle={{ alignItems: "stretch", flexGrow: "1" }}
      style={{ backgroundColor: "#131313" }}
    >
      <StyledHeader>
        <GilderLogo source={Logo} />
      </StyledHeader>
      <StyledContainer>
        <RealmScrollContainer
          contentContainerStyle={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {realmWatchlist.map((realmId) => (
            <RealmIconButton realmId={realmId} key={realmId} />
          ))}
          <Divider />
          <AddRealmButtonContainer
            onPress={() => setRealmSelectIsOpen(true)}
            activeOpacity={0.4}
          >
            <Unicons.UilPlus size="20" color={theme.gray[400]} />
          </AddRealmButtonContainer>
        </RealmScrollContainer>
        <DrawerContentContainerWrapper>
          <RealmNameContainer>
            <StyledRealmName>
              {realmDisplayName ? realmDisplayName : selectedRealm?.name}
            </StyledRealmName>
          </RealmNameContainer>
          <DrawerItemList {...props} />
        </DrawerContentContainerWrapper>
      </StyledContainer>
      <RealmSelectModal
        open={realmSelectisOpen}
        handleOnClose={() => setRealmSelectIsOpen(false)}
      />
    </DrawerContentScrollView>
  );
}

const StyledHeader = styled.View`
  background-color: ${(props) => props.theme.gray[1000]};
  flex: 1;
  align-items: center;
  padding-bottom: ${(props) => props.theme.spacing[4]};
  padding-left: ${(props) => props.theme.spacing[4]};
  /* border-bottom-color: ${(props) => props.theme.gray[800]}; */
  border-bottom-width: 1px;
  flex-direction: row;
  max-height: 40px;
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
  flex: 1;
  flex-direction: row;
  align-content: stretch;
  align-self: stretch;
  background-color: ${(props) => props.theme.gray[900]};
`;

const RealmScrollContainer = styled.ScrollView`
  max-width: 64px;
  flex: 1;
  flex-grow: 1;
  padding: 8px;
  padding-top: 16px;
  background: ${(props) => props.theme.gray[800]};
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
  flex: 1;
  width: 48px;
  height: 2px;
  background-color: ${(props) => props.theme.gray[600]};
  margin-bottom: ${(props) => props.theme.spacing[4]};
`;

const DrawerContentContainerWrapper = styled.View`
  flex: 1;
`;

const GilderLogo = styled.Image`
  height: 36px;
  width: 120px;
`;
