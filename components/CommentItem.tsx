import { Button, Card, MD2Colors, Text, TextInput } from "react-native-paper";
import { getTimeAgo } from "./utils/dateUtils";
import { useEffect, useState } from "react";
import SinglePostView from "./SinglePostView";
import {
  View,
  StyleSheet,
  Alert,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from "react-native";
import { supabase } from "../supabase/supabaseClient";
import { useUser } from "./UserContext";
import SingleCommentView from "./SingleCommentView";

type Props = {
  commentItem: any;
};

const CommentItem = ({ commentItem }: Props) => {
  const [visible, setVisible] = useState(false);
  const [comment, setComment] = useState<string>("");
  const [comments, setComments] = useState<any>([]);
  const [clickedComment, setclickedComment] = useState<any>(null);
  const { user } = useUser();
  const [isPullDownRefreshing, setIsPullDownRefreshing] = useState(false);
  const PAGE_LENGTH = 6;
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(0);

  const fetchComments = async (shouldClearData: boolean, page: number) => {
    setIsRefreshing(true);
    const { data, error } = await supabase
      .from("Comments")
      .select("*")
      .eq("parent_comment", commentItem.id)
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
      post: commentItem.post,
      user: user?.id,
      parent_comment: commentItem.id,
      content: comment,
      name: user?.user_metadata.name,
    });
    if (error) Alert.alert(JSON.stringify(error.message));
  };

  useEffect(() => {
    fetchComments(false, 0);
  }, []);

  return (
    <>
      {clickedComment !== null ? (
        <SingleCommentView
          setVisible={setVisible}
          commentItem={clickedComment}
          visible={visible}
        />
      ) : null}
      <Card
        onPress={() => {
          setVisible(true);
          setclickedComment(commentItem);
        }}
        style={{ marginVertical: 5 }}
        key={commentItem.id}
      >
        <Card.Content>
          <Text style={{ marginBottom: 10 }} variant="bodySmall">
            {commentItem.name + " • " + getTimeAgo(commentItem.created_at)}
          </Text>
          <Text variant="bodyMedium">{commentItem.content}</Text>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={comments}
            ListFooterComponent={
              <ActivityIndicator
                style={{ margin: 20 }}
                animating={isRefreshing}
                color={MD2Colors.purple100}
              />
            }
            onEndReachedThreshold={1}
            renderItem={({ item }) => {
              if (item.parent_comment === commentItem.id) {
                return <CommentItem commentItem={item} />;
              }
              return null;
            }}
            keyExtractor={(item) => item.id}
          />
        </Card.Content>
      </Card>
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
export default CommentItem;
