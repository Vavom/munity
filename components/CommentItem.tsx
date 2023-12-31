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
import { Comment } from "./post/SinglePostView";

type Props = {
  commentItem: Comment;
};

const CommentItem = ({ commentItem }: Props) => {
  const [visible, setVisible] = useState(false);
  const [clickedComment, setclickedComment] = useState<any>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

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
          <View style={{ flexDirection: "row", marginBottom: 8 }}>
            <Avatar.Icon
              style={{
                backgroundColor: stringToColor(commentItem.user),
                marginEnd: 4,
              }}
              size={20}
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
          {commentItem.child_comments &&
          commentItem.child_comments.length > 0 ? (
            <FlatList
              style={{ marginHorizontal: 8 }}
              showsVerticalScrollIndicator={false}
              data={commentItem.child_comments}
              scrollEnabled={false}
              renderItem={({ item }) => {
                return <CommentItem commentItem={item} />;
              }}
              keyExtractor={(item) => item.id.toString()}
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
