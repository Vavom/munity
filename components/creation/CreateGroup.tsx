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
import { Styles } from "../../constants";
import Account from "../Account";
import { supabase } from "../../supabase/supabaseClient";
import { useUser } from "../UserContext";
import Feed from "../feed/Feed";

const CreateGroup = () => {
  const { userAuth: user } = useUser();
  const [visible, setVisible] = React.useState(false);
  const [name, setName] = React.useState("");
  const createGroup = async () => {
    if (user?.id) {
      const { error } = await supabase.from("Groups").insert({
        name: name,
        num_members: 1,
        members: [user.id],
        posts: [],
      });
      if (error) Alert.alert(JSON.stringify(error.message));
    }
  };
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = { backgroundColor: "white", padding: 20, margin: 20 };

  return (
    <View>
      <Button icon="group" mode="contained" onPress={showModal}>
        Create Group
      </Button>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={containerStyle}
        >
          <Text>Create a new 4Rum</Text>
          <TextInput
            label="4Rum name"
            value={name}
            onChangeText={(name) => setName(name)}
          />
          <Button
            icon="group"
            style={{ marginVertical: 20 }}
            mode="contained"
            onPress={createGroup}
          >
            Create Group
          </Button>
        </Modal>
      </Portal>
    </View>
  );
};

export default CreateGroup;
