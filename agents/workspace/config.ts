import type { AgentConfig } from '../../types/agent';
// @ts-ignore
import { AgentCapabilities, AgentSkill } from '@a2a-js/sdk';

// Workspace Agent Capabilities
export const workspaceAgentCapabilities: AgentCapabilities = {
  streaming: false,
  pushNotifications: false,
};

// Workspace Agent Skills
export const workspaceAgentSkills: AgentSkill[] = [
  {
    id: "manage_workspace",
    name: "Manage Workspace",
    description: "Add and manage workspaces and their entities",
    tags: ['workspace', 'core','bmc']
  }
];

// Workspace Agent Configuration
export const workspaceAgentConfig: AgentConfig = {
  name: "Workspace Agent",
  shortname: "workspace",
  description: "Add and manage workspaces and their entities",
  version: "1.0.0",
  routePrefix: "/workspace",
  capabilities: workspaceAgentCapabilities,
  skills: workspaceAgentSkills,
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