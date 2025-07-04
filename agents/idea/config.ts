import type { AgentConfig } from '../../types/agent';
// @ts-ignore
import { AgentCapabilities, AgentSkill } from '@a2a-js/sdk';

// Idea Agent Capabilities
export const ideaAgentCapabilities: AgentCapabilities = {
  streaming: false,
  pushNotifications: false,
};

// Idea Agent Skills
export const ideaAgentSkills: AgentSkill[] = [
  {
    id: "manage_idea",
    name: "Manage Idea",
    description: "Add and manage ideas in the workspace",
    tags: ['idea', 'core','bmc']
  }
];

// Idea Agent Configuration
export const ideaAgentConfig: AgentConfig = {
  name: "Idea Agent",
  shortname: "idea",
  description: "Add and manage ideas in the workspace",
  version: "1.0.0",
  routePrefix: "/idea",
  capabilities: ideaAgentCapabilities,
  skills: ideaAgentSkills,
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