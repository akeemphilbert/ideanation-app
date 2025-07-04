import { END, START, StateGraph } from "@langchain/langgraph";
import { Annotation } from "@langchain/langgraph";
import type { BaseMessage } from "@langchain/core/messages";
import type { ProblemResource, RelationshipResource, BaseResource } from "../../types/resources";
import type { RoutingStateType } from "../../states/WorkspaceState";
import type { Agent } from "../../types/agent";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import { llm } from "../../graphs/main";
import { RELATIONSHIP_TYPES } from "../../types/relationships"
import { slugify } from "../utils";

// Define a specific state for the problem agent
export const ProblemAgentState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (x: BaseMessage[], y: BaseMessage[]) => x.concat(y),
    default: () => [],
  }),
  problems: Annotation<ProblemResource[]>({
    reducer: (x: ProblemResource[], y: ProblemResource[]) => x.concat(y),
    default: () => [],
  }),
  currentResource: Annotation<BaseResource | null>({
    reducer: (x: BaseResource | null, y: BaseResource | null) => y,
    default: () => null,
  }),
  relationships: Annotation<RelationshipResource[]>({
    reducer: (x: RelationshipResource[], y: RelationshipResource[]) => x.concat(y),
    default: () => [],
  }),
  routes: Annotation<RoutingStateType[]>({
    reducer: (x: RoutingStateType[], y: RoutingStateType[]) => x.concat(y),
    default: () => [],
  }),
  lastMessage: Annotation<string | null>({
    reducer: (x: string | null, y: string | null) => y,
    default: () => null,
  }),
  lastAction: Annotation<string | null>({
    reducer: (x: string | null, y: string | null) => y,
    default: () => null,
  }),
  currentRoute: Annotation<string | null>({
    reducer: (x: string | null, y: string | null) => y,
    default: () => null,
  }),
});

export type ProblemAgentStateType = typeof ProblemAgentState.State;

// Export a function to create the problem agent graph
export function createProblemAgentGraph(agent: Agent, authToken?: string) {
  // Node: Manage problem (placeholder)
  async function manageProblemNode(state: ProblemAgentStateType): Promise<Partial<ProblemAgentStateType>> {
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
          - create_problem
          - update_problem
          - delete_problem
          - list_problems
          `
        ],
        [
          "human",
          "{input}"
        ]
      ]);
  
      // Extract user input from the latest message in state.messages
      let input = "";
      if (state.messages && state.messages.length > 0) {
        const lastMsg = state.messages[state.messages.length - 1];
        // Try to get the content property (for HumanMessage)
        input = lastMsg.content as string;
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

  const createProblemNode = async (state: ProblemAgentStateType) => {
    console.log("🔧 Creating problem...")
    
    const userMessage = state.messages[state.messages.length - 1]
    let problemTitle = "New Problem"
    let problemDescription = "A problem that the startup idea solves"
    
    if (userMessage && userMessage.content) {
        const prompt = ChatPromptTemplate.fromMessages([
            ["system", `You are helping create a problem description for a startup idea. 
            The user has described a problem their idea solves. 
            Extract a clear, concise problem title from their input along with a detailed description of the problem.
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
    }
}

const updateProblemNode = async (state: ProblemAgentStateType) => {
  console.log("\uD83D\uDD27 Updating problem...");
  const userMessage = state.messages[state.messages.length - 1];
  let updatedProblem: ProblemResource | null = null;
  let lastMessage = "";

  if (userMessage && userMessage.content) {
    // Expecting input like: { id: string, title?: string, description?: string }
    let updateInput: { id: string; title?: string; description?: string };
    try {
      updateInput = typeof userMessage.content === 'string' ? JSON.parse(userMessage.content) : userMessage.content;
    } catch (e) {
      return { lastMessage: "Invalid input for updating problem. Please provide a valid JSON object with at least an 'id'." };
    }
    const existing = (state.problems || []).find((p: any) => p.id === updateInput.id || p['@id'] === updateInput.id);
    if (!existing) {
      return { lastMessage: `Problem with id '${updateInput.id}' not found.` };
    }
    updatedProblem = {
      ...existing,
      ...(updateInput.title ? { title: updateInput.title } : {}),
      ...(updateInput.description ? { description: updateInput.description } : {}),
      updated: new Date(),
    };
    // Replace in problems array
    const newProblems = (state.problems || []).map((p: any) => (p.id === updatedProblem.id || p['@id'] === updatedProblem.id) ? updatedProblem : p);
    if (updatedProblem) {
      lastMessage = `Problem '${updatedProblem.title}' updated.`;
      return {
        problems: newProblems,
        currentResource: updatedProblem,
        lastMessage,
        lastAction: "problem_updated",
        currentRoute: null
      };
    } else {
      return { lastMessage: "Problem could not be updated." };
    }
  }
  return { lastMessage: "No input provided for updating problem." };
};

const deleteProblemNode = async (state: ProblemAgentStateType) => {
  console.log("\uD83D\uDD27 Deleting problem...");
  const userMessage = state.messages[state.messages.length - 1];
  let lastMessage = "";
  if (userMessage && userMessage.content) {
    // Expecting input like: { id: string }
    let deleteInput: { id: string };
    try {
      deleteInput = typeof userMessage.content === 'string' ? JSON.parse(userMessage.content) : userMessage.content;
    } catch (e) {
      return { lastMessage: "Invalid input for deleting problem. Please provide a valid JSON object with an 'id'." };
    }
    const existing = (state.problems || []).find((p: any) => p.id === deleteInput.id || p['@id'] === deleteInput.id);
    if (!existing) {
      return { lastMessage: `Problem with id '${deleteInput.id}' not found.` };
    }
    const newProblems = (state.problems || []).filter((p: any) => (p.id !== deleteInput.id && p['@id'] !== deleteInput.id));
    lastMessage = `Problem '${existing.title}' deleted.`;
    return {
      problems: newProblems,
      lastMessage,
      lastAction: "problem_deleted",
      currentRoute: null
    };
  }
  return { lastMessage: "No input provided for deleting problem." };
};

const listProblemsNode = async (state: ProblemAgentStateType) => {
  console.log("\uD83D\uDD27 Listing problems...");
  const problems = state.problems || [];
  let lastMessage = "No problems found.";
  if (problems.length > 0) {
    lastMessage =
      "Problems in your workspace:\n" +
      problems.map((p: any, idx: number) => `${idx + 1}. ${p.title}: ${p.description}`).join("\n");
  }
  return {
    lastMessage,
    lastAction: "problems_listed",
    currentRoute: null
  };
};

  const graph = new StateGraph(ProblemAgentState);
  graph.addNode('detect_intent', manageProblemNode);
  graph.addNode('create_problem', createProblemNode);
  graph.addNode('update_problem', updateProblemNode);
  graph.addNode('delete_problem', deleteProblemNode);
  graph.addNode('list_problems', listProblemsNode);

   // Conditional edge from detect_intent to the correct sub-agent node
   function selectNextRoute(state: ProblemAgentStateType) {
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
  graph.addEdge('create_problem', END);
  // @ts-expect-error
  graph.addEdge('update_problem', END);
  // @ts-expect-error
  graph.addEdge('delete_problem', END);
  // @ts-expect-error
  graph.addEdge('list_problems', END);
  return graph;
} 