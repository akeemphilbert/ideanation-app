import { ChatPromptTemplate } from "@langchain/core/prompts";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { StateGraph, END, START , interrupt, Command, MemorySaver} from "@langchain/langgraph";
import { WorkspaceState, WorkspaceStateManager, createInitialWorkspaceState } from "~/states/WorkspaceState";
import type { WorkspaceResource, IdeaResource, ProblemResource, CustomerResource } from "~/types/resources";
import { RELATIONSHIP_TYPES } from "~/types/relationships";
import { z } from "zod";

import { AzureChatOpenAI } from "@langchain/openai";
import { JsonOutputParser } from "@langchain/core/output_parsers";

const config = useRuntimeConfig()

const slugify = (text: string): string => {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
        .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

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

const ROUTES = {
    WORKSPACE: "create_workspace",
    IDEA: "create_idea",
    PROBLEM: "create_problem",
    CUSTOMER: "create_customer",
    JOBS: "find_jobs"
}

const routeNode = async (state: typeof WorkspaceState.State) => {

    //if there is no workspace, prompt the user to say what the are working on and then create a workspace
    if (!state.workspace) {
        return {
            currentRoute: ROUTES.WORKSPACE
        }
    }

    if (state.currentRoute) {
        return {
            currentRoute: state.currentRoute
        }
    }

    const prompt = ChatPromptTemplate.fromMessages([
        ["system", `You are helping a user create a startup idea.
        You are part of a team of agents that are helping the user create a startup idea.
        You are the router agent.
        You goal is to interpert what the user is doing and route them to the right agent.
        
        Here the agents that you can route to 
        - create_workspace
        - create_idea
        - create_problem
        - create_customer
        - find_jobs

        Here is the last message that was sent to them:
        {lastMessage}
        Here is the last route that was taken:
        {lastRoute}

        return only the route that you think is the best fit for the user's message.
        `],
        ["user", "{input}"],
    ])


    const chain = prompt.pipe(llm)
    const result = await chain.invoke({
        input: state.messages[state.messages.length - 1]?.content,
        lastMessage: state.lastMessage,
        lastRoute: state.currentRoute
    })

    return {
        currentRoute: result.content
    }
}

const nextRoute = (state: typeof WorkspaceState.State) => {
    if (state.currentRoute) {
        return state.currentRoute
    } else {
        return END
    }
}


const createWorkspaceNode = async (state: typeof WorkspaceState.State) => {
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
        input: state.messages[state.messages.length - 1]?.content
    })

    // Generate a unique identifier
    const identifier = 'WS-001'
    const idFromIdentifier = identifier.toLowerCase()
    const uri = `/workspaces/${idFromIdentifier}`
    
    // Create workspace (mock - in real app this would use the store)
    const workspace: WorkspaceResource = {
        '@id': uri,
        '@type': 'ideanation:Workspace' as const,
        id: uri,
        title: String(result.content) || 'New Workspace',
        description: 'A new workspace for your startup idea',
        identifier: identifier,
        created: new Date(),
        updated: new Date()
    }

    //create the first idea as well 
    // Generate identifier from slugified title
    const ideaIdentifier = slugify(workspace.title)
    const ideaURI = `/ideas/${ideaIdentifier}`
    
    // Create idea (mock - in real app this would use the store)
    const idea: IdeaResource = {
        '@id': ideaURI,
        '@type': 'ideanation:Idea' as const,
        id: ideaURI,
        title: workspace.title,
        identifier: ideaIdentifier,
        created: new Date(),
        updated: new Date()
    }

    return {
        workspace,
        relationships: [
            {
                sourceId: idea.id,
                targetId: workspace.id,
                relationshipType: RELATIONSHIP_TYPES.BELONGS
            }
        ],
        ideas: [idea],
        currentResource: idea,
        lastHumanMessage: state.messages[state.messages.length - 1],
        lastMessage: "Great! I've created your workspace \"" + workspace.title + "\".",
        lastAction: "workspace_created",
        currentRoute: null
    }
}

const createIdeaNode = async (state: typeof WorkspaceState.State) => {
    console.log("💡 Creating idea...")
    
    // If we have a user message, use it to create the idea
    const userMessage = state.messages[state.messages.length - 1]
        let ideaTitle = "New Startup Idea"
        let ideaDescription = "A new startup idea"
    
    if (userMessage && userMessage.content) {
        const prompt = ChatPromptTemplate.fromMessages([
            ["system", `You are helping create an idea within a workspace. 
            The user has provided their startup idea. Extract a clear, concise idea title from their input as well as a description of the idea.`],
            ["user", "{input}"],
        ])

        const zodSchema = z.object({
            title: z.string(),
            description: z.string()
        })

        const llmWithStructuredOutput = llm.withStructuredOutput(zodSchema)

        const chain = prompt.pipe(llmWithStructuredOutput)
        const result = await chain.invoke({
            input: userMessage.content
        })
        
        ideaTitle = result.title
        ideaDescription = result.description
    }

    // Generate identifier from slugified title
    const identifier = slugify(ideaTitle)
    const uri = `/ideas/${identifier}`
    
    // Create idea (mock - in real app this would use the store)
    const idea: IdeaResource = {
        '@id': uri,
        '@type': 'ideanation:Idea' as const,
        id: uri,
        title: ideaTitle,
        description: ideaDescription,
        identifier: identifier,
        created: new Date(),
        updated: new Date()
    }

    return {
        ideas: [idea],
        relationships: [
            {
                sourceId: idea.id,
                targetId: state.workspace?.id || "",
                relationshipType: RELATIONSHIP_TYPES.BELONGS
            }
        ],
        currentIdea: idea,
        lastAction: "idea_created"
    }
}

const getInputNode = async (state: typeof WorkspaceState.State) => {
    let prompt = "What would you like to do next? (add a problem, a customer, a feature, a pain, a gain, a job, a product)"
    if (state.lastAction === "workspace_created" || state.lastAction === "idea_created") {
        prompt = "What problem does your idea solve?"
        const message: string = interrupt(prompt)
        return {
            currentRoute: ROUTES.PROBLEM,
            messages: [new HumanMessage(message)]
        }
    } else if (state.lastAction === "should_create_problems") {
        prompt = "What problems does your idea solve?"
    }
    return {
        messages: [new AIMessage(prompt)],
        currentRoute: ROUTES.PROBLEM,
    }
}

const createProblemNode = async (state: typeof WorkspaceState.State) => {
    console.log("🔧 Creating problem...")
    
    const userMessage = state.messages[state.messages.length - 1]
    let problemTitle = "New Problem"
    let problemDescription = "A problem that the startup idea solves"
    
    if (userMessage && userMessage.content) {
        const prompt = ChatPromptTemplate.fromMessages([
            ["system", `You are helping create a problem description for a startup idea. 
            The user has described a problem their idea solves. Extract a clear, concise problem title from their input along with a detailed description of the problem.
        `],
            ["user", "{input}"],
        ])

        const zodSchema = z.object({
            title: z.string(),
            description: z.string()
        })

        const llmWithStructuredOutput = llm.withStructuredOutput(zodSchema)

        const chain = prompt.pipe(llmWithStructuredOutput)
        const result = await chain.invoke({
            input: userMessage.content
        })
        
        problemTitle = result.title
        problemDescription = result.description
    }

    // Generate a unique identifier
    const identifier = slugify(problemTitle)
    const idFromIdentifier = identifier.toLowerCase()
    const uri = `/problems/${idFromIdentifier}`
    
    // Create problem (mock - in real app this would use the store)
    const problem: ProblemResource = {
        '@id': uri,
        '@type': 'ideanation:Problem' as const,
        id: uri,
        title: problemTitle,
        description: problemDescription,
        identifier: identifier,
        created: new Date(),
        updated: new Date()
    }

    return {
        problems: [problem],
        currentResource: problem,
        relationships: [
            {
                sourceId: problem.id,
                targetId: state.currentResource?.id || "",
                relationshipType: RELATIONSHIP_TYPES.ASSOCIATED
            }
        ],
        messages: [new AIMessage("Great! I've created your problem \"" + problem.title + "\".")],
        lastMessage: "Great! I've created your problem \"" + problem.title + "\".",
        lastAction: "problem_created",
        currentRoute: null
    }
}

const createCustomerNode = async (state: typeof WorkspaceState.State) => {
    console.log("👤 Creating customer...")
    
    const userMessage = state.messages[state.messages.length - 1]
    let customerTitle = "New Customer"
    let customerDescription = "A customer that the startup idea solves"
    let customerGivenName = "John"
    let customerFamilyName = "Doe"
    let customerRole = "Customer"
    let customerOrganization = "Acme Inc."
    
    if (userMessage && userMessage.content) {
        const prompt = ChatPromptTemplate.fromMessages([
            ["system", `You are helping create a customer description for a startup idea. 
            The user has described a customer their idea solves. Extract a clear, concise customer title from their input along with a detailed description of the customer's persona.
        `],
            ["user", "{input}"],
        ])

        const zodSchema = z.object({
            title: z.string(),
            description: z.string(),
            givenName: z.string(),
            familyName: z.string(),
            role: z.string(),
            organization: z.string()
        })

        const llmWithStructuredOutput = llm.withStructuredOutput(zodSchema)

        const chain = prompt.pipe(llmWithStructuredOutput)
        const result = await chain.invoke({
            input: userMessage.content
        })

        customerTitle = result.title
        customerDescription = result.description
        customerGivenName = result.givenName
        customerFamilyName = result.familyName
        customerRole = result.role
        customerOrganization = result.organization

        // Generate a unique identifier
        const identifier = slugify(customerTitle)
        const idFromIdentifier = identifier.toLowerCase()
        const uri = `/customers/${idFromIdentifier}`
        
        // Create customer (mock - in real app this would use the store)
        const customer: CustomerResource = {
            '@id': uri,
            '@type': 'ideanation:Customer' as const,
            id: uri,
            title: customerTitle,
            description: customerDescription,
            givenName: customerGivenName,
            familyName: customerFamilyName,
            role: customerRole,
            organization: customerOrganization,
            identifier: identifier,
            created: new Date(),
            updated: new Date()
        }

        return {
            customers: [customer],
            relationships: [
                {
                    sourceId: customer.id,
                    targetId: state.currentResource?.id || "",
                    relationshipType: RELATIONSHIP_TYPES.ASSOCIATED
                }
            ],
            messages: [new AIMessage("Great! I've created your customer \"" + customer.title + "\".")],
            currentResource: customer, 
            lastMessage: "Great! I've created your customer \"" + customer.title + "\".",
            lastAction: "customer_created",
            currentRoute: null
        }
    }
}

/** Agent Nodes */
const findJobs = async (state: typeof WorkspaceState.State) => {
    console.log("🔍 Finding jobs...")

    const prompt = ChatPromptTemplate.fromMessages([
        ["system", `You are helping the user workshop their startup idea. Check to see if the user specified a customer they are targeting. If they have
            then identify the jobs to be done relative to the idea using the customer's persona and the jobs to be done framework.
            1. The jobs returned should be in the categories of:
                - Functional
                - Emotional
                - Social
            2. Each job should have a title, description, and a categogory
            3. If no customer is specified, then return an empty array

            Idea {idea}
    `],
        ["user", "{input}"],
    ])

    const zodSchema = z.object({
        jobs: z.array(z.object({
            title: z.string(),
            description: z.string(),
            category: z.enum(["functional", "emotional", "social"])
        }))
    })

    const llmWithStructuredOutput = llm.withStructuredOutput(zodSchema)

    const chain = prompt.pipe(llmWithStructuredOutput)
    const result = await chain.invoke({
        input: state.messages[state.messages.length - 1]?.content,
        idea: state.ideas.length > 0 ? state.ideas[0] : null
    })

    if (result.jobs.length > 0) {
        //set the functional jobs as jobs and the emotional and social jobs as gains
        const jobs = result.jobs.filter(job => job.category === "functional")
        const gains = result.jobs.filter(job => job.category === "emotional" || job.category === "social")
        return {
            jobs: jobs,
            gains: gains,
            lastAction: "jobs_found",
            currentRoute: null
        }
    } else {
        const message: string = interrupt("Please specify a customer to identify the jobs to be done.")
        return {
            currentRoute: ROUTES.JOBS,
            messages: [new HumanMessage(message)]
        }
    }

}
/* Conditional Edges */
const shouldCreateProblems = (state: typeof WorkspaceState.State): string => {
    if (state.problems.length === 0) {
        return "get_problem_input"
    }
    return "route"
}

const shouldCreateCustomers = (state: typeof WorkspaceState.State): string => {
    if (state.customers.length === 0) {
        return "get_customer_input"
    }
    return "route"
}


// Create the workflow graph
const workflow = new StateGraph(WorkspaceState)

// Add nodes to the workflow
workflow.addNode("create_workspace", createWorkspaceNode)
workflow.addNode("route", routeNode)
workflow.addNode("get_idea_input", getInputNode)
workflow.addNode("get_problem_input", getInputNode)
workflow.addNode("get_customer_input", getInputNode)
workflow.addNode("create_idea", createIdeaNode)
workflow.addNode("create_problem", createProblemNode)
workflow.addNode("create_customer", createCustomerNode)
workflow.addNode("find_jobs", findJobs)

// Set up the workflow edges
workflow.addEdge(START, "route")

workflow.addConditionalEdges(
    "route",
    nextRoute
)

workflow.addConditionalEdges(
    "create_workspace",
    shouldCreateProblems
)

workflow.addConditionalEdges(
    "create_idea",
    shouldCreateProblems
)

workflow.addConditionalEdges(
    "create_problem",
    shouldCreateCustomers
)

// Direct edges for sequential flow
workflow.addEdge("get_idea_input", "create_idea")
workflow.addEdge("get_problem_input", "create_problem")
workflow.addEdge("get_customer_input", "create_customer")
workflow.addEdge("create_customer", "find_jobs")
workflow.addEdge("create_problem", END)
workflow.addEdge("create_workspace", END)
workflow.addEdge("find_jobs", END)

// Export the workflow
export default workflow;