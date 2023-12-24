import React, { useState } from "react";
import {
  TouchableWithoutFeedback,
  StyleSheet,
  View,
  Image,
  Animated,
} from "react-native";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useAppTheme } from "../themes";
import { Portal, Modal } from "react-native-paper";
import ImageViewer from "react-native-reanimated-image-viewer";

type Props = {
  imageUrl: string;
  height: any;
};

const FullScreenImage = ({ imageUrl, height }: Props) => {
  const [isFullScreen, setFullScreen] = useState(false);
  const paperTheme = useAppTheme();
  const [visible, setVisible] = useState(false);
  const toggleFullScreen = () => {
    setFullScreen(!isFullScreen);
  };

  return (
    <View>
      <TouchableWithoutFeedback onPress={toggleFullScreen}>
        <Animated.Image
          resizeMode="cover"
          source={{ uri: "data:image/jpeg;base64," + imageUrl }}
          style={{
            borderRadius: 10,
            height: height,
            width: "100%",
            aspectRatio: 1,
          }}
        />
      </TouchableWithoutFeedback>
      <Portal theme={paperTheme}>
        <Modal
          visible={isFullScreen}
          onDismiss={() => setFullScreen(false)}
          theme={paperTheme}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ImageViewer
            imageUrl={"data:image/jpeg;base64," + imageUrl}
            width={12000}
            height={12000}
            onRequestClose={() => {
              setFullScreen(false);
            }}
          />
        </Modal>
      </Portal>
    </View>
  );
};

export default FullScreenImage;
