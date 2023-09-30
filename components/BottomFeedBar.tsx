import { View } from "react-native";
import { useAppTheme } from "../themes";
import BucketImage from "./BucketImage";
import PostHeaderInfo from "./PostHeaderInfo";
import { Button, Divider, Text } from "react-native-paper";
import { useEffect, useState } from "react";
import { supabase } from "../supabase/supabaseClient";
type Props = {
  item: any;
};

const BottomFeedBar = ({ item }: Props) => {
  const theme = useAppTheme();
  const [likesCount, setLikesCount] = useState(0);
  const addLikesCount = async () => {
    const { data: likes, error } = await supabase
      .from("posts")
      .update({ likes: (supabase as any).raw("likes + 1") })
      .match({ id: item.id });
  };
  return (
    <>
      <Button
        icon="chevron-up-circle-outline"
        mode="contained"
        onPress={addLikesCount}
      >
        {item.likes}
      </Button>
    </>
  );
};

export default BottomFeedBar;
