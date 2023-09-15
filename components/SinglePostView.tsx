import { useEffect, useState } from "react";
import {
  Portal,
  Modal,
  Text,
  Card,
  ActivityIndicator,
  MD2Colors,
  Divider,
  Appbar,
  TextInput,
  Button,
} from "react-native-paper";
import { supabase } from "../supabase/supabaseClient";
import {
  Alert,
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import { GroupsRow } from "../types/supabaseTableTypes";
import { getTimeAgo } from "./utils/dateUtils";
import { useUser } from "./UserContext";
import FeedItem from "./FeedItem";
import CommentItem from "./CommentItem";
import SingleCommentView from "./SingleCommentView";
import React from "react";
import { useAppTheme } from "../themes";

type Props = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  post: any;
};

const SinglePostView = ({ visible, setVisible, post }: Props) => {
  const paperTheme = useAppTheme();
  const { user } = useUser();
  const containerStyle = { padding: 10 };
  const [comment, setComment] = useState<string>("");
  const [comments, setComments] = useState<any>([]);
  const [isPullDownRefreshing, setIsPullDownRefreshing] = useState(false);
  const PAGE_LENGTH = 6;
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(0);

  const fetchComments = async (shouldClearData: boolean, page: number) => {
    setIsRefreshing(true);
    const { data, error } = await supabase
      .from("Comments")
      .select("*")
      .is("parent_comment", null)
      .in("post", [post.id])
      .range(page * PAGE_LENGTH, (page + 1) * PAGE_LENGTH - 1)
      .order("created_at", { ascending: false })
      .limit(PAGE_LENGTH);
    if (error) {
      Alert.alert(JSON.stringify(error.message));
      console.log(error.message);
    } else {
      if (shouldClearData) {
        setComments(data);
        setPage(1);
      } else {
        setComments((prevData: any) => [...prevData, ...data]);
        setPage(page + 1);
      }
    }
    setIsRefreshing(false);
  };

  const commentSubmit = async () => {
    const { error } = await supabase.from("Comments").insert({
      post: post.id,
      user: user?.id,
      parent_comment: null,
      content: comment,
      name: user?.user_metadata.name,
    });
    if (error) Alert.alert(JSON.stringify(error.message));
  };

  return (
    <>
      <Portal theme={paperTheme}>
        <Modal
          style={{ height: "100%" }}
          visible={visible}
          onDismiss={() => setVisible(false)}
          contentContainerStyle={containerStyle}
          theme={paperTheme}
        >
          <View style={{ height: "100%" }}>
            <Appbar.BackAction onPress={() => setVisible(false)} />
            <View style={{ marginHorizontal: 20 }}>
              <Text style={{ marginBottom: 10 }} variant="bodySmall">
                {post.Groups.name + " • " + getTimeAgo(post.created_at)}
              </Text>
              <Text style={{ marginBottom: 5 }} variant="titleLarge">
                {post.title}
              </Text>
              <Text variant="bodyMedium">{post.content}</Text>
              <Divider style={{ marginVertical: 20 }} />
              <View style={styles.container}>
                <TextInput
                  label="Comment"
                  value={comment}
                  onChangeText={(comment) => setComment(comment)}
                  style={styles.textInput}
                />
                <Button
                  mode="contained"
                  disabled={comment.length === 0}
                  onPress={commentSubmit}
                  style={styles.button}
                >
                  Submit
                </Button>
              </View>
              <SafeAreaView>
                <FlatList
                  style={{ height: "75%" }}
                  showsVerticalScrollIndicator={false}
                  refreshControl={
                    <RefreshControl
                      refreshing={isPullDownRefreshing}
                      onRefresh={() => {
                        fetchComments(true, 0);
                      }}
                      colors={["#3498db"]} // Customize the loading indicator color
                    />
                  }
                  data={comments}
                  onEndReached={() => {
                    if (!isRefreshing) {
                      fetchComments(false, page);
                    }
                  }}
                  ListFooterComponent={
                    <ActivityIndicator
                      style={{ margin: 20 }}
                      animating={isRefreshing}
                      color={MD2Colors.purple100}
                    />
                  }
                  onEndReachedThreshold={1}
                  renderItem={({ item }) => {
                    return <CommentItem commentItem={item} />;
                  }}
                  keyExtractor={(item) => item.id}
                />
              </SafeAreaView>
            </View>
          </View>
        </Modal>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  textInput: {
    flex: 1, // Take up the available space
    marginRight: 16, // Add some margin between TextInput and Button
  },
  button: {
    width: 100, // Set a fixed width for the button
  },
});

export default SinglePostView;
