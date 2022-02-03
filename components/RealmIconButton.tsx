import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { SvgUri } from "react-native-svg";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { fetchRealm } from "../store/realmSlice";

interface RealmIconButtonProps {
  realmId: string;
}

{
  /* <RealmIcon
          source={{
            uri: realmsData[selectedRealm.pubKey].ogImage,
          }}
        /> */
}

export const RealmIconButton = ({ realmId }: RealmIconButtonProps) => {
  const { realmsData, selectedRealm } = useAppSelector((state) => state.realms);
  const dispatch = useAppDispatch();

  const handleRealmIconClick = () => {
    dispatch(fetchRealm(realmId));
  };

  const realmIconImage = `https://avatars.dicebear.com/api/jdenticon/${realmId}.svg`;

  return (
    <ContainerButton onPress={handleRealmIconClick}>
      <Container>
        {selectedRealm.pubKey === realmId && <RealmSelectedIndicator />}
        <SvgUri
          key={realmId}
          width="44"
          height="44"
          style={{ marginBottom: 12 }}
          uri={
            realmIconImage // change this to if the
          }
        />
        {/* <SvgUri
        key={realmId}
        width="48"
        height="48"
        style={{ marginBottom: 12 }}
        uri={`https://avatars.dicebear.com/api/jdenticon/${realmId}.svg`}
      /> */}
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
  margin-right: ${(props: any) => props.theme.spacing[3]};
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
