export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      Comments: {
        Row: {
          content: string;
          created_at: string;
          id: number;
          name: string;
          parent_comment: number | null;
          post: number;
          user: string;
        };
        Insert: {
          content: string;
          created_at?: string;
          id?: number;
          name: string;
          parent_comment?: number | null;
          post: number;
          user?: string;
        };
        Update: {
          content?: string;
          created_at?: string;
          id?: number;
          name?: string;
          parent_comment?: number | null;
          post?: number;
          user?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Comments_parent_comment_fkey";
            columns: ["parent_comment"];
            referencedRelation: "Comments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "Comments_post_fkey";
            columns: ["post"];
            referencedRelation: "Posts";
            referencedColumns: ["id"];
          }
        ];
      };
      Groups: {
        Row: {
          created_at: string;
          id: number;
          members: string[];
          name: string;
          num_members: number;
          posts: number[];
        };
        Insert: {
          created_at?: string;
          id?: number;
          members: string[];
          name: string;
          num_members?: number;
          posts: number[];
        };
        Update: {
          created_at?: string;
          id?: number;
          members?: string[];
          name?: string;
          num_members?: number;
          posts?: number[];
        };
        Relationships: [];
      };
      Posts: {
        Row: {
          numComments: number;
          content: string | null;
          created_at: string;
          group: number;
          id: number;
          likes: number;
          media: string | null;
          title: string | null;
          user: string | null;
        };
        Insert: {
          content?: string | null;
          created_at?: string;
          group: number;
          id?: number;
          likes?: number;
          media?: string | null;
          title?: string | null;
          user?: string | null;
        };
        Update: {
          content?: string | null;
          created_at?: string;
          group?: number;
          id?: number;
          likes?: number;
          media?: string | null;
          title?: string | null;
          user?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "Posts_group_fkey";
            columns: ["group"];
            referencedRelation: "Groups";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "Posts_user_fkey";
            columns: ["user"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      Users: {
        Row: {
          groups: number[];
          id: string;
          liked_posts: number[];
          posts: number[];
          username: string;
        };
        Insert: {
          groups: number[];
          id: string;
          liked_posts?: number[];
          posts: number[];
          username: string;
        };
        Update: {
          groups?: number[];
          id?: string;
          liked_posts?: number[];
          posts?: number[];
          username?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Users_id_fkey";
            columns: ["id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      increment_likes: {
        Args: {
          x: number;
          row_id: number;
        };
        Returns: number;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
