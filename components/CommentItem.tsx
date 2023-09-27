import {
  Button,
  Card,
  MD2Colors,
  Text,
  TextInput,
  TouchableRipple,
} from "react-native-paper";
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
import { useAppTheme } from "../themes";

type Props = {
  commentItem: any;
};

const CommentItem = ({ commentItem }: Props) => {
  const [visible, setVisible] = useState(false);
  const [comment, setComment] = useState<string>("");
  const [comments, setComments] = useState<any>([]);
  const [clickedComment, setclickedComment] = useState<any>(null);
  const { userAuth: user } = useUser();
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

  const theme = useAppTheme();

  return (
    <TouchableRipple
      rippleColor={theme.animationColors.rippleColor}
      onPress={() => {
        setVisible(true);
        setclickedComment(commentItem);
      }}
      key={commentItem.id}
      style={{
        marginBottom: 4,
        marginVertical: 4,
      }}
    >
      <View style={{ margin: 8 }}>
        {clickedComment !== null ? (
          <SingleCommentView
            setVisible={setVisible}
            commentItem={clickedComment}
            visible={visible}
          />
        ) : null}
        <Text style={{ marginBottom: 10 }} variant="bodySmall">
          {commentItem.name + " • " + getTimeAgo(commentItem.created_at)}
        </Text>
        <Text variant="bodyMedium">{commentItem.content}</Text>
        {comments.length > 0 ? (
          <FlatList
            style={{ marginHorizontal: 8 }}
            showsVerticalScrollIndicator={false}
            data={comments}
            ListFooterComponent={
              isRefreshing ? (
                <ActivityIndicator
                  style={{ margin: 20 }}
                  animating={isRefreshing}
                  color={MD2Colors.purple100}
                />
              ) : null
            }
            scrollEnabled={false}
            renderItem={({ item }) => {
              if (item.parent_comment === commentItem.id) {
                return <CommentItem commentItem={item} />;
              }
              return null;
            }}
            keyExtractor={(item) => item.id}
          />
        ) : null}
      </View>
    </TouchableRipple>
  );
};
export default CommentItem;
