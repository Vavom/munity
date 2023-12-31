import { useState } from "react";
import {
  Portal,
  Modal,
  Text,
  ActivityIndicator,
  MD2Colors,
  Divider,
  Appbar,
  Button,
} from "react-native-paper";
import { supabase } from "../../supabase/supabaseClient";
import {
  Alert,
  View,
  StyleSheet,
  RefreshControl,
  Animated,
} from "react-native";
import { useUser } from "../UserContext";
import CommentItem from "../CommentItem";
import React from "react";
import { useAppTheme } from "../../themes";
import PostHeaderInfo from "./PostHeaderInfo";
import BucketImage from "../BucketImage";
import AddCommentModal from "./AddCommentModal";
import PostContentInfo from "./PostContentInfo";

type Props = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  post: any;
};

export interface Comment {
  content: string;
  created_at: string;
  id: number;
  name: string;
  parent_comment: number | null;
  post: number;
  user: string;
  child_comments?: Comment[];
}

const SinglePostView = ({ visible, setVisible, post }: Props) => {
  const paperTheme = useAppTheme();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isPullDownRefreshing, setIsPullDownRefreshing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stopRefreshing, setStopRefreshing] = useState(false);
  const [hasDoneFirstFetch, setHasDoneFirstFetch] = useState(false);
  const [visibleComment, setVisibleComment] = useState(false);

  const fetchComments = async () => {
    if (stopRefreshing) {
      return;
    }
    setIsRefreshing(true);
    const { data, error } = await supabase
      .from("Comments")
      .select("*")
      .in("post", [post.id])
      .order("created_at", { ascending: false });
    if (error) {
      Alert.alert(JSON.stringify(error.message));
      console.log(error.message);
    } else {
      setComments(nestComments(data));
    }
    setIsRefreshing(false);
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
        <View
          style={{
            marginHorizontal: 18,
            height: "100%",
            marginBottom: 20,
          }}
        >
          <Animated.FlatList
            ListHeaderComponent={
              <>
                <PostHeaderInfo item={post} />
                <View style={{ marginBottom: 4 }}>
                  <PostContentInfo item={post} />
                  <Divider style={{ marginVertical: 20 }} />
                </View>
              </>
            }
            contentContainerStyle={{
              flexGrow: 1,
            }}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isPullDownRefreshing}
                onRefresh={() => {
                  fetchComments();
                }}
                colors={["#3498db"]} // Customize the loading indicator color
              />
            }
            data={comments}
            onEndReached={() => {
              if (!isRefreshing && !hasDoneFirstFetch) {
                setHasDoneFirstFetch(true);
                fetchComments();
              }
            }}
            ListFooterComponent={
              <>
                {isRefreshing ? (
                  <ActivityIndicator
                    style={{ margin: 20 }}
                    animating={isRefreshing}
                    color={MD2Colors.purple100}
                  />
                ) : null}
                <View style={{ height: 100 }}></View>
              </>
            }
            onEndReachedThreshold={0.1}
            renderItem={({ item }) => {
              return <CommentItem commentItem={item} />;
            }}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>
        <AddCommentModal
          visible={visibleComment}
          setVisible={setVisibleComment}
          post={post}
        />
        <View
          style={{
            ...styles.container,
            marginHorizontal: 18,
            justifyContent: "flex-start",
            borderRadius: 10,
            backgroundColor: paperTheme.colors.surfaceVariant,
            flexDirection: "row",
            position: "absolute",
            bottom: 30,
            left: 0,
            right: 0,
            zIndex: 10,
          }}
        >
          <Button
            onPress={() => setVisibleComment(true)}
            icon={"message-outline"}
            mode="text"
            textColor={"grey"}
            contentStyle={{ alignSelf: "flex-start" }}
            style={styles.button}
          >
            Comment
          </Button>
        </View>
      </Modal>
    </Portal>
  );
};

function nestComments(comments: Comment[]) {
  const commentMap = new Map();

  // Create a map for quick lookups based on id
  comments.forEach((comment) => {
    comment.child_comments = [];
    commentMap.set(comment.id, comment);
  });

  const nestedComments: Comment[] = [];

  // Iterate through comments to build the nested structure
  comments.forEach((comment) => {
    if (comment.parent_comment === null) {
      // Top-level comment
      nestedComments.push(comment);
    } else {
      // Child comment, add it to the parent's children array
      const parentComment = commentMap.get(comment.parent_comment);
      if (parentComment) {
        parentComment.child_comments.push(comment);
      }
    }
  });

  return nestedComments;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  textInput: {
    flex: 1, // Take up the available space
    marginRight: 16, // Add some margin between TextInput and Button
  },
  button: {
    width: "100%", // Set a fixed width for the button
    borderRadius: 10,
  },
});

export default SinglePostView;
