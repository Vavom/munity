import {
  ActivityIndicator,
  List,
  MD2Colors,
  TextInput,
} from "react-native-paper";
import { GroupsRow } from "../types/supabaseTableTypes";
import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { supabase } from "../supabase/supabaseClient";
import { useUser } from "./UserContext";

type Props = {
  step: number;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  title: string;
  setSelectedGroup: React.Dispatch<React.SetStateAction<null | number>>;
  selectedGroup: null | number;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  content: string;
};
const CreateStepper = ({
  step,
  title,
  setTitle,
  content,
  selectedGroup,
  setContent,
  setSelectedGroup,
}: Props) => {
  const [expanded, setExpanded] = useState(false);
  const { user } = useUser();
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
    case 1: {
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
    }
    default:
      break;
  }
};

export default CreateStepper;
