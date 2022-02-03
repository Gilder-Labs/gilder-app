import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { SvgUri } from "react-native-svg";
import { useAppSelector } from "../hooks/redux";

interface RealmIconProps {
  realmId: string;
}

export const RealmIcon = ({ realmId }: RealmIconProps) => {
  const { realmsData } = useAppSelector((state) => state.realms);
  let isSvgImage = true;

  let realmIconUrl =
    realmsData && realmsData[`${realmId}`].ogImage
      ? realmsData[realmId].ogImage
      : `https://avatars.dicebear.com/api/jdenticon/${realmId}.svg`;

  if (realmIconUrl.slice(-3) === "png") {
    isSvgImage = false;
  }

  if (realmIconUrl.slice(0, 5) !== "https") {
    realmIconUrl = `https://realms.today${realmIconUrl}`;
  }

  return (
    <Container>
      {isSvgImage ? (
        <SvgUri
          key={realmId}
          width="44"
          height="44"
          style={{ marginBottom: 12 }}
          uri={
            realmIconUrl // change this to if the
          }
        />
      ) : (
        <RealmIconImage
          key={realmId}
          source={{
            uri: realmIconUrl,
          }}
        />
      )}
    </Container>
  );
};

const Container = styled.View`
  height: 44px;
  border-radius: 4px;
`;

const RealmIconImage = styled.Image`
  width: 44px;
  height: 44px;
  margin-bottom: 12px;
  justify-content: center;
  align-self: center;
`;
