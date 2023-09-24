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
  const { userAuth: user } = useUser();
  return (
    <View style={{ height: "100%" }}>
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
