import styled from "styled-components/native";
import { TransactionCard } from "./TransactionCard";
import { Loading } from "../components";
import { FlatList, RefreshControl } from "react-native";
import { useAppDispatch, useAppSelector } from "../hooks/redux";

export const TransactionList = () => {
  const { transactions, isLoadingTransactions } = useAppSelector(
    (state) => state.wallet
  );

  const renderActivity = ({ item }: any) => {
    return <TransactionCard transaction={item} key={item.signature} />;
  };

  return (
    <Container>
      <FlatList
        data={transactions}
        renderItem={renderActivity}
        keyExtractor={(item) => item.signature}
        ListFooterComponent={<EmptyView />}
        scrollIndicatorInsets={{ right: -8 }}
        initialNumToRender={20}
        style={{ paddingLeft: 16, paddingRight: 16, minWidth: "100%" }}
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
