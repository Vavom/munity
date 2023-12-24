import "react-native-gesture-handler";
import {
  Alert,
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
import {
  ActivityIndicator,
  MD2Colors,
  PaperProvider,
} from "react-native-paper";
import Main from "./components/Main";
import React, { useEffect, useState } from "react";
import { darkTheme } from "./themes";
import { StatusBar } from "react-native";
import { supabase } from "./supabase/supabaseClient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const Container = () => {
  const { userAuth, user } = useUser();
  const insets = useSafeAreaInsets();

  return (
    <PaperProvider theme={darkTheme}>
      <StatusBar />
      {userAuth ? (
        user ? (
          <View style={{ flex: 1, paddingTop: insets.top }}>
            <Main />
          </View>
        ) : (
          <View
            style={{
              ...baseStylesForApp.container,
              justifyContent: "center",
              paddingTop: insets.top,
            }}
          >
            <ActivityIndicator
              size={"large"}
              animating={true}
              color={MD2Colors.purple100}
            />
          </View>
        )
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
    <SafeAreaProvider>
      <UserContextProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Container />
        </GestureHandlerRootView>
      </UserContextProvider>
    </SafeAreaProvider>
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
