import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
  DrawerContent,
} from "@react-navigation/drawer";
import { View } from "react-native";
import styled from "styled-components/native";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { SvgUri } from "react-native-svg";
import { RealmIconButton } from ".";

export function DrawerContentContainer(props: any) {
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
        </RealmScrollContainer>
        <DrawerContainerContainer>
          <DrawerItemList {...props} />
        </DrawerContainerContainer>
      </StyledContainer>
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
