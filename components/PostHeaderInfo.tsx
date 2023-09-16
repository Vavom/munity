import { Avatar, Button, Card, Text, TouchableRipple } from "react-native-paper";
import { getTimeAgo } from "./utils/dateUtils";
import { useState } from "react";
import SinglePostView from "./SinglePostView";
import React from "react";
import { useAppTheme } from "../themes";
import { View } from "react-native";
import stringToColor from "./utils/colourUtils";

type Props = {
	item: any;
}

function PostHeaderInfo({ item }: Props) {
	const theme = useAppTheme()
	return (
		<View style={{ marginBottom: 10, flexDirection: "row", alignContent: "center" }} >
			<Avatar.Icon style={{ backgroundColor: stringToColor(item.Groups.name), marginEnd: 5 }} size={20} icon="account-group" />
			<Text style={{ alignSelf: "center" }} variant="bodySmall">
				{item.Groups.name + " • "}
			</Text>
			<Text style={{ alignSelf: "center", color: theme.colors.onSurfaceVariant }} variant="bodySmall">
				{getTimeAgo(item.created_at)}
			</Text>
		</View>)
}
export default PostHeaderInfo
