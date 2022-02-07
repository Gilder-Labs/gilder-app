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

  // const renderSeparator = ({ leadingItem }: any) => {
  //   console.log("sep data", leadingItem);
  //   previousDate = leadingItem.blockTime;
  //   // console.log("date", previousDate);
  //   return <DateSeparator />;
  // };

  return (
    <Container>
      <FlatList
        data={realmActivity}
        renderItem={renderActivity}
        keyExtractor={(item) => item.signature}
        style={{ padding: 16 }}
        // ItemSeparatorComponent={renderSeparator}
      />
    </Container>
  );
}

const Container = styled.View`
  background-color: ${(props) => props.theme.gray[900]};
  flex: 1;
`;

const DateSeparator = styled.View`
  background: green;
  height: 20px;
`;
