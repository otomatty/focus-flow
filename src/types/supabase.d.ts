export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      badges: {
        Row: {
          condition_type: string
          condition_value: Json
          created_at: string | null
          description: string
          id: string
          image_url: string | null
          name: string
        }
        Insert: {
          condition_type: string
          condition_value: Json
          created_at?: string | null
          description: string
          id?: string
          image_url?: string | null
          name: string
        }
        Update: {
          condition_type?: string
          condition_value?: Json
          created_at?: string | null
          description?: string
          id?: string
          image_url?: string | null
          name?: string
        }
        Relationships: []
      }
      focus_sessions: {
        Row: {
          bonus_points: number | null
          created_at: string | null
          duration: unknown | null
          end_time: string | null
          id: string
          is_completed: boolean | null
          schedule_id: string | null
          start_time: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bonus_points?: number | null
          created_at?: string | null
          duration?: unknown | null
          end_time?: string | null
          id?: string
          is_completed?: boolean | null
          schedule_id?: string | null
          start_time: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          bonus_points?: number | null
          created_at?: string | null
          duration?: unknown | null
          end_time?: string | null
          id?: string
          is_completed?: boolean | null
          schedule_id?: string | null
          start_time?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "focus_sessions_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "schedules"
            referencedColumns: ["id"]
          },
        ]
      }
      focus_sessions_y2024m01: {
        Row: {
          bonus_points: number | null
          created_at: string | null
          duration: unknown | null
          end_time: string | null
          id: string
          is_completed: boolean | null
          schedule_id: string | null
          start_time: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bonus_points?: number | null
          created_at?: string | null
          duration?: unknown | null
          end_time?: string | null
          id?: string
          is_completed?: boolean | null
          schedule_id?: string | null
          start_time: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          bonus_points?: number | null
          created_at?: string | null
          duration?: unknown | null
          end_time?: string | null
          id?: string
          is_completed?: boolean | null
          schedule_id?: string | null
          start_time?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      focus_sessions_y2024m02: {
        Row: {
          bonus_points: number | null
          created_at: string | null
          duration: unknown | null
          end_time: string | null
          id: string
          is_completed: boolean | null
          schedule_id: string | null
          start_time: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bonus_points?: number | null
          created_at?: string | null
          duration?: unknown | null
          end_time?: string | null
          id?: string
          is_completed?: boolean | null
          schedule_id?: string | null
          start_time: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          bonus_points?: number | null
          created_at?: string | null
          duration?: unknown | null
          end_time?: string | null
          id?: string
          is_completed?: boolean | null
          schedule_id?: string | null
          start_time?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      focus_sessions_y2024m03: {
        Row: {
          bonus_points: number | null
          created_at: string | null
          duration: unknown | null
          end_time: string | null
          id: string
          is_completed: boolean | null
          schedule_id: string | null
          start_time: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bonus_points?: number | null
          created_at?: string | null
          duration?: unknown | null
          end_time?: string | null
          id?: string
          is_completed?: boolean | null
          schedule_id?: string | null
          start_time: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          bonus_points?: number | null
          created_at?: string | null
          duration?: unknown | null
          end_time?: string | null
          id?: string
          is_completed?: boolean | null
          schedule_id?: string | null
          start_time?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      focus_sessions_y2024m04: {
        Row: {
          bonus_points: number | null
          created_at: string | null
          duration: unknown | null
          end_time: string | null
          id: string
          is_completed: boolean | null
          schedule_id: string | null
          start_time: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bonus_points?: number | null
          created_at?: string | null
          duration?: unknown | null
          end_time?: string | null
          id?: string
          is_completed?: boolean | null
          schedule_id?: string | null
          start_time: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          bonus_points?: number | null
          created_at?: string | null
          duration?: unknown | null
          end_time?: string | null
          id?: string
          is_completed?: boolean | null
          schedule_id?: string | null
          start_time?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      focus_sessions_y2024m05: {
        Row: {
          bonus_points: number | null
          created_at: string | null
          duration: unknown | null
          end_time: string | null
          id: string
          is_completed: boolean | null
          schedule_id: string | null
          start_time: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bonus_points?: number | null
          created_at?: string | null
          duration?: unknown | null
          end_time?: string | null
          id?: string
          is_completed?: boolean | null
          schedule_id?: string | null
          start_time: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          bonus_points?: number | null
          created_at?: string | null
          duration?: unknown | null
          end_time?: string | null
          id?: string
          is_completed?: boolean | null
          schedule_id?: string | null
          start_time?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      focus_sessions_y2024m06: {
        Row: {
          bonus_points: number | null
          created_at: string | null
          duration: unknown | null
          end_time: string | null
          id: string
          is_completed: boolean | null
          schedule_id: string | null
          start_time: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bonus_points?: number | null
          created_at?: string | null
          duration?: unknown | null
          end_time?: string | null
          id?: string
          is_completed?: boolean | null
          schedule_id?: string | null
          start_time: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          bonus_points?: number | null
          created_at?: string | null
          duration?: unknown | null
          end_time?: string | null
          id?: string
          is_completed?: boolean | null
          schedule_id?: string | null
          start_time?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      focus_sessions_y2024m07: {
        Row: {
          bonus_points: number | null
          created_at: string | null
          duration: unknown | null
          end_time: string | null
          id: string
          is_completed: boolean | null
          schedule_id: string | null
          start_time: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bonus_points?: number | null
          created_at?: string | null
          duration?: unknown | null
          end_time?: string | null
          id?: string
          is_completed?: boolean | null
          schedule_id?: string | null
          start_time: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          bonus_points?: number | null
          created_at?: string | null
          duration?: unknown | null
          end_time?: string | null
          id?: string
          is_completed?: boolean | null
          schedule_id?: string | null
          start_time?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      focus_sessions_y2024m08: {
        Row: {
          bonus_points: number | null
          created_at: string | null
          duration: unknown | null
          end_time: string | null
          id: string
          is_completed: boolean | null
          schedule_id: string | null
          start_time: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bonus_points?: number | null
          created_at?: string | null
          duration?: unknown | null
          end_time?: string | null
          id?: string
          is_completed?: boolean | null
          schedule_id?: string | null
          start_time: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          bonus_points?: number | null
          created_at?: string | null
          duration?: unknown | null
          end_time?: string | null
          id?: string
          is_completed?: boolean | null
          schedule_id?: string | null
          start_time?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      focus_sessions_y2024m09: {
        Row: {
          bonus_points: number | null
          created_at: string | null
          duration: unknown | null
          end_time: string | null
          id: string
          is_completed: boolean | null
          schedule_id: string | null
          start_time: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bonus_points?: number | null
          created_at?: string | null
          duration?: unknown | null
          end_time?: string | null
          id?: string
          is_completed?: boolean | null
          schedule_id?: string | null
          start_time: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          bonus_points?: number | null
          created_at?: string | null
          duration?: unknown | null
          end_time?: string | null
          id?: string
          is_completed?: boolean | null
          schedule_id?: string | null
          start_time?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      focus_sessions_y2024m10: {
        Row: {
          bonus_points: number | null
          created_at: string | null
          duration: unknown | null
          end_time: string | null
          id: string
          is_completed: boolean | null
          schedule_id: string | null
          start_time: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bonus_points?: number | null
          created_at?: string | null
          duration?: unknown | null
          end_time?: string | null
          id?: string
          is_completed?: boolean | null
          schedule_id?: string | null
          start_time: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          bonus_points?: number | null
          created_at?: string | null
          duration?: unknown | null
          end_time?: string | null
          id?: string
          is_completed?: boolean | null
          schedule_id?: string | null
          start_time?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      focus_sessions_y2024m11: {
        Row: {
          bonus_points: number | null
          created_at: string | null
          duration: unknown | null
          end_time: string | null
          id: string
          is_completed: boolean | null
          schedule_id: string | null
          start_time: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bonus_points?: number | null
          created_at?: string | null
          duration?: unknown | null
          end_time?: string | null
          id?: string
          is_completed?: boolean | null
          schedule_id?: string | null
          start_time: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          bonus_points?: number | null
          created_at?: string | null
          duration?: unknown | null
          end_time?: string | null
          id?: string
          is_completed?: boolean | null
          schedule_id?: string | null
          start_time?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      focus_sessions_y2024m12: {
        Row: {
          bonus_points: number | null
          created_at: string | null
          duration: unknown | null
          end_time: string | null
          id: string
          is_completed: boolean | null
          schedule_id: string | null
          start_time: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bonus_points?: number | null
          created_at?: string | null
          duration?: unknown | null
          end_time?: string | null
          id?: string
          is_completed?: boolean | null
          schedule_id?: string | null
          start_time: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          bonus_points?: number | null
          created_at?: string | null
          duration?: unknown | null
          end_time?: string | null
          id?: string
          is_completed?: boolean | null
          schedule_id?: string | null
          start_time?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      quests: {
        Row: {
          created_at: string | null
          description: string
          duration_type: string | null
          id: string
          quest_type: string
          requirements: Json
          reward_badge_id: string | null
          reward_exp: number
          title: string
        }
        Insert: {
          created_at?: string | null
          description: string
          duration_type?: string | null
          id?: string
          quest_type: string
          requirements: Json
          reward_badge_id?: string | null
          reward_exp: number
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string
          duration_type?: string | null
          id?: string
          quest_type?: string
          requirements?: Json
          reward_badge_id?: string | null
          reward_exp?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "quests_reward_badge_id_fkey"
            columns: ["reward_badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
      }
      schedule_tasks: {
        Row: {
          created_at: string | null
          id: string
          schedule_id: string | null
          task_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          schedule_id?: string | null
          task_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          schedule_id?: string | null
          task_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "schedule_tasks_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "schedules"
            referencedColumns: ["id"]
          },
        ]
      }
      schedules: {
        Row: {
          activity_type: string
          created_at: string | null
          day_of_week: number
          description: string | null
          end_time: string
          id: string
          start_time: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          day_of_week: number
          description?: string | null
          end_time: string
          id?: string
          start_time: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          day_of_week?: number
          description?: string | null
          end_time?: string
          id?: string
          start_time?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      task_breakdowns: {
        Row: {
          created_at: string | null
          description: string | null
          estimated_duration: unknown | null
          id: string
          order_index: number
          parent_task_id: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          estimated_duration?: unknown | null
          id?: string
          order_index: number
          parent_task_id?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          estimated_duration?: unknown | null
          id?: string
          order_index?: number
          parent_task_id?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "task_breakdowns_parent_task_id_fkey"
            columns: ["parent_task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      task_experience: {
        Row: {
          base_exp: number
          bonus_exp: number | null
          created_at: string | null
          difficulty_level: number | null
          id: string
          skill_category: string
          task_id: string | null
        }
        Insert: {
          base_exp: number
          bonus_exp?: number | null
          created_at?: string | null
          difficulty_level?: number | null
          id?: string
          skill_category: string
          task_id?: string | null
        }
        Update: {
          base_exp?: number
          bonus_exp?: number | null
          created_at?: string | null
          difficulty_level?: number | null
          id?: string
          skill_category?: string
          task_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "task_experience_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      task_reminders: {
        Row: {
          created_at: string | null
          id: string
          is_sent: boolean | null
          reminder_time: string
          task_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_sent?: boolean | null
          reminder_time: string
          task_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_sent?: boolean | null
          reminder_time?: string
          task_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          actual_duration: unknown | null
          ai_generated: boolean | null
          category: string | null
          completion_order: number | null
          created_at: string | null
          description: string | null
          difficulty_level: number | null
          due_date: string | null
          estimated_duration: unknown | null
          id: string
          is_recurring: boolean | null
          parent_task_id: string | null
          priority: string | null
          recurring_pattern: Json | null
          status: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          actual_duration?: unknown | null
          ai_generated?: boolean | null
          category?: string | null
          completion_order?: number | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: number | null
          due_date?: string | null
          estimated_duration?: unknown | null
          id?: string
          is_recurring?: boolean | null
          parent_task_id?: string | null
          priority?: string | null
          recurring_pattern?: Json | null
          status?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          actual_duration?: unknown | null
          ai_generated?: boolean | null
          category?: string | null
          completion_order?: number | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: number | null
          due_date?: string | null
          estimated_duration?: unknown | null
          id?: string
          is_recurring?: boolean | null
          parent_task_id?: string | null
          priority?: string | null
          recurring_pattern?: Json | null
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_parent_task_id_fkey"
            columns: ["parent_task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      user_badges: {
        Row: {
          acquired_at: string | null
          badge_id: string
          id: string
          user_id: string
        }
        Insert: {
          acquired_at?: string | null
          badge_id: string
          id?: string
          user_id: string
        }
        Update: {
          acquired_at?: string | null
          badge_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          cache_version: number | null
          created_at: string | null
          display_name: string | null
          email: string | null
          experience_points: number | null
          id: string
          last_activity_at: string | null
          level: number | null
          profile_image: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cache_version?: number | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          experience_points?: number | null
          id?: string
          last_activity_at?: string | null
          level?: number | null
          profile_image?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cache_version?: number | null
          created_at?: string | null
          display_name?: string | null
          email?: string | null
          experience_points?: number | null
          id?: string
          last_activity_at?: string | null
          level?: number | null
          profile_image?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_quests: {
        Row: {
          completed_at: string | null
          created_at: string | null
          end_date: string
          id: string
          progress: Json
          quest_id: string
          start_date: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          end_date: string
          id?: string
          progress?: Json
          quest_id: string
          start_date: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          end_date?: string
          id?: string
          progress?: Json
          quest_id?: string
          start_date?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_quests_quest_id_fkey"
            columns: ["quest_id"]
            isOneToOne: false
            referencedRelation: "quests"
            referencedColumns: ["id"]
          },
        ]
      }
      user_role_mappings: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          role_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          role_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          role_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_role_mappings_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "user_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          created_at: string | null
          focus_mode_restrictions: Json | null
          id: string
          notification_enabled: boolean | null
          theme_color: string | null
          updated_at: string | null
          user_id: string
          voice_input_enabled: boolean | null
        }
        Insert: {
          created_at?: string | null
          focus_mode_restrictions?: Json | null
          id?: string
          notification_enabled?: boolean | null
          theme_color?: string | null
          updated_at?: string | null
          user_id: string
          voice_input_enabled?: boolean | null
        }
        Update: {
          created_at?: string | null
          focus_mode_restrictions?: Json | null
          id?: string
          notification_enabled?: boolean | null
          theme_color?: string | null
          updated_at?: string | null
          user_id?: string
          voice_input_enabled?: boolean | null
        }
        Relationships: []
      }
      user_skills: {
        Row: {
          created_at: string | null
          current_level: number | null
          id: string
          skill_category: string
          total_exp: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_level?: number | null
          id?: string
          skill_category: string
          total_exp?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_level?: number | null
          id?: string
          skill_category?: string
          total_exp?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_experience_points: {
        Args: {
          p_user_id: string
          p_exp_points: number
        }
        Returns: {
          new_exp: number
          new_level: number
          leveled_up: boolean
        }[]
      }
      calculate_focus_session_exp: {
        Args: {
          p_duration: unknown
          p_bonus_points: number
        }
        Returns: number
      }
      calculate_level: {
        Args: {
          p_exp: number
        }
        Returns: number
      }
      calculate_required_exp: {
        Args: {
          level: number
        }
        Returns: number
      }
      calculate_task_experience: {
        Args: {
          p_difficulty_level: number
          p_estimated_duration: unknown
          p_actual_duration: unknown
          p_current_level: number
        }
        Returns: number
      }
      check_badge_conditions: {
        Args: {
          p_user_id: string
          p_condition_type: string
          p_value: Json
        }
        Returns: {
          badge_id: string
          badge_name: string
          badge_description: string
        }[]
      }
      create_focus_session_partition: {
        Args: {
          p_year: number
          p_month: number
        }
        Returns: undefined
      }
      delete_unused_profile_images: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      generate_recurring_tasks: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      get_active_tasks: {
        Args: {
          p_user_id: string
        }
        Returns: {
          id: string
          title: string
          description: string
          due_date: string
          priority: string
          category: string
          status: string
          difficulty_level: number
          estimated_duration: unknown
          actual_duration: unknown
          ai_generated: boolean
          parent_task_id: string
        }[]
      }
      get_focus_session_stats: {
        Args: {
          p_user_id: string
          p_start_date: string
          p_end_date: string
        }
        Returns: {
          total_sessions: number
          total_duration: unknown
          total_bonus_points: number
          average_duration: unknown
          completion_rate: number
        }[]
      }
      get_task_breakdowns: {
        Args: {
          p_task_id: string
        }
        Returns: {
          id: string
          title: string
          description: string
          estimated_duration: unknown
          order_index: number
          status: string
        }[]
      }
      has_role: {
        Args: {
          p_user_id: string
          p_role_name: string
        }
        Returns: boolean
      }
      update_overdue_tasks: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_quest_progress: {
        Args: {
          p_user_id: string
          p_quest_type: string
          p_progress: Json
        }
        Returns: undefined
      }
      update_user_skill: {
        Args: {
          p_user_id: string
          p_skill_category: string
          p_exp_gained: number
        }
        Returns: {
          new_level: number
          exp_to_next_level: number
          total_exp: number
          gained_exp: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
