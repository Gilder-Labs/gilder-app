import { RootTabScreenProps } from "../types";
import styled from "styled-components/native";
import { useAppSelector } from "../hooks/redux";
import { ActivityCard } from "../components";
import { FlatList } from "react-native";
import { format, differenceInDays } from "date-fns";

// TWO ways to do this.
// Each separator, check if previous item is the same day
// if not, render day

// second
// update data to be in format for sectionlist component

export default function ActivityScreen({
  navigation,
}: RootTabScreenProps<"Activity">) {
  const { realmActivity } = useAppSelector((state) => state.realms);

  // Use 1 if it exists because we don't have a way to get it easily from flatlist to check if the second activity is a different day.
  // @ts-ignore
  let dateTracker = realmActivity[1]?.blockTime * 1000;

  const renderActivity = ({ item }: any) => {
    return (
      <ActivityCard
        signature={item.signature}
        blockTime={item.blockTime}
        key={item.signature}
      />
    );
  };

  const renderSeparator = (props: any) => {
    const { leadingItem } = props;
    let previousDate = format(leadingItem?.blockTime * 1000, "LLL d, yyyy - p");
    const isDifferentDay = differenceInDays(
      new Date(leadingItem?.blockTime * 1000),
      new Date(dateTracker)
    );

    if (isDifferentDay) {
      dateTracker = leadingItem.blocktime * 1000;
      return <DateSeparator> {previousDate}</DateSeparator>;
    }

    return <EmptyView />;
  };

  return (
    <Container>
      <FlatList
        data={realmActivity}
        renderItem={renderActivity}
        keyExtractor={(item) => item.signature}
        style={{ padding: 16 }}
        ItemSeparatorComponent={renderSeparator}
        ListHeaderComponent={
          <DateSeparator>
            {realmActivity[0] &&
              format(
                // @ts-ignore
                realmActivity[0]?.blockTime * 1000,
                "LLL d, yyyy - p"
              )}
          </DateSeparator>
        }
      />
    </Container>
  );
}

const Container = styled.View`
  background-color: ${(props) => props.theme.gray[900]};
  flex: 1;
`;

const DateSeparator = styled.Text`
  background: green;
  height: 20px;
`;

const EmptyView = styled.View``;
