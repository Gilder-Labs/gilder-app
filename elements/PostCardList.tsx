import styled from "styled-components/native";
import { PostCard } from "./PostCard";
import { Loading } from "../components";
import { FlatList, RefreshControl } from "react-native";
import { useAppDispatch, useAppSelector } from "../hooks/redux";

export const PostCardList = () => {
  const renderActivity = ({ item }: any) => {
    return <PostCard post={item} />;
  };

  return (
    <Container>
      <FlatList
        data={[1, 2, 3]}
        renderItem={renderActivity}
        ListFooterComponent={<EmptyView />}
        scrollIndicatorInsets={{ right: -8 }}
        initialNumToRender={20}
        style={{ minWidth: "100%" }}
        // onEndReached={onEndReached}
        // onEndReachedThreshold={1}
        // onRefresh={handleRefresh}
        // refreshing={isRefreshingActivities}
        // refreshControl={
        //   <RefreshControl
        //     refreshing={isRefreshingActivities}
        //     tintColor={theme.gray[300]}
        //     onRefresh={handleRefresh}
        //     size={18}
        //   />
        // }
      />
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
`;

const EmptyView = styled.View`
  height: 300px;
`;
