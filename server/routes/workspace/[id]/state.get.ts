import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";
import { defineEventHandler } from "h3";
import { createInitialWorkspaceState } from "~/states/WorkspaceState";
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
        // Get workspace ID from URL path parameter
        const workspaceId = getRouterParam(event, 'id')?.toLowerCase() || 'ws-001'

        
        // Setup checkpointer
        await checkpointer.setup();

        // Get the latest state for this workspace
        const threadId = `${user.id}:${workspaceId}`
        const config = { 
            configurable: { 
                thread_id: threadId, 
            }
        }

        // Try to get the latest checkpoint
        const latestCheckpoint = await checkpointer.get(config)
        
        if (latestCheckpoint && latestCheckpoint.channel_values) {
            // Return the current state
            return {
                workspace: latestCheckpoint.channel_values.workspace || null,
                ideas: latestCheckpoint.channel_values.ideas || [],
                problems: latestCheckpoint.channel_values.problems || [],
                customers: latestCheckpoint.channel_values.customers || [],
                products: latestCheckpoint.channel_values.products || [],
                features: latestCheckpoint.channel_values.features || [],
                jobs: latestCheckpoint.channel_values.jobs || [],
                pains: latestCheckpoint.channel_values.pains || [],
                gains: latestCheckpoint.channel_values.gains || [],
                relationships: latestCheckpoint.channel_values.relationships || [],
                currentResource: latestCheckpoint.channel_values.currentResource || null,
                lastAction: latestCheckpoint.channel_values.lastAction || null,
                lastMessage: latestCheckpoint.channel_values.lastMessage || null,
                messages: latestCheckpoint.channel_values.messages || []
            }
        } else {
            // Return initial state if no checkpoint exists
            return createInitialWorkspaceState()
        }

    } catch (error) {
        console.error('Error fetching workspace state:', error)
        throw createError({ 
            statusCode: 500, 
            message: 'Failed to fetch workspace state' 
        })
    }
}) 