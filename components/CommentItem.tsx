import {
  Avatar,
  Button,
  Card,
  MD2Colors,
  Text,
  TextInput,
  TouchableRipple,
} from "react-native-paper";
import { getTimeAgo } from "./utils/dateUtils";
import { useEffect, useState } from "react";
import SinglePostView from "./post/SinglePostView";
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
import SingleCommentView from "./post/SingleCommentView";
import { useAppTheme } from "../themes";
import stringToColor from "./utils/colourUtils";

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

  useEffect(() => {
    fetchComments(false, 0);
  }, [commentItem]);

  const theme = useAppTheme();

  const VerticalLine = () => {
    return <View style={styles.verticalLine} />;
  };

  return (
    <TouchableRipple
      rippleColor={theme.animationColors.rippleColor}
      onPress={() => {
        setVisible(true);
        setclickedComment(commentItem);
      }}
      key={commentItem.id}
      style={{
        marginVertical: 4,
      }}
    >
      <View style={{ flexDirection: "row" }}>
        {commentItem.parent_comment ? <VerticalLine /> : null}
        <View style={{ marginVertical: 12 }}>
          {clickedComment !== null ? (
            <SingleCommentView
              setVisible={setVisible}
              commentItem={clickedComment}
              visible={visible}
            />
          ) : null}
          <View style={{ flexDirection: "row" }}>
            <Avatar.Icon
              style={{
                backgroundColor: stringToColor(commentItem.user),
                marginEnd: 8,
              }}
              size={24}
              icon="account-circle"
            />
            <View style={{ marginVertical: 4, flexDirection: "row" }}>
              <Text style={{ color: "lightgrey" }} variant="bodySmall">
                {commentItem.name + " • "}
              </Text>
              <Text style={{ color: "grey" }} variant="bodySmall">
                {getTimeAgo(commentItem.created_at)}
              </Text>
            </View>
          </View>
          <Text variant="bodyMedium">{commentItem.content}</Text>
          {comments.length > 0 ? (
            <FlatList
              style={{ marginHorizontal: 8 }}
              showsVerticalScrollIndicator={false}
              data={comments}
              ListFooterComponent={
                <ActivityIndicator
                  style={{ margin: 20 }}
                  animating={isRefreshing}
                  color={MD2Colors.purple100}
                />
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
      </View>
    </TouchableRipple>
  );
};

export default CommentItem;

const styles = StyleSheet.create({
  verticalLine: {
    width: 1,
    marginRight: 12, // Adjust the width of the line as needed
    height: "100%", // Adjust the height of the line as needed
    backgroundColor: "grey", // Change the color of the line as needed
  },
});
