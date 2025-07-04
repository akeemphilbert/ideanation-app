import type { AgentConfig } from '../../types/agent';
// @ts-ignore
import { AgentCapabilities, AgentSkill } from '@a2a-js/sdk';

// Simple Routing Agent Capabilities
export const simpleRoutingCapabilities: AgentCapabilities = {
  streaming: false,
  pushNotifications: false,
};

// Simple Routing Agent Skills
export const simpleRoutingSkills: AgentSkill[] = [
  {
    id: "route_intent",
    name: "Route Intent",
    description: "Determine user intent and route to the appropriate sub-agent.",
    tags: ['router', 'core']
  }
];

// Simple Routing Agent Configuration
export const simpleRoutingConfig: AgentConfig = {
  name: "Simple Routing Agent",
  shortname: "router",
  description: "Routes user input to the appropriate sub-agent based on intent.",
  version: "1.0.0",
  routePrefix: "/simple/routing",
  capabilities: simpleRoutingCapabilities,
  skills: simpleRoutingSkills,
  securitySchemes: {
    "weos": {
      type: "openIdConnect",
      openIdConnectUrl: process.env.OPENID_CONNECT_URL
    }
  },
  security: [
    {
      "weos": ["openid", "email", "read"]
    }
  ],
  defaultInputModes: ["application/json", "text/plain"],
  defaultOutputModes: ["application/json"],
  supportsAuthenticatedExtendedCard: false
}; 