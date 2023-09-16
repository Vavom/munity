import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import {
  AppRegistry,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import "react-native-url-polyfill/auto";
import { Styles } from "./constants";
import Login from "./components/Login";
import { UserContextProvider, useUser } from "./components/UserContext";
import { ActivityIndicator, MD2Colors, PaperProvider } from "react-native-paper";
import Main from "./components/Main";
import React, { useEffect, useState } from "react";
import { darkTheme } from "./themes";
import { supabase } from "./supabase/supabaseClient";
import AsyncStorage from '@react-native-async-storage/async-storage'


const Container = () => {
  const { user } = useUser();

  return (
    <PaperProvider theme={darkTheme}>
      {user ? (
        <Main />
      ) : (
        <View style={baseStylesForApp.container}>
          <Login />
        </View>
      )}
    </PaperProvider>
  );
};

export default function App() {
  return (
    <UserContextProvider>
      <Container />
    </UserContextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export const baseStylesForApp = StyleSheet.create({
  container: {
    padding: Styles.spacing,
    flex: 1,
    backgroundColor: darkTheme.colors.background,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
});
