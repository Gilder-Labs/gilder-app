import React, { useState, useEffect } from "react";
import { FlatList } from "react-native";
import styled from "styled-components/native";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { useTheme } from "styled-components";
import { fetchWalletSolDomains, fetchMemberVotes } from "../store/memberSlice";
import { VoteCard, PublicKeyTextCopy } from "../components";
import { useQuery, gql } from "@apollo/client";
import { useCardinalIdentity } from "../hooks/useCardinaldentity";
import { Typography } from "../components";
import { AnimatedImage } from "react-native-ui-lib";
import { getColorType } from "../utils";
import { LinearGradient } from "expo-linear-gradient";
import { createIconSetFromFontello } from "@expo/vector-icons";

interface MemberProfileProps {
  open: boolean;
  route: any;
  navigation: any;
}

export const MemberProfileScreen = ({ route }: MemberProfileProps) => {
  const dispatch = useAppDispatch();
  const { isLoadingVotes, memberVotes, membersMap } = useAppSelector(
    (state) => state.members
  );
  const theme = useTheme();

  const { selectedRealm } = useAppSelector((state) => state.realms);
  const { proposalsMap } = useAppSelector((state) => state.proposals);
  const { walletId } = route?.params;
  const member = membersMap[walletId];
  const { twitterURL, twitterHandle, twitterDescription } = useCardinalIdentity(
    member.walletId
  );
  const identityName = twitterHandle;

  const color = getColorType(member?.walletId);
  const color2 = getColorType(member?.walletId.slice(-1) || "string");

  useEffect(() => {
    if (member) {
      dispatch(fetchMemberVotes({ member, realm: selectedRealm }));
      dispatch(fetchWalletSolDomains(member.walletId));
    }
  }, [member]);

  const renderVotes = ({ item }: any) => {
    return (
      <VoteCard
        member={member}
        vote={item}
        key={item.proposalId}
        proposal={proposalsMap[item.proposalId]}
        realm={selectedRealm}
      />
    );
  };

  return (
    <Container>
      <ProfileHeaderRow>
        <ProfilePictureContainer>
          <LinearGradient
            // Background Linear Gradient
            colors={[`${theme[color][500]}`, `${theme[color2][900]}`]}
            style={{ minHeight: 128, minWidth: 128 }}
            start={{ x: 0.1, y: 0.2 }}
          >
            {!!twitterURL && (
              <AnimatedImage
                style={{
                  width: 128,
                  height: 128,
                  overflow: "hidden",
                }}
                source={{
                  uri: twitterURL,
                }}
              />
            )}
          </LinearGradient>
        </ProfilePictureContainer>
        <NameRow>
          {identityName ? (
            <Typography
              text={identityName}
              shade="100"
              size="h4"
              bold={true}
              marginBottom={"0"}
            />
          ) : (
            <PublicKeyTextCopy
              shade="300"
              size="h4"
              publicKey={member.walletId}
              backgroundShade="900"
              noPadding={true}
              hideIcon={true}
              bold={true}
            />
          )}
          {identityName ? (
            <PublicKeyTextCopy
              shade="500"
              size="subtitle"
              backgroundShade="900"
              publicKey={member.walletId}
              noPadding={true}
              hideIcon={true}
            />
          ) : null}
          <DescriptionContainer>
            <Typography
              text={twitterDescription}
              shade="300"
              size="subtitle"
              marginTop="2"
              marginBottom={"0"}
              hasLinks={true}
            />
          </DescriptionContainer>
        </NameRow>
      </ProfileHeaderRow>

      <Row>
        <Typography
          text={"DAO membership"}
          shade="300"
          size="h4"
          bold={true}
          marginBottom={"2"}
        />
      </Row>

      <Column>
        <Typography
          text={"Latest Votes"}
          shade="300"
          size="h4"
          bold={true}
          marginBottom={"2"}
        />
        <FlatList
          data={memberVotes}
          renderItem={renderVotes}
          keyExtractor={(item) => item.proposalId}
          scrollIndicatorInsets={{ right: 1 }}
          initialNumToRender={10}
          horizontal={true}
        />
      </Column>
      <Row>
        <Typography
          text={"Sol domains"}
          shade="300"
          size="h4"
          bold={true}
          marginBottom={"2"}
        />
      </Row>
    </Container>
  );
};

const Container = styled.View`
  padding: ${(props) => props.theme.spacing[3]};
  background: ${(props: any) => props.theme.gray[900]};
  height: 100%;
`;

const EmptyView = styled.View`
  height: 200px;
`;

const ProfilePictureContainer = styled.View<{ color: string }>`
  background: ${(props: any) => props.theme.gray[800]};
  overflow: hidden;
  border: 1px solid ${(props: any) => props.theme.gray[900]};
  border-radius: 100px;
  height: 128px;
  width: 128px;
`;

const ProfileHeaderRow = styled.View`
  flex-direction: row;
  margin-bottom: ${(props) => props.theme.spacing[3]};
`;

const NameRow = styled.View`
  flex-direction: column;
  align-items: flex-start;
  margin-left: ${(props) => props.theme.spacing[3]};
`;

const Row = styled.View`
  flex-direction: row;
`;

const DescriptionContainer = styled.View`
  flex-direction: row;
  margin-right: 128px; // so react native doesn't overflow outside screen
`;

const Column = styled.View`
  flex-direction: column;
`;
