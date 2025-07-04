import { Agent } from '../../types/agent';
import { ideaAgentConfig } from './config';
import { createIdeaAgentGraph } from  './graph';

export function setupAgent(
  prefix: string = '/idea',
  authToken?: string
): Agent {
  // Create the Idea agent instance
  const ideaAgent = new Agent(
    ideaAgentConfig,
    createIdeaAgentGraph,
    authToken
  );

  return ideaAgent;
} 