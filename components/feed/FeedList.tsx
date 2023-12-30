import { FlatList, RefreshControl } from "react-native";
import { ActivityIndicator, Button, MD2Colors } from "react-native-paper";
import FeedItem from "./FeedItem";
import { useEffect, useRef, useState } from "react";
import Animated, {
  Easing,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useEvent,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";
import GradientButton from "../GradientButton";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Props = {
  isPullDownRefreshing: boolean;
  setIsPullDownRefreshing: React.Dispatch<React.SetStateAction<boolean>>;
  fetchPosts: any;
  posts: any;
  page: number;
  isRefreshing: boolean;
  isForSingleGroup: boolean;
};
const REFRESH_BUTTON_OFFSET_Y = 70;
const FeedList = ({
  isPullDownRefreshing,
  setIsPullDownRefreshing,
  fetchPosts,
  posts,
  page,
  isRefreshing,
  isForSingleGroup,
}: Props) => {
  const [showTopButton, setShowTopButton] = useState(true);

  const scrollY = useSharedValue(0);
  const scrollY100 = useSharedValue(REFRESH_BUTTON_OFFSET_Y);
  const prevScrollY = useSharedValue(0);

  const translateY = useAnimatedStyle(() => {
    const translate = scrollY.value - scrollY100.value;
    return {
      transform: [
        {
          translateY: (translate > 0 ? 0 : -translate) - 70,
        },
      ],
    };
  });
  useEffect(() => {
    const intervalId = setInterval(() => {
      const checkTime = async () => {
        let fetchTime = await AsyncStorage.getItem("fetch-time");
        if (fetchTime) {
          // 1000 seconds
          console.log(new Date().getTime() - JSON.parse(fetchTime) > 1000000);
          setShowTopButton(
            new Date().getTime() - JSON.parse(fetchTime) > 1000000
          );
        }
      };
      checkTime();
    }, 99999);

    // Clean up the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      {showTopButton && !isForSingleGroup && (
        <Animated.View
          style={[
            { zIndex: 9, alignSelf: "center", position: "absolute" },
            translateY,
          ]}
        >
          <GradientButton
            buttonColor="transparent"
            contentStyle={{ width: "auto" }}
            mode="contained"
            onPress={() => {
              setIsPullDownRefreshing(true);
              fetchPosts(true, 0);
              setShowTopButton(false);
            }}
          >
            Refresh
          </GradientButton>
        </Animated.View>
      )}
      <FlatList
        style={{ height: "100%" }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isPullDownRefreshing}
            onRefresh={() => {
              fetchPosts(true, 0);
            }}
            colors={["#3498db"]} // Customize the loading indicator color
          />
        }
        data={posts}
        onScroll={(event) => {
          prevScrollY.value = Math.round(scrollY.value);
          scrollY.value = Math.round(event.nativeEvent.contentOffset.y);
          if (
            prevScrollY.value < scrollY.value &&
            scrollY.value - scrollY100.value >= 0
          ) {
            scrollY100.value = Math.round(event.nativeEvent.contentOffset.y);
          }
          if (
            prevScrollY.value > scrollY.value &&
            scrollY100.value - scrollY.value >= REFRESH_BUTTON_OFFSET_Y
          ) {
            scrollY100.value = Math.round(
              event.nativeEvent.contentOffset.y + REFRESH_BUTTON_OFFSET_Y
            );
          }
        }}
        onEndReached={() => {
          if (!isRefreshing) {
            fetchPosts(false, page);
          } // LOAD MORE DATA
        }}
        ListFooterComponent={
          <ActivityIndicator
            style={{ margin: 20 }}
            animating={isRefreshing}
            color={MD2Colors.purple100}
          />
        }
        onEndReachedThreshold={4}
        refreshing={isRefreshing}
        renderItem={({ item }) => (
          <FeedItem isForSingleGroup={isForSingleGroup} item={item} />
        )}
        keyExtractor={(post) => post.id}
      />
    </>
  );
};

export default FeedList;
