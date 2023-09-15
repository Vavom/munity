import { useEffect, useState } from "react";
import { Alert, View } from "react-native";
import {
	ActivityIndicator,
	List,
	MD2Colors,
	TextInput,
} from "react-native-paper";
import { supabase } from "../supabase/supabaseClient";
import { GroupsRow } from "../types/supabaseTableTypes";
import { useUser } from "./UserContext";

const Search = () => {
	const [title, setTitle] = useState("");
	const [groups, setGroups] = useState<any>();
	const { user } = useUser();
	const [isRefreshing, setIsRefreshing] = useState(false);

	const searchGroup = async () => {
		setIsRefreshing(true)
		const { data, error } = await supabase.from("Groups").select("id, name, members").filter('name', 'ilike', `%${title}%`)
		if (error) Alert.alert(JSON.stringify(error.message));
		setGroups(data)
		setIsRefreshing(false)
	};

	const joinGroup = async (id: number, members: any) => {
		console.log(members)
		if (user?.id == null) {
			console.log("here")
			return
		}

		const { data, error } = await supabase
			.from('Groups')
			.update({ members: [...members, user?.id] })
			.eq('id', id)
			.select('*')

		if (error) Alert.alert(JSON.stringify(error.message));
		console.log(data)
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
					onPress={() => joinGroup(group.id, group.members)}
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
