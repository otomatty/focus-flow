export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export type Database = {
	ff_achievements: {
		Tables: {
			badges: {
				Row: {
					condition_type: string;
					condition_value: Json;
					created_at: string | null;
					description: string;
					id: string;
					image_url: string | null;
					name: string;
				};
				Insert: {
					condition_type: string;
					condition_value: Json;
					created_at?: string | null;
					description: string;
					id?: string;
					image_url?: string | null;
					name: string;
				};
				Update: {
					condition_type?: string;
					condition_value?: Json;
					created_at?: string | null;
					description?: string;
					id?: string;
					image_url?: string | null;
					name?: string;
				};
				Relationships: [];
			};
			user_badges: {
				Row: {
					acquired_at: string | null;
					badge_id: string;
					id: string;
					user_id: string;
				};
				Insert: {
					acquired_at?: string | null;
					badge_id: string;
					id?: string;
					user_id: string;
				};
				Update: {
					acquired_at?: string | null;
					badge_id?: string;
					id?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "user_badges_badge_id_fkey";
						columns: ["badge_id"];
						isOneToOne: false;
						referencedRelation: "badges";
						referencedColumns: ["id"];
					},
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
	ff_focus: {
		Tables: {
			focus_sessions: {
				Row: {
					bonus_points: number | null;
					created_at: string | null;
					duration: unknown | null;
					end_time: string | null;
					id: string;
					is_completed: boolean | null;
					schedule_id: string | null;
					start_time: string;
					updated_at: string | null;
					user_id: string;
				};
				Insert: {
					bonus_points?: number | null;
					created_at?: string | null;
					duration?: unknown | null;
					end_time?: string | null;
					id?: string;
					is_completed?: boolean | null;
					schedule_id?: string | null;
					start_time: string;
					updated_at?: string | null;
					user_id: string;
				};
				Update: {
					bonus_points?: number | null;
					created_at?: string | null;
					duration?: unknown | null;
					end_time?: string | null;
					id?: string;
					is_completed?: boolean | null;
					schedule_id?: string | null;
					start_time?: string;
					updated_at?: string | null;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "focus_sessions_schedule_id_fkey";
						columns: ["schedule_id"];
						isOneToOne: false;
						referencedRelation: "schedules";
						referencedColumns: ["id"];
					},
				];
			};
			focus_sessions_y2024m01: {
				Row: {
					bonus_points: number | null;
					created_at: string | null;
					duration: unknown | null;
					end_time: string | null;
					id: string;
					is_completed: boolean | null;
					schedule_id: string | null;
					start_time: string;
					updated_at: string | null;
					user_id: string;
				};
				Insert: {
					bonus_points?: number | null;
					created_at?: string | null;
					duration?: unknown | null;
					end_time?: string | null;
					id?: string;
					is_completed?: boolean | null;
					schedule_id?: string | null;
					start_time: string;
					updated_at?: string | null;
					user_id: string;
				};
				Update: {
					bonus_points?: number | null;
					created_at?: string | null;
					duration?: unknown | null;
					end_time?: string | null;
					id?: string;
					is_completed?: boolean | null;
					schedule_id?: string | null;
					start_time?: string;
					updated_at?: string | null;
					user_id?: string;
				};
				Relationships: [];
			};
			focus_sessions_y2024m02: {
				Row: {
					bonus_points: number | null;
					created_at: string | null;
					duration: unknown | null;
					end_time: string | null;
					id: string;
					is_completed: boolean | null;
					schedule_id: string | null;
					start_time: string;
					updated_at: string | null;
					user_id: string;
				};
				Insert: {
					bonus_points?: number | null;
					created_at?: string | null;
					duration?: unknown | null;
					end_time?: string | null;
					id?: string;
					is_completed?: boolean | null;
					schedule_id?: string | null;
					start_time: string;
					updated_at?: string | null;
					user_id: string;
				};
				Update: {
					bonus_points?: number | null;
					created_at?: string | null;
					duration?: unknown | null;
					end_time?: string | null;
					id?: string;
					is_completed?: boolean | null;
					schedule_id?: string | null;
					start_time?: string;
					updated_at?: string | null;
					user_id?: string;
				};
				Relationships: [];
			};
			focus_sessions_y2024m03: {
				Row: {
					bonus_points: number | null;
					created_at: string | null;
					duration: unknown | null;
					end_time: string | null;
					id: string;
					is_completed: boolean | null;
					schedule_id: string | null;
					start_time: string;
					updated_at: string | null;
					user_id: string;
				};
				Insert: {
					bonus_points?: number | null;
					created_at?: string | null;
					duration?: unknown | null;
					end_time?: string | null;
					id?: string;
					is_completed?: boolean | null;
					schedule_id?: string | null;
					start_time: string;
					updated_at?: string | null;
					user_id: string;
				};
				Update: {
					bonus_points?: number | null;
					created_at?: string | null;
					duration?: unknown | null;
					end_time?: string | null;
					id?: string;
					is_completed?: boolean | null;
					schedule_id?: string | null;
					start_time?: string;
					updated_at?: string | null;
					user_id?: string;
				};
				Relationships: [];
			};
			focus_sessions_y2024m04: {
				Row: {
					bonus_points: number | null;
					created_at: string | null;
					duration: unknown | null;
					end_time: string | null;
					id: string;
					is_completed: boolean | null;
					schedule_id: string | null;
					start_time: string;
					updated_at: string | null;
					user_id: string;
				};
				Insert: {
					bonus_points?: number | null;
					created_at?: string | null;
					duration?: unknown | null;
					end_time?: string | null;
					id?: string;
					is_completed?: boolean | null;
					schedule_id?: string | null;
					start_time: string;
					updated_at?: string | null;
					user_id: string;
				};
				Update: {
					bonus_points?: number | null;
					created_at?: string | null;
					duration?: unknown | null;
					end_time?: string | null;
					id?: string;
					is_completed?: boolean | null;
					schedule_id?: string | null;
					start_time?: string;
					updated_at?: string | null;
					user_id?: string;
				};
				Relationships: [];
			};
			focus_sessions_y2024m05: {
				Row: {
					bonus_points: number | null;
					created_at: string | null;
					duration: unknown | null;
					end_time: string | null;
					id: string;
					is_completed: boolean | null;
					schedule_id: string | null;
					start_time: string;
					updated_at: string | null;
					user_id: string;
				};
				Insert: {
					bonus_points?: number | null;
					created_at?: string | null;
					duration?: unknown | null;
					end_time?: string | null;
					id?: string;
					is_completed?: boolean | null;
					schedule_id?: string | null;
					start_time: string;
					updated_at?: string | null;
					user_id: string;
				};
				Update: {
					bonus_points?: number | null;
					created_at?: string | null;
					duration?: unknown | null;
					end_time?: string | null;
					id?: string;
					is_completed?: boolean | null;
					schedule_id?: string | null;
					start_time?: string;
					updated_at?: string | null;
					user_id?: string;
				};
				Relationships: [];
			};
			focus_sessions_y2024m06: {
				Row: {
					bonus_points: number | null;
					created_at: string | null;
					duration: unknown | null;
					end_time: string | null;
					id: string;
					is_completed: boolean | null;
					schedule_id: string | null;
					start_time: string;
					updated_at: string | null;
					user_id: string;
				};
				Insert: {
					bonus_points?: number | null;
					created_at?: string | null;
					duration?: unknown | null;
					end_time?: string | null;
					id?: string;
					is_completed?: boolean | null;
					schedule_id?: string | null;
					start_time: string;
					updated_at?: string | null;
					user_id: string;
				};
				Update: {
					bonus_points?: number | null;
					created_at?: string | null;
					duration?: unknown | null;
					end_time?: string | null;
					id?: string;
					is_completed?: boolean | null;
					schedule_id?: string | null;
					start_time?: string;
					updated_at?: string | null;
					user_id?: string;
				};
				Relationships: [];
			};
			focus_sessions_y2024m07: {
				Row: {
					bonus_points: number | null;
					created_at: string | null;
					duration: unknown | null;
					end_time: string | null;
					id: string;
					is_completed: boolean | null;
					schedule_id: string | null;
					start_time: string;
					updated_at: string | null;
					user_id: string;
				};
				Insert: {
					bonus_points?: number | null;
					created_at?: string | null;
					duration?: unknown | null;
					end_time?: string | null;
					id?: string;
					is_completed?: boolean | null;
					schedule_id?: string | null;
					start_time: string;
					updated_at?: string | null;
					user_id: string;
				};
				Update: {
					bonus_points?: number | null;
					created_at?: string | null;
					duration?: unknown | null;
					end_time?: string | null;
					id?: string;
					is_completed?: boolean | null;
					schedule_id?: string | null;
					start_time?: string;
					updated_at?: string | null;
					user_id?: string;
				};
				Relationships: [];
			};
			focus_sessions_y2024m08: {
				Row: {
					bonus_points: number | null;
					created_at: string | null;
					duration: unknown | null;
					end_time: string | null;
					id: string;
					is_completed: boolean | null;
					schedule_id: string | null;
					start_time: string;
					updated_at: string | null;
					user_id: string;
				};
				Insert: {
					bonus_points?: number | null;
					created_at?: string | null;
					duration?: unknown | null;
					end_time?: string | null;
					id?: string;
					is_completed?: boolean | null;
					schedule_id?: string | null;
					start_time: string;
					updated_at?: string | null;
					user_id: string;
				};
				Update: {
					bonus_points?: number | null;
					created_at?: string | null;
					duration?: unknown | null;
					end_time?: string | null;
					id?: string;
					is_completed?: boolean | null;
					schedule_id?: string | null;
					start_time?: string;
					updated_at?: string | null;
					user_id?: string;
				};
				Relationships: [];
			};
			focus_sessions_y2024m09: {
				Row: {
					bonus_points: number | null;
					created_at: string | null;
					duration: unknown | null;
					end_time: string | null;
					id: string;
					is_completed: boolean | null;
					schedule_id: string | null;
					start_time: string;
					updated_at: string | null;
					user_id: string;
				};
				Insert: {
					bonus_points?: number | null;
					created_at?: string | null;
					duration?: unknown | null;
					end_time?: string | null;
					id?: string;
					is_completed?: boolean | null;
					schedule_id?: string | null;
					start_time: string;
					updated_at?: string | null;
					user_id: string;
				};
				Update: {
					bonus_points?: number | null;
					created_at?: string | null;
					duration?: unknown | null;
					end_time?: string | null;
					id?: string;
					is_completed?: boolean | null;
					schedule_id?: string | null;
					start_time?: string;
					updated_at?: string | null;
					user_id?: string;
				};
				Relationships: [];
			};
			focus_sessions_y2024m10: {
				Row: {
					bonus_points: number | null;
					created_at: string | null;
					duration: unknown | null;
					end_time: string | null;
					id: string;
					is_completed: boolean | null;
					schedule_id: string | null;
					start_time: string;
					updated_at: string | null;
					user_id: string;
				};
				Insert: {
					bonus_points?: number | null;
					created_at?: string | null;
					duration?: unknown | null;
					end_time?: string | null;
					id?: string;
					is_completed?: boolean | null;
					schedule_id?: string | null;
					start_time: string;
					updated_at?: string | null;
					user_id: string;
				};
				Update: {
					bonus_points?: number | null;
					created_at?: string | null;
					duration?: unknown | null;
					end_time?: string | null;
					id?: string;
					is_completed?: boolean | null;
					schedule_id?: string | null;
					start_time?: string;
					updated_at?: string | null;
					user_id?: string;
				};
				Relationships: [];
			};
			focus_sessions_y2024m11: {
				Row: {
					bonus_points: number | null;
					created_at: string | null;
					duration: unknown | null;
					end_time: string | null;
					id: string;
					is_completed: boolean | null;
					schedule_id: string | null;
					start_time: string;
					updated_at: string | null;
					user_id: string;
				};
				Insert: {
					bonus_points?: number | null;
					created_at?: string | null;
					duration?: unknown | null;
					end_time?: string | null;
					id?: string;
					is_completed?: boolean | null;
					schedule_id?: string | null;
					start_time: string;
					updated_at?: string | null;
					user_id: string;
				};
				Update: {
					bonus_points?: number | null;
					created_at?: string | null;
					duration?: unknown | null;
					end_time?: string | null;
					id?: string;
					is_completed?: boolean | null;
					schedule_id?: string | null;
					start_time?: string;
					updated_at?: string | null;
					user_id?: string;
				};
				Relationships: [];
			};
			focus_sessions_y2024m12: {
				Row: {
					bonus_points: number | null;
					created_at: string | null;
					duration: unknown | null;
					end_time: string | null;
					id: string;
					is_completed: boolean | null;
					schedule_id: string | null;
					start_time: string;
					updated_at: string | null;
					user_id: string;
				};
				Insert: {
					bonus_points?: number | null;
					created_at?: string | null;
					duration?: unknown | null;
					end_time?: string | null;
					id?: string;
					is_completed?: boolean | null;
					schedule_id?: string | null;
					start_time: string;
					updated_at?: string | null;
					user_id: string;
				};
				Update: {
					bonus_points?: number | null;
					created_at?: string | null;
					duration?: unknown | null;
					end_time?: string | null;
					id?: string;
					is_completed?: boolean | null;
					schedule_id?: string | null;
					start_time?: string;
					updated_at?: string | null;
					user_id?: string;
				};
				Relationships: [];
			};
			schedule_tasks: {
				Row: {
					created_at: string | null;
					id: string;
					schedule_id: string | null;
					task_id: string | null;
				};
				Insert: {
					created_at?: string | null;
					id?: string;
					schedule_id?: string | null;
					task_id?: string | null;
				};
				Update: {
					created_at?: string | null;
					id?: string;
					schedule_id?: string | null;
					task_id?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "schedule_tasks_schedule_id_fkey";
						columns: ["schedule_id"];
						isOneToOne: false;
						referencedRelation: "schedules";
						referencedColumns: ["id"];
					},
				];
			};
			schedules: {
				Row: {
					activity_type: string;
					created_at: string | null;
					day_of_week: number;
					description: string | null;
					end_time: string;
					id: string;
					start_time: string;
					title: string;
					updated_at: string | null;
					user_id: string;
				};
				Insert: {
					activity_type: string;
					created_at?: string | null;
					day_of_week: number;
					description?: string | null;
					end_time: string;
					id?: string;
					start_time: string;
					title: string;
					updated_at?: string | null;
					user_id: string;
				};
				Update: {
					activity_type?: string;
					created_at?: string | null;
					day_of_week?: number;
					description?: string | null;
					end_time?: string;
					id?: string;
					start_time?: string;
					title?: string;
					updated_at?: string | null;
					user_id?: string;
				};
				Relationships: [];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
	ff_gamification: {
		Tables: {
			level_settings: {
				Row: {
					created_at: string;
					level: number;
					required_exp: number;
					rewards: Json | null;
					updated_at: string;
				};
				Insert: {
					created_at?: string;
					level: number;
					required_exp: number;
					rewards?: Json | null;
					updated_at?: string;
				};
				Update: {
					created_at?: string;
					level?: number;
					required_exp?: number;
					rewards?: Json | null;
					updated_at?: string;
				};
				Relationships: [];
			};
			quests: {
				Row: {
					created_at: string | null;
					description: string;
					duration_type: string | null;
					id: string;
					quest_type: string;
					requirements: Json;
					reward_badge_id: string | null;
					reward_exp: number;
					title: string;
				};
				Insert: {
					created_at?: string | null;
					description: string;
					duration_type?: string | null;
					id?: string;
					quest_type: string;
					requirements: Json;
					reward_badge_id?: string | null;
					reward_exp: number;
					title: string;
				};
				Update: {
					created_at?: string | null;
					description?: string;
					duration_type?: string | null;
					id?: string;
					quest_type?: string;
					requirements?: Json;
					reward_badge_id?: string | null;
					reward_exp?: number;
					title?: string;
				};
				Relationships: [];
			};
			user_levels: {
				Row: {
					created_at: string;
					current_exp: number;
					current_level: number;
					id: string;
					total_exp: number;
					updated_at: string;
					user_id: string;
				};
				Insert: {
					created_at?: string;
					current_exp?: number;
					current_level?: number;
					id?: string;
					total_exp?: number;
					updated_at?: string;
					user_id: string;
				};
				Update: {
					created_at?: string;
					current_exp?: number;
					current_level?: number;
					id?: string;
					total_exp?: number;
					updated_at?: string;
					user_id?: string;
				};
				Relationships: [];
			};
			user_quests: {
				Row: {
					completed_at: string | null;
					created_at: string | null;
					end_date: string;
					id: string;
					progress: Json;
					quest_id: string;
					start_date: string;
					status: string | null;
					updated_at: string | null;
					user_id: string;
				};
				Insert: {
					completed_at?: string | null;
					created_at?: string | null;
					end_date: string;
					id?: string;
					progress?: Json;
					quest_id: string;
					start_date: string;
					status?: string | null;
					updated_at?: string | null;
					user_id: string;
				};
				Update: {
					completed_at?: string | null;
					created_at?: string | null;
					end_date?: string;
					id?: string;
					progress?: Json;
					quest_id?: string;
					start_date?: string;
					status?: string | null;
					updated_at?: string | null;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "user_quests_quest_id_fkey";
						columns: ["quest_id"];
						isOneToOne: false;
						referencedRelation: "quests";
						referencedColumns: ["id"];
					},
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
	ff_learning: {
		Tables: {
			learning_path_resources: {
				Row: {
					created_at: string;
					id: string;
					is_required: boolean;
					order_index: number;
					path_id: string;
					resource_data: Json;
					resource_id: string;
					updated_at: string;
				};
				Insert: {
					created_at?: string;
					id?: string;
					is_required?: boolean;
					order_index: number;
					path_id: string;
					resource_data?: Json;
					resource_id: string;
					updated_at?: string;
				};
				Update: {
					created_at?: string;
					id?: string;
					is_required?: boolean;
					order_index?: number;
					path_id?: string;
					resource_data?: Json;
					resource_id?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "learning_path_resources_path_id_fkey";
						columns: ["path_id"];
						isOneToOne: false;
						referencedRelation: "learning_paths";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "learning_path_resources_resource_id_fkey";
						columns: ["resource_id"];
						isOneToOne: false;
						referencedRelation: "learning_resources";
						referencedColumns: ["id"];
					},
				];
			};
			learning_paths: {
				Row: {
					created_at: string;
					creator_id: string;
					description: string | null;
					estimated_duration: string | null;
					id: string;
					is_official: boolean;
					is_public: boolean;
					likes_count: number;
					name: string;
					path_data: Json;
					target_level: string;
					updated_at: string;
				};
				Insert: {
					created_at?: string;
					creator_id: string;
					description?: string | null;
					estimated_duration?: string | null;
					id?: string;
					is_official?: boolean;
					is_public?: boolean;
					likes_count?: number;
					name: string;
					path_data?: Json;
					target_level: string;
					updated_at?: string;
				};
				Update: {
					created_at?: string;
					creator_id?: string;
					description?: string | null;
					estimated_duration?: string | null;
					id?: string;
					is_official?: boolean;
					is_public?: boolean;
					likes_count?: number;
					name?: string;
					path_data?: Json;
					target_level?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
			learning_resource_recommendations: {
				Row: {
					created_at: string;
					id: string;
					is_dismissed: boolean;
					recommendation_data: Json;
					recommendation_score: number;
					recommendation_type: string;
					resource_id: string;
					updated_at: string;
					user_id: string;
				};
				Insert: {
					created_at?: string;
					id?: string;
					is_dismissed?: boolean;
					recommendation_data?: Json;
					recommendation_score: number;
					recommendation_type: string;
					resource_id: string;
					updated_at?: string;
					user_id: string;
				};
				Update: {
					created_at?: string;
					id?: string;
					is_dismissed?: boolean;
					recommendation_data?: Json;
					recommendation_score?: number;
					recommendation_type?: string;
					resource_id?: string;
					updated_at?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "learning_resource_recommendations_resource_id_fkey";
						columns: ["resource_id"];
						isOneToOne: false;
						referencedRelation: "learning_resources";
						referencedColumns: ["id"];
					},
				];
			};
			learning_resource_reviews: {
				Row: {
					completion_status: string | null;
					created_at: string;
					helpful_count: number;
					id: string;
					is_verified_purchase: boolean;
					rating: number;
					resource_id: string;
					review_data: Json;
					review_text: string | null;
					updated_at: string;
					user_id: string;
				};
				Insert: {
					completion_status?: string | null;
					created_at?: string;
					helpful_count?: number;
					id?: string;
					is_verified_purchase?: boolean;
					rating: number;
					resource_id: string;
					review_data?: Json;
					review_text?: string | null;
					updated_at?: string;
					user_id: string;
				};
				Update: {
					completion_status?: string | null;
					created_at?: string;
					helpful_count?: number;
					id?: string;
					is_verified_purchase?: boolean;
					rating?: number;
					resource_id?: string;
					review_data?: Json;
					review_text?: string | null;
					updated_at?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "learning_resource_reviews_resource_id_fkey";
						columns: ["resource_id"];
						isOneToOne: false;
						referencedRelation: "learning_resources";
						referencedColumns: ["id"];
					},
				];
			};
			learning_resources: {
				Row: {
					cost: Json | null;
					created_at: string;
					description: string | null;
					duration: string | null;
					format: string | null;
					id: string;
					language: string | null;
					level: string | null;
					metadata: Json | null;
					name: string;
					objectives: Json | null;
					prerequisites: Json | null;
					provider: string | null;
					rating: Json | null;
					skill_id: string;
					type: string;
					updated_at: string;
					url: string | null;
				};
				Insert: {
					cost?: Json | null;
					created_at?: string;
					description?: string | null;
					duration?: string | null;
					format?: string | null;
					id?: string;
					language?: string | null;
					level?: string | null;
					metadata?: Json | null;
					name: string;
					objectives?: Json | null;
					prerequisites?: Json | null;
					provider?: string | null;
					rating?: Json | null;
					skill_id: string;
					type: string;
					updated_at?: string;
					url?: string | null;
				};
				Update: {
					cost?: Json | null;
					created_at?: string;
					description?: string | null;
					duration?: string | null;
					format?: string | null;
					id?: string;
					language?: string | null;
					level?: string | null;
					metadata?: Json | null;
					name?: string;
					objectives?: Json | null;
					prerequisites?: Json | null;
					provider?: string | null;
					rating?: Json | null;
					skill_id?: string;
					type?: string;
					updated_at?: string;
					url?: string | null;
				};
				Relationships: [];
			};
			user_learning_paths: {
				Row: {
					completed_at: string | null;
					created_at: string;
					id: string;
					path_id: string;
					progress_data: Json;
					started_at: string | null;
					status: string;
					updated_at: string;
					user_id: string;
				};
				Insert: {
					completed_at?: string | null;
					created_at?: string;
					id?: string;
					path_id: string;
					progress_data?: Json;
					started_at?: string | null;
					status: string;
					updated_at?: string;
					user_id: string;
				};
				Update: {
					completed_at?: string | null;
					created_at?: string;
					id?: string;
					path_id?: string;
					progress_data?: Json;
					started_at?: string | null;
					status?: string;
					updated_at?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "user_learning_paths_path_id_fkey";
						columns: ["path_id"];
						isOneToOne: false;
						referencedRelation: "learning_paths";
						referencedColumns: ["id"];
					},
				];
			};
			user_learning_progress: {
				Row: {
					completed_at: string | null;
					created_at: string;
					id: string;
					progress_data: Json;
					resource_id: string;
					started_at: string | null;
					status: string;
					updated_at: string;
					user_id: string;
				};
				Insert: {
					completed_at?: string | null;
					created_at?: string;
					id?: string;
					progress_data?: Json;
					resource_id: string;
					started_at?: string | null;
					status: string;
					updated_at?: string;
					user_id: string;
				};
				Update: {
					completed_at?: string | null;
					created_at?: string;
					id?: string;
					progress_data?: Json;
					resource_id?: string;
					started_at?: string | null;
					status?: string;
					updated_at?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "user_learning_progress_resource_id_fkey";
						columns: ["resource_id"];
						isOneToOne: false;
						referencedRelation: "learning_resources";
						referencedColumns: ["id"];
					},
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
	ff_skills: {
		Tables: {
			evaluation_history: {
				Row: {
					created_at: string;
					evaluated_at: string;
					evaluated_by: string | null;
					evaluation_data: Json;
					evaluation_type: string;
					id: string;
					user_skill_id: string;
				};
				Insert: {
					created_at?: string;
					evaluated_at?: string;
					evaluated_by?: string | null;
					evaluation_data: Json;
					evaluation_type: string;
					id?: string;
					user_skill_id: string;
				};
				Update: {
					created_at?: string;
					evaluated_at?: string;
					evaluated_by?: string | null;
					evaluation_data?: Json;
					evaluation_type?: string;
					id?: string;
					user_skill_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "evaluation_history_user_skill_id_fkey";
						columns: ["user_skill_id"];
						isOneToOne: false;
						referencedRelation: "user_skills";
						referencedColumns: ["id"];
					},
				];
			};
			rank_evaluation_criteria: {
				Row: {
					category_id: string;
					created_at: string;
					from_rank_id: string;
					id: string;
					minimum_total_score: number;
					required_metrics: Json;
					to_rank_id: string;
					updated_at: string;
				};
				Insert: {
					category_id: string;
					created_at?: string;
					from_rank_id: string;
					id?: string;
					minimum_total_score: number;
					required_metrics: Json;
					to_rank_id: string;
					updated_at?: string;
				};
				Update: {
					category_id?: string;
					created_at?: string;
					from_rank_id?: string;
					id?: string;
					minimum_total_score?: number;
					required_metrics?: Json;
					to_rank_id?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "rank_evaluation_criteria_category_id_fkey";
						columns: ["category_id"];
						isOneToOne: false;
						referencedRelation: "skill_categories";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "rank_evaluation_criteria_from_rank_id_fkey";
						columns: ["from_rank_id"];
						isOneToOne: false;
						referencedRelation: "skill_ranks";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "rank_evaluation_criteria_to_rank_id_fkey";
						columns: ["to_rank_id"];
						isOneToOne: false;
						referencedRelation: "skill_ranks";
						referencedColumns: ["id"];
					},
				];
			};
			rank_promotion_requirements: {
				Row: {
					category_id: string;
					created_at: string;
					from_rank_id: string;
					id: string;
					requirements: Json;
					to_rank_id: string;
					updated_at: string;
				};
				Insert: {
					category_id: string;
					created_at?: string;
					from_rank_id: string;
					id?: string;
					requirements: Json;
					to_rank_id: string;
					updated_at?: string;
				};
				Update: {
					category_id?: string;
					created_at?: string;
					from_rank_id?: string;
					id?: string;
					requirements?: Json;
					to_rank_id?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "rank_promotion_requirements_category_id_fkey";
						columns: ["category_id"];
						isOneToOne: false;
						referencedRelation: "skill_categories";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "rank_promotion_requirements_from_rank_id_fkey";
						columns: ["from_rank_id"];
						isOneToOne: false;
						referencedRelation: "skill_ranks";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "rank_promotion_requirements_to_rank_id_fkey";
						columns: ["to_rank_id"];
						isOneToOne: false;
						referencedRelation: "skill_ranks";
						referencedColumns: ["id"];
					},
				];
			};
			skill_categories: {
				Row: {
					color: string | null;
					created_at: string;
					description: string | null;
					icon: string | null;
					id: string;
					is_active: boolean | null;
					name: string;
					parent_id: string | null;
					slug: string;
					updated_at: string;
				};
				Insert: {
					color?: string | null;
					created_at?: string;
					description?: string | null;
					icon?: string | null;
					id?: string;
					is_active?: boolean | null;
					name: string;
					parent_id?: string | null;
					slug: string;
					updated_at?: string;
				};
				Update: {
					color?: string | null;
					created_at?: string;
					description?: string | null;
					icon?: string | null;
					id?: string;
					is_active?: boolean | null;
					name?: string;
					parent_id?: string | null;
					slug?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "skill_categories_parent_id_fkey";
						columns: ["parent_id"];
						isOneToOne: false;
						referencedRelation: "skill_categories";
						referencedColumns: ["id"];
					},
				];
			};
			skill_details: {
				Row: {
					category_id: string;
					created_at: string;
					description: string | null;
					difficulty_level: string;
					id: string;
					is_active: boolean | null;
					learning_resources: Json | null;
					name: string;
					prerequisites: Json | null;
					related_skills: Json | null;
					slug: string;
					updated_at: string;
					version_info: Json | null;
				};
				Insert: {
					category_id: string;
					created_at?: string;
					description?: string | null;
					difficulty_level: string;
					id?: string;
					is_active?: boolean | null;
					learning_resources?: Json | null;
					name: string;
					prerequisites?: Json | null;
					related_skills?: Json | null;
					slug: string;
					updated_at?: string;
					version_info?: Json | null;
				};
				Update: {
					category_id?: string;
					created_at?: string;
					description?: string | null;
					difficulty_level?: string;
					id?: string;
					is_active?: boolean | null;
					learning_resources?: Json | null;
					name?: string;
					prerequisites?: Json | null;
					related_skills?: Json | null;
					slug?: string;
					updated_at?: string;
					version_info?: Json | null;
				};
				Relationships: [
					{
						foreignKeyName: "skill_details_category_id_fkey";
						columns: ["category_id"];
						isOneToOne: false;
						referencedRelation: "skill_categories";
						referencedColumns: ["id"];
					},
				];
			};
			skill_evaluation_metrics: {
				Row: {
					category: string;
					created_at: string;
					description: string | null;
					evaluation_type: string;
					id: string;
					name: string;
					slug: string;
					updated_at: string;
					weight: number;
				};
				Insert: {
					category: string;
					created_at?: string;
					description?: string | null;
					evaluation_type: string;
					id?: string;
					name: string;
					slug: string;
					updated_at?: string;
					weight?: number;
				};
				Update: {
					category?: string;
					created_at?: string;
					description?: string | null;
					evaluation_type?: string;
					id?: string;
					name?: string;
					slug?: string;
					updated_at?: string;
					weight?: number;
				};
				Relationships: [];
			};
			skill_ranks: {
				Row: {
					color: string | null;
					created_at: string;
					description: string | null;
					display_order: number;
					icon: string | null;
					id: string;
					name: string;
					required_exp: number;
					slug: string;
					updated_at: string;
				};
				Insert: {
					color?: string | null;
					created_at?: string;
					description?: string | null;
					display_order: number;
					icon?: string | null;
					id?: string;
					name: string;
					required_exp: number;
					slug: string;
					updated_at?: string;
				};
				Update: {
					color?: string | null;
					created_at?: string;
					description?: string | null;
					display_order?: number;
					icon?: string | null;
					id?: string;
					name?: string;
					required_exp?: number;
					slug?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
			user_skill_evaluations: {
				Row: {
					created_at: string;
					current_score: number | null;
					evaluation_data: Json;
					id: string;
					last_updated: string | null;
					metric_id: string;
					updated_at: string;
					user_skill_id: string;
				};
				Insert: {
					created_at?: string;
					current_score?: number | null;
					evaluation_data?: Json;
					id?: string;
					last_updated?: string | null;
					metric_id: string;
					updated_at?: string;
					user_skill_id: string;
				};
				Update: {
					created_at?: string;
					current_score?: number | null;
					evaluation_data?: Json;
					id?: string;
					last_updated?: string | null;
					metric_id?: string;
					updated_at?: string;
					user_skill_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "user_skill_evaluations_metric_id_fkey";
						columns: ["metric_id"];
						isOneToOne: false;
						referencedRelation: "skill_evaluation_metrics";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "user_skill_evaluations_user_skill_id_fkey";
						columns: ["user_skill_id"];
						isOneToOne: false;
						referencedRelation: "user_skills";
						referencedColumns: ["id"];
					},
				];
			};
			user_skills: {
				Row: {
					created_at: string | null;
					current_level: number | null;
					id: string;
					skill_category: string;
					total_exp: number | null;
					updated_at: string | null;
					user_id: string;
				};
				Insert: {
					created_at?: string | null;
					current_level?: number | null;
					id?: string;
					skill_category: string;
					total_exp?: number | null;
					updated_at?: string | null;
					user_id: string;
				};
				Update: {
					created_at?: string | null;
					current_level?: number | null;
					id?: string;
					skill_category?: string;
					total_exp?: number | null;
					updated_at?: string | null;
					user_id?: string;
				};
				Relationships: [];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
	ff_tasks: {
		Tables: {
			project_activities: {
				Row: {
					action: string;
					created_at: string | null;
					details: Json | null;
					id: string;
					project_id: string;
					type: Database["public"]["Enums"]["activity_type"];
					updated_at: string | null;
					user_id: string;
				};
				Insert: {
					action: string;
					created_at?: string | null;
					details?: Json | null;
					id?: string;
					project_id: string;
					type: Database["public"]["Enums"]["activity_type"];
					updated_at?: string | null;
					user_id: string;
				};
				Update: {
					action?: string;
					created_at?: string | null;
					details?: Json | null;
					id?: string;
					project_id?: string;
					type?: Database["public"]["Enums"]["activity_type"];
					updated_at?: string | null;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "project_activities_project_id_fkey";
						columns: ["project_id"];
						isOneToOne: false;
						referencedRelation: "projects";
						referencedColumns: ["id"];
					},
				];
			};
			project_tasks: {
				Row: {
					created_at: string | null;
					position: number;
					project_id: string;
					task_id: string;
				};
				Insert: {
					created_at?: string | null;
					position: number;
					project_id: string;
					task_id: string;
				};
				Update: {
					created_at?: string | null;
					position?: number;
					project_id?: string;
					task_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "project_tasks_project_id_fkey";
						columns: ["project_id"];
						isOneToOne: false;
						referencedRelation: "projects";
						referencedColumns: ["id"];
					},
				];
			};
			projects: {
				Row: {
					color: string | null;
					created_at: string | null;
					description: string | null;
					end_date: string | null;
					id: string;
					is_archived: boolean | null;
					name: string;
					priority: string | null;
					start_date: string | null;
					status: string;
					updated_at: string | null;
					user_id: string | null;
				};
				Insert: {
					color?: string | null;
					created_at?: string | null;
					description?: string | null;
					end_date?: string | null;
					id?: string;
					is_archived?: boolean | null;
					name: string;
					priority?: string | null;
					start_date?: string | null;
					status?: string;
					updated_at?: string | null;
					user_id?: string | null;
				};
				Update: {
					color?: string | null;
					created_at?: string | null;
					description?: string | null;
					end_date?: string | null;
					id?: string;
					is_archived?: boolean | null;
					name?: string;
					priority?: string | null;
					start_date?: string | null;
					status?: string;
					updated_at?: string | null;
					user_id?: string | null;
				};
				Relationships: [];
			};
			task_breakdowns: {
				Row: {
					created_at: string | null;
					description: string | null;
					estimated_duration: unknown | null;
					id: string;
					order_index: number;
					parent_task_id: string | null;
					status: string | null;
					title: string;
					updated_at: string | null;
				};
				Insert: {
					created_at?: string | null;
					description?: string | null;
					estimated_duration?: unknown | null;
					id?: string;
					order_index: number;
					parent_task_id?: string | null;
					status?: string | null;
					title: string;
					updated_at?: string | null;
				};
				Update: {
					created_at?: string | null;
					description?: string | null;
					estimated_duration?: unknown | null;
					id?: string;
					order_index?: number;
					parent_task_id?: string | null;
					status?: string | null;
					title?: string;
					updated_at?: string | null;
				};
				Relationships: [];
			};
			task_dependencies: {
				Row: {
					conditions: Json | null;
					created_at: string | null;
					dependency_type: Database["public"]["Enums"]["dependency_type"];
					dependent_task_id: string;
					lag_time: unknown | null;
					link_type: Database["public"]["Enums"]["dependency_link_type"];
					metadata: Json | null;
					prerequisite_task_id: string;
					status: Database["public"]["Enums"]["dependency_status"];
					updated_at: string | null;
				};
				Insert: {
					conditions?: Json | null;
					created_at?: string | null;
					dependency_type: Database["public"]["Enums"]["dependency_type"];
					dependent_task_id: string;
					lag_time?: unknown | null;
					link_type?: Database["public"]["Enums"]["dependency_link_type"];
					metadata?: Json | null;
					prerequisite_task_id: string;
					status?: Database["public"]["Enums"]["dependency_status"];
					updated_at?: string | null;
				};
				Update: {
					conditions?: Json | null;
					created_at?: string | null;
					dependency_type?: Database["public"]["Enums"]["dependency_type"];
					dependent_task_id?: string;
					lag_time?: unknown | null;
					link_type?: Database["public"]["Enums"]["dependency_link_type"];
					metadata?: Json | null;
					prerequisite_task_id?: string;
					status?: Database["public"]["Enums"]["dependency_status"];
					updated_at?: string | null;
				};
				Relationships: [];
			};
			task_experience: {
				Row: {
					base_exp: number;
					bonus_exp: number | null;
					created_at: string | null;
					difficulty_level: number | null;
					id: string;
					skill_category: string;
					task_id: string | null;
				};
				Insert: {
					base_exp: number;
					bonus_exp?: number | null;
					created_at?: string | null;
					difficulty_level?: number | null;
					id?: string;
					skill_category: string;
					task_id?: string | null;
				};
				Update: {
					base_exp?: number;
					bonus_exp?: number | null;
					created_at?: string | null;
					difficulty_level?: number | null;
					id?: string;
					skill_category?: string;
					task_id?: string | null;
				};
				Relationships: [];
			};
			task_group_memberships: {
				Row: {
					created_at: string | null;
					group_id: string;
					position: number | null;
					task_id: string;
					updated_at: string | null;
				};
				Insert: {
					created_at?: string | null;
					group_id: string;
					position?: number | null;
					task_id: string;
					updated_at?: string | null;
				};
				Update: {
					created_at?: string | null;
					group_id?: string;
					position?: number | null;
					task_id?: string;
					updated_at?: string | null;
				};
				Relationships: [];
			};
			task_group_views: {
				Row: {
					created_at: string | null;
					group_id: string | null;
					id: string;
					is_enabled: boolean | null;
					last_used_at: string | null;
					settings: Json | null;
					updated_at: string | null;
					view_type: string | null;
				};
				Insert: {
					created_at?: string | null;
					group_id?: string | null;
					id?: string;
					is_enabled?: boolean | null;
					last_used_at?: string | null;
					settings?: Json | null;
					updated_at?: string | null;
					view_type?: string | null;
				};
				Update: {
					created_at?: string | null;
					group_id?: string | null;
					id?: string;
					is_enabled?: boolean | null;
					last_used_at?: string | null;
					settings?: Json | null;
					updated_at?: string | null;
					view_type?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "task_group_views_group_id_fkey";
						columns: ["group_id"];
						isOneToOne: false;
						referencedRelation: "task_groups";
						referencedColumns: ["id"];
					},
				];
			};
			task_groups: {
				Row: {
					active_view_type: string | null;
					created_at: string | null;
					description: string | null;
					id: string;
					metadata: Json | null;
					name: string;
					parent_group_id: string | null;
					path: unknown | null;
					project_id: string | null;
					updated_at: string | null;
				};
				Insert: {
					active_view_type?: string | null;
					created_at?: string | null;
					description?: string | null;
					id?: string;
					metadata?: Json | null;
					name: string;
					parent_group_id?: string | null;
					path?: unknown | null;
					project_id?: string | null;
					updated_at?: string | null;
				};
				Update: {
					active_view_type?: string | null;
					created_at?: string | null;
					description?: string | null;
					id?: string;
					metadata?: Json | null;
					name?: string;
					parent_group_id?: string | null;
					path?: unknown | null;
					project_id?: string | null;
					updated_at?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "task_groups_parent_group_id_fkey";
						columns: ["parent_group_id"];
						isOneToOne: false;
						referencedRelation: "task_groups";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "task_groups_project_id_fkey";
						columns: ["project_id"];
						isOneToOne: false;
						referencedRelation: "projects";
						referencedColumns: ["id"];
					},
				];
			};
			task_relationships: {
				Row: {
					created_at: string | null;
					metadata: Json | null;
					relationship_type: Database["public"]["Enums"]["task_relationship_type"];
					source_task_id: string;
					target_task_id: string;
					updated_at: string | null;
				};
				Insert: {
					created_at?: string | null;
					metadata?: Json | null;
					relationship_type: Database["public"]["Enums"]["task_relationship_type"];
					source_task_id: string;
					target_task_id: string;
					updated_at?: string | null;
				};
				Update: {
					created_at?: string | null;
					metadata?: Json | null;
					relationship_type?: Database["public"]["Enums"]["task_relationship_type"];
					source_task_id?: string;
					target_task_id?: string;
					updated_at?: string | null;
				};
				Relationships: [];
			};
			task_reminders: {
				Row: {
					created_at: string | null;
					id: string;
					is_sent: boolean | null;
					reminder_time: string;
					task_id: string | null;
					updated_at: string | null;
				};
				Insert: {
					created_at?: string | null;
					id?: string;
					is_sent?: boolean | null;
					reminder_time: string;
					task_id?: string | null;
					updated_at?: string | null;
				};
				Update: {
					created_at?: string | null;
					id?: string;
					is_sent?: boolean | null;
					reminder_time?: string;
					task_id?: string | null;
					updated_at?: string | null;
				};
				Relationships: [];
			};
			tasks: {
				Row: {
					actual_duration: unknown | null;
					ai_generated: boolean | null;
					category: string | null;
					created_at: string | null;
					description: string | null;
					difficulty_level: number | null;
					due_date: string | null;
					estimated_duration: unknown | null;
					id: string;
					is_recurring: boolean | null;
					priority: string | null;
					progress_percentage: number | null;
					project_id: string | null;
					recurring_pattern: Json | null;
					start_date: string | null;
					status: string | null;
					style: Json | null;
					title: string;
					updated_at: string | null;
					user_id: string;
				};
				Insert: {
					actual_duration?: unknown | null;
					ai_generated?: boolean | null;
					category?: string | null;
					created_at?: string | null;
					description?: string | null;
					difficulty_level?: number | null;
					due_date?: string | null;
					estimated_duration?: unknown | null;
					id?: string;
					is_recurring?: boolean | null;
					priority?: string | null;
					progress_percentage?: number | null;
					project_id?: string | null;
					recurring_pattern?: Json | null;
					start_date?: string | null;
					status?: string | null;
					style?: Json | null;
					title: string;
					updated_at?: string | null;
					user_id: string;
				};
				Update: {
					actual_duration?: unknown | null;
					ai_generated?: boolean | null;
					category?: string | null;
					created_at?: string | null;
					description?: string | null;
					difficulty_level?: number | null;
					due_date?: string | null;
					estimated_duration?: unknown | null;
					id?: string;
					is_recurring?: boolean | null;
					priority?: string | null;
					progress_percentage?: number | null;
					project_id?: string | null;
					recurring_pattern?: Json | null;
					start_date?: string | null;
					status?: string | null;
					style?: Json | null;
					title?: string;
					updated_at?: string | null;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "tasks_project_id_fkey";
						columns: ["project_id"];
						isOneToOne: false;
						referencedRelation: "projects";
						referencedColumns: ["id"];
					},
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
	ff_users: {
		Tables: {
			user_profiles: {
				Row: {
					cache_version: number | null;
					created_at: string | null;
					display_name: string | null;
					email: string | null;
					id: string;
					last_activity_at: string | null;
					profile_image: string | null;
					updated_at: string | null;
					user_id: string;
				};
				Insert: {
					cache_version?: number | null;
					created_at?: string | null;
					display_name?: string | null;
					email?: string | null;
					id?: string;
					last_activity_at?: string | null;
					profile_image?: string | null;
					updated_at?: string | null;
					user_id: string;
				};
				Update: {
					cache_version?: number | null;
					created_at?: string | null;
					display_name?: string | null;
					email?: string | null;
					id?: string;
					last_activity_at?: string | null;
					profile_image?: string | null;
					updated_at?: string | null;
					user_id?: string;
				};
				Relationships: [];
			};
			user_role_mappings: {
				Row: {
					assigned_at: string | null;
					assigned_by: string | null;
					created_at: string | null;
					id: string;
					is_active: boolean | null;
					role_id: string;
					updated_at: string | null;
					user_id: string;
				};
				Insert: {
					assigned_at?: string | null;
					assigned_by?: string | null;
					created_at?: string | null;
					id?: string;
					is_active?: boolean | null;
					role_id: string;
					updated_at?: string | null;
					user_id: string;
				};
				Update: {
					assigned_at?: string | null;
					assigned_by?: string | null;
					created_at?: string | null;
					id?: string;
					is_active?: boolean | null;
					role_id?: string;
					updated_at?: string | null;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "user_role_mappings_role_id_fkey";
						columns: ["role_id"];
						isOneToOne: false;
						referencedRelation: "user_roles";
						referencedColumns: ["id"];
					},
				];
			};
			user_roles: {
				Row: {
					created_at: string | null;
					description: string | null;
					id: string;
					name: string;
				};
				Insert: {
					created_at?: string | null;
					description?: string | null;
					id?: string;
					name: string;
				};
				Update: {
					created_at?: string | null;
					description?: string | null;
					id?: string;
					name?: string;
				};
				Relationships: [];
			};
			user_settings: {
				Row: {
					created_at: string | null;
					focus_mode_restrictions: Json | null;
					id: string;
					notification_enabled: boolean | null;
					theme_color: string | null;
					updated_at: string | null;
					user_id: string;
					voice_input_enabled: boolean | null;
				};
				Insert: {
					created_at?: string | null;
					focus_mode_restrictions?: Json | null;
					id?: string;
					notification_enabled?: boolean | null;
					theme_color?: string | null;
					updated_at?: string | null;
					user_id: string;
					voice_input_enabled?: boolean | null;
				};
				Update: {
					created_at?: string | null;
					focus_mode_restrictions?: Json | null;
					id?: string;
					notification_enabled?: boolean | null;
					theme_color?: string | null;
					updated_at?: string | null;
					user_id?: string;
					voice_input_enabled?: boolean | null;
				};
				Relationships: [];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
	public: {
		Tables: {
			[_ in never]: never;
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			_ltree_compress: {
				Args: {
					"": unknown;
				};
				Returns: unknown;
			};
			_ltree_gist_options: {
				Args: {
					"": unknown;
				};
				Returns: undefined;
			};
			add_experience_points: {
				Args: {
					p_user_id: string;
					p_exp_points: number;
				};
				Returns: {
					new_exp: number;
					new_level: number;
					leveled_up: boolean;
				}[];
			};
			calculate_focus_session_exp: {
				Args: {
					p_duration: unknown;
					p_bonus_points: number;
				};
				Returns: number;
			};
			calculate_level: {
				Args: {
					p_exp: number;
				};
				Returns: number;
			};
			calculate_required_exp: {
				Args: {
					level: number;
				};
				Returns: number;
			};
			calculate_task_experience: {
				Args: {
					p_difficulty_level: number;
					p_estimated_duration: unknown;
					p_actual_duration: unknown;
					p_current_level: number;
				};
				Returns: number;
			};
			check_badge_conditions: {
				Args: {
					p_user_id: string;
					p_condition_type: string;
					p_value: Json;
				};
				Returns: {
					badge_id: string;
					badge_name: string;
					badge_description: string;
				}[];
			};
			create_focus_session_partition: {
				Args: {
					p_year: number;
					p_month: number;
				};
				Returns: undefined;
			};
			delete_unused_profile_images: {
				Args: Record<PropertyKey, never>;
				Returns: undefined;
			};
			generate_recurring_tasks: {
				Args: Record<PropertyKey, never>;
				Returns: undefined;
			};
			get_active_tasks: {
				Args: {
					p_user_id: string;
				};
				Returns: {
					id: string;
					title: string;
					description: string;
					due_date: string;
					priority: string;
					category: string;
					status: string;
					difficulty_level: number;
					estimated_duration: unknown;
					actual_duration: unknown;
					ai_generated: boolean;
					parent_task_id: string;
					path: unknown;
					position: number;
					depth: number;
				}[];
			};
			get_default_view_settings: {
				Args: {
					p_view_type: string;
				};
				Returns: Json;
			};
			get_focus_session_stats: {
				Args: {
					p_user_id: string;
					p_start_date: string;
					p_end_date: string;
				};
				Returns: {
					total_sessions: number;
					total_duration: unknown;
					total_bonus_points: number;
					average_duration: unknown;
					completion_rate: number;
				}[];
			};
			get_subtasks: {
				Args: {
					p_task_id: string;
				};
				Returns: {
					id: string;
					title: string;
					description: string;
					due_date: string;
					priority: string;
					status: string;
					position: number;
					path: unknown;
					depth: number;
				}[];
			};
			get_task_breakdowns: {
				Args: {
					p_task_id: string;
				};
				Returns: {
					id: string;
					title: string;
					description: string;
					estimated_duration: unknown;
					order_index: number;
					status: string;
				}[];
			};
			has_role: {
				Args: {
					p_user_id: string;
					p_role_name: string;
				};
				Returns: boolean;
			};
			lca: {
				Args: {
					"": unknown[];
				};
				Returns: unknown;
			};
			lquery_in: {
				Args: {
					"": unknown;
				};
				Returns: unknown;
			};
			lquery_out: {
				Args: {
					"": unknown;
				};
				Returns: unknown;
			};
			lquery_recv: {
				Args: {
					"": unknown;
				};
				Returns: unknown;
			};
			lquery_send: {
				Args: {
					"": unknown;
				};
				Returns: string;
			};
			ltree_compress: {
				Args: {
					"": unknown;
				};
				Returns: unknown;
			};
			ltree_decompress: {
				Args: {
					"": unknown;
				};
				Returns: unknown;
			};
			ltree_gist_in: {
				Args: {
					"": unknown;
				};
				Returns: unknown;
			};
			ltree_gist_options: {
				Args: {
					"": unknown;
				};
				Returns: undefined;
			};
			ltree_gist_out: {
				Args: {
					"": unknown;
				};
				Returns: unknown;
			};
			ltree_in: {
				Args: {
					"": unknown;
				};
				Returns: unknown;
			};
			ltree_out: {
				Args: {
					"": unknown;
				};
				Returns: unknown;
			};
			ltree_recv: {
				Args: {
					"": unknown;
				};
				Returns: unknown;
			};
			ltree_send: {
				Args: {
					"": unknown;
				};
				Returns: string;
			};
			ltree2text: {
				Args: {
					"": unknown;
				};
				Returns: string;
			};
			ltxtq_in: {
				Args: {
					"": unknown;
				};
				Returns: unknown;
			};
			ltxtq_out: {
				Args: {
					"": unknown;
				};
				Returns: unknown;
			};
			ltxtq_recv: {
				Args: {
					"": unknown;
				};
				Returns: unknown;
			};
			ltxtq_send: {
				Args: {
					"": unknown;
				};
				Returns: string;
			};
			nlevel: {
				Args: {
					"": unknown;
				};
				Returns: number;
			};
			text2ltree: {
				Args: {
					"": string;
				};
				Returns: unknown;
			};
			update_overdue_tasks: {
				Args: Record<PropertyKey, never>;
				Returns: undefined;
			};
			update_quest_progress: {
				Args: {
					p_user_id: string;
					p_quest_type: string;
					p_progress: Json;
				};
				Returns: undefined;
			};
			update_user_skill: {
				Args: {
					p_user_id: string;
					p_skill_category: string;
					p_exp_gained: number;
				};
				Returns: {
					new_level: number;
					exp_to_next_level: number;
					total_exp: number;
					gained_exp: number;
				}[];
			};
		};
		Enums: {
			activity_type:
				| "project_update"
				| "task_create"
				| "task_update"
				| "task_delete"
				| "member_update";
			dependency_link_type:
				| "finish_to_start"
				| "start_to_start"
				| "finish_to_finish"
				| "start_to_finish";
			dependency_status: "pending" | "satisfied" | "blocked" | "skipped";
			dependency_type: "required" | "optional" | "conditional";
			task_relationship_type:
				| "related"
				| "references"
				| "derived_from"
				| "blocks"
				| "duplicates";
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type PublicSchema = Database[Extract<keyof Database, "public">];

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
			Row: infer R;
		}
		? R
		: never
	: PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
				PublicSchema["Views"])
		? (PublicSchema["Tables"] &
				PublicSchema["Views"])[PublicTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	PublicTableNameOrOptions extends
		| keyof PublicSchema["Tables"]
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
		? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	PublicTableNameOrOptions extends
		| keyof PublicSchema["Tables"]
		| { schema: keyof Database },
	TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
		? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
	? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
		? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

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
		: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof PublicSchema["CompositeTypes"]
		| { schema: keyof Database },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
		: never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
	? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
		? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
		: never;
