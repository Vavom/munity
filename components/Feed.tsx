import * as React from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  ActivityIndicator,
  Button,
  Card,
  List,
  MD2Colors,
  Modal,
  Portal,
  Text,
} from "react-native-paper";
import { Styles } from "../constants";
import { supabase } from "../supabase/supabaseClient";
import { useState } from "react";
import Groups from "./Groups";
import { getTimeAgo } from "./utils/dateUtils";
import SinglePostView from "./SinglePostView";
import FeedItem from "./FeedItem";

const Feed = () => {
  const [posts, setPosts] = React.useState<any>([]);
  const [isPullDownRefreshing, setIsPullDownRefreshing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const PAGE_LENGTH = 6;
  const fetchPosts = async (shouldClearData: boolean, page: number) => {
    setIsRefreshing(true);
    const { data, error } = await supabase
      .from("Posts")
      .select("*, Groups(id, name)")
      .in("group", [8, 5, 19])
      .range(page * PAGE_LENGTH, (page + 1) * PAGE_LENGTH - 1)
      .order("created_at", { ascending: false })
      .limit(PAGE_LENGTH);
    if (error) {
      Alert.alert(JSON.stringify(error.message));
      console.log(error.message);
    } else {
      if (shouldClearData) {
        setPosts(data);
        setPage(1);
      } else {
        setPosts((prevData: any) => [...prevData, ...data]);
        setPage(page + 1);
      }
    }
    setIsRefreshing(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView>
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
            fetchPosts(false, page);
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
      </SafeAreaView>
    </View>
  );
};

export const baseStylesForApp = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: Styles.spacing,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
});

export default Feed;
