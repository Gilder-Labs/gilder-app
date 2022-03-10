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

  const isSelected = selectedRealm?.pubKey === realmId;

  return (
    <ContainerButton
      onPress={handleRealmIconClick}
      key={realmId}
      activeOpacity={0.4}
      disabled={isDisabled}
      isSelected={isSelected}
    >
      <Container>
        {/* {isSelected && <RealmSelectedIndicator />} */}
        <RealmIcon realmId={realmId} />
      </Container>
    </ContainerButton>
  );
};

const ContainerButton = styled.TouchableOpacity<{ isSelected: boolean }>`
  height: 48px;
  width: 48px;
  min-height: 48px;
  min-width: 48px;
  margin-bottom: ${(props: any) => props.theme.spacing[3]};
  border-radius: 100px;
  padding: ${(props: any) => props.theme.spacing[1]};
  background: ${(props: any) => props.theme.gray[900]};
  border: ${(props: any) =>
    props.isSelected
      ? `1px solid ${props.theme.primary[400]}}`
      : "1px solid transparent"};
`;

const Container = styled.View``;
