import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  View,
} from "react-native";
import { Styles } from "../constants";
import { supabase } from "../supabase/supabaseClient";
import { LinearGradient } from "expo-linear-gradient";

import { Button, Text, TextInput } from "react-native-paper";
import { useAppTheme } from "../themes";

const { width, height } = Dimensions.get("window");

export default function Auth() {
  const theme = useAppTheme();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState("");

  const signUp = async () => {
    const signUp = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name: username } },
    });
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase
        .from("profiles")
        .insert([{ id: user.id, username: username, email: email }]);
      if (error) Alert.alert(JSON.stringify(error));
    }
    return signUp;
  };

  const handleLogin = async (type: string, email: string, password: string) => {
    setLoading(type);
    const { data, error } =
      type === "LOGIN"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await signUp();
    if (!error && !data.user)
      Alert.alert("Check your email for the login link!");
    if (error) Alert.alert(JSON.stringify(error));
    setLoading("");
  };

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        style={{
          margin: -20,
          flex: 1,
          justifyContent: "center", // Center the content
          alignItems: "center", // Center the content
          // width: Dimensions.get("window").width,
          // height: Dimensions.get("window").height,
          // borderColor: "red",
          // borderWidth: 2,
        }}
        source={require("../images/corners.png")}
        // source={require("../images/gradientBackgroundBlackCropped.png")}
        resizeMode="cover"
      >
        <View style={styles.container}>
          <View style={styles.verticallySpacedTop}>
            {/* <TextInput
            style={styles.textInputStyle}
            placeholderTextColor={theme.text.textInputPlaceholder}
            // activeOutlineColor="transparent"
            // style={styles.textInputStyle}
            outlineColor="transparent"
            mode="outlined"
            // label="Username"
            onChangeText={(text) => setUsername(text)}
            value={username}
            placeholder="Username"
            autoCapitalize={"none"}
          /> */}
            <Image
              resizeMode="contain"
              style={styles.logoStyle}
              source={require("../images/munityWhite.png")}
            />
            <View style={styles.signInContainer}>
              <TextInput
                style={styles.textInputStyle}
                placeholderTextColor={theme.text.textInputPlaceholder}
                // outlineColor="transparent"
                mode="outlined"
                onChangeText={(text) => setEmail(text)}
                value={email}
                placeholder="email@address.com"
                autoCapitalize={"none"}
              />
              <TextInput
                style={styles.textInputStyle}
                placeholderTextColor={theme.text.textInputPlaceholder}
                mode="outlined"
                // outlineColor="transparent"
                onChangeText={(text) => setPassword(text)}
                value={password}
                secureTextEntry={true}
                placeholder="Password"
                autoCapitalize={"none"}
              />
              <LinearGradient
                colors={["#000A62", "#9C00B6"]} // Define your gradient colors
                start={{ x: 0, y: 0 }} // Start from the left
                end={{ x: 1, y: 0 }} // End at the right
                style={styles.buttonStyle}
              >
                <Button
                  buttonColor="transparent"
                  contentStyle={{ width: "auto" }}
                  mode="contained"
                  disabled={!!loading.length}
                  loading={loading === "LOGIN"}
                  onPress={async () =>
                    await handleLogin("LOGIN", email, password)
                  }
                >
                  {"Sign in"}
                </Button>
              </LinearGradient>
            </View>
          </View>
          <View style={styles.verticallySpacedBottom}>
            <View style={styles.googleandfb}>
              <Button compact icon={"google"} mode="contained-tonal">
                Sign in with Google
              </Button>
              <Button compact icon={"facebook"} mode="contained-tonal">
                Sign in with Facebook
              </Button>
            </View>
            <View style={styles.signUpStyle}>
              <Text>Don't have an account?</Text>
              <Button
                mode="text"
                disabled={!!loading.length}
                loading={loading === "SIGNUP"}
                onPress={async () =>
                  await handleLogin("SIGNUP", email, password)
                }
              >
                Sign up
              </Button>
            </View>
            <Button
              compact={true}
              mode="contained-tonal"
              disabled={!!loading.length}
              loading={loading === "SIGNUP"}
              onPress={async () =>
                await handleLogin("LOGIN", "nshamash123@gmail.com", "123456")
              }
            >
              Sign in nshamash123
            </Button>
            <Button
              compact={true}
              mode="contained-tonal"
              disabled={!!loading.length}
              loading={loading === "SIGNUP"}
              onPress={async () =>
                await handleLogin("LOGIN", "mshamash@hotmail.com", "123456")
              }
            >
              Sign in mshamash
            </Button>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    flexGrow: 1,
    // backgroundColor: "black",
    // paddingTop: 4,
    // paddingBottom: 4,
    // alignSelf: "stretch",
  },
  verticallySpacedTop: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    margin: 40,
    flexGrow: 1,
    gap: 5,
    // borderColor: "red",
    // borderWidth: 3,
  },
  verticallySpacedBottom: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    width: "100%",
    flexGrow: 1,
    // borderColor: "red",
    // borderWidth: 3,
    gap: 5,
  },
  buttonStyle: {
    alignSelf: "center",
    margin: 10,
    width: "auto",
    borderRadius: 20,
  },
  textInputStyle: {
    backgroundColor: "black",
    borderRadius: 10,
  },
  signInContainer: {
    backgroundColor: "black",
    padding: 10,
    borderRadius: 20,
  },
  signUpStyle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  googleandfb: {
    display: "flex",
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  logoStyle: {
    alignSelf: "center",
    width: 200,
    height: 60,
  },
});
