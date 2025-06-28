import { defineEventHandler } from "h3";
import { AzureChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { StateGraph, END } from "@langchain/langgraph";
import { WorkspaceState, WorkspaceStateManager, createInitialWorkspaceState } from "~/states/WorkspaceState";

const config = useRuntimeConfig()

export default defineEventHandler(async (event) => {
    setResponseHeaders(event, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
    })

    const writer = event.node.res
    
    try {
        const body = await readBody(event)
        
        // Initialize LLM
        const llm = new AzureChatOpenAI({
            model: "gpt-4o-mini",
            temperature: 0.7,
            maxTokens: 1000,
            azureOpenAI: {
                apiKey: config.azureOpenAI.apiKey,
                apiVersion: config.azureOpenAI.apiVersion,
                basePath: config.azureOpenAI.basePath,
                deploymentName: config.azureOpenAI.deployment,
            }
        })

        // Create initial workspace state
        let workspaceState = createInitialWorkspaceState()
        
        // Add user message to state
        const userMessage = new HumanMessage(body.message)
        workspaceState = WorkspaceStateManager.addMessage(workspaceState, userMessage)

        // Define workflow nodes
        const checkWorkspaceNode = async (state: WorkspaceState): Promise<WorkspaceState> => {
            console.log("🔍 Checking workspace state...")
            
            // Check if workspace exists
            if (!state.workspace) {
                return WorkspaceStateManager.setLastAction(state, "need_workspace")
            }
            
            // Check if workspace has at least one idea
            if (state.ideas.length === 0) {
                return WorkspaceStateManager.setLastAction(state, "need_idea")
            }
            
            return WorkspaceStateManager.setLastAction(state, "workspace_ready")
        }

        const createWorkspaceNode = async (state: WorkspaceState): Promise<WorkspaceState> => {
            console.log("🏢 Creating workspace...")
            
            const prompt = ChatPromptTemplate.fromMessages([
                ["system", `You are helping create a workspace for a startup idea. 
                The user's message suggests they want to start working on an idea.
                Extract a workspace title from their message, or suggest one if unclear.
                Respond with just the workspace title, nothing else.`],
                ["user", "{input}"],
            ])

            const chain = prompt.pipe(llm)
            const result = await chain.invoke({
                input: state.messages[state.messages.length - 1].content
            })

            // Create workspace (mock - in real app this would use the store)
            const workspace = {
                '@id': '/workspaces/new-workspace',
                '@type': 'ideanation:Workspace',
                id: 'new-workspace',
                title: result.content || 'New Workspace',
                description: 'A new workspace for your startup idea',
                identifier: 'WS-001',
                created: new Date(),
                updated: new Date()
            }

            let newState = WorkspaceStateManager.setWorkspace(state, workspace)
            newState = WorkspaceStateManager.setLastAction(newState, "workspace_created")
            
            return newState
        }

        const createIdeaNode = async (state: WorkspaceState): Promise<WorkspaceState> => {
            console.log("💡 Creating idea...")
            
            const prompt = ChatPromptTemplate.fromMessages([
                ["system", `You are helping create an idea within a workspace. 
                The user's message suggests they want to work on a startup idea.
                Extract an idea title from their message, or suggest one based on context.
                Respond with just the idea title, nothing else.`],
                ["user", "{input}"],
            ])

            const chain = prompt.pipe(llm)
            const result = await chain.invoke({
                input: state.messages[state.messages.length - 1].content
            })

            // Create idea (mock - in real app this would use the store)
            const idea = {
                '@id': '/ideas/new-idea',
                '@type': 'ideanation:Idea',
                id: 'new-idea',
                title: result.content || 'New Startup Idea',
                description: 'A new startup idea',
                identifier: 'IDEA-001',
                created: new Date(),
                updated: new Date()
            }

            let newState = WorkspaceStateManager.addEntity(state, idea)
            newState = WorkspaceStateManager.setCurrentIdea(newState, idea)
            newState = WorkspaceStateManager.setLastAction(newState, "idea_created")
            
            return newState
        }

        const processMessageNode = async (state: WorkspaceState): Promise<WorkspaceState> => {
            console.log("💬 Processing message...")
            
            const prompt = ChatPromptTemplate.fromMessages([
                ["system", `You are an expert startup advisor helping users structure their ideas.
                The workspace is ready with an idea. Now help the user with their request.
                
                Current workspace: ${state.workspace?.title}
                Current idea: ${state.currentIdea?.title}
                
                Provide helpful advice and suggestions for building out their startup idea.`],
                ["user", "{input}"],
            ])

            const chain = prompt.pipe(llm)
            
            // Stream the response
            const stream = await chain.stream({
                input: state.messages[state.messages.length - 1].content
            })

            let responseContent = ""
            for await (const chunk of stream) {
                if (chunk.content) {
                    responseContent += chunk.content
                    writer.write(chunk.content)
                }
            }

            // Add AI response to state
            const aiMessage = new AIMessage(responseContent)
            let newState = WorkspaceStateManager.addMessage(state, aiMessage)
            newState = WorkspaceStateManager.setLastAction(newState, "message_processed")
            
            return newState
        }

        const generateResponseNode = async (state: WorkspaceState): Promise<WorkspaceState> => {
            console.log("📝 Generating response...")
            
            let responseMessage = ""
            
            if (state.lastAction === "workspace_created") {
                responseMessage = `Great! I've created your workspace "${state.workspace?.title}". Now, what's your startup idea? Please tell me about the main concept you want to work on.`
            } else if (state.lastAction === "idea_created") {
                responseMessage = `Perfect! I've created your idea "${state.currentIdea?.title}" in the workspace "${state.workspace?.title}". 

Now you can start building it out by creating:
• **problem:** describe problems your idea solves
• **customer:** describe your target customers  
• **feature:** describe key features
• **pain:** describe customer pain points
• **gain:** describe customer gains

What would you like to add first?`
            }

            if (responseMessage) {
                writer.write(responseMessage)
                
                const aiMessage = new AIMessage(responseMessage)
                let newState = WorkspaceStateManager.addMessage(state, aiMessage)
                newState = WorkspaceStateManager.setLastAction(newState, "response_generated")
                
                return newState
            }
            
            return state
        }

        // Define conditional logic
        const shouldCreateWorkspace = (state: WorkspaceState): string => {
            if (state.lastAction === "need_workspace") {
                return "create_workspace"
            }
            if (state.lastAction === "need_idea") {
                return "create_idea"
            }
            if (state.lastAction === "workspace_ready") {
                return "process_message"
            }
            if (state.lastAction === "workspace_created" || state.lastAction === "idea_created") {
                return "generate_response"
            }
            return END
        }

        // Create the workflow graph
        const workflow = new StateGraph({
            channels: {
                messages: [],
                workspace: null,
                currentIdea: null,
                ideas: [],
                problems: [],
                customers: [],
                products: [],
                features: [],
                jobs: [],
                pains: [],
                gains: [],
                relationships: [],
                isProcessing: false,
                lastAction: null,
                selectedEntityIds: [],
                entityCreationContext: {},
                insights: {
                    problemSolutionFit: 0,
                    customerProblemFit: 0,
                    featureCompleteness: 0,
                    relationshipDensity: 0
                },
                exportHistory: []
            }
        })

        // Add nodes to the workflow
        workflow.addNode("check_workspace", checkWorkspaceNode)
        workflow.addNode("create_workspace", createWorkspaceNode)
        workflow.addNode("create_idea", createIdeaNode)
        workflow.addNode("process_message", processMessageNode)
        workflow.addNode("generate_response", generateResponseNode)

        // Define the workflow edges
        workflow.setEntryPoint("check_workspace")
        
        workflow.addConditionalEdges(
            "check_workspace",
            shouldCreateWorkspace,
            {
                "create_workspace": "create_workspace",
                "create_idea": "create_idea", 
                "process_message": "process_message",
                "generate_response": "generate_response"
            }
        )
        
        workflow.addEdge("create_workspace", "generate_response")
        workflow.addEdge("create_idea", "generate_response")
        workflow.addEdge("process_message", END)
        workflow.addEdge("generate_response", END)

        // Compile and run the workflow
        const app = workflow.compile()
        
        console.log("🚀 Starting workflow execution...")
        const finalState = await app.invoke(workspaceState)
        
        console.log("✅ Workflow completed. Final action:", finalState.lastAction)

    } catch (error) {
        console.error('Error in workflow:', error)
        writer.write('Sorry, I encountered an error while processing your message. Please try again.')
    } finally {
        writer.end()
    }
})