import React, { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Styles } from "../constants";
import { supabase } from "../supabase/supabaseClient";

import { Button, TextInput } from "react-native-paper";

export default function Auth() {
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
    <View>
      <View style={[styles.verticallySpaced, { marginTop: 20 }]}>
        <TextInput
          label="Username"
          onChangeText={(text) => setUsername(text)}
          value={username}
          placeholder="Username"
          autoCapitalize={"none"}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <TextInput
          label="Email"
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={"none"}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <TextInput
          label="Password"
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={"none"}
        />
      </View>
      <View style={[styles.verticallySpaced, { marginTop: 20 }]}>
        <Button
          disabled={!!loading.length}
          loading={loading === "LOGIN"}
          onPress={async () => await handleLogin("LOGIN", email, password)}
        >
          Sign in
        </Button>
      </View>
      <View style={styles.verticallySpaced}>
        <Button
          disabled={!!loading.length}
          loading={loading === "SIGNUP"}
          onPress={async () => await handleLogin("SIGNUP", email, password)}
        >
          Sign up
        </Button>
      </View>
      <View style={styles.verticallySpaced}>
        <Button
          disabled={!!loading.length}
          loading={loading === "SIGNUP"}
          onPress={async () =>
            await handleLogin("LOGIN", "nshamash123@gmail.com", "123456")
          }
        >
          Sign in nshamash123
        </Button>
      </View>
      <View style={styles.verticallySpaced}>
        <Button
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
  );
}

const styles = StyleSheet.create({
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
