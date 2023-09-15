import { useEffect, useState } from "react";
import { Alert, View } from "react-native";
import {
	ActivityIndicator,
	Button,
	List,
	MD2Colors,
	TextInput,
	Text,
} from "react-native-paper";
import { supabase } from "../supabase/supabaseClient";
import { GroupsRow } from "../types/supabaseTableTypes";
import { useUser } from "./UserContext";
import CreateStepper from "./CreateStepper";

const Search = () => {
	const [title, setTitle] = useState("");
	const [groups, setGroups] = useState<any>();
	const { user } = useUser();
	const [isRefreshing, setIsRefreshing] = useState(false);
	const searchGroup = async () => {
		console.log("his")
		setIsRefreshing(true)
		const { data, error } = await supabase.from("Groups").select("id, name").filter('name', 'ilike', `%${title}%`)

		if (error) Alert.alert(JSON.stringify(error.message));
		setGroups(data)
		console.log(data)
		setIsRefreshing(false)
	};

	useEffect(() => {
		searchGroup()
	}, [title])

	return (
		<View>
			<TextInput
				label="Title"
				value={title}
				onChangeText={(title) => setTitle(title)}
			/>
			{groups?.map((group: GroupsRow) => (
				<List.Item
					key={group.id}
					title={group.name}
				/>
			))}
			{isRefreshing ? <ActivityIndicator
				style={{ margin: 20 }}
				animating={true}
				color={MD2Colors.purple100}
			/> : null}
		</View>
	);
};

export default Search;
