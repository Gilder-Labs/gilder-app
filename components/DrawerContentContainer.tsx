import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
  DrawerContent,
} from "@react-navigation/drawer";
import { View } from "react-native";
import styled from "styled-components/native";

export function DrawerContentContainer(props: any) {
  return (
    <DrawerContentScrollView {...props} scrollEnabled={false}>
      <StyledHeader>
        <StyledHeaderText>Realm Name </StyledHeaderText>
      </StyledHeader>
      <StyledContainer>
        <DrawerItemList {...props} />
      </StyledContainer>
    </DrawerContentScrollView>
  );
}

const StyledHeader = styled.View`
  background-color: ${(props) => props.theme.gray[900]};
  flex: 1;
  margin-bottom: ${(props) => props.theme.spacing[4]};
  justify-content: center;
  padding: ${(props) => props.theme.spacing[4]};
  border-bottom-color: ${(props) => props.theme.gray[800]};
  border-bottom-width: 1px;
`;

const StyledHeaderText = styled.Text`
  color: ${(props) => props.theme.gray[200]};
  font-size: 24px;
  font-weight: 900;
`;

const StyledContainer = styled.View``;
