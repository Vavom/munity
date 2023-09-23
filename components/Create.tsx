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
import { ImagePickerAsset } from "expo-image-picker";
import ConfirmationModal, { ConfirmationType } from "./ConfirmationModal";

const Create = () => {
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [modal, setModal] = useState(false);
  const [image, setImage] = useState<ImagePickerAsset | null | undefined>(null);
  const [selectedGroup, setSelectedGroup] = useState<null | number>(null);
  const { user } = useUser();

  const uploadImage = async () => {
    // Implement your image upload logic here, e.g., send it to a server
    console.log(image);
    if (image === null) {
      return;
    }

    // Create a Blob from the file data
    if (image?.base64 == null) {
      return;
    }
    const { data, error } = await supabase.storage
      .from("General Post Storage")
      .upload(
        "images/" +
          (
            Date.now().toLocaleString() +
            Math.random() +
            image.base64.slice(0, 20)
          ).replace("/", ""),
        image.base64,
        {
          cacheControl: "3600", // Cache control options if needed
          upsert: true, // Replace if the file already exists
        }
      );
    if (error) {
      if (error) Alert.alert(JSON.stringify(error.message));
    } else {
      return data.path;
    }
  };

  const createPost = async () => {
    if (selectedGroup === null) {
      Alert.alert("Please select a group");
      return;
    }
    const media = await uploadImage();
    const { error } = await supabase.from("Posts").insert({
      group: selectedGroup,
      user: user?.id,
      title,
      content,
      media,
    });
    if (error) {
      Alert.alert(JSON.stringify(error.message));
    } else {
      setModal(true);
    }
  };

  return (
    <View>
      {modal ? (
        <ConfirmationModal
          isVisible={modal}
          setVisible={setModal}
          confirmationType={ConfirmationType.POST_CREATION}
        />
      ) : null}
      <CreateStepper
        content={content}
        selectedGroup={selectedGroup}
        setContent={setContent}
        setSelectedGroup={setSelectedGroup}
        step={step}
        title={title}
        setTitle={setTitle}
        setImage={setImage}
        image={image}
      />
      {step === 2 ? (
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
