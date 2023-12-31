import { View } from "react-native";
import { useAppTheme } from "../themes";
import BucketImage from "./BucketImage";
import PostHeaderInfo from "./post/PostHeaderInfo";
import { Button, Divider, Text } from "react-native-paper";
import { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";
import { useUser } from "./UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
type Props = {
  item: any;
  numComments: number;
};

const BottomFeedBar = ({ item, numComments }: Props) => {
  const theme = useAppTheme();
  const { user } = useUser();
  const containsItemId = user?.liked_posts.includes(item.id) ?? false;
  const [likesCount, setLikesCount] = useState(item.likes);
  const [shouldShowInitiallyLiked, setshouldShowInitiallyLiked] =
    useState(containsItemId);
  const addLikesCount = async (x: number) => {
    //required to stop weird like behaviour
    await AsyncStorage.removeItem("feed-posts");

    setshouldShowInitiallyLiked(false);
    if (x < 0) {
      setLikesCount(likesCount - 1);
      if (user) {
        user.liked_posts = user.liked_posts.filter((y) => y !== item.id);
        const { error } = await supabase
          .from("Users")
          .update({ liked_posts: [...user.liked_posts] })
          .eq("id", user.id);
        console.log(error);
      }
    } else {
      setLikesCount(likesCount + x);
      if (user) {
        const { error } = await supabase
          .from("Users")
          .update({ liked_posts: [...user.liked_posts, item.id] })
          .eq("id", user.id);
        user.liked_posts = [...user.liked_posts, item.id];
      }
    }
    const { data, error } = await supabase.rpc("increment_likes", {
      x,
      row_id: item.id,
    });
    console.log(error);
  };

  return (
    <View
      style={{
        marginTop: 12,
        justifyContent: "space-between",
        borderRadius: 10,
        backgroundColor: theme.colors.surfaceVariant,
        flexDirection: "row",
      }}
    >
      <Button icon={"message-outline"} mode="text" textColor={"grey"}>
        {numComments}
      </Button>
      <Button
        icon={
          likesCount > item.likes || shouldShowInitiallyLiked
            ? "arrow-up-bold"
            : "arrow-up-bold-outline"
        }
        mode="text"
        textColor={
          likesCount > item.likes || shouldShowInitiallyLiked ? "cyan" : "grey"
        }
        onPress={() =>
          likesCount > item.likes || shouldShowInitiallyLiked
            ? addLikesCount(-1)
            : addLikesCount(1)
        }
      >
        {likesCount}
      </Button>
    </View>
  );
};

export default BottomFeedBar;
