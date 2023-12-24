import { View } from "react-native";
import stringToColor from "./utils/colourUtils";
import { Avatar, Text } from "react-native-paper";
import GradientButton from "./GradientButton";
import { GroupsRow } from "../types/supabaseTableTypes";
import { useUser } from "./UserContext";

type Props = {
  group: GroupsRow;
  groupIds: number[];
  joinGroup: (id: number) => void;
};

const SearchItem = ({ group, groupIds, joinGroup }: Props) => {
  const { refetchUser } = useUser();
  return (
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
          disabled={groupIds.some((id: number) => id === group.id)}
          contentStyle={{ width: "auto" }}
          mode="contained"
          onPress={(e) => {
            joinGroup(group.id);
            refetchUser();
          }}
        >
          {groupIds.some((id: number) => id === group.id) ? "Joined" : "Join"}
        </GradientButton>
      </View>
    </View>
  );
};

export default SearchItem;
