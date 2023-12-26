import { Text } from "react-native-paper";
import React from "react";
import { useAppTheme } from "../../themes";
import { View } from "react-native";
import BucketImage from "../BucketImage";

type Props = {
  item: any;
};

function PostContentInfo({ item }: Props) {
  const theme = useAppTheme();
  return (
    <View>
      <Text style={{ marginBottom: 5 }} variant="titleLarge">
        {item.title}
      </Text>
      {item.media != null ? (
        <BucketImage path={item.media} />
      ) : (
        <Text
          style={{ color: theme.colors.onSurfaceVariant }}
          variant="bodyMedium"
        >
          {item.content}
        </Text>
      )}
    </View>
  );
}
export default PostContentInfo;
