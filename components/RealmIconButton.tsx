import React from "react";
import styled from "styled-components/native";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { fetchRealm, selectRealm } from "../store/realmSlice";
import { RealmIcon } from "./RealmIcon";
import * as Haptics from "expo-haptics";

interface RealmIconButtonProps {
  realmId: string;
  isDisabled?: boolean;
  showSelected?: boolean;
  size?: number;
}

export const RealmIconButton = ({
  realmId,
  isDisabled = false,
  showSelected = true,
  size = 48,
}: RealmIconButtonProps) => {
  const { realmsMap, selectedRealmId, isLoadingSelectedRealm } = useAppSelector(
    (state) => state.realms
  );
  const dispatch = useAppDispatch();

  const handleRealmIconClick = () => {
    // if user selects realm they are already on, don't do anything
    if (selectedRealmId === realmId) {
      return;
    }

    dispatch(selectRealm(realmsMap[realmId]));
    dispatch(fetchRealm(realmId));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  };

  const isSelected = selectedRealmId === realmId;

  return (
    <ContainerButton
      onPress={handleRealmIconClick}
      key={realmId}
      activeOpacity={0.4}
      disabled={isDisabled || isLoadingSelectedRealm}
      isSelected={isSelected}
      showSelected={showSelected}
      size={size}
    >
      <Container>
        {/* {isSelected && <RealmSelectedIndicator />} */}
        <RealmIcon realmId={realmId} size={size} />
      </Container>
    </ContainerButton>
  );
};

const ContainerButton = styled.TouchableOpacity<{
  isSelected: boolean;
  showSelected: boolean;
  size: number;
}>`
  height: ${(props: any) => props.size}px;
  width: ${(props: any) => props.size}px;
  min-height: ${(props: any) => props.size}px;
  min-width: ${(props: any) => props.size}px;
  margin-bottom: ${(props: any) => props.theme.spacing[3]};
  border-radius: 100px;
  padding: ${(props: any) => props.theme.spacing[1]};
  background: ${(props: any) => props.theme.gray[900]};
  border: ${(props: any) =>
    props.isSelected && props.showSelected
      ? `1px solid ${props.theme.primary[400]}}`
      : "1px solid transparent"};
`;

const Container = styled.View``;
