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

type Props = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  commentItem: any;
};

const SingleCommentView = ({ visible, setVisible, commentItem }: Props) => {
  const { userAuth: user } = useUser();
  const containerStyle = { backgroundColor: "white", padding: 10 };
  const [comment, setComment] = useState<string>("");

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

  return (
    <Portal>
      <Modal
        style={{ height: "100%" }}
        visible={visible}
        onDismiss={() => setVisible(false)}
        contentContainerStyle={containerStyle}
        theme={{
          colors: {
            backdrop: "transparent",
          },
        }}
      >
        <View style={{ height: "100%" }}>
          <Appbar.BackAction onPress={() => setVisible(false)} />
          <View style={{ marginHorizontal: 20 }}>
            <Text style={{ marginBottom: 10 }} variant="bodySmall">
              {commentItem.name + " • " + getTimeAgo(commentItem.created_at)}
            </Text>
            <Text variant="bodyMedium">{commentItem.content}</Text>
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
          </View>
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

export default SingleCommentView;
