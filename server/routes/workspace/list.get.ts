import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";
import { defineEventHandler } from "h3";
import { useSupabaseServer } from "~/server/utils/supabase";

const config = useRuntimeConfig()

// Server-side function to get user from token
const getUserFromToken = async (token: string) => {
  const client = useSupabaseServer()
  token = token.split(' ')[1]
  const { data, error } = await client.auth.getUser(token)
  if (error) {
    throw createError({ statusCode: 401, message: 'Invalid token' })
  }
  return data.user
}

const checkpointer = PostgresSaver.fromConnString(config.postgresConnectionString, {
    schema: "public"
});

export default defineEventHandler(async (event) => {
    const authHeader = getHeader(event, 'authorization')
    if (!authHeader) throw createError({ statusCode: 401, message: 'No token provided' })

    const user = await getUserFromToken(authHeader)
    event.context.user = user

    if (!user) throw createError({ statusCode: 401, message: 'Invalid token' })

    try {
        // Setup checkpointer
        await checkpointer.setup();

        // Get all checkpoints for this user
        const userCheckpoints = await checkpointer.list({
            configurable: { 
                user_id: user.id
            }
        })

        const workspaces: Array<{
            id: string
            title: string
            description: string
            identifier: string
            created: Date
            updated: Date
            resourceCount: number
            lastActivity: Date | null
        }> = []

        // Process each checkpoint to extract workspace information
        for await (const checkpointTuple of userCheckpoints) {
            const checkpoint = checkpointTuple.checkpoint // Get the checkpoint from the tuple
            if (checkpoint.channel_values && checkpoint.channel_values.workspace) {
                const workspace = checkpoint.channel_values.workspace
                const resourceCount = 
                    (checkpoint.channel_values.ideas?.length || 0) +
                    (checkpoint.channel_values.problems?.length || 0) +
                    (checkpoint.channel_values.customers?.length || 0) +
                    (checkpoint.channel_values.products?.length || 0) +
                    (checkpoint.channel_values.features?.length || 0) +
                    (checkpoint.channel_values.jobs?.length || 0) +
                    (checkpoint.channel_values.pains?.length || 0) +
                    (checkpoint.channel_values.gains?.length || 0)

                workspaces.push({
                    id: workspace.id,
                    title: workspace.title,
                    description: workspace.description,
                    identifier: workspace.identifier,
                    created: workspace.created,
                    updated: workspace.updated,
                    resourceCount,
                    lastActivity: checkpoint.metadata?.last_activity ? new Date(checkpoint.metadata.last_activity) : null
                })
            }
        }

        return {
            workspaces,
            total: workspaces.length
        }

    } catch (error) {
        console.error('Error fetching workspace list:', error)
        throw createError({ 
            statusCode: 500, 
            message: 'Failed to fetch workspace list' 
        })
    }
}) 