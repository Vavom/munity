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
} from "react-native";
import { GroupsRow } from "../types/supabaseTableTypes";
import { getTimeAgo } from "./utils/dateUtils";
import { useUser } from "./UserContext";
import FeedItem from "./FeedItem";
import CommentItem from "./CommentItem";
import SingleCommentView from "./SingleCommentView";
import React from "react";
import { useAppTheme } from "../themes";
import PostHeaderInfo from "./PostHeaderInfo";
import BucketImage from "./BucketImage";

type Props = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  post: any;
};

const SinglePostView = ({ visible, setVisible, post }: Props) => {
  const paperTheme = useAppTheme();
  const { userAuth: user } = useUser();
  const [comment, setComment] = useState<string>("");
  const [comments, setComments] = useState<any>([]);
  const [isPullDownRefreshing, setIsPullDownRefreshing] = useState(false);
  const PAGE_LENGTH = 6;
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setPage] = useState(0);

  const fetchComments = async (shouldClearData: boolean, page: number) => {
    setIsRefreshing(true);
    const { data, error } = await supabase
      .from("Comments")
      .select("*")
      .is("parent_comment", null)
      .in("post", [post.id])
      .range(page * PAGE_LENGTH, (page + 1) * PAGE_LENGTH - 1)
      .order("created_at", { ascending: false });
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
    <Portal theme={paperTheme}>
      <Modal
        visible={visible}
        onDismiss={() => setVisible(false)}
        theme={paperTheme}
        style={{ marginTop: 50 }}
      >
        <Appbar.Header style={{ marginVertical: 12 }} mode="small">
          <Appbar.BackAction onPress={() => setVisible(false)} />
        </Appbar.Header>
        <View style={{ marginHorizontal: 18, height: "100%" }}>
          <PostHeaderInfo item={post} />
          <View style={{ marginBottom: 4 }}>
            <Text variant="titleLarge">{post.title}</Text>
            {post.media != null ? <BucketImage path={post.media} /> : null}
            <Text variant="bodyMedium">{post.content}</Text>
            <Divider style={{ marginVertical: 20 }} />
          </View>
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
          <FlatList
            contentContainerStyle={{
              flexGrow: 1,
            }}
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
                fetchComments(false, currentPage);
              }
            }}
            ListFooterComponent={
              isRefreshing ? (
                <ActivityIndicator
                  style={{ margin: 20 }}
                  animating={isRefreshing}
                  color={MD2Colors.purple100}
                />
              ) : null
            }
            onEndReachedThreshold={1}
            renderItem={({ item }) => {
              return <CommentItem commentItem={item} />;
            }}
            keyExtractor={(item) => item.id}
          />
        </View>
      </Modal>
    </Portal>
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
