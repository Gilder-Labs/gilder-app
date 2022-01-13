import { StyleSheet } from "react-native";
import { useEffect } from "react";
import { Text, View } from "../components/Themed";
import { RootTabScreenProps } from "../types";
import styled from "styled-components/native";
import { ThemeProvider } from "@react-navigation/native";
import { useAppSelector } from "../hooks/redux";

export default function ActivityScreen({
  navigation,
}: RootTabScreenProps<"Activity">) {
  return (
    <StyledContainer>
      <Text>Activity</Text>
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
    </StyledContainer>
  );
}

const StyledContainer = styled.View`
  background: ${(props) => props.theme.gray[800]};
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const styles = StyleSheet.create({
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
