import { Agent } from '../../types/agent';
import { workspaceAgentConfig } from './config';
import { createWorkspaceAgentGraph } from './graph';

export function setupAgent(
  prefix: string = '/workspace',
  authToken?: string
): Agent {
  // Create the Workspace agent instance
  const workspaceAgent = new Agent(
    workspaceAgentConfig,
    createWorkspaceAgentGraph,
    authToken
  );

  return workspaceAgent;
} 