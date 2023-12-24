import * as React from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Button, Card, List, Text } from "react-native-paper";
import { Styles } from "../constants";
import Account from "./Account";
import { supabase } from "../supabase/supabaseClient";
import { useUser } from "./UserContext";
import { useState } from "react";
import { GroupsRow } from "../types/supabaseTableTypes";
import CreateGroup from "./creation/CreateGroup";

const Groups = () => {
  const { userAuth: user } = useUser();
  const [noGroupsYet, setNoGroupsYet] = useState(true);
  const [groups, setGroups] = useState<GroupsRow[] | null>(null);
  const getGroupMemberInfo = async (memberIDs: string[]) => {
    // const membersData = memberIDs.map(id => {
    //   const {data, error} = await supabase.from("")
    // });
  };
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
        const groupsData = await data.map(async (group) => {
          const members = await getGroupMemberInfo(group.members);
          return { group: data, members: members };
        });
        // setGroups(groupsData);
      }
    }
  };
  return (
    <>
      <Text>Groups</Text>
      <Button icon="group" mode="contained" onPress={() => retrieveGroups()}>
        Get Groups
      </Button>
      {noGroupsYet ? (
        <>
          <Text>No Groups yet, try creating a group</Text>
          <CreateGroup />
        </>
      ) : null}
      {groups ? (
        <List.Section>
          {groups.map((group: any) => {
            const card = (
              <Card key={group.id}>
                <Card.Content>
                  <Text variant="titleLarge">{group.name}</Text>
                  <Text variant="bodyMedium">{group.members}</Text>
                </Card.Content>
              </Card>
            );
            return card;
          })}
        </List.Section>
      ) : null}
    </>
  );
};

export default Groups;
