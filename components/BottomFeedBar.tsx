import { View } from "react-native";
import { useAppTheme } from "../themes";
import BucketImage from "./BucketImage";
import PostHeaderInfo from "./PostHeaderInfo";
import { Button, Divider, Text } from "react-native-paper";
import { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";
import { useUser } from "./UserContext";
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
    setshouldShowInitiallyLiked(false);
    if (x < 0) {
      setLikesCount(item.likes);
      if (user) {
        user.liked_posts = user.liked_posts.filter((y) => y !== item.id);
        const { error } = await supabase
          .from("Users")
          .update({ liked_posts: [...user.liked_posts] })
          .eq("id", user.id);
        console.log(error);
      }
    } else {
      setLikesCount(item.likes + x);
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
        flexDirection: "row",
      }}
    >
      <Button
        onPress={() => {}}
        icon={"message-outline"}
        mode="elevated"
        textColor={"grey"}
      >
        {numComments}
      </Button>
      <Button
        icon={
          likesCount > item.likes || shouldShowInitiallyLiked
            ? "arrow-up-bold"
            : "arrow-up-bold-outline"
        }
        mode="elevated"
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
