export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export type Database = {
	auth: {
		Tables: {
			audit_log_entries: {
				Row: {
					created_at: string | null;
					id: string;
					instance_id: string | null;
					ip_address: string;
					payload: Json | null;
				};
				Insert: {
					created_at?: string | null;
					id: string;
					instance_id?: string | null;
					ip_address?: string;
					payload?: Json | null;
				};
				Update: {
					created_at?: string | null;
					id?: string;
					instance_id?: string | null;
					ip_address?: string;
					payload?: Json | null;
				};
				Relationships: [];
			};
			flow_state: {
				Row: {
					auth_code: string;
					auth_code_issued_at: string | null;
					authentication_method: string;
					code_challenge: string;
					code_challenge_method: Database["auth"]["Enums"]["code_challenge_method"];
					created_at: string | null;
					id: string;
					provider_access_token: string | null;
					provider_refresh_token: string | null;
					provider_type: string;
					updated_at: string | null;
					user_id: string | null;
				};
				Insert: {
					auth_code: string;
					auth_code_issued_at?: string | null;
					authentication_method: string;
					code_challenge: string;
					code_challenge_method: Database["auth"]["Enums"]["code_challenge_method"];
					created_at?: string | null;
					id: string;
					provider_access_token?: string | null;
					provider_refresh_token?: string | null;
					provider_type: string;
					updated_at?: string | null;
					user_id?: string | null;
				};
				Update: {
					auth_code?: string;
					auth_code_issued_at?: string | null;
					authentication_method?: string;
					code_challenge?: string;
					code_challenge_method?: Database["auth"]["Enums"]["code_challenge_method"];
					created_at?: string | null;
					id?: string;
					provider_access_token?: string | null;
					provider_refresh_token?: string | null;
					provider_type?: string;
					updated_at?: string | null;
					user_id?: string | null;
				};
				Relationships: [];
			};
			identities: {
				Row: {
					created_at: string | null;
					email: string | null;
					id: string;
					identity_data: Json;
					last_sign_in_at: string | null;
					provider: string;
					provider_id: string;
					updated_at: string | null;
					user_id: string;
				};
				Insert: {
					created_at?: string | null;
					email?: string | null;
					id?: string;
					identity_data: Json;
					last_sign_in_at?: string | null;
					provider: string;
					provider_id: string;
					updated_at?: string | null;
					user_id: string;
				};
				Update: {
					created_at?: string | null;
					email?: string | null;
					id?: string;
					identity_data?: Json;
					last_sign_in_at?: string | null;
					provider?: string;
					provider_id?: string;
					updated_at?: string | null;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "identities_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					},
				];
			};
			instances: {
				Row: {
					created_at: string | null;
					id: string;
					raw_base_config: string | null;
					updated_at: string | null;
					uuid: string | null;
				};
				Insert: {
					created_at?: string | null;
					id: string;
					raw_base_config?: string | null;
					updated_at?: string | null;
					uuid?: string | null;
				};
				Update: {
					created_at?: string | null;
					id?: string;
					raw_base_config?: string | null;
					updated_at?: string | null;
					uuid?: string | null;
				};
				Relationships: [];
			};
			mfa_amr_claims: {
				Row: {
					authentication_method: string;
					created_at: string;
					id: string;
					session_id: string;
					updated_at: string;
				};
				Insert: {
					authentication_method: string;
					created_at: string;
					id: string;
					session_id: string;
					updated_at: string;
				};
				Update: {
					authentication_method?: string;
					created_at?: string;
					id?: string;
					session_id?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "mfa_amr_claims_session_id_fkey";
						columns: ["session_id"];
						isOneToOne: false;
						referencedRelation: "sessions";
						referencedColumns: ["id"];
					},
				];
			};
			mfa_challenges: {
				Row: {
					created_at: string;
					factor_id: string;
					id: string;
					ip_address: unknown;
					otp_code: string | null;
					verified_at: string | null;
					web_authn_session_data: Json | null;
				};
				Insert: {
					created_at: string;
					factor_id: string;
					id: string;
					ip_address: unknown;
					otp_code?: string | null;
					verified_at?: string | null;
					web_authn_session_data?: Json | null;
				};
				Update: {
					created_at?: string;
					factor_id?: string;
					id?: string;
					ip_address?: unknown;
					otp_code?: string | null;
					verified_at?: string | null;
					web_authn_session_data?: Json | null;
				};
				Relationships: [
					{
						foreignKeyName: "mfa_challenges_auth_factor_id_fkey";
						columns: ["factor_id"];
						isOneToOne: false;
						referencedRelation: "mfa_factors";
						referencedColumns: ["id"];
					},
				];
			};
			mfa_factors: {
				Row: {
					created_at: string;
					factor_type: Database["auth"]["Enums"]["factor_type"];
					friendly_name: string | null;
					id: string;
					last_challenged_at: string | null;
					phone: string | null;
					secret: string | null;
					status: Database["auth"]["Enums"]["factor_status"];
					updated_at: string;
					user_id: string;
					web_authn_aaguid: string | null;
					web_authn_credential: Json | null;
				};
				Insert: {
					created_at: string;
					factor_type: Database["auth"]["Enums"]["factor_type"];
					friendly_name?: string | null;
					id: string;
					last_challenged_at?: string | null;
					phone?: string | null;
					secret?: string | null;
					status: Database["auth"]["Enums"]["factor_status"];
					updated_at: string;
					user_id: string;
					web_authn_aaguid?: string | null;
					web_authn_credential?: Json | null;
				};
				Update: {
					created_at?: string;
					factor_type?: Database["auth"]["Enums"]["factor_type"];
					friendly_name?: string | null;
					id?: string;
					last_challenged_at?: string | null;
					phone?: string | null;
					secret?: string | null;
					status?: Database["auth"]["Enums"]["factor_status"];
					updated_at?: string;
					user_id?: string;
					web_authn_aaguid?: string | null;
					web_authn_credential?: Json | null;
				};
				Relationships: [
					{
						foreignKeyName: "mfa_factors_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					},
				];
			};
			one_time_tokens: {
				Row: {
					created_at: string;
					id: string;
					relates_to: string;
					token_hash: string;
					token_type: Database["auth"]["Enums"]["one_time_token_type"];
					updated_at: string;
					user_id: string;
				};
				Insert: {
					created_at?: string;
					id: string;
					relates_to: string;
					token_hash: string;
					token_type: Database["auth"]["Enums"]["one_time_token_type"];
					updated_at?: string;
					user_id: string;
				};
				Update: {
					created_at?: string;
					id?: string;
					relates_to?: string;
					token_hash?: string;
					token_type?: Database["auth"]["Enums"]["one_time_token_type"];
					updated_at?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "one_time_tokens_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					},
				];
			};
			refresh_tokens: {
				Row: {
					created_at: string | null;
					id: number;
					instance_id: string | null;
					parent: string | null;
					revoked: boolean | null;
					session_id: string | null;
					token: string | null;
					updated_at: string | null;
					user_id: string | null;
				};
				Insert: {
					created_at?: string | null;
					id?: number;
					instance_id?: string | null;
					parent?: string | null;
					revoked?: boolean | null;
					session_id?: string | null;
					token?: string | null;
					updated_at?: string | null;
					user_id?: string | null;
				};
				Update: {
					created_at?: string | null;
					id?: number;
					instance_id?: string | null;
					parent?: string | null;
					revoked?: boolean | null;
					session_id?: string | null;
					token?: string | null;
					updated_at?: string | null;
					user_id?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "refresh_tokens_session_id_fkey";
						columns: ["session_id"];
						isOneToOne: false;
						referencedRelation: "sessions";
						referencedColumns: ["id"];
					},
				];
			};
			saml_providers: {
				Row: {
					attribute_mapping: Json | null;
					created_at: string | null;
					entity_id: string;
					id: string;
					metadata_url: string | null;
					metadata_xml: string;
					name_id_format: string | null;
					sso_provider_id: string;
					updated_at: string | null;
				};
				Insert: {
					attribute_mapping?: Json | null;
					created_at?: string | null;
					entity_id: string;
					id: string;
					metadata_url?: string | null;
					metadata_xml: string;
					name_id_format?: string | null;
					sso_provider_id: string;
					updated_at?: string | null;
				};
				Update: {
					attribute_mapping?: Json | null;
					created_at?: string | null;
					entity_id?: string;
					id?: string;
					metadata_url?: string | null;
					metadata_xml?: string;
					name_id_format?: string | null;
					sso_provider_id?: string;
					updated_at?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "saml_providers_sso_provider_id_fkey";
						columns: ["sso_provider_id"];
						isOneToOne: false;
						referencedRelation: "sso_providers";
						referencedColumns: ["id"];
					},
				];
			};
			saml_relay_states: {
				Row: {
					created_at: string | null;
					flow_state_id: string | null;
					for_email: string | null;
					id: string;
					redirect_to: string | null;
					request_id: string;
					sso_provider_id: string;
					updated_at: string | null;
				};
				Insert: {
					created_at?: string | null;
					flow_state_id?: string | null;
					for_email?: string | null;
					id: string;
					redirect_to?: string | null;
					request_id: string;
					sso_provider_id: string;
					updated_at?: string | null;
				};
				Update: {
					created_at?: string | null;
					flow_state_id?: string | null;
					for_email?: string | null;
					id?: string;
					redirect_to?: string | null;
					request_id?: string;
					sso_provider_id?: string;
					updated_at?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "saml_relay_states_flow_state_id_fkey";
						columns: ["flow_state_id"];
						isOneToOne: false;
						referencedRelation: "flow_state";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "saml_relay_states_sso_provider_id_fkey";
						columns: ["sso_provider_id"];
						isOneToOne: false;
						referencedRelation: "sso_providers";
						referencedColumns: ["id"];
					},
				];
			};
			schema_migrations: {
				Row: {
					version: string;
				};
				Insert: {
					version: string;
				};
				Update: {
					version?: string;
				};
				Relationships: [];
			};
			sessions: {
				Row: {
					aal: Database["auth"]["Enums"]["aal_level"] | null;
					created_at: string | null;
					factor_id: string | null;
					id: string;
					ip: unknown | null;
					not_after: string | null;
					refreshed_at: string | null;
					tag: string | null;
					updated_at: string | null;
					user_agent: string | null;
					user_id: string;
				};
				Insert: {
					aal?: Database["auth"]["Enums"]["aal_level"] | null;
					created_at?: string | null;
					factor_id?: string | null;
					id: string;
					ip?: unknown | null;
					not_after?: string | null;
					refreshed_at?: string | null;
					tag?: string | null;
					updated_at?: string | null;
					user_agent?: string | null;
					user_id: string;
				};
				Update: {
					aal?: Database["auth"]["Enums"]["aal_level"] | null;
					created_at?: string | null;
					factor_id?: string | null;
					id?: string;
					ip?: unknown | null;
					not_after?: string | null;
					refreshed_at?: string | null;
					tag?: string | null;
					updated_at?: string | null;
					user_agent?: string | null;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "sessions_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "users";
						referencedColumns: ["id"];
					},
				];
			};
			sso_domains: {
				Row: {
					created_at: string | null;
					domain: string;
					id: string;
					sso_provider_id: string;
					updated_at: string | null;
				};
				Insert: {
					created_at?: string | null;
					domain: string;
					id: string;
					sso_provider_id: string;
					updated_at?: string | null;
				};
				Update: {
					created_at?: string | null;
					domain?: string;
					id?: string;
					sso_provider_id?: string;
					updated_at?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "sso_domains_sso_provider_id_fkey";
						columns: ["sso_provider_id"];
						isOneToOne: false;
						referencedRelation: "sso_providers";
						referencedColumns: ["id"];
					},
				];
			};
			sso_providers: {
				Row: {
					created_at: string | null;
					id: string;
					resource_id: string | null;
					updated_at: string | null;
				};
				Insert: {
					created_at?: string | null;
					id: string;
					resource_id?: string | null;
					updated_at?: string | null;
				};
				Update: {
					created_at?: string | null;
					id?: string;
					resource_id?: string | null;
					updated_at?: string | null;
				};
				Relationships: [];
			};
			users: {
				Row: {
					aud: string | null;
					banned_until: string | null;
					confirmation_sent_at: string | null;
					confirmation_token: string | null;
					confirmed_at: string | null;
					created_at: string | null;
					deleted_at: string | null;
					email: string | null;
					email_change: string | null;
					email_change_confirm_status: number | null;
					email_change_sent_at: string | null;
					email_change_token_current: string | null;
					email_change_token_new: string | null;
					email_confirmed_at: string | null;
					encrypted_password: string | null;
					id: string;
					instance_id: string | null;
					invited_at: string | null;
					is_anonymous: boolean;
					is_sso_user: boolean;
					is_super_admin: boolean | null;
					last_sign_in_at: string | null;
					phone: string | null;
					phone_change: string | null;
					phone_change_sent_at: string | null;
					phone_change_token: string | null;
					phone_confirmed_at: string | null;
					raw_app_meta_data: Json | null;
					raw_user_meta_data: Json | null;
					reauthentication_sent_at: string | null;
					reauthentication_token: string | null;
					recovery_sent_at: string | null;
					recovery_token: string | null;
					role: string | null;
					updated_at: string | null;
				};
				Insert: {
					aud?: string | null;
					banned_until?: string | null;
					confirmation_sent_at?: string | null;
					confirmation_token?: string | null;
					confirmed_at?: string | null;
					created_at?: string | null;
					deleted_at?: string | null;
					email?: string | null;
					email_change?: string | null;
					email_change_confirm_status?: number | null;
					email_change_sent_at?: string | null;
					email_change_token_current?: string | null;
					email_change_token_new?: string | null;
					email_confirmed_at?: string | null;
					encrypted_password?: string | null;
					id: string;
					instance_id?: string | null;
					invited_at?: string | null;
					is_anonymous?: boolean;
					is_sso_user?: boolean;
					is_super_admin?: boolean | null;
					last_sign_in_at?: string | null;
					phone?: string | null;
					phone_change?: string | null;
					phone_change_sent_at?: string | null;
					phone_change_token?: string | null;
					phone_confirmed_at?: string | null;
					raw_app_meta_data?: Json | null;
					raw_user_meta_data?: Json | null;
					reauthentication_sent_at?: string | null;
					reauthentication_token?: string | null;
					recovery_sent_at?: string | null;
					recovery_token?: string | null;
					role?: string | null;
					updated_at?: string | null;
				};
				Update: {
					aud?: string | null;
					banned_until?: string | null;
					confirmation_sent_at?: string | null;
					confirmation_token?: string | null;
					confirmed_at?: string | null;
					created_at?: string | null;
					deleted_at?: string | null;
					email?: string | null;
					email_change?: string | null;
					email_change_confirm_status?: number | null;
					email_change_sent_at?: string | null;
					email_change_token_current?: string | null;
					email_change_token_new?: string | null;
					email_confirmed_at?: string | null;
					encrypted_password?: string | null;
					id?: string;
					instance_id?: string | null;
					invited_at?: string | null;
					is_anonymous?: boolean;
					is_sso_user?: boolean;
					is_super_admin?: boolean | null;
					last_sign_in_at?: string | null;
					phone?: string | null;
					phone_change?: string | null;
					phone_change_sent_at?: string | null;
					phone_change_token?: string | null;
					phone_confirmed_at?: string | null;
					raw_app_meta_data?: Json | null;
					raw_user_meta_data?: Json | null;
					reauthentication_sent_at?: string | null;
					reauthentication_token?: string | null;
					recovery_sent_at?: string | null;
					recovery_token?: string | null;
					role?: string | null;
					updated_at?: string | null;
				};
				Relationships: [];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			email: {
				Args: Record<PropertyKey, never>;
				Returns: string;
			};
			jwt: {
				Args: Record<PropertyKey, never>;
				Returns: Json;
			};
			pg_exception_context: {
				Args: Record<PropertyKey, never>;
				Returns: string;
			};
			role: {
				Args: Record<PropertyKey, never>;
				Returns: string;
			};
			uid: {
				Args: Record<PropertyKey, never>;
				Returns: string;
			};
		};
		Enums: {
			aal_level: "aal1" | "aal2" | "aal3";
			code_challenge_method: "s256" | "plain";
			factor_status: "unverified" | "verified";
			factor_type: "totp" | "webauthn" | "phone";
			one_time_token_type:
				| "confirmation_token"
				| "reauthentication_token"
				| "recovery_token"
				| "email_change_token_new"
				| "email_change_token_current"
				| "phone_change_token";
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
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
				Relationships: [];
			};
			focus_sessions_y2025m01: {
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
				Relationships: [];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			create_focus_sessions_partition: {
				Args: Record<PropertyKey, never>;
				Returns: undefined;
			};
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
	ff_goals: {
		Tables: {
			goal_templates: {
				Row: {
					category: string;
					created_at: string | null;
					description: string | null;
					difficulty: string | null;
					estimated_duration: unknown | null;
					id: string;
					is_featured: boolean | null;
					metrics_template: Json | null;
					recommended_habits: Json | null;
					suggested_milestones: Json | null;
					tags: string[] | null;
					title: string;
					updated_at: string | null;
				};
				Insert: {
					category: string;
					created_at?: string | null;
					description?: string | null;
					difficulty?: string | null;
					estimated_duration?: unknown | null;
					id?: string;
					is_featured?: boolean | null;
					metrics_template?: Json | null;
					recommended_habits?: Json | null;
					suggested_milestones?: Json | null;
					tags?: string[] | null;
					title: string;
					updated_at?: string | null;
				};
				Update: {
					category?: string;
					created_at?: string | null;
					description?: string | null;
					difficulty?: string | null;
					estimated_duration?: unknown | null;
					id?: string;
					is_featured?: boolean | null;
					metrics_template?: Json | null;
					recommended_habits?: Json | null;
					suggested_milestones?: Json | null;
					tags?: string[] | null;
					title?: string;
					updated_at?: string | null;
				};
				Relationships: [];
			};
			user_goals: {
				Row: {
					category: string;
					collaborators: string[] | null;
					completed_at: string | null;
					created_at: string | null;
					description: string | null;
					id: string;
					metrics: Json | null;
					milestones: Json | null;
					parent_goal_id: string | null;
					priority: string | null;
					progress: number | null;
					reflection_notes: Json | null;
					related_skills: string[] | null;
					start_date: string | null;
					status: string | null;
					tags: string[] | null;
					target_date: string | null;
					template_id: string | null;
					title: string;
					updated_at: string | null;
					user_id: string;
					visibility: string | null;
				};
				Insert: {
					category: string;
					collaborators?: string[] | null;
					completed_at?: string | null;
					created_at?: string | null;
					description?: string | null;
					id?: string;
					metrics?: Json | null;
					milestones?: Json | null;
					parent_goal_id?: string | null;
					priority?: string | null;
					progress?: number | null;
					reflection_notes?: Json | null;
					related_skills?: string[] | null;
					start_date?: string | null;
					status?: string | null;
					tags?: string[] | null;
					target_date?: string | null;
					template_id?: string | null;
					title: string;
					updated_at?: string | null;
					user_id: string;
					visibility?: string | null;
				};
				Update: {
					category?: string;
					collaborators?: string[] | null;
					completed_at?: string | null;
					created_at?: string | null;
					description?: string | null;
					id?: string;
					metrics?: Json | null;
					milestones?: Json | null;
					parent_goal_id?: string | null;
					priority?: string | null;
					progress?: number | null;
					reflection_notes?: Json | null;
					related_skills?: string[] | null;
					start_date?: string | null;
					status?: string | null;
					tags?: string[] | null;
					target_date?: string | null;
					template_id?: string | null;
					title?: string;
					updated_at?: string | null;
					user_id?: string;
					visibility?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "user_goals_parent_goal_id_fkey";
						columns: ["parent_goal_id"];
						isOneToOne: false;
						referencedRelation: "user_goals";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "user_goals_template_id_fkey";
						columns: ["template_id"];
						isOneToOne: false;
						referencedRelation: "goal_templates";
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
	ff_habits: {
		Tables: {
			habit_logs: {
				Row: {
					completed_at: string | null;
					count: number | null;
					created_at: string | null;
					difficulty_level: string | null;
					duration_minutes: number | null;
					energy_level: number | null;
					environment: string[] | null;
					habit_id: string;
					id: string;
					location: string | null;
					mood: string | null;
					notes: string | null;
					obstacles: string[] | null;
					user_id: string;
				};
				Insert: {
					completed_at?: string | null;
					count?: number | null;
					created_at?: string | null;
					difficulty_level?: string | null;
					duration_minutes?: number | null;
					energy_level?: number | null;
					environment?: string[] | null;
					habit_id: string;
					id?: string;
					location?: string | null;
					mood?: string | null;
					notes?: string | null;
					obstacles?: string[] | null;
					user_id: string;
				};
				Update: {
					completed_at?: string | null;
					count?: number | null;
					created_at?: string | null;
					difficulty_level?: string | null;
					duration_minutes?: number | null;
					energy_level?: number | null;
					environment?: string[] | null;
					habit_id?: string;
					id?: string;
					location?: string | null;
					mood?: string | null;
					notes?: string | null;
					obstacles?: string[] | null;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "habit_logs_habit_id_fkey";
						columns: ["habit_id"];
						isOneToOne: false;
						referencedRelation: "user_habits";
						referencedColumns: ["id"];
					},
				];
			};
			habit_reminders: {
				Row: {
					created_at: string | null;
					days_of_week: string[];
					habit_id: string;
					id: string;
					is_enabled: boolean | null;
					last_triggered_at: string | null;
					message: string | null;
					reminder_time: string;
					updated_at: string | null;
					user_id: string;
				};
				Insert: {
					created_at?: string | null;
					days_of_week: string[];
					habit_id: string;
					id?: string;
					is_enabled?: boolean | null;
					last_triggered_at?: string | null;
					message?: string | null;
					reminder_time: string;
					updated_at?: string | null;
					user_id: string;
				};
				Update: {
					created_at?: string | null;
					days_of_week?: string[];
					habit_id?: string;
					id?: string;
					is_enabled?: boolean | null;
					last_triggered_at?: string | null;
					message?: string | null;
					reminder_time?: string;
					updated_at?: string | null;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "habit_reminders_habit_id_fkey";
						columns: ["habit_id"];
						isOneToOne: false;
						referencedRelation: "user_habits";
						referencedColumns: ["id"];
					},
				];
			};
			habit_stats: {
				Row: {
					average_energy_level: number | null;
					common_environments: string[] | null;
					common_obstacles: string[] | null;
					completion_count: number | null;
					created_at: string | null;
					date: string;
					habit_id: string;
					id: string;
					streak_count: number | null;
					success_rate: number | null;
					total_duration_minutes: number | null;
					updated_at: string | null;
					user_id: string;
				};
				Insert: {
					average_energy_level?: number | null;
					common_environments?: string[] | null;
					common_obstacles?: string[] | null;
					completion_count?: number | null;
					created_at?: string | null;
					date: string;
					habit_id: string;
					id?: string;
					streak_count?: number | null;
					success_rate?: number | null;
					total_duration_minutes?: number | null;
					updated_at?: string | null;
					user_id: string;
				};
				Update: {
					average_energy_level?: number | null;
					common_environments?: string[] | null;
					common_obstacles?: string[] | null;
					completion_count?: number | null;
					created_at?: string | null;
					date?: string;
					habit_id?: string;
					id?: string;
					streak_count?: number | null;
					success_rate?: number | null;
					total_duration_minutes?: number | null;
					updated_at?: string | null;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "habit_stats_habit_id_fkey";
						columns: ["habit_id"];
						isOneToOne: false;
						referencedRelation: "user_habits";
						referencedColumns: ["id"];
					},
				];
			};
			habit_templates: {
				Row: {
					benefits: string[] | null;
					category: string;
					common_obstacles: string[] | null;
					created_at: string | null;
					description: string | null;
					difficulty: string | null;
					estimated_minutes: number | null;
					id: string;
					is_featured: boolean | null;
					recommended_frequency: Json;
					related_habits: string[] | null;
					success_criteria: Json | null;
					tags: string[] | null;
					tips: string[] | null;
					title: string;
					updated_at: string | null;
				};
				Insert: {
					benefits?: string[] | null;
					category: string;
					common_obstacles?: string[] | null;
					created_at?: string | null;
					description?: string | null;
					difficulty?: string | null;
					estimated_minutes?: number | null;
					id?: string;
					is_featured?: boolean | null;
					recommended_frequency?: Json;
					related_habits?: string[] | null;
					success_criteria?: Json | null;
					tags?: string[] | null;
					tips?: string[] | null;
					title: string;
					updated_at?: string | null;
				};
				Update: {
					benefits?: string[] | null;
					category?: string;
					common_obstacles?: string[] | null;
					created_at?: string | null;
					description?: string | null;
					difficulty?: string | null;
					estimated_minutes?: number | null;
					id?: string;
					is_featured?: boolean | null;
					recommended_frequency?: Json;
					related_habits?: string[] | null;
					success_criteria?: Json | null;
					tags?: string[] | null;
					tips?: string[] | null;
					title?: string;
					updated_at?: string | null;
				};
				Relationships: [];
			};
			user_habits: {
				Row: {
					completion_rate: number | null;
					created_at: string | null;
					current_streak: number | null;
					description: string | null;
					frequency: Json;
					goal_id: string | null;
					id: string;
					last_completed_at: string | null;
					longest_streak: number | null;
					notes: Json | null;
					priority: string | null;
					skip_dates: string[] | null;
					start_date: string | null;
					status: string | null;
					target_count: number | null;
					target_end_date: string | null;
					template_id: string | null;
					title: string;
					total_completions: number | null;
					updated_at: string | null;
					user_id: string;
					visibility: string | null;
				};
				Insert: {
					completion_rate?: number | null;
					created_at?: string | null;
					current_streak?: number | null;
					description?: string | null;
					frequency?: Json;
					goal_id?: string | null;
					id?: string;
					last_completed_at?: string | null;
					longest_streak?: number | null;
					notes?: Json | null;
					priority?: string | null;
					skip_dates?: string[] | null;
					start_date?: string | null;
					status?: string | null;
					target_count?: number | null;
					target_end_date?: string | null;
					template_id?: string | null;
					title: string;
					total_completions?: number | null;
					updated_at?: string | null;
					user_id: string;
					visibility?: string | null;
				};
				Update: {
					completion_rate?: number | null;
					created_at?: string | null;
					current_streak?: number | null;
					description?: string | null;
					frequency?: Json;
					goal_id?: string | null;
					id?: string;
					last_completed_at?: string | null;
					longest_streak?: number | null;
					notes?: Json | null;
					priority?: string | null;
					skip_dates?: string[] | null;
					start_date?: string | null;
					status?: string | null;
					target_count?: number | null;
					target_end_date?: string | null;
					template_id?: string | null;
					title?: string;
					total_completions?: number | null;
					updated_at?: string | null;
					user_id?: string;
					visibility?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "user_habits_template_id_fkey";
						columns: ["template_id"];
						isOneToOne: false;
						referencedRelation: "habit_templates";
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
	ff_logs: {
		Tables: {
			debug_logs: {
				Row: {
					created_at: string | null;
					function_name: string;
					id: string;
					log_data: Json;
					step_name: string;
				};
				Insert: {
					created_at?: string | null;
					function_name: string;
					id?: string;
					log_data: Json;
					step_name: string;
				};
				Update: {
					created_at?: string | null;
					function_name?: string;
					id?: string;
					log_data?: Json;
					step_name?: string;
				};
				Relationships: [];
			};
			system_logs: {
				Row: {
					created_at: string | null;
					created_by: string | null;
					error_detail: Json | null;
					event_data: Json;
					event_source: string;
					event_type: string;
					id: string;
				};
				Insert: {
					created_at?: string | null;
					created_by?: string | null;
					error_detail?: Json | null;
					event_data?: Json;
					event_source: string;
					event_type: string;
					id?: string;
				};
				Update: {
					created_at?: string | null;
					created_by?: string | null;
					error_detail?: Json | null;
					event_data?: Json;
					event_source?: string;
					event_type?: string;
					id?: string;
				};
				Relationships: [];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			cleanup_old_logs: {
				Args: Record<PropertyKey, never>;
				Returns: undefined;
			};
			log_debug: {
				Args: {
					function_name: string;
					step_name: string;
					log_data: Json;
				};
				Returns: undefined;
			};
			log_error: {
				Args: {
					p_function_name: string;
					p_error_type: string;
					p_error_data?: Json;
				};
				Returns: undefined;
			};
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
	ff_notifications: {
		Tables: {
			categories: {
				Row: {
					color: string | null;
					created_at: string | null;
					description: string | null;
					display_name: string;
					icon: string | null;
					id: string;
					is_active: boolean | null;
					name: string;
					priority: number | null;
					updated_at: string | null;
				};
				Insert: {
					color?: string | null;
					created_at?: string | null;
					description?: string | null;
					display_name: string;
					icon?: string | null;
					id?: string;
					is_active?: boolean | null;
					name: string;
					priority?: number | null;
					updated_at?: string | null;
				};
				Update: {
					color?: string | null;
					created_at?: string | null;
					description?: string | null;
					display_name?: string;
					icon?: string | null;
					id?: string;
					is_active?: boolean | null;
					name?: string;
					priority?: number | null;
					updated_at?: string | null;
				};
				Relationships: [];
			};
			delivery_history: {
				Row: {
					created_at: string | null;
					delivery_type: string;
					error_message: string | null;
					id: string;
					notification_id: string;
					provider: string | null;
					provider_response: Json | null;
					status: string;
				};
				Insert: {
					created_at?: string | null;
					delivery_type: string;
					error_message?: string | null;
					id?: string;
					notification_id: string;
					provider?: string | null;
					provider_response?: Json | null;
					status: string;
				};
				Update: {
					created_at?: string | null;
					delivery_type?: string;
					error_message?: string | null;
					id?: string;
					notification_id?: string;
					provider?: string | null;
					provider_response?: Json | null;
					status?: string;
				};
				Relationships: [
					{
						foreignKeyName: "delivery_history_notification_id_fkey";
						columns: ["notification_id"];
						isOneToOne: false;
						referencedRelation: "notifications";
						referencedColumns: ["id"];
					},
				];
			};
			notifications: {
				Row: {
					action_data: Json | null;
					action_type: string | null;
					body: string;
					category_id: string;
					created_at: string | null;
					delivery_attempts: Json | null;
					expires_at: string | null;
					id: string;
					metadata: Json | null;
					priority: number | null;
					read_at: string | null;
					status: string;
					template_id: string;
					title: string;
					updated_at: string | null;
					user_id: string;
				};
				Insert: {
					action_data?: Json | null;
					action_type?: string | null;
					body: string;
					category_id: string;
					created_at?: string | null;
					delivery_attempts?: Json | null;
					expires_at?: string | null;
					id?: string;
					metadata?: Json | null;
					priority?: number | null;
					read_at?: string | null;
					status?: string;
					template_id: string;
					title: string;
					updated_at?: string | null;
					user_id: string;
				};
				Update: {
					action_data?: Json | null;
					action_type?: string | null;
					body?: string;
					category_id?: string;
					created_at?: string | null;
					delivery_attempts?: Json | null;
					expires_at?: string | null;
					id?: string;
					metadata?: Json | null;
					priority?: number | null;
					read_at?: string | null;
					status?: string;
					template_id?: string;
					title?: string;
					updated_at?: string | null;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "notifications_category_id_fkey";
						columns: ["category_id"];
						isOneToOne: false;
						referencedRelation: "categories";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "notifications_template_id_fkey";
						columns: ["template_id"];
						isOneToOne: false;
						referencedRelation: "templates";
						referencedColumns: ["id"];
					},
				];
			};
			templates: {
				Row: {
					action_data: Json | null;
					action_type: string | null;
					body_template: string;
					category_id: string;
					created_at: string | null;
					id: string;
					is_active: boolean | null;
					name: string;
					priority: number | null;
					title_template: string;
					updated_at: string | null;
				};
				Insert: {
					action_data?: Json | null;
					action_type?: string | null;
					body_template: string;
					category_id: string;
					created_at?: string | null;
					id?: string;
					is_active?: boolean | null;
					name: string;
					priority?: number | null;
					title_template: string;
					updated_at?: string | null;
				};
				Update: {
					action_data?: Json | null;
					action_type?: string | null;
					body_template?: string;
					category_id?: string;
					created_at?: string | null;
					id?: string;
					is_active?: boolean | null;
					name?: string;
					priority?: number | null;
					title_template?: string;
					updated_at?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "templates_category_id_fkey";
						columns: ["category_id"];
						isOneToOne: false;
						referencedRelation: "categories";
						referencedColumns: ["id"];
					},
				];
			};
			user_preferences: {
				Row: {
					category_id: string;
					created_at: string | null;
					email_enabled: boolean | null;
					id: string;
					in_app_enabled: boolean | null;
					push_enabled: boolean | null;
					quiet_hours: Json | null;
					updated_at: string | null;
					user_id: string;
				};
				Insert: {
					category_id: string;
					created_at?: string | null;
					email_enabled?: boolean | null;
					id?: string;
					in_app_enabled?: boolean | null;
					push_enabled?: boolean | null;
					quiet_hours?: Json | null;
					updated_at?: string | null;
					user_id: string;
				};
				Update: {
					category_id?: string;
					created_at?: string | null;
					email_enabled?: boolean | null;
					id?: string;
					in_app_enabled?: boolean | null;
					push_enabled?: boolean | null;
					quiet_hours?: Json | null;
					updated_at?: string | null;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "user_preferences_category_id_fkey";
						columns: ["category_id"];
						isOneToOne: false;
						referencedRelation: "categories";
						referencedColumns: ["id"];
					},
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			create_notification: {
				Args: {
					p_user_id: string;
					p_category_name: string;
					p_template_name: string;
					p_template_data: Json;
				};
				Returns: string;
			};
			render_template: {
				Args: {
					p_template: string;
					p_data: Json;
				};
				Returns: string;
			};
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
	ff_party: {
		Tables: {
			parties: {
				Row: {
					created_at: string | null;
					end_date: string;
					id: string;
					is_active: boolean | null;
					is_completed: boolean | null;
					max_members: number;
					quest_id: string;
					start_date: string;
					updated_at: string | null;
				};
				Insert: {
					created_at?: string | null;
					end_date: string;
					id?: string;
					is_active?: boolean | null;
					is_completed?: boolean | null;
					max_members?: number;
					quest_id: string;
					start_date: string;
					updated_at?: string | null;
				};
				Update: {
					created_at?: string | null;
					end_date?: string;
					id?: string;
					is_active?: boolean | null;
					is_completed?: boolean | null;
					max_members?: number;
					quest_id?: string;
					start_date?: string;
					updated_at?: string | null;
				};
				Relationships: [];
			};
			party_generation_history: {
				Row: {
					created_at: string | null;
					execution_time: unknown;
					generation_date: string;
					id: string;
					total_parties: number;
					total_users: number;
				};
				Insert: {
					created_at?: string | null;
					execution_time: unknown;
					generation_date: string;
					id?: string;
					total_parties: number;
					total_users: number;
				};
				Update: {
					created_at?: string | null;
					execution_time?: unknown;
					generation_date?: string;
					id?: string;
					total_parties?: number;
					total_users?: number;
				};
				Relationships: [];
			};
			party_members: {
				Row: {
					created_at: string | null;
					id: string;
					joined_at: string | null;
					party_id: string;
					updated_at: string | null;
					user_id: string;
				};
				Insert: {
					created_at?: string | null;
					id?: string;
					joined_at?: string | null;
					party_id: string;
					updated_at?: string | null;
					user_id: string;
				};
				Update: {
					created_at?: string | null;
					id?: string;
					joined_at?: string | null;
					party_id?: string;
					updated_at?: string | null;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "party_members_party_id_fkey";
						columns: ["party_id"];
						isOneToOne: false;
						referencedRelation: "parties";
						referencedColumns: ["id"];
					},
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			complete_party_quest: {
				Args: {
					p_party_id: string;
					p_user_id: string;
				};
				Returns: boolean;
			};
			generate_weekly_parties: {
				Args: Record<PropertyKey, never>;
				Returns: undefined;
			};
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
	ff_quest: {
		Tables: {
			party_quest_progress: {
				Row: {
					created_at: string | null;
					id: string;
					party_id: string;
					progress: Json;
					updated_at: string | null;
				};
				Insert: {
					created_at?: string | null;
					id?: string;
					party_id: string;
					progress?: Json;
					updated_at?: string | null;
				};
				Update: {
					created_at?: string | null;
					id?: string;
					party_id?: string;
					progress?: Json;
					updated_at?: string | null;
				};
				Relationships: [];
			};
			quest_difficulties: {
				Row: {
					created_at: string | null;
					exp_multiplier: number;
					id: string;
					level: number;
					name: string;
				};
				Insert: {
					created_at?: string | null;
					exp_multiplier?: number;
					id?: string;
					level: number;
					name: string;
				};
				Update: {
					created_at?: string | null;
					exp_multiplier?: number;
					id?: string;
					level?: number;
					name?: string;
				};
				Relationships: [];
			};
			quest_types: {
				Row: {
					created_at: string | null;
					description: string;
					id: string;
					name: string;
					validation_rules: Json;
				};
				Insert: {
					created_at?: string | null;
					description: string;
					id?: string;
					name: string;
					validation_rules: Json;
				};
				Update: {
					created_at?: string | null;
					description?: string;
					id?: string;
					name?: string;
					validation_rules?: Json;
				};
				Relationships: [];
			};
			quests: {
				Row: {
					base_reward_exp: number;
					created_at: string | null;
					description: string;
					difficulty_id: string;
					duration_type: string | null;
					id: string;
					is_active: boolean | null;
					is_party_quest: boolean | null;
					max_participants: number | null;
					min_level: number | null;
					quest_type_id: string;
					requirements: Json;
					reward_badge_id: string | null;
					title: string;
					updated_at: string | null;
				};
				Insert: {
					base_reward_exp: number;
					created_at?: string | null;
					description: string;
					difficulty_id: string;
					duration_type?: string | null;
					id?: string;
					is_active?: boolean | null;
					is_party_quest?: boolean | null;
					max_participants?: number | null;
					min_level?: number | null;
					quest_type_id: string;
					requirements: Json;
					reward_badge_id?: string | null;
					title: string;
					updated_at?: string | null;
				};
				Update: {
					base_reward_exp?: number;
					created_at?: string | null;
					description?: string;
					difficulty_id?: string;
					duration_type?: string | null;
					id?: string;
					is_active?: boolean | null;
					is_party_quest?: boolean | null;
					max_participants?: number | null;
					min_level?: number | null;
					quest_type_id?: string;
					requirements?: Json;
					reward_badge_id?: string | null;
					title?: string;
					updated_at?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "quests_difficulty_id_fkey";
						columns: ["difficulty_id"];
						isOneToOne: false;
						referencedRelation: "quest_difficulties";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "quests_quest_type_id_fkey";
						columns: ["quest_type_id"];
						isOneToOne: false;
						referencedRelation: "quest_types";
						referencedColumns: ["id"];
					},
				];
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
			check_quest_completion: {
				Args: {
					p_progress: Json;
					p_requirements: Json;
				};
				Returns: boolean;
			};
			grant_quest_rewards: {
				Args: {
					p_user_id: string;
					p_base_exp: number;
					p_difficulty_id: string;
					p_badge_id: string;
					p_is_party_quest: boolean;
				};
				Returns: undefined;
			};
			update_party_quest_progress: {
				Args: {
					p_party_id: string;
					p_quest_type_id: string;
					p_progress: Json;
				};
				Returns: undefined;
			};
			update_quest_progress: {
				Args: {
					p_user_id: string;
					p_quest_type_id: string;
					p_progress: Json;
				};
				Returns: undefined;
			};
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
	ff_schedules: {
		Tables: {
			color_palette: {
				Row: {
					color_code: string;
					created_at: string | null;
					id: string;
					name: string;
				};
				Insert: {
					color_code: string;
					created_at?: string | null;
					id?: string;
					name: string;
				};
				Update: {
					color_code?: string;
					created_at?: string | null;
					id?: string;
					name?: string;
				};
				Relationships: [];
			};
			google_calendar_connections: {
				Row: {
					access_token: string;
					created_at: string | null;
					google_account_email: string;
					id: string;
					is_enabled: boolean | null;
					last_synced_at: string | null;
					refresh_token: string;
					sync_range_months: number | null;
					token_expires_at: string;
					updated_at: string | null;
					user_id: string;
				};
				Insert: {
					access_token: string;
					created_at?: string | null;
					google_account_email: string;
					id?: string;
					is_enabled?: boolean | null;
					last_synced_at?: string | null;
					refresh_token: string;
					sync_range_months?: number | null;
					token_expires_at: string;
					updated_at?: string | null;
					user_id: string;
				};
				Update: {
					access_token?: string;
					created_at?: string | null;
					google_account_email?: string;
					id?: string;
					is_enabled?: boolean | null;
					last_synced_at?: string | null;
					refresh_token?: string;
					sync_range_months?: number | null;
					token_expires_at?: string;
					updated_at?: string | null;
					user_id?: string;
				};
				Relationships: [];
			};
			google_calendars: {
				Row: {
					calendar_name: string;
					color_id: string | null;
					connection_id: string;
					created_at: string | null;
					description: string | null;
					google_calendar_id: string;
					id: string;
					is_primary: boolean | null;
					is_selected: boolean | null;
					updated_at: string | null;
				};
				Insert: {
					calendar_name: string;
					color_id?: string | null;
					connection_id: string;
					created_at?: string | null;
					description?: string | null;
					google_calendar_id: string;
					id?: string;
					is_primary?: boolean | null;
					is_selected?: boolean | null;
					updated_at?: string | null;
				};
				Update: {
					calendar_name?: string;
					color_id?: string | null;
					connection_id?: string;
					created_at?: string | null;
					description?: string | null;
					google_calendar_id?: string;
					id?: string;
					is_primary?: boolean | null;
					is_selected?: boolean | null;
					updated_at?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "google_calendars_color_id_fkey";
						columns: ["color_id"];
						isOneToOne: false;
						referencedRelation: "color_palette";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "google_calendars_connection_id_fkey";
						columns: ["connection_id"];
						isOneToOne: false;
						referencedRelation: "google_calendar_connections";
						referencedColumns: ["id"];
					},
				];
			};
			recurrence_rules: {
				Row: {
					created_at: string | null;
					end_date: string | null;
					id: string;
					interval: number | null;
					pattern: Database["ff_schedules"]["Enums"]["recurrence_pattern"];
					start_date: string;
					updated_at: string | null;
				};
				Insert: {
					created_at?: string | null;
					end_date?: string | null;
					id?: string;
					interval?: number | null;
					pattern: Database["ff_schedules"]["Enums"]["recurrence_pattern"];
					start_date: string;
					updated_at?: string | null;
				};
				Update: {
					created_at?: string | null;
					end_date?: string | null;
					id?: string;
					interval?: number | null;
					pattern?: Database["ff_schedules"]["Enums"]["recurrence_pattern"];
					start_date?: string;
					updated_at?: string | null;
				};
				Relationships: [];
			};
			recurrence_weekdays: {
				Row: {
					created_at: string | null;
					day_of_week: number;
					id: string;
					rule_id: string;
				};
				Insert: {
					created_at?: string | null;
					day_of_week: number;
					id?: string;
					rule_id: string;
				};
				Update: {
					created_at?: string | null;
					day_of_week?: number;
					id?: string;
					rule_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "recurrence_weekdays_rule_id_fkey";
						columns: ["rule_id"];
						isOneToOne: false;
						referencedRelation: "recurrence_rules";
						referencedColumns: ["id"];
					},
				];
			};
			schedule_categories: {
				Row: {
					color_id: string | null;
					created_at: string | null;
					description: string | null;
					id: string;
					is_active: boolean | null;
					name: string;
					sort_order: number;
					system_category_id: string | null;
					updated_at: string | null;
					user_id: string;
				};
				Insert: {
					color_id?: string | null;
					created_at?: string | null;
					description?: string | null;
					id?: string;
					is_active?: boolean | null;
					name: string;
					sort_order?: number;
					system_category_id?: string | null;
					updated_at?: string | null;
					user_id: string;
				};
				Update: {
					color_id?: string | null;
					created_at?: string | null;
					description?: string | null;
					id?: string;
					is_active?: boolean | null;
					name?: string;
					sort_order?: number;
					system_category_id?: string | null;
					updated_at?: string | null;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "schedule_categories_color_id_fkey";
						columns: ["color_id"];
						isOneToOne: false;
						referencedRelation: "color_palette";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "schedule_categories_system_category_id_fkey";
						columns: ["system_category_id"];
						isOneToOne: false;
						referencedRelation: "system_categories";
						referencedColumns: ["id"];
					},
				];
			};
			schedule_google_events: {
				Row: {
					created_at: string | null;
					google_calendar_id: string;
					google_event_id: string;
					id: string;
					last_synced_at: string;
					schedule_id: string;
					sync_status: Database["ff_schedules"]["Enums"]["sync_status"];
					updated_at: string | null;
				};
				Insert: {
					created_at?: string | null;
					google_calendar_id: string;
					google_event_id: string;
					id?: string;
					last_synced_at: string;
					schedule_id: string;
					sync_status: Database["ff_schedules"]["Enums"]["sync_status"];
					updated_at?: string | null;
				};
				Update: {
					created_at?: string | null;
					google_calendar_id?: string;
					google_event_id?: string;
					id?: string;
					last_synced_at?: string;
					schedule_id?: string;
					sync_status?: Database["ff_schedules"]["Enums"]["sync_status"];
					updated_at?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "schedule_google_events_google_calendar_id_fkey";
						columns: ["google_calendar_id"];
						isOneToOne: false;
						referencedRelation: "google_calendars";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "schedule_google_events_schedule_id_fkey";
						columns: ["schedule_id"];
						isOneToOne: false;
						referencedRelation: "schedules";
						referencedColumns: ["id"];
					},
				];
			};
			schedule_recurrences: {
				Row: {
					created_at: string | null;
					id: string;
					rule_id: string;
					schedule_id: string;
				};
				Insert: {
					created_at?: string | null;
					id?: string;
					rule_id: string;
					schedule_id: string;
				};
				Update: {
					created_at?: string | null;
					id?: string;
					rule_id?: string;
					schedule_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "schedule_recurrences_rule_id_fkey";
						columns: ["rule_id"];
						isOneToOne: false;
						referencedRelation: "recurrence_rules";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "schedule_recurrences_schedule_id_fkey";
						columns: ["schedule_id"];
						isOneToOne: false;
						referencedRelation: "schedules";
						referencedColumns: ["id"];
					},
				];
			};
			schedule_reminders: {
				Row: {
					created_at: string | null;
					id: string;
					is_enabled: boolean | null;
					minutes_before: number;
					schedule_id: string;
				};
				Insert: {
					created_at?: string | null;
					id?: string;
					is_enabled?: boolean | null;
					minutes_before: number;
					schedule_id: string;
				};
				Update: {
					created_at?: string | null;
					id?: string;
					is_enabled?: boolean | null;
					minutes_before?: number;
					schedule_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "schedule_reminders_schedule_id_fkey";
						columns: ["schedule_id"];
						isOneToOne: false;
						referencedRelation: "schedules";
						referencedColumns: ["id"];
					},
				];
			};
			schedules: {
				Row: {
					category_id: string;
					color_id: string | null;
					created_at: string | null;
					description: string | null;
					end_date: string;
					end_time: string | null;
					google_event_data: Json | null;
					google_last_modified: string | null;
					google_sync_error: string | null;
					habit_id: string | null;
					id: string;
					is_all_day: boolean | null;
					is_google_synced: boolean | null;
					priority: Database["ff_schedules"]["Enums"]["priority_level"];
					project_id: string | null;
					start_date: string;
					start_time: string | null;
					task_id: string | null;
					title: string;
					updated_at: string | null;
					user_id: string;
				};
				Insert: {
					category_id: string;
					color_id?: string | null;
					created_at?: string | null;
					description?: string | null;
					end_date: string;
					end_time?: string | null;
					google_event_data?: Json | null;
					google_last_modified?: string | null;
					google_sync_error?: string | null;
					habit_id?: string | null;
					id?: string;
					is_all_day?: boolean | null;
					is_google_synced?: boolean | null;
					priority: Database["ff_schedules"]["Enums"]["priority_level"];
					project_id?: string | null;
					start_date: string;
					start_time?: string | null;
					task_id?: string | null;
					title: string;
					updated_at?: string | null;
					user_id: string;
				};
				Update: {
					category_id?: string;
					color_id?: string | null;
					created_at?: string | null;
					description?: string | null;
					end_date?: string;
					end_time?: string | null;
					google_event_data?: Json | null;
					google_last_modified?: string | null;
					google_sync_error?: string | null;
					habit_id?: string | null;
					id?: string;
					is_all_day?: boolean | null;
					is_google_synced?: boolean | null;
					priority?: Database["ff_schedules"]["Enums"]["priority_level"];
					project_id?: string | null;
					start_date?: string;
					start_time?: string | null;
					task_id?: string | null;
					title?: string;
					updated_at?: string | null;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "schedules_category_id_fkey";
						columns: ["category_id"];
						isOneToOne: false;
						referencedRelation: "schedule_categories";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "schedules_color_id_fkey";
						columns: ["color_id"];
						isOneToOne: false;
						referencedRelation: "color_palette";
						referencedColumns: ["id"];
					},
				];
			};
			system_categories: {
				Row: {
					color_id: string | null;
					created_at: string | null;
					description: string | null;
					id: string;
					is_default: boolean | null;
					name: string;
					updated_at: string | null;
				};
				Insert: {
					color_id?: string | null;
					created_at?: string | null;
					description?: string | null;
					id?: string;
					is_default?: boolean | null;
					name: string;
					updated_at?: string | null;
				};
				Update: {
					color_id?: string | null;
					created_at?: string | null;
					description?: string | null;
					id?: string;
					is_default?: boolean | null;
					name?: string;
					updated_at?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "system_categories_color_id_fkey";
						columns: ["color_id"];
						isOneToOne: false;
						referencedRelation: "color_palette";
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
			priority_level: "high" | "medium" | "low";
			recurrence_pattern: "daily" | "weekly" | "monthly";
			sync_status: "synced" | "pending" | "failed";
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
	ff_seasons: {
		Tables: {
			audit_logs: {
				Row: {
					action_details: Json;
					action_type: string;
					created_at: string | null;
					id: string;
					performed_by: string | null;
					season_id: string;
					user_id: string | null;
				};
				Insert: {
					action_details: Json;
					action_type: string;
					created_at?: string | null;
					id?: string;
					performed_by?: string | null;
					season_id: string;
					user_id?: string | null;
				};
				Update: {
					action_details?: Json;
					action_type?: string;
					created_at?: string | null;
					id?: string;
					performed_by?: string | null;
					season_id?: string;
					user_id?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "audit_logs_season_id_fkey";
						columns: ["season_id"];
						isOneToOne: false;
						referencedRelation: "seasons";
						referencedColumns: ["id"];
					},
				];
			};
			data_integrity_checks: {
				Row: {
					check_type: string;
					created_at: string | null;
					id: string;
					inconsistencies: Json | null;
					resolved: boolean | null;
					transition_id: string;
					updated_at: string | null;
				};
				Insert: {
					check_type: string;
					created_at?: string | null;
					id?: string;
					inconsistencies?: Json | null;
					resolved?: boolean | null;
					transition_id: string;
					updated_at?: string | null;
				};
				Update: {
					check_type?: string;
					created_at?: string | null;
					id?: string;
					inconsistencies?: Json | null;
					resolved?: boolean | null;
					transition_id?: string;
					updated_at?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "data_integrity_checks_transition_id_fkey";
						columns: ["transition_id"];
						isOneToOne: false;
						referencedRelation: "season_transitions";
						referencedColumns: ["id"];
					},
				];
			};
			rank_settings: {
				Row: {
					created_at: string | null;
					daily_focus_requirement: unknown | null;
					demotion_threshold: number | null;
					focus_time_requirement: unknown | null;
					id: string;
					maintenance_requirements: Json | null;
					promotion_threshold: number | null;
					rank_name: string;
					required_points: number;
					rewards: Json;
					season_id: string;
					task_completion_requirement: number | null;
					updated_at: string | null;
					weekly_focus_requirement: unknown | null;
				};
				Insert: {
					created_at?: string | null;
					daily_focus_requirement?: unknown | null;
					demotion_threshold?: number | null;
					focus_time_requirement?: unknown | null;
					id?: string;
					maintenance_requirements?: Json | null;
					promotion_threshold?: number | null;
					rank_name: string;
					required_points: number;
					rewards?: Json;
					season_id: string;
					task_completion_requirement?: number | null;
					updated_at?: string | null;
					weekly_focus_requirement?: unknown | null;
				};
				Update: {
					created_at?: string | null;
					daily_focus_requirement?: unknown | null;
					demotion_threshold?: number | null;
					focus_time_requirement?: unknown | null;
					id?: string;
					maintenance_requirements?: Json | null;
					promotion_threshold?: number | null;
					rank_name?: string;
					required_points?: number;
					rewards?: Json;
					season_id?: string;
					task_completion_requirement?: number | null;
					updated_at?: string | null;
					weekly_focus_requirement?: unknown | null;
				};
				Relationships: [
					{
						foreignKeyName: "rank_settings_season_id_fkey";
						columns: ["season_id"];
						isOneToOne: false;
						referencedRelation: "seasons";
						referencedColumns: ["id"];
					},
				];
			};
			season_transitions: {
				Row: {
					created_at: string | null;
					error_logs: Json | null;
					from_season_id: string;
					id: string;
					status: string;
					to_season_id: string;
					transition_end: string;
					transition_start: string;
					transition_steps: Json;
					updated_at: string | null;
				};
				Insert: {
					created_at?: string | null;
					error_logs?: Json | null;
					from_season_id: string;
					id?: string;
					status?: string;
					to_season_id: string;
					transition_end: string;
					transition_start: string;
					transition_steps?: Json;
					updated_at?: string | null;
				};
				Update: {
					created_at?: string | null;
					error_logs?: Json | null;
					from_season_id?: string;
					id?: string;
					status?: string;
					to_season_id?: string;
					transition_end?: string;
					transition_start?: string;
					transition_steps?: Json;
					updated_at?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "season_transitions_from_season_id_fkey";
						columns: ["from_season_id"];
						isOneToOne: false;
						referencedRelation: "seasons";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "season_transitions_to_season_id_fkey";
						columns: ["to_season_id"];
						isOneToOne: false;
						referencedRelation: "seasons";
						referencedColumns: ["id"];
					},
				];
			};
			seasons: {
				Row: {
					created_at: string | null;
					default_duration: unknown;
					description: string | null;
					end_date: string;
					id: string;
					name: string;
					rewards: Json | null;
					rules: Json | null;
					season_number: number;
					start_date: string;
					status: string;
					transition_end_date: string | null;
					transition_start_date: string | null;
					updated_at: string | null;
				};
				Insert: {
					created_at?: string | null;
					default_duration?: unknown;
					description?: string | null;
					end_date: string;
					id?: string;
					name: string;
					rewards?: Json | null;
					rules?: Json | null;
					season_number: number;
					start_date: string;
					status?: string;
					transition_end_date?: string | null;
					transition_start_date?: string | null;
					updated_at?: string | null;
				};
				Update: {
					created_at?: string | null;
					default_duration?: unknown;
					description?: string | null;
					end_date?: string;
					id?: string;
					name?: string;
					rewards?: Json | null;
					rules?: Json | null;
					season_number?: number;
					start_date?: string;
					status?: string;
					transition_end_date?: string | null;
					transition_start_date?: string | null;
					updated_at?: string | null;
				};
				Relationships: [];
			};
			transition_backups: {
				Row: {
					backup_data: Json;
					backup_type: string;
					created_at: string | null;
					id: string;
					transition_id: string;
				};
				Insert: {
					backup_data: Json;
					backup_type: string;
					created_at?: string | null;
					id?: string;
					transition_id: string;
				};
				Update: {
					backup_data?: Json;
					backup_type?: string;
					created_at?: string | null;
					id?: string;
					transition_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "transition_backups_transition_id_fkey";
						columns: ["transition_id"];
						isOneToOne: false;
						referencedRelation: "season_transitions";
						referencedColumns: ["id"];
					},
				];
			};
			transition_checkpoints: {
				Row: {
					created_at: string | null;
					error_count: number | null;
					id: string;
					last_processed_user_id: string | null;
					processed_users: number | null;
					status: string;
					step_name: string;
					total_users: number | null;
					transition_id: string;
					updated_at: string | null;
				};
				Insert: {
					created_at?: string | null;
					error_count?: number | null;
					id?: string;
					last_processed_user_id?: string | null;
					processed_users?: number | null;
					status?: string;
					step_name: string;
					total_users?: number | null;
					transition_id: string;
					updated_at?: string | null;
				};
				Update: {
					created_at?: string | null;
					error_count?: number | null;
					id?: string;
					last_processed_user_id?: string | null;
					processed_users?: number | null;
					status?: string;
					step_name?: string;
					total_users?: number | null;
					transition_id?: string;
					updated_at?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "transition_checkpoints_transition_id_fkey";
						columns: ["transition_id"];
						isOneToOne: false;
						referencedRelation: "season_transitions";
						referencedColumns: ["id"];
					},
				];
			};
			transition_notifications: {
				Row: {
					created_at: string | null;
					id: string;
					message: string;
					notification_type: string;
					read: boolean | null;
					transition_id: string;
					user_id: string;
				};
				Insert: {
					created_at?: string | null;
					id?: string;
					message: string;
					notification_type: string;
					read?: boolean | null;
					transition_id: string;
					user_id: string;
				};
				Update: {
					created_at?: string | null;
					id?: string;
					message?: string;
					notification_type?: string;
					read?: boolean | null;
					transition_id?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "transition_notifications_transition_id_fkey";
						columns: ["transition_id"];
						isOneToOne: false;
						referencedRelation: "season_transitions";
						referencedColumns: ["id"];
					},
				];
			};
			transition_performance_stats: {
				Row: {
					created_at: string | null;
					end_time: string | null;
					execution_time: unknown | null;
					id: string;
					memory_usage: Json | null;
					performance_metrics: Json | null;
					processed_records: number | null;
					start_time: string;
					step_name: string;
					transition_id: string;
				};
				Insert: {
					created_at?: string | null;
					end_time?: string | null;
					execution_time?: unknown | null;
					id?: string;
					memory_usage?: Json | null;
					performance_metrics?: Json | null;
					processed_records?: number | null;
					start_time: string;
					step_name: string;
					transition_id: string;
				};
				Update: {
					created_at?: string | null;
					end_time?: string | null;
					execution_time?: unknown | null;
					id?: string;
					memory_usage?: Json | null;
					performance_metrics?: Json | null;
					processed_records?: number | null;
					start_time?: string;
					step_name?: string;
					transition_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "transition_performance_stats_transition_id_fkey";
						columns: ["transition_id"];
						isOneToOne: false;
						referencedRelation: "season_transitions";
						referencedColumns: ["id"];
					},
				];
			};
			user_history: {
				Row: {
					achievements_earned: Json | null;
					archived_at: string | null;
					created_at: string | null;
					final_rank: string;
					id: string;
					rewards_received: Json | null;
					season_id: string;
					statistics: Json | null;
					total_completed_tasks: number;
					total_focus_time: unknown;
					total_points: number;
					user_id: string;
				};
				Insert: {
					achievements_earned?: Json | null;
					archived_at?: string | null;
					created_at?: string | null;
					final_rank: string;
					id?: string;
					rewards_received?: Json | null;
					season_id: string;
					statistics?: Json | null;
					total_completed_tasks?: number;
					total_focus_time?: unknown;
					total_points?: number;
					user_id: string;
				};
				Update: {
					achievements_earned?: Json | null;
					archived_at?: string | null;
					created_at?: string | null;
					final_rank?: string;
					id?: string;
					rewards_received?: Json | null;
					season_id?: string;
					statistics?: Json | null;
					total_completed_tasks?: number;
					total_focus_time?: unknown;
					total_points?: number;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "user_history_season_id_fkey";
						columns: ["season_id"];
						isOneToOne: false;
						referencedRelation: "seasons";
						referencedColumns: ["id"];
					},
				];
			};
			user_progress: {
				Row: {
					achievements: Json | null;
					completed_tasks: number;
					created_at: string | null;
					current_points: number;
					current_rank: string;
					highest_rank: string;
					id: string;
					rewards_claimed: boolean | null;
					season_id: string;
					total_focus_time: unknown;
					updated_at: string | null;
					user_id: string;
				};
				Insert: {
					achievements?: Json | null;
					completed_tasks?: number;
					created_at?: string | null;
					current_points?: number;
					current_rank?: string;
					highest_rank?: string;
					id?: string;
					rewards_claimed?: boolean | null;
					season_id: string;
					total_focus_time?: unknown;
					updated_at?: string | null;
					user_id: string;
				};
				Update: {
					achievements?: Json | null;
					completed_tasks?: number;
					created_at?: string | null;
					current_points?: number;
					current_rank?: string;
					highest_rank?: string;
					id?: string;
					rewards_claimed?: boolean | null;
					season_id?: string;
					total_focus_time?: unknown;
					updated_at?: string | null;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "user_progress_season_id_fkey";
						columns: ["season_id"];
						isOneToOne: false;
						referencedRelation: "seasons";
						referencedColumns: ["id"];
					},
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			archive_user_season_history: {
				Args: {
					p_season_id: string;
					p_user_id: string;
				};
				Returns: undefined;
			};
			create_default_rank_settings: {
				Args: {
					p_season_id: string;
				};
				Returns: undefined;
			};
			create_transition_backup: {
				Args: {
					p_transition_id: string;
					p_backup_type: string;
				};
				Returns: string;
			};
			create_transition_notification: {
				Args: {
					p_user_id: string;
					p_transition_id: string;
					p_notification_type: string;
					p_message: string;
				};
				Returns: undefined;
			};
			execute_season_transition: {
				Args: {
					p_from_season_id: string;
					p_to_season_id: string;
				};
				Returns: undefined;
			};
			log_action: {
				Args: {
					p_season_id: string;
					p_user_id: string;
					p_action_type: string;
					p_action_details: Json;
					p_performed_by?: string;
				};
				Returns: undefined;
			};
			log_performance_stats: {
				Args: {
					p_transition_id: string;
					p_step_name: string;
					p_start_time: string;
					p_processed_records: number;
				};
				Returns: undefined;
			};
			update_checkpoint: {
				Args: {
					p_transition_id: string;
					p_step_name: string;
					p_processed_count: number;
					p_status: string;
				};
				Returns: undefined;
			};
			verify_data_integrity: {
				Args: {
					p_transition_id: string;
				};
				Returns: undefined;
			};
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
	ff_social: {
		Tables: {
			blocks: {
				Row: {
					blocked_id: string;
					blocker_id: string;
					created_at: string | null;
					id: string;
					reason: string | null;
					updated_at: string | null;
				};
				Insert: {
					blocked_id: string;
					blocker_id: string;
					created_at?: string | null;
					id?: string;
					reason?: string | null;
					updated_at?: string | null;
				};
				Update: {
					blocked_id?: string;
					blocker_id?: string;
					created_at?: string | null;
					id?: string;
					reason?: string | null;
					updated_at?: string | null;
				};
				Relationships: [];
			};
			follow_stats: {
				Row: {
					created_at: string | null;
					followers_count: number;
					following_count: number;
					updated_at: string | null;
					user_id: string;
				};
				Insert: {
					created_at?: string | null;
					followers_count?: number;
					following_count?: number;
					updated_at?: string | null;
					user_id: string;
				};
				Update: {
					created_at?: string | null;
					followers_count?: number;
					following_count?: number;
					updated_at?: string | null;
					user_id?: string;
				};
				Relationships: [];
			};
			follows: {
				Row: {
					created_at: string | null;
					follower_id: string;
					following_id: string;
					id: string;
					status: Database["ff_social"]["Enums"]["follow_status"];
					updated_at: string | null;
				};
				Insert: {
					created_at?: string | null;
					follower_id: string;
					following_id: string;
					id?: string;
					status?: Database["ff_social"]["Enums"]["follow_status"];
					updated_at?: string | null;
				};
				Update: {
					created_at?: string | null;
					follower_id?: string;
					following_id?: string;
					id?: string;
					status?: Database["ff_social"]["Enums"]["follow_status"];
					updated_at?: string | null;
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
			follow_status: "pending" | "accepted" | "blocked";
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
	ff_statistics: {
		Tables: {
			access_control: {
				Row: {
					access_period: unknown;
					created_at: string;
					id: string;
					max_history_months: number;
					updated_at: string;
					user_tier: string;
				};
				Insert: {
					access_period: unknown;
					created_at?: string;
					id?: string;
					max_history_months: number;
					updated_at?: string;
					user_tier: string;
				};
				Update: {
					access_period?: unknown;
					created_at?: string;
					id?: string;
					max_history_months?: number;
					updated_at?: string;
					user_tier?: string;
				};
				Relationships: [];
			};
			error_logs: {
				Row: {
					created_at: string;
					error_context: string | null;
					error_detail: string | null;
					error_hint: string | null;
					error_message: string;
					function_name: string;
					id: string;
				};
				Insert: {
					created_at?: string;
					error_context?: string | null;
					error_detail?: string | null;
					error_hint?: string | null;
					error_message: string;
					function_name: string;
					id?: string;
				};
				Update: {
					created_at?: string;
					error_context?: string | null;
					error_detail?: string | null;
					error_hint?: string | null;
					error_message?: string;
					function_name?: string;
					id?: string;
				};
				Relationships: [];
			};
			statistics_archive: {
				Row: {
					archive_data: Json;
					archive_date: string;
					created_at: string;
					id: string;
					user_id: string;
				};
				Insert: {
					archive_data: Json;
					archive_date: string;
					created_at?: string;
					id?: string;
					user_id: string;
				};
				Update: {
					archive_data?: Json;
					archive_date?: string;
					created_at?: string;
					id?: string;
					user_id?: string;
				};
				Relationships: [];
			};
			update_frequency: {
				Row: {
					batch_window: unknown;
					created_at: string;
					id: string;
					last_update: string | null;
					next_update: string | null;
					statistic_name: string;
					update_frequency: unknown;
					updated_at: string;
				};
				Insert: {
					batch_window: unknown;
					created_at?: string;
					id?: string;
					last_update?: string | null;
					next_update?: string | null;
					statistic_name: string;
					update_frequency: unknown;
					updated_at?: string;
				};
				Update: {
					batch_window?: unknown;
					created_at?: string;
					id?: string;
					last_update?: string | null;
					next_update?: string | null;
					statistic_name?: string;
					update_frequency?: unknown;
					updated_at?: string;
				};
				Relationships: [];
			};
			user_statistics: {
				Row: {
					created_at: string;
					current_focus_streak: number;
					daily_completed_tasks: number;
					daily_focus_time: unknown;
					id: string;
					longest_focus_streak: number;
					monthly_completed_tasks: number;
					monthly_focus_time: unknown;
					total_completed_tasks: number;
					total_focus_time: unknown;
					updated_at: string;
					user_id: string;
					weekly_completed_tasks: number;
					weekly_focus_time: unknown;
				};
				Insert: {
					created_at?: string;
					current_focus_streak?: number;
					daily_completed_tasks?: number;
					daily_focus_time?: unknown;
					id?: string;
					longest_focus_streak?: number;
					monthly_completed_tasks?: number;
					monthly_focus_time?: unknown;
					total_completed_tasks?: number;
					total_focus_time?: unknown;
					updated_at?: string;
					user_id: string;
					weekly_completed_tasks?: number;
					weekly_focus_time?: unknown;
				};
				Update: {
					created_at?: string;
					current_focus_streak?: number;
					daily_completed_tasks?: number;
					daily_focus_time?: unknown;
					id?: string;
					longest_focus_streak?: number;
					monthly_completed_tasks?: number;
					monthly_focus_time?: unknown;
					total_completed_tasks?: number;
					total_focus_time?: unknown;
					updated_at?: string;
					user_id?: string;
					weekly_completed_tasks?: number;
					weekly_focus_time?: unknown;
				};
				Relationships: [];
			};
			user_statistics_history: {
				Row: {
					completed_tasks: number;
					created_at: string;
					focus_time: unknown;
					id: string;
					statistics_date: string;
					user_id: string;
				};
				Insert: {
					completed_tasks?: number;
					created_at?: string;
					focus_time?: unknown;
					id?: string;
					statistics_date: string;
					user_id: string;
				};
				Update: {
					completed_tasks?: number;
					created_at?: string;
					focus_time?: unknown;
					id?: string;
					statistics_date?: string;
					user_id?: string;
				};
				Relationships: [];
			};
			user_statistics_history_2025_01_2025_04: {
				Row: {
					completed_tasks: number;
					created_at: string;
					focus_time: unknown;
					id: string;
					statistics_date: string;
					user_id: string;
				};
				Insert: {
					completed_tasks?: number;
					created_at?: string;
					focus_time?: unknown;
					id?: string;
					statistics_date: string;
					user_id: string;
				};
				Update: {
					completed_tasks?: number;
					created_at?: string;
					focus_time?: unknown;
					id?: string;
					statistics_date?: string;
					user_id?: string;
				};
				Relationships: [];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			adjust_access_on_tier_change: {
				Args: {
					p_user_id: string;
					p_new_tier: string;
				};
				Returns: undefined;
			};
			archive_old_statistics: {
				Args: {
					p_archive_before_date: string;
				};
				Returns: undefined;
			};
			create_statistics_history_partition: {
				Args: {
					start_date: string;
					end_date: string;
				};
				Returns: undefined;
			};
			get_focus_trends: {
				Args: {
					p_user_id: string;
					p_period_start: string;
					p_period_end: string;
				};
				Returns: {
					period: string;
					focus_time: unknown;
					completed_tasks: number;
					trend_direction: string;
					avg_focus_time: unknown;
					avg_completed_tasks: number;
				}[];
			};
			get_statistics_by_period: {
				Args: {
					p_user_id: string;
					p_start_date: string;
					p_end_date: string;
				};
				Returns: {
					focus_time: unknown;
					completed_tasks: number;
					avg_daily_focus_time: unknown;
					avg_daily_tasks: number;
				}[];
			};
			get_user_statistics: {
				Args: {
					p_user_id: string;
					p_user_tier: string;
				};
				Returns: {
					total_focus_time: unknown;
					total_completed_tasks: number;
					daily_focus_time: unknown;
					weekly_focus_time: unknown;
					monthly_focus_time: unknown;
					daily_completed_tasks: number;
					weekly_completed_tasks: number;
					monthly_completed_tasks: number;
					longest_focus_streak: number;
					current_focus_streak: number;
				}[];
			};
			log_error: {
				Args: {
					p_function_name: string;
					p_error_message: string;
					p_error_detail?: string;
					p_error_hint?: string;
					p_error_context?: string;
				};
				Returns: undefined;
			};
			manage_history_partitions: {
				Args: Record<PropertyKey, never>;
				Returns: undefined;
			};
			optimize_statistics_tables: {
				Args: Record<PropertyKey, never>;
				Returns: undefined;
			};
			safe_update_statistics: {
				Args: Record<PropertyKey, never>;
				Returns: undefined;
			};
			schedule_maintenance: {
				Args: Record<PropertyKey, never>;
				Returns: undefined;
			};
			schedule_statistics_updates: {
				Args: Record<PropertyKey, never>;
				Returns: undefined;
			};
			update_daily_statistics: {
				Args: Record<PropertyKey, never>;
				Returns: undefined;
			};
			update_focus_streaks: {
				Args: Record<PropertyKey, never>;
				Returns: undefined;
			};
			update_monthly_statistics: {
				Args: Record<PropertyKey, never>;
				Returns: undefined;
			};
			update_weekly_statistics: {
				Args: Record<PropertyKey, never>;
				Returns: undefined;
			};
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
	ff_subscriptions: {
		Tables: {
			plans: {
				Row: {
					created_at: string;
					description: string | null;
					display_name: string;
					features: Json;
					id: string;
					interval: string;
					is_active: boolean;
					name: string;
					price: number;
					updated_at: string;
				};
				Insert: {
					created_at?: string;
					description?: string | null;
					display_name: string;
					features?: Json;
					id?: string;
					interval: string;
					is_active?: boolean;
					name: string;
					price: number;
					updated_at?: string;
				};
				Update: {
					created_at?: string;
					description?: string | null;
					display_name?: string;
					features?: Json;
					id?: string;
					interval?: string;
					is_active?: boolean;
					name?: string;
					price?: number;
					updated_at?: string;
				};
				Relationships: [];
			};
			subscription_history: {
				Row: {
					created_at: string;
					id: string;
					period_end: string;
					period_start: string;
					plan_id: string;
					status: string;
					user_id: string;
				};
				Insert: {
					created_at?: string;
					id?: string;
					period_end: string;
					period_start: string;
					plan_id: string;
					status: string;
					user_id: string;
				};
				Update: {
					created_at?: string;
					id?: string;
					period_end?: string;
					period_start?: string;
					plan_id?: string;
					status?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "subscription_history_plan_id_fkey";
						columns: ["plan_id"];
						isOneToOne: false;
						referencedRelation: "plans";
						referencedColumns: ["id"];
					},
				];
			};
			user_subscriptions: {
				Row: {
					cancel_at_period_end: boolean;
					created_at: string;
					current_period_end: string;
					current_period_start: string;
					id: string;
					plan_id: string;
					status: string;
					trial_end: string | null;
					updated_at: string;
					user_id: string;
				};
				Insert: {
					cancel_at_period_end?: boolean;
					created_at?: string;
					current_period_end: string;
					current_period_start: string;
					id?: string;
					plan_id: string;
					status: string;
					trial_end?: string | null;
					updated_at?: string;
					user_id: string;
				};
				Update: {
					cancel_at_period_end?: boolean;
					created_at?: string;
					current_period_end?: string;
					current_period_start?: string;
					id?: string;
					plan_id?: string;
					status?: string;
					trial_end?: string | null;
					updated_at?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "user_subscriptions_plan_id_fkey";
						columns: ["plan_id"];
						isOneToOne: false;
						referencedRelation: "plans";
						referencedColumns: ["id"];
					},
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			get_user_plan: {
				Args: {
					p_user_id: string;
				};
				Returns: {
					plan_name: string;
					plan_features: Json;
					status: string;
					current_period_end: string;
				}[];
			};
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
	ff_time_table: {
		Tables: {
			template_apply_days: {
				Row: {
					created_at: string | null;
					day_of_week: number;
					id: string;
					template_id: string;
				};
				Insert: {
					created_at?: string | null;
					day_of_week: number;
					id?: string;
					template_id: string;
				};
				Update: {
					created_at?: string | null;
					day_of_week?: number;
					id?: string;
					template_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "template_apply_days_template_id_fkey";
						columns: ["template_id"];
						isOneToOne: false;
						referencedRelation: "templates";
						referencedColumns: ["id"];
					},
				];
			};
			template_likes: {
				Row: {
					created_at: string | null;
					id: string;
					template_id: string;
					user_id: string;
				};
				Insert: {
					created_at?: string | null;
					id?: string;
					template_id: string;
					user_id: string;
				};
				Update: {
					created_at?: string | null;
					id?: string;
					template_id?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "template_likes_template_id_fkey";
						columns: ["template_id"];
						isOneToOne: false;
						referencedRelation: "templates";
						referencedColumns: ["id"];
					},
				];
			};
			template_time_slots: {
				Row: {
					color_id: string | null;
					created_at: string | null;
					description: string | null;
					end_time: string;
					id: string;
					start_time: string;
					template_id: string;
					title: string;
				};
				Insert: {
					color_id?: string | null;
					created_at?: string | null;
					description?: string | null;
					end_time: string;
					id?: string;
					start_time: string;
					template_id: string;
					title: string;
				};
				Update: {
					color_id?: string | null;
					created_at?: string | null;
					description?: string | null;
					end_time?: string;
					id?: string;
					start_time?: string;
					template_id?: string;
					title?: string;
				};
				Relationships: [
					{
						foreignKeyName: "template_time_slots_template_id_fkey";
						columns: ["template_id"];
						isOneToOne: false;
						referencedRelation: "templates";
						referencedColumns: ["id"];
					},
				];
			};
			templates: {
				Row: {
					color_id: string | null;
					created_at: string | null;
					description: string | null;
					id: string;
					is_featured: boolean | null;
					likes_count: number | null;
					name: string;
					updated_at: string | null;
					user_id: string;
					visibility: Database["ff_time_table"]["Enums"]["visibility_type"];
				};
				Insert: {
					color_id?: string | null;
					created_at?: string | null;
					description?: string | null;
					id?: string;
					is_featured?: boolean | null;
					likes_count?: number | null;
					name: string;
					updated_at?: string | null;
					user_id: string;
					visibility?: Database["ff_time_table"]["Enums"]["visibility_type"];
				};
				Update: {
					color_id?: string | null;
					created_at?: string | null;
					description?: string | null;
					id?: string;
					is_featured?: boolean | null;
					likes_count?: number | null;
					name?: string;
					updated_at?: string | null;
					user_id?: string;
					visibility?: Database["ff_time_table"]["Enums"]["visibility_type"];
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
			visibility_type: "private" | "public" | "followers";
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
	ff_users: {
		Tables: {
			account_statuses: {
				Row: {
					changed_at: string | null;
					changed_by: string | null;
					created_at: string | null;
					id: string;
					reason: string | null;
					status: string;
					updated_at: string | null;
					user_id: string;
				};
				Insert: {
					changed_at?: string | null;
					changed_by?: string | null;
					created_at?: string | null;
					id?: string;
					reason?: string | null;
					status?: string;
					updated_at?: string | null;
					user_id: string;
				};
				Update: {
					changed_at?: string | null;
					changed_by?: string | null;
					created_at?: string | null;
					id?: string;
					reason?: string | null;
					status?: string;
					updated_at?: string | null;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "account_statuses_changed_by_fkey";
						columns: ["changed_by"];
						isOneToOne: false;
						referencedRelation: "user_details";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "account_statuses_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "user_details";
						referencedColumns: ["id"];
					},
				];
			};
			focus_statuses: {
				Row: {
					created_at: string | null;
					expected_end_at: string | null;
					id: string;
					session_id: string | null;
					session_start_time: string | null;
					started_at: string | null;
					status: string;
					updated_at: string | null;
					user_id: string;
				};
				Insert: {
					created_at?: string | null;
					expected_end_at?: string | null;
					id?: string;
					session_id?: string | null;
					session_start_time?: string | null;
					started_at?: string | null;
					status?: string;
					updated_at?: string | null;
					user_id: string;
				};
				Update: {
					created_at?: string | null;
					expected_end_at?: string | null;
					id?: string;
					session_id?: string | null;
					session_start_time?: string | null;
					started_at?: string | null;
					status?: string;
					updated_at?: string | null;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "focus_statuses_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: true;
						referencedRelation: "user_details";
						referencedColumns: ["id"];
					},
				];
			};
			presence_statuses: {
				Row: {
					created_at: string | null;
					id: string;
					last_activity_at: string | null;
					status: string;
					updated_at: string | null;
					user_id: string;
				};
				Insert: {
					created_at?: string | null;
					id?: string;
					last_activity_at?: string | null;
					status?: string;
					updated_at?: string | null;
					user_id: string;
				};
				Update: {
					created_at?: string | null;
					id?: string;
					last_activity_at?: string | null;
					status?: string;
					updated_at?: string | null;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "presence_statuses_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: true;
						referencedRelation: "user_details";
						referencedColumns: ["id"];
					},
				];
			};
			status_history: {
				Row: {
					changed_at: string | null;
					changed_by: string | null;
					created_at: string | null;
					id: string;
					new_status: string | null;
					old_status: string | null;
					status_type: string;
					user_id: string;
				};
				Insert: {
					changed_at?: string | null;
					changed_by?: string | null;
					created_at?: string | null;
					id?: string;
					new_status?: string | null;
					old_status?: string | null;
					status_type: string;
					user_id: string;
				};
				Update: {
					changed_at?: string | null;
					changed_by?: string | null;
					created_at?: string | null;
					id?: string;
					new_status?: string | null;
					old_status?: string | null;
					status_type?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "status_history_changed_by_fkey";
						columns: ["changed_by"];
						isOneToOne: false;
						referencedRelation: "user_details";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "status_history_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "user_details";
						referencedColumns: ["id"];
					},
				];
			};
			user_profiles: {
				Row: {
					availability_status: string | null;
					bio: string | null;
					cache_version: number | null;
					created_at: string | null;
					display_name: string | null;
					email: string | null;
					id: string;
					interests: string[] | null;
					last_activity_at: string | null;
					location: string | null;
					profile_image: string | null;
					social_links: Json | null;
					title: string | null;
					updated_at: string | null;
					user_id: string;
					website: string | null;
				};
				Insert: {
					availability_status?: string | null;
					bio?: string | null;
					cache_version?: number | null;
					created_at?: string | null;
					display_name?: string | null;
					email?: string | null;
					id?: string;
					interests?: string[] | null;
					last_activity_at?: string | null;
					location?: string | null;
					profile_image?: string | null;
					social_links?: Json | null;
					title?: string | null;
					updated_at?: string | null;
					user_id: string;
					website?: string | null;
				};
				Update: {
					availability_status?: string | null;
					bio?: string | null;
					cache_version?: number | null;
					created_at?: string | null;
					display_name?: string | null;
					email?: string | null;
					id?: string;
					interests?: string[] | null;
					last_activity_at?: string | null;
					location?: string | null;
					profile_image?: string | null;
					social_links?: Json | null;
					title?: string | null;
					updated_at?: string | null;
					user_id?: string;
					website?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "user_profiles_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: true;
						referencedRelation: "user_details";
						referencedColumns: ["id"];
					},
				];
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
						foreignKeyName: "user_role_mappings_assigned_by_fkey";
						columns: ["assigned_by"];
						isOneToOne: false;
						referencedRelation: "user_details";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "user_role_mappings_role_id_fkey";
						columns: ["role_id"];
						isOneToOne: false;
						referencedRelation: "user_roles";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "user_role_mappings_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "user_details";
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
					permissions: Json | null;
					role_type: string | null;
					updated_at: string | null;
				};
				Insert: {
					created_at?: string | null;
					description?: string | null;
					id?: string;
					name: string;
					permissions?: Json | null;
					role_type?: string | null;
					updated_at?: string | null;
				};
				Update: {
					created_at?: string | null;
					description?: string | null;
					id?: string;
					name?: string;
					permissions?: Json | null;
					role_type?: string | null;
					updated_at?: string | null;
				};
				Relationships: [];
			};
			user_settings: {
				Row: {
					collaboration_preferences: Json | null;
					created_at: string | null;
					focus_mode_restrictions: Json | null;
					id: string;
					interface_preferences: Json | null;
					notification_enabled: boolean | null;
					notification_preferences: Json | null;
					privacy_settings: Json | null;
					theme_color: string | null;
					updated_at: string | null;
					user_id: string;
					voice_input_enabled: boolean | null;
				};
				Insert: {
					collaboration_preferences?: Json | null;
					created_at?: string | null;
					focus_mode_restrictions?: Json | null;
					id?: string;
					interface_preferences?: Json | null;
					notification_enabled?: boolean | null;
					notification_preferences?: Json | null;
					privacy_settings?: Json | null;
					theme_color?: string | null;
					updated_at?: string | null;
					user_id: string;
					voice_input_enabled?: boolean | null;
				};
				Update: {
					collaboration_preferences?: Json | null;
					created_at?: string | null;
					focus_mode_restrictions?: Json | null;
					id?: string;
					interface_preferences?: Json | null;
					notification_enabled?: boolean | null;
					notification_preferences?: Json | null;
					privacy_settings?: Json | null;
					theme_color?: string | null;
					updated_at?: string | null;
					user_id?: string;
					voice_input_enabled?: boolean | null;
				};
				Relationships: [
					{
						foreignKeyName: "user_settings_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: true;
						referencedRelation: "user_details";
						referencedColumns: ["id"];
					},
				];
			};
		};
		Views: {
			user_details: {
				Row: {
					aud: string | null;
					availability_status: string | null;
					bio: string | null;
					cache_version: number | null;
					created_at: string | null;
					display_name: string | null;
					email: string | null;
					id: string | null;
					interests: string[] | null;
					is_super_admin: boolean | null;
					last_activity_at: string | null;
					last_sign_in_at: string | null;
					location: string | null;
					profile_image: string | null;
					raw_app_meta_data: Json | null;
					raw_user_meta_data: Json | null;
					role: string | null;
					social_links: Json | null;
					title: string | null;
					updated_at: string | null;
					website: string | null;
				};
				Relationships: [];
			};
		};
		Functions: {
			initialize_user_data: {
				Args: {
					user_id: string;
				};
				Returns: undefined;
			};
			is_system_admin: {
				Args: {
					target_user_id: string;
				};
				Returns: boolean;
			};
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
			agents: {
				Row: {
					avatar_url: string | null;
					character: Json | null;
					created_at: string | null;
					id: string;
					is_default: boolean | null;
					name: string;
					personality: string | null;
					system_prompt: string | null;
					updated_at: string | null;
				};
				Insert: {
					avatar_url?: string | null;
					character?: Json | null;
					created_at?: string | null;
					id: string;
					is_default?: boolean | null;
					name: string;
					personality?: string | null;
					system_prompt?: string | null;
					updated_at?: string | null;
				};
				Update: {
					avatar_url?: string | null;
					character?: Json | null;
					created_at?: string | null;
					id?: string;
					is_default?: boolean | null;
					name?: string;
					personality?: string | null;
					system_prompt?: string | null;
					updated_at?: string | null;
				};
				Relationships: [];
			};
			conversation_evaluations: {
				Row: {
					conversation_id: string | null;
					created_at: string | null;
					depth_score: number | null;
					emotional_score: number | null;
					emotional_understanding_change: number | null;
					evaluation_factors: Json | null;
					id: string;
					interest_score: number | null;
					intimacy_change: number | null;
					length_score: number | null;
					response_score: number | null;
					shared_experience_change: number | null;
					total_score: number | null;
					user_agent_relationship_id: string | null;
				};
				Insert: {
					conversation_id?: string | null;
					created_at?: string | null;
					depth_score?: number | null;
					emotional_score?: number | null;
					emotional_understanding_change?: number | null;
					evaluation_factors?: Json | null;
					id?: string;
					interest_score?: number | null;
					intimacy_change?: number | null;
					length_score?: number | null;
					response_score?: number | null;
					shared_experience_change?: number | null;
					total_score?: number | null;
					user_agent_relationship_id?: string | null;
				};
				Update: {
					conversation_id?: string | null;
					created_at?: string | null;
					depth_score?: number | null;
					emotional_score?: number | null;
					emotional_understanding_change?: number | null;
					evaluation_factors?: Json | null;
					id?: string;
					interest_score?: number | null;
					intimacy_change?: number | null;
					length_score?: number | null;
					response_score?: number | null;
					shared_experience_change?: number | null;
					total_score?: number | null;
					user_agent_relationship_id?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "conversation_evaluations_conversation_id_fkey";
						columns: ["conversation_id"];
						isOneToOne: false;
						referencedRelation: "conversations";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "conversation_evaluations_user_agent_relationship_id_fkey";
						columns: ["user_agent_relationship_id"];
						isOneToOne: false;
						referencedRelation: "user_agent_relationships";
						referencedColumns: ["id"];
					},
				];
			};
			conversation_tags: {
				Row: {
					confidence_score: number | null;
					conversation_id: string | null;
					created_at: string | null;
					id: string;
					tag_name: string;
				};
				Insert: {
					confidence_score?: number | null;
					conversation_id?: string | null;
					created_at?: string | null;
					id?: string;
					tag_name: string;
				};
				Update: {
					confidence_score?: number | null;
					conversation_id?: string | null;
					created_at?: string | null;
					id?: string;
					tag_name?: string;
				};
				Relationships: [
					{
						foreignKeyName: "conversation_tags_conversation_id_fkey";
						columns: ["conversation_id"];
						isOneToOne: false;
						referencedRelation: "conversations";
						referencedColumns: ["id"];
					},
				];
			};
			conversations: {
				Row: {
					agent_id: string | null;
					context: string | null;
					created_at: string | null;
					id: string;
					message: string;
					sender_type: string;
					user_id: string | null;
				};
				Insert: {
					agent_id?: string | null;
					context?: string | null;
					created_at?: string | null;
					id?: string;
					message: string;
					sender_type: string;
					user_id?: string | null;
				};
				Update: {
					agent_id?: string | null;
					context?: string | null;
					created_at?: string | null;
					id?: string;
					message?: string;
					sender_type?: string;
					user_id?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "conversations_agent_id_fkey";
						columns: ["agent_id"];
						isOneToOne: false;
						referencedRelation: "agents";
						referencedColumns: ["id"];
					},
				];
			};
			relationship_parameter_history: {
				Row: {
					created_at: string | null;
					id: string;
					new_value: number | null;
					old_value: number | null;
					parameter_name: string | null;
					reason: string | null;
					user_agent_relationship_id: string | null;
				};
				Insert: {
					created_at?: string | null;
					id?: string;
					new_value?: number | null;
					old_value?: number | null;
					parameter_name?: string | null;
					reason?: string | null;
					user_agent_relationship_id?: string | null;
				};
				Update: {
					created_at?: string | null;
					id?: string;
					new_value?: number | null;
					old_value?: number | null;
					parameter_name?: string | null;
					reason?: string | null;
					user_agent_relationship_id?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "relationship_parameter_history_user_agent_relationship_id_fkey";
						columns: ["user_agent_relationship_id"];
						isOneToOne: false;
						referencedRelation: "user_agent_relationships";
						referencedColumns: ["id"];
					},
				];
			};
			shared_experiences: {
				Row: {
					created_at: string | null;
					description: string | null;
					experience_type: string;
					id: string;
					impact_score: number | null;
					user_agent_relationship_id: string | null;
				};
				Insert: {
					created_at?: string | null;
					description?: string | null;
					experience_type: string;
					id?: string;
					impact_score?: number | null;
					user_agent_relationship_id?: string | null;
				};
				Update: {
					created_at?: string | null;
					description?: string | null;
					experience_type?: string;
					id?: string;
					impact_score?: number | null;
					user_agent_relationship_id?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "shared_experiences_user_agent_relationship_id_fkey";
						columns: ["user_agent_relationship_id"];
						isOneToOne: false;
						referencedRelation: "user_agent_relationships";
						referencedColumns: ["id"];
					},
				];
			};
			user_agent_relationships: {
				Row: {
					agent_id: string | null;
					created_at: string | null;
					emotional_understanding: number | null;
					id: string;
					intimacy: number | null;
					last_interaction_at: string | null;
					shared_experience: number | null;
					total_interactions: number | null;
					updated_at: string | null;
					user_id: string | null;
				};
				Insert: {
					agent_id?: string | null;
					created_at?: string | null;
					emotional_understanding?: number | null;
					id?: string;
					intimacy?: number | null;
					last_interaction_at?: string | null;
					shared_experience?: number | null;
					total_interactions?: number | null;
					updated_at?: string | null;
					user_id?: string | null;
				};
				Update: {
					agent_id?: string | null;
					created_at?: string | null;
					emotional_understanding?: number | null;
					id?: string;
					intimacy?: number | null;
					last_interaction_at?: string | null;
					shared_experience?: number | null;
					total_interactions?: number | null;
					updated_at?: string | null;
					user_id?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "user_agent_relationships_agent_id_fkey";
						columns: ["agent_id"];
						isOneToOne: false;
						referencedRelation: "agents";
						referencedColumns: ["id"];
					},
				];
			};
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
			get_api_requests_by_hour: {
				Args: {
					hours_limit: number;
				};
				Returns: {
					hour: number;
					request_count: number;
					error_count: number;
				}[];
			};
			get_db_size: {
				Args: Record<PropertyKey, never>;
				Returns: {
					size_mb: number;
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
			get_realtime_connections: {
				Args: Record<PropertyKey, never>;
				Returns: {
					connections: number;
				}[];
			};
			get_storage_size: {
				Args: Record<PropertyKey, never>;
				Returns: {
					size_gb: number;
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
			get_task_completion_by_month: {
				Args: {
					months_limit: number;
				};
				Returns: {
					month: string;
					completion_rate: number;
					overdue_rate: number;
				}[];
			};
			get_user_activity_by_month: {
				Args: {
					months_limit: number;
				};
				Returns: {
					month: string;
					active_users: number;
					new_users: number;
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
			pg_exception_context: {
				Args: Record<PropertyKey, never>;
				Returns: string;
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
