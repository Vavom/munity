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
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isValidUsername, setIsValidUsername] = useState(false);

  const validateUsername = (text) => {
    // Add unique username check here
    const isValid = text.length >= 6;
    setIsValidUsername(isValid);
    setUsername(text);
  };

  const validatePassword = (text) => {
    // Implement your password validation logic here
    // For example, you can check if the password meets certain criteria
    const isValid = text.length >= 6; // Change this condition as needed
    setIsPasswordValid(isValid);
    setPassword(text);
  };

  const validateEmail = (text) => {
    // Use a regular expression to validate the email format
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    const isValid = emailPattern.test(text);
    setIsValidEmail(isValid);
    setEmail(text);
  };

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
            <Image
              resizeMode="contain"
              style={styles.logoStyle}
              source={require("../images/munityWhite.png")}
            />
            <View style={styles.signInContainer}>
              {isSignUp ? (
                <TextInput
                  style={styles.textInputStyle}
                  placeholderTextColor={theme.text.textInputPlaceholder}
                  activeOutlineColor={theme.colors.secondaryContainer}
                  left={
                    <TextInput.Icon
                      color={theme.colors.secondaryContainer}
                      icon="account"
                    />
                  }
                  right={
                    isValidUsername ? (
                      <TextInput.Icon
                        color={theme.colors.secondary}
                        icon="check-bold"
                      />
                    ) : username.length > 0 ? (
                      <TextInput.Icon
                        color={theme.colors.error}
                        icon="close-thick"
                      />
                    ) : null
                  }
                  // outlineColor={theme.colors.primary}
                  // outlineStyle={{ borderWidth: 3 }}
                  mode="outlined"
                  onChangeText={(text) => validateUsername(text)}
                  value={username}
                  placeholder="Username"
                  autoCapitalize={"none"}
                />
              ) : null}
              <TextInput
                style={styles.textInputStyle}
                placeholderTextColor={theme.text.textInputPlaceholder}
                activeOutlineColor={theme.colors.secondaryContainer}
                left={
                  <TextInput.Icon
                    color={theme.colors.secondaryContainer}
                    icon="email"
                  />
                }
                right={
                  isValidEmail ? (
                    <TextInput.Icon
                      color={theme.colors.secondary}
                      icon="check-bold"
                    />
                  ) : email.length > 0 ? (
                    <TextInput.Icon
                      color={theme.colors.error}
                      icon="close-thick"
                    />
                  ) : null
                }
                // outlineColor={theme.colors.primary}
                // outlineStyle={{ borderWidth: 3 }}
                mode="outlined"
                onChangeText={(text) => validateEmail(text)}
                value={email}
                placeholder="email@address.com"
                autoCapitalize={"none"}
              />
              <TextInput
                style={styles.textInputStyle}
                placeholderTextColor={theme.text.textInputPlaceholder}
                mode="outlined"
                left={
                  <TextInput.Icon
                    color={theme.colors.secondaryContainer}
                    icon="lock"
                  />
                }
                right={
                  isPasswordValid ? (
                    <TextInput.Icon
                      color={theme.colors.secondary}
                      icon="check-bold"
                    />
                  ) : password.length > 0 ? (
                    <TextInput.Icon
                      color={theme.colors.error}
                      icon="close-thick"
                    />
                  ) : null
                }
                // outlineColor={theme.colors.primary}
                // outlineStyle={{ borderWidth: 3 }}
                activeOutlineColor={theme.colors.secondaryContainer}
                onChangeText={(text) => validatePassword(text)}
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
                {isSignUp ? (
                  <Button
                    buttonColor="transparent"
                    contentStyle={{ width: "auto" }}
                    mode="contained"
                    disabled={
                      !!loading.length ||
                      !isPasswordValid ||
                      !isValidEmail ||
                      !isValidUsername
                    }
                    loading={loading === "SIGNUP"}
                    onPress={async () =>
                      await handleLogin("SIGNUP", email, password)
                    }
                  >
                    {"Sign Up"}
                  </Button>
                ) : (
                  <Button
                    buttonColor="transparent"
                    contentStyle={{ width: "auto" }}
                    mode="contained"
                    disabled={
                      !!loading.length || !isPasswordValid || !isValidEmail
                    }
                    loading={loading === "LOGIN"}
                    onPress={async () =>
                      await handleLogin("LOGIN", email, password)
                    }
                  >
                    {"Sign in"}
                  </Button>
                )}
              </LinearGradient>
            </View>
          </View>
          <View style={styles.verticallySpacedBottom}>
            {/* <View
              style={{
                flexGrow: 1,
                justifyContent: "flex-end",
                borderColor: "red",
                borderWidth: 3,
              }}
            > */}
            {!isSignUp ? (
              <>
                {/* <View style={styles.googleandfb}>
                  <Button
                    compact
                    icon={"google"}
                    mode="text"
                    textColor={theme.colors.secondaryContainer}
                  >
                    Sign in with Google
                  </Button>
                  <Button
                    textColor={theme.colors.secondaryContainer}
                    compact
                    icon={"facebook"}
                    mode="text"
                  >
                    Sign in with Facebook
                  </Button>
                </View> */}
                <View style={styles.signUpStyle}>
                  <Text>Don't have an account?</Text>
                  <Button
                    mode="text"
                    textColor={theme.colors.secondary}
                    onPress={() => setIsSignUp(true)}
                    // onPress={async () =>
                    //   await handleLogin("SIGNUP", email, password)
                    // }
                  >
                    Sign up
                  </Button>
                </View>
              </>
            ) : (
              <View style={styles.signUpStyle}>
                <Text>Already have an account?</Text>
                <Button
                  mode="text"
                  textColor={theme.colors.secondary}
                  onPress={() => setIsSignUp(false)}
                  // onPress={async () =>
                  //   await handleLogin("SIGNUP", email, password)
                  // }
                >
                  Sign In
                </Button>
              </View>
            )}
            {/* </View> */}
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
    alignItems: "center",
    flexGrow: 1,
    borderColor: "red",
    width: "100%",
    borderWidth: 3,
    // backgroundColor: "black",
    // paddingTop: 4,
    // paddingBottom: 4,
    // alignSelf: "stretch",
  },
  verticallySpacedTop: {
    display: "flex",
    flexDirection: "column",
    // justifyContent: "space-between",
    marginTop: 40,
    flexGrow: 1,
    width: "100%",
    gap: 5,
    // borderColor: "red",
    // borderWidth: 3,
  },
  verticallySpacedBottom: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    marginBottom: 100,
    alignItems: "center",
    width: "100%",
    flexGrow: 1,
    gap: 5,
  },
  buttonStyle: {
    alignSelf: "center",
    margin: 10,
    width: "auto",
    borderRadius: 20,
  },
  textInputStyle: {
    // backgroundColor: "#9C00B6",
    borderRadius: 20,
    // backgroundColor: "#000000",
    // shadowColor: "white", // Shadow color
    // shadowOpacity: 0.3, // Shadow opacity
    // shadowRadius: 50, // Shadow radius
    // shadowOffset: {
    //   width: 0,
    //   height: -10,
    // },
    // elevation: 3, // Android shadow
  },
  signInContainer: {
    // backgroundColor: "black",
    // padding: 10,
    paddingTop: 100,
    flexGrow: 1,
    borderRadius: 20,
    width: "100%",
    paddingStart: 50,
    paddingEnd: 50,
    gap: 5,
    // borderColor: "red",
    // borderWidth: 3,
  },
  signUpStyle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  googleandfb: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  logoStyle: {
    alignSelf: "center",
    width: 200,
    height: 60,
    marginTop: 60,
    marginBottom: 60,
  },
});

/* <Button
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
            </Button> */
