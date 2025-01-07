-- 会話評価の統計を取得するストアドプロシージャ
create or replace function ff_agents.get_evaluation_statistics(
    p_user_id uuid,
    p_agent_id varchar
)
returns json
language plpgsql
security definer
as $$
declare
    result json;
begin
    with evaluation_stats as (
        select
            avg(depth_score) as avg_depth_score,
            avg(emotional_score) as avg_emotional_score,
            avg(interest_score) as avg_interest_score,
            avg(length_score) as avg_length_score,
            avg(response_score) as avg_response_score,
            avg(total_score) as avg_total_score,
            count(*) as total_evaluations,
            max(created_at) as last_evaluation_at
        from ff_agents.conversation_evaluations ce
        where ce.user_id = p_user_id
        and ce.agent_id = p_agent_id
    ),
    relationship_stats as (
        select
            intimacy,
            shared_experience,
            emotional_understanding,
            total_interactions
        from ff_agents.user_agent_relationships
        where user_id = p_user_id
        and agent_id = p_agent_id
    )
    select json_build_object(
        'evaluation_statistics', (
            select row_to_json(evaluation_stats.*)
            from evaluation_stats
        ),
        'relationship_statistics', (
            select row_to_json(relationship_stats.*)
            from relationship_stats
        )
    ) into result;

    return result;
end;
$$; 