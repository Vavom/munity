import { Button, Card, Text, TouchableRipple } from "react-native-paper";
import { getTimeAgo } from "./utils/dateUtils";
import { useState } from "react";
import SinglePostView from "./SinglePostView";
import React from "react";
import { useAppTheme } from "../themes";

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
            <Text style={{ marginBottom: 10 }} variant="bodySmall">
              {item.Groups.name + " • " + getTimeAgo(item.created_at) + item.id}
            </Text>
            <Text style={{ marginBottom: 5 }} variant="titleLarge">
              {item.title}
            </Text>
            <Text variant="bodyMedium">{item.content}</Text>
          </Card.Content>
        </Card>
      </TouchableRipple>
    </>
  );
};

export default FeedItem;
