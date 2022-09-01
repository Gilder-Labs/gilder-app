import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { useTheme } from "styled-components";
import { getColorType } from "../utils";
import { useQuery, gql } from "@apollo/client";
import { Typography } from "../components";
import { AnimatedImage } from "react-native-ui-lib";
import { formatVoteWeight } from "../utils";
import { useAppSelector } from "../hooks/redux";
import { PublicKeyTextCopy } from "./PublicKeyTextCopy";
import { useCardinalIdentity } from "../hooks/useCardinaldentity";
import { faAngleDoubleRight } from "@fortawesome/pro-solid-svg-icons/faAngleDoubleRight";
import { RealmIcon } from "../components";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCheckToSlot } from "@fortawesome/pro-solid-svg-icons/faCheckToSlot";
import numeral from "numeral";
import { LinearGradient } from "expo-linear-gradient";

interface MemberCardProps {
  member: any;
  onSelect: any;
}

export const MemberCard = ({ member, onSelect }: MemberCardProps) => {
  const theme = useTheme();

  const { twitterURL, twitterHandle } = useCardinalIdentity(member.walletId);

  const { selectedRealm } = useAppSelector((state) => state.realms);

  const color = getColorType(member.walletId);
  const color2 = getColorType(member?.walletId.slice(-1) || "string");

  const identityName = twitterHandle;
  const avatarUrl = twitterURL;

  const handleProfileClick = () => {
    onSelect({ name: identityName, avatarUrl: avatarUrl });
  };

  return (
    <Container onLongPress={handleProfileClick} activeOpacity={0.5}>
      <ContentContainer>
        <TitleRow>
          <ProfilePictureContainer>
            <LinearGradient
              // Background Linear Gradient
              colors={[`${theme[color][500]}`, `${theme[color2][900]}`]}
              style={{ minHeight: 36, minWidth: 36 }}
              start={{ x: 0.1, y: 0.2 }}
            >
              {!!twitterURL && (
                <AnimatedImage
                  style={{
                    width: 36,
                    height: 36,
                    overflow: "hidden",
                  }}
                  source={{
                    uri: twitterURL,
                  }}
                />
              )}
            </LinearGradient>
          </ProfilePictureContainer>
          <Column>
            <MemberNameContainer>
              {identityName ? (
                <Typography
                  text={identityName}
                  shade="300"
                  size="body"
                  bold={true}
                  marginBottom={"0"}
                />
              ) : (
                <PublicKeyTextCopy
                  shade="300"
                  size="body"
                  publicKey={member.walletId}
                  noPadding={true}
                  hideIcon={true}
                  bold={true}
                />
              )}
              {identityName ? (
                <PublicKeyTextCopy
                  shade="500"
                  size="caption"
                  publicKey={member.walletId}
                  noPadding={true}
                  hideIcon={true}
                />
              ) : null}
            </MemberNameContainer>
          </Column>
          <IconButton onPress={handleProfileClick} activeOpacity={0.5}>
            <FontAwesomeIcon
              icon={faAngleDoubleRight}
              size={18}
              color={theme.gray[400]}
            />
          </IconButton>
        </TitleRow>

        <VotesContainer>
          {member?.councilDepositAmount && (
            <VoteContainer>
              <Typography
                text="Council Votes"
                shade="500"
                marginBottom="0"
                size="caption"
              />
              <Column>
                <Row>
                  <RealmIcon realmId={selectedRealm?.pubKey || ""} size={32} />

                  <Typography
                    text={numeral(
                      formatVoteWeight(
                        member.councilDepositAmount,
                        selectedRealm?.councilMintDecimals
                      )
                    ).format("0,0")}
                    marginRight="2"
                    marginLeft="1"
                    size="h4"
                    bold={true}
                    marginBottom="0"
                  />
                </Row>
                <Row>
                  <FontAwesomeIcon
                    icon={faCheckToSlot}
                    size={14}
                    color={theme.gray[400]}
                  />
                  <Typography
                    text={member.totalVotesCouncil}
                    size="caption"
                    marginLeft="2"
                    shade="400"
                    marginBottom="0"
                  />
                </Row>
              </Column>
            </VoteContainer>
          )}

          {member?.communityDepositAmount && (
            <VoteContainer>
              <Typography
                text="Community Votes"
                shade="500"
                marginBottom="0"
                size="caption"
              />
              <Column>
                <Row>
                  <RealmIcon realmId={selectedRealm.pubKey} size={32} />
                  <Typography
                    text={numeral(
                      formatVoteWeight(
                        member.communityDepositAmount,
                        selectedRealm?.communityMintDecimals
                      )
                    ).format("0.0a")}
                    bold={true}
                    marginLeft="1"
                    size="h4"
                    marginBottom="0"
                  />
                </Row>
                <Row>
                  <FontAwesomeIcon
                    icon={faCheckToSlot}
                    size={14}
                    color={theme.gray[400]}
                  />
                  <Typography
                    text={member.totalVotesCommunity}
                    size="caption"
                    marginLeft="2"
                    shade="400"
                    marginBottom="0"
                  />
                </Row>
              </Column>
            </VoteContainer>
          )}
        </VotesContainer>
      </ContentContainer>
    </Container>
  );
};

const Container = styled.TouchableOpacity`
  margin-bottom: ${(props: any) => props.theme.spacing[3]};
  border-radius: 4px;
  background: ${(props: any) => props.theme.gray[800]};
  align-items: center;
  justify-content: space-between;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
`;

const ContentContainer = styled.View`
  padding: ${(props: any) => props.theme.spacing[2]};
  padding-left: ${(props: any) => props.theme.spacing[2]};
  padding-right: ${(props: any) => props.theme.spacing[2]};
  width: 100%;
  /* justify-content: space-between; */
`;

const MemberNameContainer = styled.View`
  align-items: flex-start;
  margin-left: ${(props: any) => props.theme.spacing[2]};
`;

const IconButton = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 100px;
  background: ${(props: any) => props.theme.gray[700]};
  margin-left: auto;
`;

const TitleRow = styled.View`
  flex-direction: row;
  margin-bottom: ${(props) => props.theme.spacing[2]};
`;

const VotesContainer = styled.View`
  flex-direction: row;
  margin-left: -${(props) => props.theme.spacing[1]};
  margin-right: -${(props) => props.theme.spacing[1]};
`;

const VoteContainer = styled.View`
  background: ${(props: any) => props.theme.gray[900]};
  padding: ${(props) => props.theme.spacing[2]};
  flex: 1;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  margin-left: ${(props) => props.theme.spacing[1]};
  margin-right: ${(props) => props.theme.spacing[1]};
`;

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const Column = styled.View`
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ProfilePictureContainer = styled.View`
  background: ${(props: any) => props.theme.gray[800]};
  overflow: hidden;
  border: 1px solid ${(props: any) => props.theme.gray[900]};
  border-radius: 100px;
  height: 36px;
  width: 36px;
`;
