import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContent,
} from "@react-navigation/drawer";
import { View, Modal, Text } from "react-native";
import styled from "styled-components/native";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { RealmIconButton, RealmSelectModal } from ".";
import { FontAwesome5 as FontAwesome } from "@expo/vector-icons";
import { useTheme } from "styled-components";

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
    >
      <StyledHeader>
        <StyledHeaderText>
          {realmDisplayName ? realmDisplayName : selectedRealm?.name}{" "}
        </StyledHeaderText>
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
            <FontAwesome
              size={16}
              style={{}}
              name="plus"
              color={theme.gray[400]}
            />
          </AddRealmButtonContainer>
        </RealmScrollContainer>
        <DrawerContainerContainer>
          <DrawerItemList {...props} />
        </DrawerContainerContainer>
      </StyledContainer>
      <RealmSelectModal
        open={realmSelectisOpen}
        handleOnClose={() => setRealmSelectIsOpen(false)}
      />
    </DrawerContentScrollView>
  );
}

const StyledHeader = styled.View`
  background-color: ${(props) => props.theme.gray[900]};
  flex: 1;
  align-items: center;
  padding: ${(props) => props.theme.spacing[4]};
  border-bottom-color: ${(props) => props.theme.gray[800]};
  border-bottom-width: 1px;
  flex-direction: row;
  max-height: 64px;
`;

const StyledHeaderText = styled.Text`
  color: ${(props) => props.theme.gray[200]};
  font-size: 24px;
  font-weight: 900;
`;

const StyledContainer = styled.View`
  flex: 1;
  flex-direction: row;
  align-content: stretch;
  align-self: stretch;
`;

const RealmScrollContainer = styled.ScrollView`
  max-width: 64px;
  flex: 1;
  flex-grow: 1;
  padding: 8px;
  background: ${(props) => props.theme.gray[800]};
`;

const DrawerContainerContainer = styled.View`
  flex: 1;
`;

const AddRealmButtonContainer = styled.TouchableOpacity`
  width: 44px;
  height: 44px;
  border-radius: 100px;
  align-items: center;
  justify-content: center;
  border: 1px dashed ${(props) => props.theme.gray[600]};
`;

const Divider = styled.View`
  flex: 1;
  width: 48px;
  height: 2px;
  background-color: ${(props) => props.theme.gray[600]};
  margin-bottom: ${(props) => props.theme.spacing[4]};
`;
