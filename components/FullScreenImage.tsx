import React, { useState } from "react";
import { TouchableWithoutFeedback, StyleSheet, View, Modal, Image } from "react-native";
import ImageView from "react-native-image-viewing";

type Props = {
	imageUrl: string
}


const FullScreenImage = ({ imageUrl }: Props) => {
	const [isFullScreen, setFullScreen] = useState(false);

	const toggleFullScreen = () => {
		setFullScreen(!isFullScreen);
	};

	return (
		<View >
			<TouchableWithoutFeedback onPress={toggleFullScreen}>
				<Image
					resizeMode="cover"
					source={{ uri: 'data:image/jpeg;base64,' + imageUrl }}
					style={{ borderRadius: 20, width: '100%', aspectRatio: 1 }}
				/>
			</TouchableWithoutFeedback>
			<ImageView
				images={[{ uri: 'data:image/jpeg;base64,' + imageUrl }]}
				imageIndex={0} visible={isFullScreen} onRequestClose={toggleFullScreen} />
		</View>
	);
};

export default FullScreenImage
