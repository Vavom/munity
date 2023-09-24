import React, { useEffect, useState, createContext, useContext } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "../supabase/supabaseClient";
import { UsersRow } from "../types/supabaseTableTypes";
import { Alert } from "react-native";

export const UserContext = createContext<{
  userAuth: User | null;
  session: Session | null;
  user: UsersRow | null;
  updateUser: (user: UsersRow) => UsersRow | null;
}>({
  userAuth: null,
  session: null,
  user: null,
  updateUser: () => null,
});

export const UserContextProvider = (props: any) => {
  const [session, setSession] = useState<Session | null>(null);
  const [userAuth, setUserAuth] = useState<User | null>(null);
  const [user, setUser] = useState<UsersRow | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (userAuth) {
        const { data, error } = await supabase
          .from("Users")
          .select("*")
          .eq("id", userAuth.id)
          .single();

        if (error) {
          Alert.alert(JSON.stringify(error));
        } else {
          setUser(data);
          return false;
        }
        return true;
      }
    };
    const createUser = async () => {
      const shouldCreate = await fetchUser();
      if (userAuth && shouldCreate) {
        const { data, error } = await supabase
          .from("Users")
          .insert([
            {
              id: userAuth.id,
              username: userAuth.user_metadata.name,
              groups: [],
              posts: [],
            },
          ])
          .select("*")
          .single();
        if (error?.code !== "23505" && error) {
          console.log(error);
          Alert.alert(JSON.stringify(error));
        } else {
          console.log({ setUser: data });
          setUser(data);
        }
      }
    };

    createUser();
  }, [userAuth?.id]);

  useEffect(() => {
    const getAuthListener = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setUserAuth(session?.user ?? null);
    };
    getAuthListener();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`Supabase auth event: ${event}`);
        setSession(session);
        setUserAuth(session?.user ?? null);
      }
    );
    return () => {
      authListener!.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    session,
    userAuth,
    user,
    updateUser: (user: UsersRow) => {
      setUser(user);
      return user;
    },
  };
  return <UserContext.Provider value={value} {...props} />;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error(`useUser must be used within a UserContextProvider.`);
  }
  return context;
};
