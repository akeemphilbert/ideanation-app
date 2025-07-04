import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";
import { defineEventHandler } from "h3";


import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { WorkspaceState, WorkspaceStateManager, createInitialWorkspaceState } from "~/states/WorkspaceState";
import { AgentUpdate } from "~/types/dtos";
import { MemorySaver } from "@langchain/langgraph";
import { writeFileSync } from "node:fs";
import { useSupabaseServer } from "~/server/utils/supabase";
import { createServerDebug } from "~/utils/debug";
import { setupAgent as setupRoutingAgent } from "~/agents/routing/main";
import { setupAgent as setupProblemAgent } from "~/agents/problem/main";

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

    console.log('Starting workflow execution')
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

        const agent = setupRoutingAgent("","")
        const problemAgent = setupProblemAgent("problem","")
        agent.addSubAgent(problemAgent)


        const workspace = await agent.getGraph()
        const app = await workspace.compile({
            checkpointer: checkpointer
        })

        //save the graph as a png
        // let tgraph = app.getGraph()
        // let image = await tgraph.drawMermaidPng();
        // let graphStateArrayBuffer = await image.arrayBuffer();
        // let filePath = "./graphState.png";
        // writeFileSync(filePath, new Uint8Array(graphStateArrayBuffer));

        // const problemGraph = await problemAgent.getGraph()
        // const problemApp = await problemGraph.compile()


        // tgraph = problemApp.getGraph()
        // image = await tgraph.drawMermaidPng();
        // graphStateArrayBuffer = await image.arrayBuffer();
        // filePath = "./problemGraphState.png";
        // writeFileSync(filePath, new Uint8Array(graphStateArrayBuffer));

        //use the workspace identifier (lowercased) as the thread_id. If one doesn't exist use ws-001 as it's the default first workspace identifier
        const thread_id = workspaceState.workspace?.identifier.toLowerCase() || "ws-001"
        const config = { configurable: { thread_id: event.context.user?.id+':'+thread_id}, streamMode: "updates" as const }
        
        console.log("🚀 Starting workflow execution...")
        const stream = await app.stream({
            messages: [new HumanMessage(body.message)]
        },config)

        

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
                        agentUpdate.data.lastMessage = chunk[key].messages[chunk[key].messages.length-1].content
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