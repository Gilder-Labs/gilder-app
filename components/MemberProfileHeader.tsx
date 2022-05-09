import React from "react";
import styled from "styled-components/native";
import { useTheme } from "styled-components";
import * as Unicons from "@iconscout/react-native-unicons";
import { SvgXml } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";

interface MemberProfileHeaderProps {
  selectedTab: string;
  onSelectTab: any;
  color: string;
  color2: string;
  avatarUrl: string;
}

export const MemberProfileHeader = ({
  selectedTab = "Messages",
  onSelectTab,
  color,
  color2,
  avatarUrl,
}: MemberProfileHeaderProps) => {
  const theme = useTheme();

  return (
    <HeaderContainer>
      <LinearGradient
        colors={[`${theme[color][500]}44`, `${theme[color][700]}aa`]}
        style={{
          height: 80,
          // flex: 1,
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
        start={{ x: 0.1, y: 0.2 }}
      ></LinearGradient>
      <IconContainer color={color}>
        {avatarUrl ? (
          <Avatar source={{ uri: avatarUrl }} />
        ) : (
          <LinearGradient
            // Background Linear Gradient
            colors={[`${theme[color][500]}`, `${theme[color2][900]}`]}
            style={{ height: 60, width: 60 }}
            start={{ x: 0.1, y: 0.2 }}
          />
        )}
      </IconContainer>
      <MemberInfoSwitcherContainer>
        {/* <NavIconButton
          color={color}
          isSelected={selectedTab === "Info"}
          onPress={() => onSelectTab("Info")}
        >
          <Unicons.UilUser
            size="20"
            style={{ marginRight: 4 }}
            color={theme[color][200]}
          />
          <ButtonText color={color}>Info</ButtonText>
        </NavIconButton> */}
        <NavIconButton
          color={color}
          isSelected={selectedTab === "Messages"}
          onPress={() => onSelectTab("Messages")}
        >
          <Unicons.UilCommentDots
            size="20"
            style={{ marginRight: 4 }}
            color={theme[color][200]}
          />
          <ButtonText color={color}>Messages</ButtonText>
        </NavIconButton>
        <NavIconButton
          color={color}
          isSelected={selectedTab === "Votes"}
          onPress={() => onSelectTab("Votes")}
        >
          <Unicons.UilEnvelopeEdit
            size="20"
            style={{ marginRight: 4 }}
            color={theme[color][200]}
          />
          <ButtonText color={color}>Votes</ButtonText>
        </NavIconButton>
      </MemberInfoSwitcherContainer>
    </HeaderContainer>
  );
};

const BackIconButton = styled.TouchableOpacity`
  width: 48px;
  height: 48px;
  justify-content: center;
  align-items: center;
`;

const HeaderContainer = styled.View`
  /* height: 80px; */
  margin-bottom: ${(props: any) => props.theme.spacing[4]};
  border-bottom-width: 1px;
  border-color: ${(props) => props.theme.gray[1000]};
  flex-direction: column;
`;

const IconContainer = styled.View<{ color: string }>`
  /* border-radius: 100px, */
  background: ${(props: any) => props.theme[props.color][800]};
  flex-direction: row;
  align-items: center;
  position: absolute;
  left: 30px;
  top: 48px;
  overflow: hidden;
  border: 2px solid ${(props: any) => props.theme.gray[900]};
  border-radius: 100px;
`;

const MemberInfoSwitcherContainer = styled.View`
  /* background: red; */
  flex-direction: row;
  justify-content: flex-end;
  margin-top: ${(props: any) => props.theme.spacing[2]};
  padding-right: ${(props: any) => props.theme.spacing[2]};

  /* align-items: center; */
  /* height: 80px; */
  /* width: 100px; */
`;

const NavIconButton = styled.TouchableOpacity<{
  color: string;
  isSelected: boolean;
}>`
  background: ${(props: any) =>
    props.isSelected ? `${props.theme[props.color][900]}aa` : "transparent"};
  border-radius: 8px;
  /* padding: ${(props: any) => props.theme.spacing[1]}; */
  padding-top: ${(props: any) => props.theme.spacing[1]};
  padding-bottom: ${(props: any) => props.theme.spacing[1]};

  padding-left: ${(props: any) => props.theme.spacing[2]};
  padding-right: ${(props: any) => props.theme.spacing[2]};
  margin-left: ${(props: any) => props.theme.spacing[1]};
  margin-right: ${(props: any) => props.theme.spacing[1]};

  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const Avatar = styled.Image`
  height: 60px;
  width: 60px;
`;

const ButtonText = styled.Text<{ color: string }>`
  color: ${(props: any) => props.theme[props.color][200]};
`;
