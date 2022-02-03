import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { SvgUri } from "react-native-svg";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { fetchRealm } from "../store/realmSlice";

interface RealmIconButtonProps {
  realmId: string;
}

export const RealmIconButton = ({ realmId }: RealmIconButtonProps) => {
  const { realmsData, selectedRealm } = useAppSelector((state) => state.realms);
  const dispatch = useAppDispatch();
  let isSvgImage = true;

  const handleRealmIconClick = () => {
    dispatch(fetchRealm(realmId));
  };

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
    <ContainerButton onPress={handleRealmIconClick} key={realmId}>
      <Container>
        {selectedRealm?.pubKey === realmId && <RealmSelectedIndicator />}
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
          <RealmIcon
            key={realmId}
            source={{
              uri: realmIconUrl,
            }}
          />
        )}
      </Container>
    </ContainerButton>
  );
};

const ContainerButton = styled.TouchableHighlight`
  height: 44px;
  margin-bottom: ${(props: any) => props.theme.spacing[3]};
  border-radius: 4px;
`;

const Container = styled.View``;

const RealmIcon = styled.Image`
  width: 44px;
  height: 44px;
  margin-bottom: 12px;
  justify-content: center;
  align-self: center;
`;

const RealmSelectedIndicator = styled.View`
  width: 6px;
  height: 36px;
  left: -12px;
  top: 4px;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  background: ${(props: any) => props.theme.gray[300]};
  position: absolute;
`;
