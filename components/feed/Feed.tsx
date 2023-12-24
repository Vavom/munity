import * as React from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
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
import { Styles } from "../../constants";
import { supabase } from "../../supabase/supabaseClient";
import { useState } from "react";
import Groups from "../Groups";
import { getTimeAgo } from "../utils/dateUtils";
import SinglePostView from "../post/SinglePostView";
import FeedItem from "./FeedItem";
import { useUser } from "../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FeedList from "./FeedList";
import { PostsRow } from "../../types/supabaseTableTypes";

const Feed = () => {
  const [posts, setPosts] = React.useState<PostsRow[]>([]);
  const [isPullDownRefreshing, setIsPullDownRefreshing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [groupIds, setGroupIds] = useState<any>([]);
  const { user, refetchUser } = useUser();
  const PAGE_LENGTH = 6;

  const fetchPosts = async (shouldClearData: boolean, page: number) => {
    await AsyncStorage.removeItem("feed-posts");
    if (!user) {
      Alert.alert("User does not exist");
      return;
    }
    setIsRefreshing(true);

    const storedPosts = await AsyncStorage.getItem("feed-posts");
    const pageStored = JSON.parse(
      (await AsyncStorage.getItem("feed-posts-page")) ?? "0"
    );
    if (!shouldClearData && page === 0 && storedPosts !== null) {
      setPosts(JSON.parse(storedPosts));
      setPage(pageStored);
    } else {
      await AsyncStorage.removeItem("feed-posts-page");

      const { data, error } = await supabase
        .from("Posts")
        .select("*, Groups(id, name)")
        .in("group", user.groups)
        .range(page * PAGE_LENGTH, (page + 1) * PAGE_LENGTH - 1)
        .order("created_at", { ascending: false })
        .limit(PAGE_LENGTH);
      if (error) {
        Alert.alert(JSON.stringify(error.message));
        console.log(error.message);
      } else {
        if (shouldClearData) {
          setPosts(() => {
            // AsyncStorage.setItem("feed-posts", JSON.stringify(data));
            return data;
          });
          setPage(1);
          await AsyncStorage.setItem("feed-posts-page", JSON.stringify(1));
        } else {
          setPosts((prevData: any) => {
            AsyncStorage.setItem(
              "feed-posts",
              JSON.stringify([...prevData, ...data])
            );
            return [...prevData, ...data];
          });
          setPage(page + 1);
          await AsyncStorage.setItem(
            "feed-posts-page",
            JSON.stringify(page + 1)
          );
        }
      }
    }
    setIsRefreshing(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <FeedList
        isPullDownRefreshing={isPullDownRefreshing}
        fetchPosts={fetchPosts}
        posts={posts}
        page={page}
        isRefreshing={isRefreshing}
        isForSingleGroup={false}
      />
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
