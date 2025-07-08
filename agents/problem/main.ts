import { Agent } from '../../types/agent';
import { problemAgentConfig } from './config';
import { createProblemAgentGraph } from './graph';

export function setupAgent(
  prefix: string = '/problem',
  authToken?: string
): Agent {
  // Create the Problem agent instance
  const problemAgent = new Agent(
    problemAgentConfig,
    createProblemAgentGraph,
    authToken
  );

  return problemAgent;
} 