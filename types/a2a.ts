// A2A (Agent-to-Agent) types for compatibility

// @ts-ignore
import { AgentProvider, AgentSkill, AgentCapabilities, SecurityScheme } from "@a2a-js/sdk";

/**
 * An AgentCard conveys key information:
 * - Overall details (version, name, description, uses)
 * - Skills: A set of capabilities the agent can perform
 * - Default modalities/content types supported by the agent.
 * - Authentication requirements
 *
 * This interface was referenced by `MySchema`'s JSON-Schema
 * via the `definition` "AgentCard".
 */
export interface AgentCard {
    capabilities: AgentCapabilities;
    /**
     * The set of interaction modes that the agent supports across all skills. This can be overridden per-skill.
     * Supported media types for input.
     */
    defaultInputModes: string[];
    /**
     * Supported media types for output.
     */
    defaultOutputModes: string[];
    /**
     * A human-readable description of the agent. Used to assist users and
     * other agents in understanding what the agent can do.
     */
    description: string;
    /**
     * A URL to documentation for the agent.
     */
    documentationUrl?: string;
    /**
     * A URL to an icon for the agent.
     */
    iconUrl?: string;
    /**
     * Human readable name of the agent.
     */
    name: string;
    provider?: AgentProvider;
    /**
     * Security requirements for contacting the agent.
     */
    security?: {
      [k: string]: string[];
    }[];
    /**
     * Security scheme details used for authenticating with this agent.
     */
    securitySchemes?: {
      [k: string]: SecurityScheme;
    };
    /**
     * Skills are a unit of capability that an agent can perform.
     */
    skills: AgentSkill[];
    /**
     * true if the agent supports providing an extended agent card when the user is authenticated.
     * Defaults to false if not specified.
     */
    supportsAuthenticatedExtendedCard?: boolean;
    /**
     * A URL to the address the agent is hosted at.
     */
    url: string;
    /**
     * The version of the agent - format is up to the provider.
     */
    version: string;
    defaultPrompt?: string;
}

// JSON-RPC request/response types
export interface JsonRpcRequest {
  jsonrpc: string;
  method: string;
  params?: any;
  id?: string | number;
}

export interface JsonRpcResponse {
  jsonrpc: string;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
  id?: string | number;
} 