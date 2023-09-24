import { useEffect, useState } from "react";
import { Alert, View } from "react-native";
import { ActivityIndicator, MD2Colors, TextInput } from "react-native-paper";
import { supabase } from "../supabase/supabaseClient";
import { GroupsRow } from "../types/supabaseTableTypes";
import { useUser } from "./UserContext";
import SearchItem from "./SearchItem";

const Search = () => {
  const [title, setTitle] = useState("");
  const [groups, setGroups] = useState<any>();
  const { user, refetchUser } = useUser();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [groupIds, setGroupIds] = useState<number[]>(user?.groups ?? []);

  const searchGroup = async () => {
    if (title.length === 0) {
      setGroups(undefined);
      return;
    }
    setIsRefreshing(true);
    const { data, error } = await supabase
      .from("Groups")
      .select("id, name, members")
      .filter("name", "ilike", `%${title}%`)
      .limit(10);
    if (error) Alert.alert(JSON.stringify(error.message));
    setGroups(data);
    setIsRefreshing(false);
  };

  const joinGroup = async (id: number) => {
    setGroupIds([...groupIds, id]);
    if (user === null) {
      return;
    }

    const { data, error } = await supabase
      .from("Users")
      .update({ groups: [...new Set([...user.groups, ...groupIds, id])] })
      .eq("id", user.id)
      .select("*")
      .single();

    user.groups = [...new Set([...user.groups, ...groupIds, id])];

    //Update group IDs

    if (error) {
      Alert.alert(JSON.stringify(error.message));
    }
  };

  useEffect(() => {
    searchGroup();
  }, [title]);

  return (
    <View>
      <TextInput
        label="Title"
        value={title}
        onChangeText={(title) => setTitle(title)}
      />
      {groups?.map((group: GroupsRow) => (
        <SearchItem
          group={group}
          groupIds={groupIds}
          joinGroup={joinGroup}
          key={group.id}
        />
      ))}
      {isRefreshing ? (
        <ActivityIndicator
          style={{ margin: 20 }}
          animating={true}
          color={MD2Colors.purple100}
        />
      ) : null}
    </View>
  );
};

export default Search;
