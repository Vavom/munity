import { Avatar, Button, Card, Text, TouchableRipple } from "react-native-paper";
import { getTimeAgo } from "./utils/dateUtils";
import { useState } from "react";
import SinglePostView from "./SinglePostView";
import React from "react";
import { darkTheme, useAppTheme } from "../themes";
import { View, Image } from "react-native";
import stringToColor from "./utils/colourUtils";
import PostHeaderInfo from "./PostHeaderInfo";
import BucketImage from "./BucketImage";

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
        style={{ marginVertical: 5 }}
        key={item.id}
      >
        <Card>
          <Card.Content>
            <PostHeaderInfo item={item} />
            <Text style={{ marginBottom: 5 }} variant="titleLarge">
              {item.title}
            </Text>
            {item.media != null ? <BucketImage path={item.media} /> : null}
            <Text style={{ color: theme.colors.onSurfaceVariant }} variant="bodyMedium">{item.content}</Text>
          </Card.Content>
        </Card>
      </TouchableRipple>
    </>
  );
};

export default FeedItem;
