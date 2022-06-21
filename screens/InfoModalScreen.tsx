import styled from "styled-components/native";
import { Button, Typography } from "../components";
import { useTheme } from "styled-components";
import * as Haptics from "expo-haptics";
import * as Linking from "expo-linking";
import * as Unicons from "@iconscout/react-native-unicons";

export default function InfoModalScreen({ navigation }: any) {
  const theme = useTheme();

  const handleTwitterLink = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Linking.openURL(`https://twitter.com/gilderxyz`);
  };

  return (
    <Container>
      <FloatingBarContainer>
        <FloatingBar />
      </FloatingBarContainer>
      <ContentContainer>
        <Row>
          <Typography
            size="h3"
            bold={true}
            shade="100"
            text={"Discover and Featured"}
            marginBottom="0"
          />
          <IconContainerButton activeOpacity={0.4} onPress={handleTwitterLink}>
            <Unicons.UilTwitter size="40" color={"#1DA1F2"} />
          </IconContainerButton>
        </Row>
        <Typography
          size="body"
          shade="400"
          text={
            "The discover tab is for featuring awesome DAO's and tools for DAO's. We will be regularly updating this page to help spread the word around your community or tool."
          }
          marginBottom="2"
        />
        <Typography
          size="body"
          shade="400"
          text={
            "If you are interested in seeing your DAO or Tool featured on Gilder, please feel free to DM us on twitter!"
          }
          marginBottom="2"
        />
      </ContentContainer>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;

  background: ${(props: any) => props.theme.gray[900]};
`;

const ContentContainer = styled.View`
  margin-top: ${(props: any) => props.theme.spacing[4]};

  padding: ${(props: any) => props.theme.spacing[4]};
`;

const Row = styled.View`
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  margin-bottom: ${(props: any) => props.theme.spacing[4]};
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

const IconContainerButton = styled.TouchableOpacity`
  border-radius: 100px;
  padding: ${(props: any) => props.theme.spacing[2]};
  background: ${(props: any) => props.theme.gray[800]};
`;
