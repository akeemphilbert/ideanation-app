import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";
import { defineEventHandler } from "h3";


import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { WorkspaceState, WorkspaceStateManager, createInitialWorkspaceState } from "~/states/WorkspaceState";
import workflow from "~/graphs/main";
import { AgentUpdate } from "~/types/dtos";
import { MemorySaver } from "@langchain/langgraph";
import { writeFileSync } from "node:fs";
import { useSupabaseServer } from "~/server/utils/supabase";
import { createServerDebug } from "~/utils/debug";

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

    const debug = createServerDebug('API:MessageStream')
    debug.debug('Starting workflow execution', {
        user: event.context.user,
        url: config.supabaseUrl
    })




    const authHeader = getHeader(event, 'authorization')
    if (!authHeader) throw createError({ statusCode: 401, message: 'No token provided' })

    const user = await getUserFromToken(authHeader)

      event.context.user = user

      if (!user) throw createError({ statusCode: 401, message: 'Invalid token' })



    setResponseHeaders(event, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
    })

    const writer = event.node.res
    
    try {
        const body = await readBody(event)
        // Create initial workspace state
        let workspaceState = createInitialWorkspaceState()
        
        // Add user message to state
        const userMessage = new HumanMessage(body.message)

        // You must call .setup() the first time you use the checkpointer:
        await checkpointer.setup();

        // Compile and run the workflow
        const app = workflow.compile({
            checkpointer: checkpointer
        })
        //use the workspace identifier (lowercased) as the thread_id. If one doesn't exist use ws-001 as it's the default first workspace identifier
        const thread_id = workspaceState.workspace?.identifier.toLowerCase() || "ws-001"
        const config = { configurable: { thread_id: event.context.user?.id+':'+thread_id, user_id: event.context.user?.id}, streamMode: "updates" as const }
        
        console.log("🚀 Starting workflow execution...")
        const stream = await app.stream({
            messages: [new HumanMessage(body.message)]
        },config)

        //save the graph as a png
        const tgraph = app.getGraph()
        const image = await tgraph.drawMermaidPng();
        const graphStateArrayBuffer = await image.arrayBuffer();
        const filePath = "./graphState.png";
        writeFileSync(filePath, new Uint8Array(graphStateArrayBuffer));

        for await (const chunk of stream) {
            //the chunk is an object with a property for the node (which could be different from the previous chunk) and the WorkflowState as the value let's check the last action 
            for (const key in chunk) {
                let agentUpdate = new AgentUpdate(key, chunk[key])
                switch (key) {
                    case "__interrupt__":
                        agentUpdate = new AgentUpdate(key, {
                            lastMessage: chunk[key][0].value
                        })
                        writer.write(`update: ${JSON.stringify(agentUpdate)}`)
                        break;
                    default:
                        writer.write(`update: ${JSON.stringify(agentUpdate)}`)
                }
            } 
        }

    } catch (error) {
        console.error('Error in workflow:', error)
        writer.write('Sorry, I encountered an error while processing your message. Please try again.')
    } finally {
        writer.end()
    }
})