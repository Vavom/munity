import { FlatList, RefreshControl } from "react-native-gesture-handler";
import { ActivityIndicator, MD2Colors } from "react-native-paper";
import FeedItem from "./FeedItem";

type Props = {
  isPullDownRefreshing: boolean;
  fetchPosts: any;
  posts: any;
  page: number;
  isRefreshing: boolean;
};

const FeedList = ({
  isPullDownRefreshing,
  fetchPosts,
  posts,
  page,
  isRefreshing,
}: Props) => {
  return (
    <FlatList
      style={{ height: "100%" }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isPullDownRefreshing}
          onRefresh={() => {
            fetchPosts(true, 0);
          }}
          colors={["#3498db"]} // Customize the loading indicator color
        />
      }
      data={posts}
      onEndReached={() => {
        if (!isRefreshing) {
          fetchPosts(false, page);
        } // LOAD MORE DATA
      }}
      ListFooterComponent={
        <ActivityIndicator
          style={{ margin: 20 }}
          animating={isRefreshing}
          color={MD2Colors.purple100}
        />
      }
      onEndReachedThreshold={1}
      renderItem={({ item }) => <FeedItem item={item} />}
      keyExtractor={(post) => post.id}
    />
  );
};

export default FeedList;
