import {
  NavigationContainer,
  ParamListBase,
  RouteProp,
} from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { supabase } from "../supabase/supabaseClient";
import { GroupsRow } from "../types/supabaseTableTypes";
import { useUser } from "./UserContext";
import { View } from "react-native";
import { Text } from "react-native-paper";
import GroupFeed from "./GroupFeed";
import { Database } from "../types/supabase";
import Home from "./Home";

type Props = {
  HomeScreen: (
    HomeRoute: () => React.JSX.Element,
    navigation: any
  ) => React.JSX.Element;
  setIndex: Dispatch<SetStateAction<number>>;
};

const DrawerMain = ({ HomeScreen, setIndex }: Props) => {
  const Drawer = createDrawerNavigator();
  const { user } = useUser();
  const [noGroupsYet, setNoGroupsYet] = useState(true);
  const [groups, setGroups] = useState<GroupsRow[] | null>(null);
  const retrieveGroups = async () => {
    if (user?.id) {
      const { data, error } = await supabase
        .from("Groups")
        .select("*")
        .contains("members", [user.id]);
      if (error) {
        setNoGroupsYet(true);
      } else {
        setNoGroupsYet(false);
        setGroups(data);
      }
    }
  };

  useEffect(() => {
    retrieveGroups();
  }, []);
  const GroupFeedItem = (groupId: number, navigation: any) => {
    navigation.addListener("focus", () => {
      setIndex(0);
    });
    const screen = (
      <View style={{ height: "100%" }}>
        <GroupFeed groupId={groupId} navigation={navigation} />
      </View>
    );
    return HomeScreen(() => screen, navigation);
  };

  const OriginalHome = ({ navigation }: any) => {
    const screen = (
      <View style={{ height: "100%" }}>
        <Home />
      </View>
    );
    return HomeScreen(() => screen, navigation);
  };

  return (
    <>
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Home">
          <Drawer.Screen
            name="Home"
            options={{
              drawerItemStyle: { display: "none" },
            }}
            component={OriginalHome}
          />
          {groups?.map((group: GroupsRow) => {
            const card = (
              <Drawer.Screen key={group.id} name={group.name}>
                {({ navigation }) => GroupFeedItem(group.id, navigation)}
              </Drawer.Screen>
            );
            return card;
          })}
        </Drawer.Navigator>
      </NavigationContainer>
    </>
  );
};

export default DrawerMain;
