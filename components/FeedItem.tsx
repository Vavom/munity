import { Card, Divider, TouchableRipple } from "react-native-paper";
import { getTimeAgo } from "./utils/dateUtils";
import { useState } from "react";
import SinglePostView from "./SinglePostView";
import React from "react";
import { useAppTheme } from "../themes";
import FeedItemLayout from "./FeedItemLayout";
import { View } from "react-native";

type Props = {
  item: any;
};
const FeedItem = ({ item }: Props) => {
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
        <FeedItemLayout item={item} />
      </TouchableRipple>
    </>
  );
};

export default FeedItem;
