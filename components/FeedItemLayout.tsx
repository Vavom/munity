import { View } from "react-native";
import { useAppTheme } from "../themes";
import BucketImage from "./BucketImage";
import PostHeaderInfo from "./PostHeaderInfo";
import { Divider, Text } from "react-native-paper";
type Props = {
  item: any;
};

const FeedItemLayout = ({ item }: Props) => {
  const theme = useAppTheme();
  return (
    <>
      <View style={{ marginHorizontal: 8, marginVertical: 12 }}>
        <PostHeaderInfo item={item} />
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
      <Divider style={{ opacity: 0.4 }} />
    </>
  );
};

export default FeedItemLayout;
