import { useEffect, useState } from "react";
import { Alert, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  List,
  MD2Colors,
  TextInput,
  Text,
} from "react-native-paper";
import { supabase } from "../supabase/supabaseClient";
import { GroupsRow } from "../types/supabaseTableTypes";
import { useUser } from "./UserContext";
import CreateStepper from "./CreateStepper";

const Create = () => {
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<null | number>(null);
  const { user } = useUser();
  const createPost = async () => {
    if (selectedGroup === null) {
      Alert.alert("Please select a group");
      return;
    }
    const { error } = await supabase.from("Posts").insert({
      group: selectedGroup,
      user: user?.id,
      title,
      content,
    });
    if (error) Alert.alert(JSON.stringify(error.message));
  };

  return (
    <View>
      <CreateStepper
        content={content}
        selectedGroup={selectedGroup}
        setContent={setContent}
        setSelectedGroup={setSelectedGroup}
        step={step}
        title={title}
        setTitle={setTitle}
      />
      {step === 1 ? (
        <>
          <Button
            style={{ margin: 20, marginBottom: 5 }}
            mode="contained"
            onPress={createPost}
          >
            Post
          </Button>
          <Button
            style={{ margin: 20, marginTop: 5 }}
            mode="contained"
            onPress={() => setStep((step) => step - 1)}
          >
            Back
          </Button>
        </>
      ) : (
        <Button
          style={{ margin: 20 }}
          mode="contained"
          onPress={() => {
            if (title.length === 0) {
              Alert.alert("Please add a title");
              return;
            } else {
              setStep((step) => step + 1);
            }
          }}
        >
          Next
        </Button>
      )}
    </View>
  );
};

export default Create;
