import React, {useState, useEffect} from 'react';
import {Alert, View} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';
import {supabase} from '../supabase/supabaseClient';
import {useUser} from './UserContext';

const Account = () => {
  const {user} = useUser();

  return (
    <View>
      <Text>Email: {user?.email}</Text>
      <Text>name: {user?.user_metadata?.name}</Text>
      <Button
        icon="camera"
        mode="contained"
        onPress={() => supabase.auth.signOut()}>
        Sign Out
      </Button>
    </View>
  );
};

export default Account;
