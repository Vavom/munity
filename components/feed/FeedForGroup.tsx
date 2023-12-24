import * as React from "react";
import { Alert, StyleSheet, View } from "react-native";

import { Styles } from "../../constants";
import { supabase } from "../../supabase/supabaseClient";
import { useState } from "react";
import { useUser } from "../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FeedList from "./FeedList";
import { PostsRow } from "../../types/supabaseTableTypes";
import { Appbar, Avatar, Modal, Portal, Text } from "react-native-paper";
import { useAppTheme } from "../../themes";
import stringToColor from "../utils/colourUtils";

type Props = {
  group: any;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const FeedForGroup = ({ visible, setVisible, group }: Props) => {
  const paperTheme = useAppTheme();
  const [posts, setPosts] = React.useState<PostsRow[]>([]);
  const [isPullDownRefreshing, setIsPullDownRefreshing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const { user } = useUser();
  const PAGE_LENGTH = 6;

  const fetchPosts = async (shouldClearData: boolean, page: number) => {
    if (!user) {
      Alert.alert("User does not exist");
      return;
    }
    setIsRefreshing(true);
    const { data, error } = await supabase
      .from("Posts")
      .select("*, Groups(id, name)")
      .in("group", [group.id])
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
        setPosts((prevData: any) => {
          return [...prevData, ...data];
        });
        setPage(page + 1);
      }
    }
    setIsRefreshing(false);
  };

  return (
    <Portal theme={paperTheme}>
      <Modal
        visible={visible}
        onDismiss={() => setVisible(false)}
        theme={paperTheme}
        style={{ marginTop: 40, padding: Styles.spacing - 2 }}
      >
        <Appbar.Header style={{}} mode="small">
          <Avatar.Icon
            style={{
              backgroundColor: stringToColor(group.name),
              marginEnd: 5,
            }}
            size={30}
            icon="account-group"
          />
          <Appbar.Content title={group.name} />
        </Appbar.Header>
        <View style={{ height: "100%" }}>
          <FeedList
            isForSingleGroup={true}
            isPullDownRefreshing={isPullDownRefreshing}
            fetchPosts={fetchPosts}
            posts={posts}
            page={page}
            isRefreshing={isRefreshing}
          />
        </View>
      </Modal>
    </Portal>
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

export default FeedForGroup;
