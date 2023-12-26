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
import { supabase } from "../../supabase/supabaseClient";
import {
  Alert,
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
} from "react-native";
import { GroupsRow, PostsRow } from "../../types/supabaseTableTypes";
import { getTimeAgo } from "../utils/dateUtils";
import { useUser } from "../UserContext";
import FeedItem from "../feed/FeedItem";
import CommentItem from "../CommentItem";
import { useAppTheme } from "../../themes";
import PostHeaderInfo from "../PostHeaderInfo";

type Props = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  post: PostsRow;
};

const AddCommentModal = ({ visible, setVisible, post }: Props) => {
  const { userAuth: user } = useUser();
  const [comment, setComment] = useState<string>("");
  const paperTheme = useAppTheme();
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
      >
        <View style={{ height: "100%" }}>
          <Appbar.BackAction onPress={() => setVisible(false)} />
          <View style={{ marginHorizontal: 20 }}>
            <PostHeaderInfo item={post} />
            <Divider style={{ marginVertical: 20 }} />
            <View style={styles.container}>
              <TextInput
                label="Comment"
                mode="flat"
                value={comment}
                style={{ backgroundColor: paperTheme.colors.background }}
                onChangeText={(comment) => setComment(comment)}
                autoFocus={true}
              />
              <Button
                mode="elevated"
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
    flexDirection: "column",
    marginVertical: 20,
  },
  textInput: {
    flex: 1, // Take up the available space
    marginRight: 16, // Add some margin between TextInput and Button
  },
  button: {
    marginVertical: 20,
    alignSelf: "flex-end",
    width: 100, // Set a fixed width for the button
  },
});

export default AddCommentModal;
