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
} from "react-native-paper";
import { supabase } from "../supabase/supabaseClient";
import { Alert, View } from "react-native";
import { GroupsRow } from "../types/supabaseTableTypes";
import { getTimeAgo } from "./utils/dateUtils";

type Props = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  post: any;
};

const SinglePostView = ({ visible, setVisible, post }: Props) => {
  const containerStyle = { backgroundColor: "white", padding: 10 };

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
              {post.Groups.name + " • " + getTimeAgo(post.created_at)}
            </Text>
            <Text style={{ marginBottom: 5 }} variant="titleLarge">
              {post.title}
            </Text>
            <Text variant="bodyMedium">{post.content}</Text>
            <Divider style={{ marginVertical: 20 }} />
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

export default SinglePostView;
