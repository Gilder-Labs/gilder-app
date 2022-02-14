import { RootTabScreenProps } from "../types";
import { useState } from "react";
import styled from "styled-components/native";
import { ActivityCard, Loading } from "../components";
import { FlatList } from "react-native";
import { format, differenceInDays } from "date-fns";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { fetchRealmActivity } from "../store/realmSlice";

// TWO ways to do this.
// Each separator, check if previous item is the same day
// if not, render day

// second
// update data to be in format for sectionlist component

export default function ActivityScreen({
  navigation,
}: RootTabScreenProps<"Activity">) {
  const { realmActivity, isLoadingActivities, selectedRealm } = useAppSelector(
    (state) => state.realms
  );
  const dispatch = useAppDispatch();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  // Use 1 if it exists because we don't have a way to get it easily from flatlist to check if the second activity is a different day.
  // @ts-ignore
  // let dateTracker = realmActivity[1]?.blockTime * 1000;

  const renderActivity = ({ item }: any) => {
    return <ActivityCard activity={item} key={item.signature} />;
  };

  // const renderSeparator = (props: any) => {
  //   const { leadingItem } = props;
  //   let previousDate = format(leadingItem?.blockTime * 1000, "LLL d, yyyy - p");
  //   const isDifferentDay = differenceInDays(
  //     new Date(leadingItem?.blockTime * 1000),
  //     new Date(dateTracker)
  //   );

  //   if (isDifferentDay) {
  //     dateTracker = leadingItem.blocktime * 1000;
  //     return <DateSeparator> {previousDate}</DateSeparator>;
  //   }

  //   return <EmptyView />;
  // };

  const handleRefresh = () => {
    console.log("refreshing", isRefreshing);
    setIsRefreshing(true);
  };

  const onEndReached = () => {
    console.log("at the end");
    setIsFetchingMore(true);
    dispatch(
      fetchRealmActivity({
        realm: selectedRealm,
        fetchAfterSignature:
          "3muySMQvb5EmQJnuNYYxzAXHtrBhjFNpRZ7GZxyzGafQCgHvb228pwEYz1HAEJDmVtudqUH9gn5fT1V3Loj89cKN",
      })
    );
  };

  return (
    <Container>
      {isLoadingActivities && !isFetchingMore ? (
        <Loading />
      ) : (
        <FlatList
          data={realmActivity}
          renderItem={renderActivity}
          keyExtractor={(item) => item.signature}
          style={{ padding: 16, minWidth: "100%" }}
          ListFooterComponent={isFetchingMore ? <Loading /> : <EmptyView />}
          scrollIndicatorInsets={{ right: 1 }}
          removeClippedSubviews={true}
          initialNumToRender={15}
          onEndReached={onEndReached}
          onEndReachedThreshold={3}
          // onRefresh={handleRefresh}
          // refreshing={isRefreshing}
          // ItemSeparatorComponent={renderSeparator}
          // ListHeaderComponent={
          //   <DateSeparator>
          //     {realmActivity[0] &&
          //       format(
          //         // @ts-ignore
          //         realmActivity[0]?.blockTime * 1000,
          //         "LLL d, yyyy - p"
          //       )}
          //   </DateSeparator>
          // }
        />
      )}
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

const EmptyView = styled.View`
  height: 150px;
`;
