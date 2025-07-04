import type { AgentConfig } from '../../types/agent';
// @ts-ignore
import { AgentCapabilities, AgentSkill } from '@a2a-js/sdk';

// Problem Agent Capabilities
export const problemAgentCapabilities: AgentCapabilities = {
  streaming: false,
  pushNotifications: false,
};

// Problem Agent Skills
export const problemAgentSkills: AgentSkill[] = [
  {
    id: "manage_problem",
    name: "Manage Problem",
    description: "Add problems that your ideas solves to the workspace",
    tags: ['problem', 'core','bmc']
  }
];

// Problem Agent Configuration
export const problemAgentConfig: AgentConfig = {
  name: "Problem Agent",
  shortname: "problem",
  description: "Add problems that your ideas solves to the workspace",
  version: "1.0.0",
  routePrefix: "/problem",
  capabilities: problemAgentCapabilities,
  skills: problemAgentSkills,
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