import { END, START, StateGraph } from "@langchain/langgraph";
import { Annotation } from "@langchain/langgraph";
import type { BaseMessage } from "@langchain/core/messages";
import type { WorkspaceResource, RelationshipResource, BaseResource } from "../../types/resources";
import type { RoutingStateType } from "../../states/WorkspaceState";
import type { Agent } from "../../types/agent";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import { llm } from "../../graphs/main";
import { RELATIONSHIP_TYPES } from "../../types/relationships"
import { slugify } from "../utils";
import { WorkspaceState } from "../../states/WorkspaceState";

// Define a specific state for the workspace agent
export const WorkspaceAgentState = WorkspaceState;
export type WorkspaceAgentStateType = typeof WorkspaceState.State;

// Export a function to create the workspace agent graph
export function createWorkspaceAgentGraph(agent: Agent, authToken?: string) {
  // Node: Manage workspace (placeholder)
  async function manageWorkspaceNode(state: WorkspaceAgentStateType): Promise<Partial<WorkspaceAgentStateType>> {
    // Define the output schema
    const outputSchema = z.object({
        route: z.string(),
        explanation: z.string(),
        nextInput: z.string()
      });
  
      // Define the prompt template with markers
      const prompt = ChatPromptTemplate.fromMessages([
        [
          "system",
          `You are a router. Given the user's message and the available workspace actions, select the best route to handle the message. \nThe explanation should be brief and clearly tell the user what you are about to do.\nThe possible routes are:\n- create_workspace\n- update_workspace\n- delete_workspace\n- list_workspaces\n`
        ],
        [
          "human",
          "{input}"
        ]
      ]);
  
      // Extract user input from the latest human message in state.messages
      let input = "";
      if (state.messages && state.messages.length > 0) {
        // Find the last human message
        for (let i = state.messages.length - 1; i >= 0; i--) {
          const msg = state.messages[i];
          if (msg instanceof HumanMessage) {
            input = msg.content as string;
            break;
          }
        }
      }
  
      // Chain the prompt and the LLM with structured output
      const chain = prompt.pipe(
        llm.withStructuredOutput(outputSchema)
      );
  
      // Call the chain with variables
      const result = await chain.invoke({
        input,
      }) as z.infer<typeof outputSchema>;
  
      // Prepare the new route object
      const newRoute: RoutingStateType = {
        input,
        route: result.route,
        explanation: result.explanation,
        nextInput: result.nextInput,
        nextInputData: undefined
      };
  
      return {
        messages: [new AIMessage(result.explanation)],
        routes: [newRoute]
      };
  }

  async function createWorkspaceNode(state: WorkspaceAgentStateType): Promise<Partial<WorkspaceAgentStateType>> {
    console.log("🏢 Creating workspace...")
    
    const userMessage = state.messages[state.messages.length - 1]
    let workspaceTitle = "New Workspace"
    let workspaceDescription = "A new workspace for your ideas and problems"
    
    if (userMessage && userMessage.content) {
        const prompt = ChatPromptTemplate.fromMessages([
            ["system", `You are helping create a workspace. \nThe user has described their workspace. \nExtract a clear, concise workspace title from their input along with a detailed description of the workspace.`],
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
        
        workspaceTitle = result.title
        workspaceDescription = result.description
    }

    // Generate a unique identifier
    const identifier = slugify(workspaceTitle)
    const idFromIdentifier = identifier.toLowerCase()
    const uri = `/workspaces/${idFromIdentifier}`
    
    // Create workspace (mock - in real app this would use the store)
    const workspace: WorkspaceResource = {
        '@id': uri,
        '@type': 'ideanation:Workspace' as const,
        id: uri,
        title: workspaceTitle,
        description: workspaceDescription,
        identifier: identifier,
        created: new Date(),
        updated: new Date()
    }

    return {
        workspace: workspace,
        messages: [new AIMessage("Great! I've created your workspace '" + workspace.title + "'.")],
    }
  }

  const updateWorkspaceNode = async (state: WorkspaceAgentStateType) => {
    console.log("\uD83D\uDD27 Updating workspace...");
    const userMessage = state.messages[state.messages.length - 1];
    let updatedWorkspace: WorkspaceResource | null = null;
    let lastMessage = "";

    if (userMessage && userMessage.content) {
      // Expecting input like: { id: string, title?: string, description?: string }
      let updateInput: { id: string; title?: string; description?: string };
      try {
        updateInput = typeof userMessage.content === 'string' ? JSON.parse(userMessage.content) : userMessage.content;
      } catch (e) {
        return { lastMessage: "Invalid input for updating workspace. Please provide a valid JSON object with at least an 'id'." };
      }
      const existing = state.workspace && (state.workspace.id === updateInput.id || state.workspace['@id'] === updateInput.id) ? state.workspace : null;
      if (!existing) {
        return { lastMessage: `Workspace with id '${updateInput.id}' not found.` };
      }
      updatedWorkspace = {
        ...existing,
        ...(updateInput.title ? { title: updateInput.title } : {}),
        ...(updateInput.description ? { description: updateInput.description } : {}),
        updated: new Date(),
      };
      return {
          ...state,
          workspace: updatedWorkspace,
          messages: [new AIMessage("Workspace updated.")],
      }
    }
    return { lastMessage: "No input provided for updating workspace." };
  };

  const deleteWorkspaceNode = async (state: WorkspaceAgentStateType) => {
    console.log("\uD83D\uDD27 Deleting workspace...");
    const userMessage = state.messages[state.messages.length - 1];
    let lastMessage = "";
    if (userMessage && userMessage.content) {
      // Expecting input like: { id: string }
      let deleteInput: { id: string };
      try {
        deleteInput = typeof userMessage.content === 'string' ? JSON.parse(userMessage.content) : userMessage.content;
      } catch (e) {
        return { lastMessage: "Invalid input for deleting workspace. Please provide a valid JSON object with an 'id'." };
      }
      const existing = state.workspace && (state.workspace.id === deleteInput.id || state.workspace['@id'] === deleteInput.id) ? state.workspace : null;
      if (!existing) {
        return { lastMessage: `Workspace with id '${deleteInput.id}' not found.` };
      }
      lastMessage = `Workspace '${existing.title}' deleted.`;
      return {
          ...state,
          workspace: null,
          messages: [new AIMessage(lastMessage)]
      };
    }
    return { lastMessage: "No input provided for deleting workspace." };
  };

  const listWorkspacesNode = async (state: WorkspaceAgentStateType) => {
    console.log("\uD83D\uDD27 Listing workspaces...");
    // For demo, just return the current workspace if it exists
    const workspace = state.workspace;
    let lastMessage = "No workspaces found.";
    if (workspace) {
      lastMessage = `Workspace: ${workspace.title}: ${workspace.description}`;
    }
    return {
      ...state,
      messages: [new AIMessage(lastMessage)]
    };
  };

  const graph = new StateGraph(WorkspaceAgentState);
  graph.addNode('detect_intent', manageWorkspaceNode);
  graph.addNode('create_workspace', createWorkspaceNode);
  graph.addNode('update_workspace', updateWorkspaceNode);
  graph.addNode('delete_workspace', deleteWorkspaceNode);
  graph.addNode('list_workspaces', listWorkspacesNode);

   // Conditional edge from detect_intent to the correct sub-agent node
   function selectNextRoute(state: WorkspaceAgentStateType) {
    // Get the last route from state.routes
    const routes = state.routes || [];
    const lastRoute = routes.length > 0 ? routes[routes.length - 1] : undefined;
    const route = lastRoute && lastRoute.route;
    // Find the agent with a matching shortname
    return route;
    return END;
  }
  // @ts-expect-error
  graph.addConditionalEdges('detect_intent', selectNextRoute);
  
  // @ts-expect-error
  graph.addEdge(START, 'detect_intent');
  // @ts-expect-error
  graph.addEdge('detect_intent', END);
  // @ts-expect-error
  graph.addEdge('create_workspace', END);
  // @ts-expect-error
  graph.addEdge('update_workspace', END);
  // @ts-expect-error
  graph.addEdge('delete_workspace', END);
  // @ts-expect-error
  graph.addEdge('list_workspaces', END);
  return graph;
} 