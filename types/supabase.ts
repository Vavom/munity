export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      Groups: {
        Row: {
          created_at: string
          id: number
          members: string[]
          name: string
          num_members: number
          posts: number[]
        }
        Insert: {
          created_at?: string
          id?: number
          members: string[]
          name: string
          num_members?: number
          posts: number[]
        }
        Update: {
          created_at?: string
          id?: number
          members?: string[]
          name?: string
          num_members?: number
          posts?: number[]
        }
        Relationships: []
      }
      Posts: {
        Row: {
          content: string | null
          created_at: string
          group: number
          id: number
          title: string | null
          user: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          group: number
          id?: number
          title?: string | null
          user?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string
          group?: number
          id?: number
          title?: string | null
          user?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Posts_group_fkey"
            columns: ["group"]
            referencedRelation: "Groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Posts_user_fkey"
            columns: ["user"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
