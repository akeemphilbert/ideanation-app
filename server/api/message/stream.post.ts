import { defineEventHandler } from "h3";


import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { WorkspaceState, WorkspaceStateManager, createInitialWorkspaceState } from "~/states/WorkspaceState";
import workflow from "~/graphs/main";
import { AgentUpdate } from "~/types/dtos";
import { MemorySaver } from "@langchain/langgraph";

const memorySaver = new MemorySaver();

export default defineEventHandler(async (event) => {
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

        // Compile and run the workflow
        const app = workflow.compile({
            checkpointer: memorySaver
        })

        const config = { configurable: { thread_id: "2"}, streamMode: "updates" as const }
        
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