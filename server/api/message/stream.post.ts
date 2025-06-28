import { defineEventHandler } from "h3";
import { AzureChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { StateGraph, END, START , interrupt} from "@langchain/langgraph";
import { WorkspaceState, WorkspaceStateManager, createInitialWorkspaceState } from "~/states/WorkspaceState";
import type { WorkspaceResource, IdeaResource, ProblemResource } from "~/types/resources";

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
            azureOpenAIApiKey: config.azureOpenAI.apiKey,
            azureOpenAIApiVersion: config.azureOpenAI.apiVersion,
            azureOpenAIBasePath: config.azureOpenAI.basePath,
            azureOpenAIApiDeploymentName: config.azureOpenAI.deployment,
        })

        // Create initial workspace state
        let workspaceState = createInitialWorkspaceState()
        
        // Add user message to state
        const userMessage = new HumanMessage(body.message)

        // Define workflow nodes
        const checkWorkspaceNode = async (state: typeof WorkspaceState.State) => {
            console.log("🔍 Checking workspace state...")
            
            // Check if workspace exists
            if (!state.workspace) {
                return { lastAction: "need_workspace" }
            }
            
            // Check if workspace has at least one idea
            if (state.ideas.length === 0) {
                return { lastAction: "need_idea" }
            }
            
            return { lastAction: "workspace_ready" }
        }

        const createWorkspaceNode = async (state: typeof WorkspaceState.State) => {
            console.log("🏢 Creating workspace and idea...")
            
            const prompt = ChatPromptTemplate.fromMessages([
                ["system", `You are helping create a workspace and startup idea. 
                The user has provided their startup idea or concept.
                
                Extract or generate:
                1. A workspace title (should be descriptive but concise)
                2. An idea title (the main startup concept)
                3. A brief description of what the idea does
                
                Respond in JSON format:
                {
                  "workspace_title": "workspace name",
                  "idea_title": "startup idea name", 
                  "idea_description": "brief description of what the startup does"
                }
                
                If the user input is unclear, make reasonable assumptions based on context.`],
                ["user", "{input}"],
            ])

            const chain = prompt.pipe(llm)
            const result = await chain.invoke({
                input: state.messages[state.messages.length - 1]?.content
            })

            let workspaceTitle = "New Workspace"
            let ideaTitle = "New Startup Idea"
            let ideaDescription = "A new startup idea"

            try {
                // Try to parse JSON response
                const parsed = JSON.parse(String(result.content))
                workspaceTitle = parsed.workspace_title || workspaceTitle
                ideaTitle = parsed.idea_title || ideaTitle
                ideaDescription = parsed.idea_description || ideaDescription
            } catch (e) {
                // Fallback: use the raw content as idea title
                const content = String(result.content).trim()
                if (content) {
                    ideaTitle = content
                    workspaceTitle = `${content} Workspace`
                    ideaDescription = `Startup idea: ${content}`
                }
            }

            // Create workspace
            const workspace: WorkspaceResource = {
                '@id': '/workspaces/new-workspace',
                '@type': 'ideanation:Workspace' as const,
                id: 'new-workspace',
                title: workspaceTitle,
                description: `Workspace for ${ideaTitle}`,
                identifier: 'WS-001',
                created: new Date(),
                updated: new Date()
            }

            // Create idea
            const idea: IdeaResource = {
                '@id': '/ideas/new-idea',
                '@type': 'ideanation:Idea' as const,
                id: 'new-idea',
                title: ideaTitle,
                description: ideaDescription,
                identifier: 'IDEA-001',
                created: new Date(),
                updated: new Date()
            }

            return {
                workspace,
                ideas: [idea],
                currentIdea: idea,
                lastAction: "workspace_and_idea_created"
            }
        }

        const getInputNode = async (state: typeof WorkspaceState.State) => {
            let prompt = "What would you like to do next? (add a problem, a customer, a feature, a pain, a gain, a job, a product)"
            if (state.lastAction === "workspace_and_idea_created") {
                prompt = "Great! Now let's build out your idea. What problems does your startup solve? Please describe the main problems or pain points your idea addresses."
            } else if (state.lastAction === "should_create_problems") {
                prompt = "What problems does your idea solve?"
            }
            const message: string = interrupt(prompt)
            return {
                messages: [new HumanMessage(message)]
            }
        }

        const createProblemNode = async (state: typeof WorkspaceState.State) => {
            console.log("🔧 Creating problem...")
            
            const userMessage = state.messages[state.messages.length - 1]
            let problemTitle = "New Problem"
            
            if (userMessage && userMessage.content) {
                const prompt = ChatPromptTemplate.fromMessages([
                    ["system", `You are helping create a problem description for a startup idea. 
                    The user has described a problem their idea solves. Extract a clear, concise problem title from their input.
                    Respond with just the problem title, nothing else.`],
                    ["user", "{input}"],
                ])

                const chain = prompt.pipe(llm)
                const result = await chain.invoke({
                    input: userMessage.content
                })
                
                problemTitle = String(result.content) || "New Problem"
            }

            // Create problem
            const problem: ProblemResource = {
                '@id': '/problems/new-problem',
                '@type': 'ideanation:Problem' as const,
                id: 'new-problem',
                title: problemTitle,
                description: 'A problem that the startup idea solves',
                identifier: 'PROB-001',
                created: new Date(),
                updated: new Date()
            }

            return {
                problems: [problem],
                lastAction: "problem_created"
            }
        }

        const processMessageNode = async (state: typeof WorkspaceState.State) => {
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
            
            return {
                messages: [aiMessage],
                lastAction: "message_processed"
            }
        }

        const generateResponseNode = async (state: typeof WorkspaceState.State) => {
            console.log("📝 Generating response...")
            
            let responseMessage = ""
            
            if (state.lastAction === "workspace_and_idea_created") {
                responseMessage = `Perfect! I've created your workspace "${state.workspace?.title}" with your startup idea "${state.currentIdea?.title}".

${state.currentIdea?.description}

Now let's start building it out! What problems does your startup solve? Please describe the main problems or pain points your idea addresses.

You can also create other components by typing:
• **customer:** describe your target customers  
• **feature:** describe key features
• **pain:** describe customer pain points
• **gain:** describe customer gains`
            } else if (state.lastAction === "problem_created") {
                responseMessage = `Excellent! I've added the problem "${state.problems[state.problems.length - 1]?.title}" to your idea.

Now you can continue building out your startup by adding:
• **customer:** describe your target customers  
• **feature:** describe key features
• **pain:** describe customer pain points
• **gain:** describe customer gains

What would you like to add next?`
            }

            if (responseMessage) {
                writer.write(responseMessage)
                
                const aiMessage = new AIMessage(responseMessage)
                
                return {
                    messages: [aiMessage],
                    lastAction: "response_generated"
                }
            }
            
            return {}
        }

        // Define conditional logic
        const shouldCreateWorkspace = (state: typeof WorkspaceState.State): string => {
            if (!state.workspace) {
                return "create_workspace"
            }
            return "check_ideas"
        }

        const shouldCreateIdea = (state: typeof WorkspaceState.State): string => {
            if (state.ideas.length === 0) {
                return "get_idea_input"
            }
            return "check_problems"
        }

        const shouldCreateProblems = (state: typeof WorkspaceState.State): string => {
            if (state.problems.length === 0) {
                return "get_problem_input"
            }
            return "process_message"
        }

        // Create the workflow graph
        const workflow = new StateGraph(WorkspaceState)

        // Add nodes to the workflow
        workflow.addNode("check_workspace", checkWorkspaceNode)
        workflow.addNode("create_workspace", createWorkspaceNode)
        workflow.addNode("check_ideas", checkWorkspaceNode) // Reuse checkWorkspaceNode for idea checking
        workflow.addNode("check_problems", checkWorkspaceNode) // Reuse checkWorkspaceNode for problem checking
        workflow.addNode("get_idea_input", getInputNode)
        workflow.addNode("get_problem_input", getInputNode)
        workflow.addNode("create_problem", createProblemNode)
        workflow.addNode("process_message", processMessageNode)
        workflow.addNode("generate_response", generateResponseNode)
        
        // Set up the workflow edges
        workflow.addEdge(START, "check_workspace")
        
        // Conditional edges with explicit mappings
        workflow.addConditionalEdges(
            "check_workspace",
            shouldCreateWorkspace
        )
        
        workflow.addConditionalEdges(
            "create_workspace",
            shouldCreateIdea
        )
        
        workflow.addConditionalEdges(
            "check_ideas",
            shouldCreateIdea,
            {
                "get_idea_input": "get_idea_input",
                "check_problems": "check_problems"
            }
        )
        
        workflow.addConditionalEdges(
            "check_problems",
            shouldCreateProblems,
            {
                "get_problem_input": "get_problem_input",
                "process_message": "process_message"
            }
        )
        
        // Direct edges for sequential flow
        workflow.addEdge("get_idea_input", "create_problem")
        workflow.addEdge("get_problem_input", "create_problem")
        workflow.addEdge("create_workspace", "generate_response")
        workflow.addEdge("create_problem", "generate_response")
        
        // End edges
        workflow.addEdge("generate_response", END)
        workflow.addEdge("process_message", END)

        // Compile and run the workflow
        const app = workflow.compile()
        
        console.log("🚀 Starting workflow execution...")
        const stream = await app.stream({
            messages: [new HumanMessage(body.message)]
        })

        for await (const chunk of stream) {
            //the chunk is an object with a property for the node (which could be different from the previous chunk) and the WorkflowState as the value let's check the last action 
            for (const key in chunk) {
                switch (key) {
                    case "create_workspace":
                        if (chunk[key].workspace && chunk[key].currentIdea) {
                            writer.write(`🎉 Great! I've created your workspace "${chunk[key].workspace.title}" with your startup idea "${chunk[key].currentIdea.title}". `)
                        } else {
                            writer.write("Sorry, I encountered an error while creating your workspace and idea. Please try again.")
                        }
                        break;
                    case "__interrupt__":
                        writer.write(`${chunk[key][0].value}`)
                        break;
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