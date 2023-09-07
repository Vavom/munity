import { Database } from "./supabase";

export type GroupsRow = Database["public"]["Tables"]["Groups"]["Row"];
export type PostsRow = Database["public"]["Tables"]["Posts"]["Row"];

export type GroupsInsert = Database["public"]["Tables"]["Groups"]["Insert"];
export type PostsInsert = Database["public"]["Tables"]["Posts"]["Insert"];

export type GroupsUpdate = Database["public"]["Tables"]["Groups"]["Update"];
export type PostsUpdate = Database["public"]["Tables"]["Posts"]["Update"];
