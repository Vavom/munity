import * as React from "react";
import { Alert, StyleSheet, View } from "react-native";
import {
  BottomNavigation,
  Button,
  Card,
  Modal,
  Portal,
  Text,
  TextInput,
} from "react-native-paper";
import { Styles } from "../constants";
import Account from "./Account";
import { supabase } from "../supabase/supabaseClient";
import { useUser } from "./UserContext";
import Feed from "./Feed";
import CreateGroup from "./CreateGroup";

const Home = () => {
  const { user } = useUser();
  const createPostForGroup4Rums = async () => {
    const { error } = await supabase.from("Posts").insert({
      group: 19,
      user: user?.id,
      title: "Wow this is another post",
      content:
        "This is some great contentThis is some great contentThis is some great contentThis is some great contentThis is some great content",
    });
    if (error) Alert.alert(JSON.stringify(error.message));
  };

  return (
    <View style={{ height: "100%" }}>
      <CreateGroup />
      <Button icon="group" mode="contained" onPress={createPostForGroup4Rums}>
        Create Post
      </Button>
      <Feed />
    </View>
  );
};

export const baseStylesForApp = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: Styles.spacing,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
});

export default Home;
