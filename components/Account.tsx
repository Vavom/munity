import React, { useState, useEffect } from "react";
import { Alert, SafeAreaView, ScrollView, View } from "react-native";
import {
  Avatar,
  Button,
  Caption,
  Divider,
  Text,
  TextInput,
  Title,
} from "react-native-paper";
import { supabase } from "../supabase/supabaseClient";
import { useUser } from "./UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import GradientButton from "./GradientButton";
import stringToColor from "./utils/colourUtils";

const Account = () => {
  const { userAuth, user } = useUser();

  return (
    <View style={{ display: "flex", height: "100%" }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <View
            style={{ flex: 1, flexDirection: "column", alignItems: "center" }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 20,
              }}
            >
              <Avatar.Icon
                style={{
                  backgroundColor: stringToColor(userAuth?.email ?? ""),
                  marginEnd: 10,
                }}
                size={40}
                icon="account"
              />
              <View>
                <Title>{userAuth?.user_metadata?.name}</Title>
                <Caption>{userAuth?.email}</Caption>
                <Caption>
                  {"Since: " + formatDate(userAuth?.created_at ?? "")}
                </Caption>
              </View>
              <Divider />
              {/* Additional fields you want to display */}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
      <View
        style={{
          position: "absolute",
          bottom: 10,
          flexDirection: "row",
          alignSelf: "flex-end",
        }}
      >
        <GradientButton
          buttonColor="transparent"
          contentStyle={{ width: "auto" }}
          mode="contained"
          onPress={() => {
            AsyncStorage.clear();
            supabase.auth.signOut();
          }}
        >
          Sign Out
        </GradientButton>
      </View>
    </View>
  );
};

function formatDate(dateString: string) {
  const dateParts = dateString.split("T")[0].split("-");
  const year = dateParts[0];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = monthNames[Number(dateParts[1]) - 1];
  const day = dateParts[2];

  return `${month} ${day}, ${year}`;
}

export default Account;
