import {
  Avatar,
  Button,
  Card,
  Text,
  TouchableRipple,
} from "react-native-paper";
import { getTimeAgo } from "./utils/dateUtils";
import { useState } from "react";
import SinglePostView from "./post/SinglePostView";
import React from "react";
import { useAppTheme } from "../themes";
import { View } from "react-native";
import stringToColor from "./utils/colourUtils";
import FeedForGroup from "./feed/FeedForGroup";

type Props = {
  item: any;
  isForSingleGroup: boolean;
};

function PostHeaderInfo({ item, isForSingleGroup }: Props) {
  const [visible, setVisible] = useState(false);
  const theme = useAppTheme();
  if (isForSingleGroup) {
    return null;
  }
  return (
    <View
      style={{ marginBottom: 10, flexDirection: "row", alignContent: "center" }}
    >
      <TouchableRipple
        rippleColor={theme.animationColors.rippleColor}
        onPress={() => {
          setVisible(true);
        }}
        key={item.id}
      >
        <View style={{ flexDirection: "row", alignContent: "center" }}>
          <Avatar.Icon
            style={{
              backgroundColor: stringToColor(item.Groups.name),
              marginEnd: 5,
            }}
            size={20}
            icon="account-group"
          />
          <Text style={{ alignSelf: "center" }} variant="bodySmall">
            {item.Groups.name + " • "}
          </Text>
        </View>
      </TouchableRipple>
      <Text
        style={{ alignSelf: "center", color: theme.colors.onSurfaceVariant }}
        variant="bodySmall"
      >
        {getTimeAgo(item.created_at)}
      </Text>
      <FeedForGroup
        group={item.Groups}
        visible={visible}
        setVisible={setVisible}
      />
    </View>
  );
}
export default PostHeaderInfo;
