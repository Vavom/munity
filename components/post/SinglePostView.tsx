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
import PostHeaderInfo from "../PostHeaderInfo";
import BucketImage from "../BucketImage";
import AddCommentModal from "./AddCommentModal";

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
  const [stopRefreshing, setStopRefreshing] = useState(false);
  const [visibleComment, setVisibleComment] = useState(false);

  const fetchComments = async (shouldClearData: boolean, page: number) => {
    if (stopRefreshing) {
      return;
    }
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
        setStopRefreshing(data.length < 1);
        setComments((prevData: any) => [...prevData, ...data]);
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
                  <Text variant="titleLarge">{post.title}</Text>
                  {post.media != null ? (
                    <BucketImage path={post.media} />
                  ) : null}
                  <Text variant="bodyMedium">{post.content}</Text>
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
            keyExtractor={(item) => item.id}
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
