import { Agent } from '../../types/agent';
import { simpleRoutingConfig } from './config';
import { createSimpleRoutingGraph } from './graph';

export function setupAgent(
  prefix: string = '/simple/routing',
  authToken?: string
): Agent {
  // Create the Simple Routing agent instance
  const simpleAgent = new Agent(
    simpleRoutingConfig,
    createSimpleRoutingGraph,
    authToken
  );



  return simpleAgent;
} 