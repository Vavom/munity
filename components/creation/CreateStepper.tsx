import {
  ActivityIndicator,
  Button,
  List,
  MD2Colors,
  TextInput,
} from "react-native-paper";
import { GroupsRow } from "../../types/supabaseTableTypes";
import { useState, useEffect } from "react";
import { Alert, View } from "react-native";
import { supabase } from "../../supabase/supabaseClient";
import { useUser } from "../UserContext";
import ImageUpload from "../ImageUpload";
import { ImagePickerAsset } from "expo-image-picker";

type Props = {
  step: number;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  title: string;
  setSelectedGroup: React.Dispatch<React.SetStateAction<null | number>>;
  selectedGroup: null | number;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  content: string;
  setImage: React.Dispatch<
    React.SetStateAction<ImagePickerAsset | null | undefined>
  >;
  image: ImagePickerAsset | null | undefined;
};
const CreateStepper = ({
  step,
  title,
  setTitle,
  content,
  selectedGroup,
  setContent,
  setSelectedGroup,
  setImage,
  image,
}: Props) => {
  const [expanded, setExpanded] = useState(false);
  const { userAuth: user } = useUser();
  const [noGroupsYet, setNoGroupsYet] = useState(true);
  const [groups, setGroups] = useState<GroupsRow[] | null>(null);

  const retrieveGroups = async () => {
    if (user?.id) {
      const { data, error } = await supabase
        .from("Groups")
        .select("*")
        .contains("members", [user.id]);
      if (error) {
        setNoGroupsYet(true);
      } else {
        setNoGroupsYet(false);
        setGroups(data);
      }
    }
  };

  useEffect(() => {
    if (step === 1) {
      retrieveGroups();
    }
  }, [step]);
  switch (step) {
    case 0:
      return (
        <>
          <TextInput
            label="Title"
            value={title}
            onChangeText={(title) => setTitle(title)}
          />
          <TextInput
            label="Content"
            value={content}
            onChangeText={(content) => setContent(content)}
            multiline={true}
          />
        </>
      );
    case 1:
      return <ImageUpload setImage={setImage} image={image} />;
    case 2:
      return (
        <>
          {noGroupsYet ? (
            <ActivityIndicator
              style={{ margin: 20 }}
              animating={true}
              color={MD2Colors.purple100}
            />
          ) : (
            groups?.map((group: GroupsRow) => (
              <List.Item
                onPress={() => {
                  setSelectedGroup(group.id);
                  setExpanded(false);
                }}
                style={
                  selectedGroup === group.id
                    ? { backgroundColor: "#f7e0ff", borderRadius: 20 }
                    : {}
                }
                key={group.id}
                title={group.name}
              />
            ))
          )}
        </>
      );
    default:
      return <></>;
      break;
  }
};

export default CreateStepper;
