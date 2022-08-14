import { RootTabScreenProps } from "../types";
import { useEffect, useState } from "react";
import styled from "styled-components/native";
import { ActivityCard, Loading } from "../components";
import { FlatList, RefreshControl } from "react-native";
import { format, differenceInDays } from "date-fns";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { fetchRealmActivity } from "../store/activitySlice";
import { useTheme } from "styled-components";

// TWO ways to do this.
// Each separator, check if previous item is the same day
// if not, render day

// second
// update data to be in format for sectionlist component

export default function ActivityScreen({
  navigation,
}: RootTabScreenProps<"Activity">) {
  const { selectedRealm } = useAppSelector((state) => state.realms);
  const { realmActivity, isLoadingActivities, isRefreshingActivities } =
    useAppSelector((state) => state.activities);

  const theme = useTheme();
  const dispatch = useAppDispatch();
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  useEffect(() => {
    // when loading activities is finished we can turn off fetching more
    if (!isLoadingActivities) {
      setIsFetchingMore(false);
    }
  }, [isLoadingActivities]);

  const renderActivity = ({ item }: any) => {
    return <ActivityCard activity={item} key={item.signature} />;
  };

  const handleRefresh = () => {
    dispatch(
      fetchRealmActivity({
        realm: selectedRealm,
        // get the signature of the last activity we have to get more
        isRefreshing: true,
      })
    );
  };

  const onEndReached = () => {
    if (!isFetchingMore && realmActivity && realmActivity.length > 19) {
      const lastActivity = realmActivity?.slice(-1)[0];
      setIsFetchingMore(true);
      dispatch(
        fetchRealmActivity({
          realm: selectedRealm,
          // get the signature of the last activity we have to get more
          fetchAfterSignature: lastActivity?.signature,
        })
      );
    }
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
          ListFooterComponent={
            isFetchingMore ? <Loading size={64} /> : <EmptyView />
          }
          scrollIndicatorInsets={{ right: 1 }}
          removeClippedSubviews={true}
          initialNumToRender={15}
          onEndReached={onEndReached}
          onEndReachedThreshold={1}
          onRefresh={handleRefresh}
          refreshing={isRefreshingActivities}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshingActivities}
              tintColor={theme.gray[300]}
              onRefresh={handleRefresh}
            />
          }
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

const EmptyView = styled.View`
  height: 150px;
`;
