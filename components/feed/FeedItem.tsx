import { Card, Divider, TouchableRipple } from "react-native-paper";
import { getTimeAgo } from "../utils/dateUtils";
import { useState } from "react";
import SinglePostView from "../post/SinglePostView";
import React from "react";
import { useAppTheme } from "../../themes";
import FeedItemLayout from "./FeedItemLayout";
import { View } from "react-native";
import { PostsRow } from "../../types/supabaseTableTypes";

type Props = {
  item: PostsRow;
  isForSingleGroup: boolean;
};
const FeedItem = ({ item, isForSingleGroup }: Props) => {
  const theme = useAppTheme();
  const [visible, setVisible] = useState(false);
  const [clickedPost, setClickedPost] = useState<any>(null);

  return (
    <>
      {clickedPost !== null ? (
        <SinglePostView
          setVisible={setVisible}
          post={clickedPost}
          visible={visible}
        />
      ) : null}
      <TouchableRipple
        rippleColor={theme.animationColors.rippleColor}
        onPress={() => {
          setClickedPost(item);
          setVisible(true);
        }}
        key={item.id}
      >
        <FeedItemLayout isForSingleGroup={isForSingleGroup} item={item} />
      </TouchableRipple>
    </>
  );
};

export default FeedItem;
