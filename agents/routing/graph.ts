import { END, interrupt, START, StateGraph } from "@langchain/langgraph";
import { WorkspaceState } from "../../states/WorkspaceState";
import type { WorkspaceStateType, RoutingStateType } from "../../states/WorkspaceState";
import type { Agent } from "../../types/agent";
import { llm } from "../../graphs/main"
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { slugify } from "../utils";
import { generateResourceId, RELATIONSHIP_TYPES } from "~/types/resources";


// Export a function to create the routing graph
export function createSimpleRoutingGraph(agent: Agent, authToken?: string) {
  const agents = agent.getSubAgents();
  // Node: Detect intent from input
  async function detectIntentNode(state: WorkspaceStateType): Promise<Partial<WorkspaceStateType>> {
    if (!state.workspace) {
      // No workspace, route to get_idea_input node
      return {
        routes: [{
          input: "",
          route: "create_workspace",
          explanation: "Create idea and workspace",
          nextInput: "",
          nextInputData: undefined
        }]
      };
    }
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

  // Node: Create workspace and idea at the same time
  async function createWorkspaceAndIdeaNode(state: WorkspaceStateType): Promise<Partial<WorkspaceStateType>> {
    const userMessage = state.messages && state.messages.length > 0 ? state.messages[state.messages.length - 1] : null;
    let workspaceTitle = "New Workspace";
    let workspaceDescription = "A new workspace for your ideas and problems.";
    let ideaTitle = "New Idea";
    let ideaDescription = "A new startup idea.";

    if (userMessage && userMessage.content) {
      // Use LLM to extract both workspace and idea info from the input
      const prompt = ChatPromptTemplate.fromMessages([
        ["system", `You are helping create a workspace and an idea at the same time.\nThe user has described their needs.\nExtract a clear, concise workspace title and description, and also an idea title and description from their input.`],
        ["user", "{input}"],
      ]);
      const zodSchema = z.object({
        workspaceTitle: z.string(),
        workspaceDescription: z.string(),
        ideaTitle: z.string(),
        ideaDescription: z.string(),
      });
      const llmWithStructuredOutput = llm.withStructuredOutput(zodSchema);
      const chain = prompt.pipe(llmWithStructuredOutput);
      const result = await chain.invoke({ input: userMessage.content });
      workspaceTitle = result.workspaceTitle;
      workspaceDescription = result.workspaceDescription;
      ideaTitle = result.ideaTitle;
      ideaDescription = result.ideaDescription;
    }

    // Create workspace resource
    const identifier = 'WS-001'
    const workspaceIdentifier = identifier.toLowerCase()
    const workspaceUri = `/workspaces/${workspaceIdentifier}`;
    const workspace = {
      '@id': workspaceUri,
      '@type': 'ideanation:Workspace' as const,
      id: workspaceUri,
      title: workspaceTitle,
      description: workspaceDescription,
      identifier: workspaceIdentifier,
      created: new Date(),
      updated: new Date(),
    };
    // Create idea resource
    const ideaIdentifier = slugify(ideaTitle);
    const ideaUri = `/ideas/${ideaIdentifier}`;
    const idea = {
      '@id': ideaUri,
      '@type': 'ideanation:Idea' as const,
      id: ideaUri,
      title: ideaTitle,
      description: ideaDescription,
      identifier: ideaIdentifier,
      created: new Date(),
      updated: new Date(),
    };
    const relationshipId = generateResourceId('ideanation:Relationship')
    return {
      currentResource: idea,
      workspace,
      ideas: [idea],
      relationships: [
        {
          '@type': 'ideanation:Relationship',
          '@id': relationshipId,
          id: relationshipId,
          created: new Date(),
          updated: new Date(),
          sourceId: idea.id,
          targetId: workspace.id,
          relationshipType: RELATIONSHIP_TYPES.BELONGS
        }
      ],
      messages: [new AIMessage(`Great! I've created your workspace '${workspace.title}' and idea '${idea.title}'.`)],
    };
  }

  async function getIdeaInputNode(state: WorkspaceStateType): Promise<Partial<WorkspaceStateType>> {
    // If the last message is from the user, proceed to create workspace and idea
    const message = interrupt("Tell me about your idea so we can really get started.")
    // Otherwise, wait for user input (already prompted in detectIntentNode)
    return {
      messages: [new HumanMessage(message)]
    };
  }

  async function getProblemInputNode(state: WorkspaceStateType): Promise<Partial<WorkspaceStateType>> {
    // If the last message is from the user, proceed to create workspace and idea
    const message = interrupt("What problem(s) are you trying to solve?")
    // Otherwise, wait for user input (already prompted in detectIntentNode)
    return {
      messages: [new HumanMessage(message)]
    };
  }

  async function getCustomerInputNode(state: WorkspaceStateType): Promise<Partial<WorkspaceStateType>> {
    // If the last message is from the user, proceed to create workspace and idea
    const message = interrupt("Who faces these problems?")
    // Otherwise, wait for user input (already prompted in detectIntentNode)
    return {
      messages: [new HumanMessage(message)]
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
  graph.addNode('create_workspace', createWorkspaceAndIdeaNode);
  graph.addNode('get_problem_input', getProblemInputNode);
  // @ts-expect-error
  graph.addEdge(START, 'detect_intent');
  // Conditional edge from detect_intent to the correct sub-agent node
  function selectNextRoute(state: WorkspaceStateType) {
    // Get the last route from state.routes
    const routes = state.routes || [];
    const lastRoute = routes.length > 0 ? routes[routes.length - 1] : undefined;
    const route = lastRoute && lastRoute.route;
    return route;
  }
  function guideNextAction(state: WorkspaceStateType) {
    // Get the last route from state.routes
    if (state.problems.length === 0) {
      return 'get_problem_input';
    } else {
      return END;
    }
  }
  // @ts-expect-error
  graph.addEdge('get_problem_input','problem');
  // @ts-expect-error
  graph.addConditionalEdges('create_workspace', guideNextAction);
  // @ts-expect-error
  graph.addConditionalEdges('detect_intent', selectNextRoute);
  return graph;
} 