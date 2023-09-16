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
import { useUser } from "./UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Feed = () => {
  const [posts, setPosts] = React.useState<any>([]);
  const [isPullDownRefreshing, setIsPullDownRefreshing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [groupIds, setGroupIds] = useState<any>([])
  const { user } = useUser()
  const PAGE_LENGTH = 6;

  const fetchGroupIds = async () => {
    console.log("groupfetch")
    const { data, error } = await supabase
      .from("Groups")
      .select("id")
      .contains("members", [user?.id])
    if (error) {
      Alert.alert(JSON.stringify(error.message));
    } else {
      setGroupIds(data)
      return data
    }
  }

  const fetchPosts = async (shouldClearData: boolean, page: number) => {
    setIsRefreshing(true);
    const storedPosts = await AsyncStorage.getItem('feed-posts')
    const pageStored = JSON.parse(await AsyncStorage.getItem('feed-posts-page') ?? "0")
    if (!shouldClearData && page === 0 && storedPosts !== null) {
      console.log('here1')
      setPosts(JSON.parse(storedPosts))
      setPage(pageStored)
    } else {
      await AsyncStorage.removeItem('feed-posts')
      await AsyncStorage.removeItem('feed-posts-page')
      console.log('here')
      let ids
      if (groupIds.length < 1) {
        ids = await fetchGroupIds()
      } else {
        ids = groupIds
      }

      const { data, error } = await supabase
        .from("Posts")
        .select("*, Groups(id, name)")
        .in("group", ids.map((object: { id: any; }) => object.id))
        .range(page * PAGE_LENGTH, (page + 1) * PAGE_LENGTH - 1)
        .order("created_at", { ascending: false })
        .limit(PAGE_LENGTH);
      if (error) {
        Alert.alert(JSON.stringify(error.message));
        console.log(error.message);
      } else {
        if (shouldClearData) {
          setPosts(() => {
            AsyncStorage.setItem('feed-posts', JSON.stringify(data))
            return data
          });
          setPage(1);
          await AsyncStorage.setItem('feed-posts-page', JSON.stringify(1))

        } else {
          setPosts((prevData: any) => {
            AsyncStorage.setItem('feed-posts', JSON.stringify([...prevData, ...data]))
            return [...prevData, ...data]
          });
          setPage(page + 1);
          await AsyncStorage.setItem('feed-posts-page', JSON.stringify(page + 1))

        }
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
            if (!isRefreshing) {
              fetchPosts(false, page);
            }
          }}
          ListFooterComponent={
            <ActivityIndicator
              style={{ margin: 20 }}
              animating={isRefreshing}
              color={MD2Colors.purple100}
            />
          }
          onEndReachedThreshold={0.5}
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
