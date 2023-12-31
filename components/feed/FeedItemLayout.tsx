import { View } from "react-native";
import { useAppTheme } from "../../themes";
import BucketImage from "../BucketImage";
import PostHeaderInfo from "../post/PostHeaderInfo";
import { Divider, Text, TouchableRipple } from "react-native-paper";
import BottomFeedBar from "../BottomFeedBar";
import { supabase } from "../../supabase/supabaseClient";
import { SetStateAction, useEffect, useState } from "react";
import { PostsRow } from "../../types/supabaseTableTypes";
import PostContentInfo from "../post/PostContentInfo";
type Props = {
  item: PostsRow;
  isForSingleGroup: boolean;
};

const FeedItemLayout = ({ item, isForSingleGroup }: Props) => {
  const theme = useAppTheme();
  const [numComments, setNumComments] = useState(0);

  const fetchCommentsNumbers = async () => {
    const { data, error } = await supabase
      .from("Comments")
      .select("id")
      .eq("post", item.id);
    if (error) {
      console.log(error);
    } else {
      setNumComments(data.length);
    }
  };

  useEffect(() => {
    fetchCommentsNumbers();
  }, []);
  return (
    <>
      <View style={{ marginHorizontal: 8, marginVertical: 12 }}>
        {isForSingleGroup ? null : <PostHeaderInfo item={item} />}
        <PostContentInfo item={item} />
        <BottomFeedBar numComments={item.numComments} item={item} />
      </View>
      <Divider style={{ opacity: 0.4 }} />
    </>
  );
};

export default FeedItemLayout;
