import type { Database } from "@/types/supabase";

export type Agent = Database["ff_agents"]["Tables"]["agents"]["Row"];
export type AgentInsert = Database["ff_agents"]["Tables"]["agents"]["Insert"];
export type AgentUpdate = Database["ff_agents"]["Tables"]["agents"]["Update"];

export type UserAgentRelationship =
	Database["ff_agents"]["Tables"]["user_agent_relationships"]["Row"];
export type UserAgentRelationshipInsert =
	Database["ff_agents"]["Tables"]["user_agent_relationships"]["Insert"];
export type UserAgentRelationshipUpdate =
	Database["ff_agents"]["Tables"]["user_agent_relationships"]["Update"];

export type Conversation =
	Database["ff_agents"]["Tables"]["conversations"]["Row"];
export type ConversationInsert =
	Database["ff_agents"]["Tables"]["conversations"]["Insert"];
export type ConversationUpdate =
	Database["ff_agents"]["Tables"]["conversations"]["Update"];

export type ConversationEvaluation =
	Database["ff_agents"]["Tables"]["conversation_evaluations"]["Row"];
export type ConversationEvaluationInsert =
	Database["ff_agents"]["Tables"]["conversation_evaluations"]["Insert"];
export type ConversationEvaluationUpdate =
	Database["ff_agents"]["Tables"]["conversation_evaluations"]["Update"];

export type SharedExperience =
	Database["ff_agents"]["Tables"]["shared_experiences"]["Row"];
export type SharedExperienceInsert =
	Database["ff_agents"]["Tables"]["shared_experiences"]["Insert"];
export type SharedExperienceUpdate =
	Database["ff_agents"]["Tables"]["shared_experiences"]["Update"];

export type RelationshipParameterHistory =
	Database["ff_agents"]["Tables"]["relationship_parameter_history"]["Row"];
export type RelationshipParameterHistoryInsert =
	Database["ff_agents"]["Tables"]["relationship_parameter_history"]["Insert"];
export type RelationshipParameterHistoryUpdate =
	Database["ff_agents"]["Tables"]["relationship_parameter_history"]["Update"];

export type ConversationTag =
	Database["ff_agents"]["Tables"]["conversation_tags"]["Row"];
export type ConversationTagInsert =
	Database["ff_agents"]["Tables"]["conversation_tags"]["Insert"];
export type ConversationTagUpdate =
	Database["ff_agents"]["Tables"]["conversation_tags"]["Update"];

export interface GetEvaluationStatisticsArgs {
	p_user_id: string;
	p_agent_id: string;
}

export interface GetEvaluationStatisticsReturns {
	evaluation_statistics: {
		avg_depth_score: number;
		avg_emotional_score: number;
		avg_interest_score: number;
		avg_length_score: number;
		avg_response_score: number;
		avg_total_score: number;
		total_evaluations: number;
		last_evaluation_at: string;
	};
	relationship_statistics: {
		intimacy: number;
		shared_experience: number;
		emotional_understanding: number;
		total_interactions: number;
	};
}
