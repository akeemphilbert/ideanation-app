import { END, START, StateGraph } from "@langchain/langgraph";
import { Annotation } from "@langchain/langgraph";
import type { BaseMessage } from "@langchain/core/messages";
import type { IdeaResource, RelationshipResource, BaseResource } from "../../types/resources";
import type { RoutingStateType } from "../../states/WorkspaceState";
import type { Agent } from "../../types/agent";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import { llm } from "../../graphs/main";
import { RELATIONSHIP_TYPES } from "../../types/relationships"
import { slugify } from "../utils";

// Define a specific state for the idea agent
export const IdeaAgentState = Annotation.Root({
    isGlobalState: Annotation<boolean>({
        reducer: (x: boolean, y: boolean) => y, // Latest value wins
        default: () => true,
      }),
  messages: Annotation<BaseMessage[]>({
    reducer: (x: BaseMessage[], y: BaseMessage[]) => x.concat(y),
    default: () => [],
  }),
  ideas: Annotation<IdeaResource[]>({
    reducer: (x: IdeaResource[], y: IdeaResource[]) => x.concat(y),
    default: () => [],
  }),
  relationships: Annotation<RelationshipResource[]>({
    reducer: (x: RelationshipResource[], y: RelationshipResource[]) => x.concat(y),
    default: () => [],
  }),
  routes: Annotation<RoutingStateType[]>({
    reducer: (x: RoutingStateType[], y: RoutingStateType[]) => x.concat(y),
    default: () => [],
  }),
});

export type IdeaAgentStateType = typeof IdeaAgentState.State;

// Export a function to create the idea agent graph
export function createIdeaAgentGraph(agent: Agent, authToken?: string) {
  // Node: Manage idea (placeholder)
  async function manageIdeaNode(state: IdeaAgentStateType): Promise<Partial<IdeaAgentStateType>> {
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
          `You are a router. Given the user's message and the available agents, select the best route to handle the message. 
          The explanation should be brief and clearly tell the user what you are about to do.
          The possible routes are:
          - create_idea
          - update_idea
          - delete_idea
          - list_ideas
          `
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

  async function createIdeaNode(state: IdeaAgentStateType): Promise<Partial<IdeaAgentStateType>> {
    console.log("💡 Creating idea...")
    
    const userMessage = state.messages[state.messages.length - 1]
    let ideaTitle = "New Idea"
    let ideaDescription = "A new startup idea"
    
    if (userMessage && userMessage.content) {
        const prompt = ChatPromptTemplate.fromMessages([
            ["system", `You are helping create a startup idea. 
            The user has described their idea. 
            Extract a clear, concise idea title from their input along with a detailed description of the idea.
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
        
        ideaTitle = result.title
        ideaDescription = result.description
    }

    // Generate a unique identifier
    const identifier = slugify(ideaTitle)
    const idFromIdentifier = identifier.toLowerCase()
    const uri = `/ideas/${idFromIdentifier}`
    
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
        routes: [],
        relationships: [],
        messages: [new AIMessage("Great! I've created your idea '" + idea.title + "'.")],
    }
  }

  const updateIdeaNode = async (state: IdeaAgentStateType) => {
    console.log("\uD83D\uDD27 Updating idea...");
    const userMessage = state.messages[state.messages.length - 1];
    let updatedIdea: IdeaResource | null = null;
    let lastMessage = "";

    if (userMessage && userMessage.content) {
      // Expecting input like: { id: string, title?: string, description?: string }
      let updateInput: { id: string; title?: string; description?: string };
      try {
        updateInput = typeof userMessage.content === 'string' ? JSON.parse(userMessage.content) : userMessage.content;
      } catch (e) {
        return { lastMessage: "Invalid input for updating idea. Please provide a valid JSON object with at least an 'id'." };
      }
      const existing = (state.ideas || []).find((p: any) => p.id === updateInput.id || p['@id'] === updateInput.id);
      if (!existing) {
        return { lastMessage: `Idea with id '${updateInput.id}' not found.` };
      }
      updatedIdea = {
        ...existing,
        ...(updateInput.title ? { title: updateInput.title } : {}),
        ...(updateInput.description ? { description: updateInput.description } : {}),
        updated: new Date(),
      };
      // Replace in ideas array
      if (updatedIdea) {
        const updatedIdeaId = updatedIdea.id || updatedIdea['@id'];
        const newIdeas = (state.ideas || []).map((p: any) => {
          const ideaId = p.id || p['@id'];
          return (ideaId === updatedIdeaId) ? updatedIdea : p;
        });
        return {
            ...state,
            ideas: newIdeas,
            messages: [new AIMessage("Idea updated.")],
        }
      }
      return {
          ...state,
          messages: [new AIMessage("Failed to update idea.")],
      }
    }
    return { lastMessage: "No input provided for updating idea." };
  };

  const deleteIdeaNode = async (state: IdeaAgentStateType) => {
    console.log("\uD83D\uDD27 Deleting idea...");
    const userMessage = state.messages[state.messages.length - 1];
    let lastMessage = "";
    if (userMessage && userMessage.content) {
      // Expecting input like: { id: string }
      let deleteInput: { id: string };
      try {
        deleteInput = typeof userMessage.content === 'string' ? JSON.parse(userMessage.content) : userMessage.content;
      } catch (e) {
        return { lastMessage: "Invalid input for deleting idea. Please provide a valid JSON object with an 'id'." };
      }
      const existing = (state.ideas || []).find((p: any) => p.id === deleteInput.id || p['@id'] === deleteInput.id);
      if (!existing) {
        return { lastMessage: `Idea with id '${deleteInput.id}' not found.` };
      }
      const newIdeas = (state.ideas || []).filter((p: any) => (p.id !== deleteInput.id && p['@id'] !== deleteInput.id));
      lastMessage = `Idea '${existing.title}' deleted.`;
      return {
          ...state,
          ideas: newIdeas
      };
    }
    return { lastMessage: "No input provided for deleting idea." };
  };

  const listIdeasNode = async (state: IdeaAgentStateType) => {
    console.log("\uD83D\uDD27 Listing ideas...");
    const ideas = state.ideas || [];
    let lastMessage = "No ideas found.";
    if (ideas.length > 0) {
      lastMessage =
        "Ideas in your workspace:\n" +
        ideas.map((p: any, idx: number) => `${idx + 1}. ${p.title}: ${p.description}`).join("\n");
    }
    return {
      ...state,
      ideas: ideas
    };
  };

  const graph = new StateGraph(IdeaAgentState);
  graph.addNode('detect_intent', manageIdeaNode);
  graph.addNode('create_idea', createIdeaNode);
  graph.addNode('update_idea', updateIdeaNode);
  graph.addNode('delete_idea', deleteIdeaNode);
  graph.addNode('list_ideas', listIdeasNode);

   // Conditional edge from detect_intent to the correct sub-agent node
   function selectNextRoute(state: IdeaAgentStateType) {
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
  graph.addEdge('create_idea', END);
  // @ts-expect-error
  graph.addEdge('update_idea', END);
  // @ts-expect-error
  graph.addEdge('delete_idea', END);
  // @ts-expect-error
  graph.addEdge('list_ideas', END);
  return graph;
} 