import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { AppRegistry, StyleSheet, Text, View } from "react-native";
import "react-native-url-polyfill/auto";
import { Styles } from "./constants";
import Login from "./components/Login";
import { UserContextProvider, useUser } from "./components/UserContext";
import { DefaultTheme, PaperProvider } from "react-native-paper";
import Main from "./components/Main";

const theme = {
  ...DefaultTheme,
};

const Container = () => {
  const { user } = useUser();

  return user ? (
    <PaperProvider theme={theme}>
      <Main />
    </PaperProvider>
  ) : (
    <View style={baseStylesForApp.container}>
      <View style={baseStylesForApp.verticallySpaced}></View>
      <Login />
    </View>
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
    marginTop: 40,
    padding: Styles.spacing,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
});
