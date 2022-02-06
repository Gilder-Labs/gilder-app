import React from "react";
import styled from "styled-components/native";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { fetchRealm } from "../store/realmSlice";
import { RealmIcon } from "./RealmIcon";

interface RealmIconButtonProps {
  realmId: string;
  isDisabled?: boolean;
}

export const RealmIconButton = ({
  realmId,
  isDisabled = false,
}: RealmIconButtonProps) => {
  const { realmsData, selectedRealm } = useAppSelector((state) => state.realms);
  const dispatch = useAppDispatch();

  const handleRealmIconClick = () => {
    dispatch(fetchRealm(realmId));
  };

  return (
    <ContainerButton
      onPress={handleRealmIconClick}
      key={realmId}
      activeOpacity={0.4}
      disabled={isDisabled}
    >
      <Container>
        {selectedRealm?.pubKey === realmId && <RealmSelectedIndicator />}
        <RealmIcon realmId={realmId} />
      </Container>
    </ContainerButton>
  );
};

const ContainerButton = styled.TouchableOpacity`
  height: 44px;
  margin-bottom: ${(props: any) => props.theme.spacing[3]};
  border-radius: 4px;
`;

const Container = styled.View``;

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
