import * as React from "react";
import { StyleSheet, View } from "react-native";
import { Appbar, BottomNavigation, Text } from "react-native-paper";
import { Styles } from "../constants";
import Account from "./Account";
import Home from "./Home";
import Search from "./Search";
import Groups from "./Groups";
import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useUser } from "./UserContext";
import { GroupsRow } from "../types/supabaseTableTypes";
import { supabase } from "../supabase/supabaseClient";
import DrawerMain from "./DrawerMain";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";
import Create from "./Create";
import { darkTheme } from "../themes";

const AccountRoute = () => (
  <View style={baseStylesForApp.container}>
    <Account />
  </View>
);
const GroupsRoute = () => (
  <View style={baseStylesForApp.container}>
    <Groups />
  </View>
);

const CreateRoute = () => (
  <View style={baseStylesForApp.container}>
    <Create />
  </View>
);
const SearchRoute = () => (
  <View style={baseStylesForApp.container}>
    <Search />
  </View>
);

const Main = () => {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: "home",
      title: "Home",
      focusedIcon: "home",
      unfocusedIcon: "home-outline",
    },
    {
      key: "search",
      title: "Search",
      focusedIcon: "magnify",
      unfocusedIcon: "magnify",
    },
    {
      key: "create",
      title: "Create",
      focusedIcon: "plus-thick",
      unfocusedIcon: "plus",
    },
    {
      key: "groups",
      title: "Groups",
      focusedIcon: "account-group",
      unfocusedIcon: "account-group-outline",
    },
    {
      key: "account",
      title: "Account",
      focusedIcon: "bell",
      unfocusedIcon: "bell-outline",
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: () => (
      <View style={baseStylesForApp.container}>
        <View style={{ height: "100%" }}>
          <Home />
        </View>
      </View>
    ),
    search: () => <SearchRoute />,
    create: () => <CreateRoute />,
    groups: () => <GroupsRoute />,
    account: () => <AccountRoute />,
  });

  return (
    <>
      <Appbar.Header style={{ height: 30 }} mode="small">
        <Appbar.Content title="Home" />
      </Appbar.Header>

      <BottomNavigation
        shifting={false}
        barStyle={{
          backgroundColor: darkTheme.colors.background,
          height: 60,
          justifyContent: "center",
          // paddingVertical: 10,
        }}
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
      />
    </>
  );
};

export const baseStylesForApp = StyleSheet.create({
  container: {
    display: "flex",
    padding: 10,
    paddingBottom: 0,
    flexGrow: 1,
    backgroundColor: darkTheme.colors.background,
  },
  verticallySpaced: {
    paddingTop: 4,
  },
});

export default Main;
