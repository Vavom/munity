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
  const [likesCount, setLikesCount] = useState(item.likes);
  const addLikesCount = async (x: number) => {
    if (x < 0) {
      setLikesCount(item.likes);
    } else {
      setLikesCount(item.likes + x);
    }
    const { data, error } = await supabase.rpc(
      "increment_likes" as never,
      {
        x,
        row_id: item.id,
      } as any
    );
  };
  return (
    <>
      <Button
        icon={
          likesCount > item.likes ? "arrow-up-bold" : "arrow-up-bold-outline"
        }
        mode="text"
        onPress={() =>
          likesCount > item.likes ? addLikesCount(-1) : addLikesCount(1)
        }
      >
        {likesCount}
      </Button>
    </>
  );
};

export default BottomFeedBar;
