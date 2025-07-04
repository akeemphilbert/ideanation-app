import { END, START, StateGraph } from "@langchain/langgraph";
import { WorkspaceState } from "../../states/WorkspaceState";
import type { WorkspaceStateType, RoutingStateType } from "../../states/WorkspaceState";
import type { Agent } from "../../types/agent";
import { llm } from "../../graphs/main"
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import { AIMessage, HumanMessage } from "@langchain/core/messages";


// Export a function to create the routing graph
export function createSimpleRoutingGraph(agent: Agent, authToken?: string) {
  const agents = agent.getSubAgents();
  // Node: Detect intent from input
  async function detectIntentNode(state: WorkspaceStateType): Promise<Partial<WorkspaceStateType>> {
    // Prepare agent info for the LLM
    const agentInfos = agents.map(agent => {
      const config = agent.getConfig();
      // Collect all examples from all skills
      let examples: string[] = [];
      if (config.skills && config.skills.length > 0) {
        examples = config.skills.flatMap(skill => skill.examples || []);
      }
      return {
        name: config.name,
        shortname: config.shortname || "(none)",
        description: config.description,
        examples
      };
    });

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
        "You are a router. Given the user's message and the available agents, select the best agent to handle the message. Each agent includes a list of example messages it handles. Respond with a JSON object with keys: route (the agent's shortname), explanation (a short, user-facing sentence explaining what will happen next), and nextInput (the message to send to the agent). Use the examples to help you choose the most appropriate agent. The explanation should be brief and clearly tell the user what you are about to do."
      ],
      [
        "human",
        "User message: {input}\nAvailable agents: {agents}"
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
      agents: JSON.stringify(agentInfos, null, 2)
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


  const graph = new StateGraph(WorkspaceState);
  graph.addNode('detect_intent', detectIntentNode);
  // Add each sub-agent as a node using its shortname and compiled graph
  agents.forEach((agent) => {
    const shortname = agent.getShortname();
    const compiledGraph = agent.getCompiledGraph();
    graph.addNode(shortname, compiledGraph);
    // @ts-expect-error
    graph.addEdge(shortname, END);
  });
  // @ts-expect-error
  graph.addEdge(START, 'detect_intent');
  // Conditional edge from detect_intent to the correct sub-agent node
  function selectNextRoute(state: WorkspaceStateType) {
    // Get the last route from state.routes
    const routes = state.routes || [];
    const lastRoute = routes.length > 0 ? routes[routes.length - 1] : undefined;
    const route = lastRoute && lastRoute.route;
    // Find the agent with a matching shortname
    if (route && agents.some(agent => agent.getShortname() === route)) {
      return route;
    }
    return END;
  }
  // @ts-expect-error
  graph.addConditionalEdges('detect_intent', selectNextRoute);
  return graph;
} 