import { useEffect, useState } from "react";
import { Alert, View } from "react-native";
import {
  ActivityIndicator,
  Avatar,
  List,
  MD2Colors,
  Text,
  TextInput,
} from "react-native-paper";
import { supabase } from "../supabase/supabaseClient";
import { GroupsRow } from "../types/supabaseTableTypes";
import { useUser } from "./UserContext";
import GradientButton from "./GradientButton";
import PostHeaderInfo from "./PostHeaderInfo";
import stringToColor from "./utils/colourUtils";

const Search = () => {
  const [title, setTitle] = useState("");
  const [groups, setGroups] = useState<any>();
  const { user } = useUser();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [groupIds, setGroupIds] = useState<any>([]);

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

  const fetchGroupIds = async () => {
    const { data, error } = await supabase
      .from("Groups")
      .select("id")
      .contains("members", [user?.id]);
    if (error) {
      Alert.alert(JSON.stringify(error.message));
    } else {
      setGroupIds(data);
    }
  };

  const joinGroup = async (id: number, members: any) => {
    console.log(members);
    if (user?.id == null) {
      console.log("here");
      return;
    }

    const { data, error } = await supabase
      .from("Groups")
      .update({ members: [...members, user?.id] })
      .eq("id", id)
      .select("*");

    if (error) {
      Alert.alert(JSON.stringify(error.message));
    } else {
      setGroupIds([...groupIds, id]);
    }
    console.log(data);
  };

  useEffect(() => {
    searchGroup();
  }, [title]);

  useEffect(() => {
    fetchGroupIds();
  }, []);

  return (
    <View>
      <TextInput
        label="Title"
        value={title}
        onChangeText={(title) => setTitle(title)}
      />
      {groups?.map((group: GroupsRow) => (
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
          }}
          key={group.id}
        >
          <View
            style={{
              flexGrow: 1,
              flexDirection: "row",
              alignContent: "center",
            }}
          >
            <Avatar.Icon
              style={{
                backgroundColor: stringToColor(group.name),
                marginEnd: 5,
              }}
              size={20}
              icon="account-group"
            />
            <Text style={{ alignSelf: "center" }} variant="bodySmall">
              {group.name.slice(0, 35)}
              {group.name.length > 35 ? "..." : null}
            </Text>
          </View>
          <View>
            <GradientButton
              buttonColor="transparent"
              disabled={groupIds.some(
                (item: { id: any }) => item.id === group.id
              )}
              contentStyle={{ width: "auto" }}
              mode="contained"
              onPress={(e) => {
                joinGroup(group.id, group.members);
              }}
            >
              {groupIds.some((item: { id: any }) => item.id === group.id)
                ? "Joined"
                : "Join"}
            </GradientButton>
          </View>
        </View>
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
