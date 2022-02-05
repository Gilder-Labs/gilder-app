import { RootTabScreenProps } from "../types";
import styled from "styled-components/native";
import { useAppSelector } from "../hooks/redux";
import { ActivityCard } from "../components";
import { FlatList } from "react-native";

export default function ActivityScreen({
  navigation,
}: RootTabScreenProps<"Activity">) {
  const { realmActivity } = useAppSelector((state) => state.realms);

  const renderActivity = ({ item }: any) => {
    return (
      <ActivityCard
        signature={item.signature}
        blockTime={item.blockTime}
        key={item.signature}
      />
    );
  };

  return (
    <Container>
      <FlatList
        data={realmActivity}
        renderItem={renderActivity}
        keyExtractor={(item) => item.signature}
      />
    </Container>
  );
}

const Container = styled.View`
  background-color: ${(props) => props.theme.gray[900]};
  flex: 1;
  padding: ${(props) => props.theme.spacing[3]};
`;
