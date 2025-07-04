
import type { AgentCard } from './a2a';
// @ts-ignore
import { AgentCapabilities, AgentSkill, SecurityScheme } from '@a2a-js/sdk';
import type { AnnotationRoot } from "@langchain/langgraph";
import { StateGraph } from "@langchain/langgraph";


export interface AgentConfig {
  name: string;
  shortname?: string;
  description: string;
  version: string;
  routePrefix: string;
  capabilities: AgentCapabilities;
  skills: AgentSkill[];
  securitySchemes: Record<string, any>;
  security: Array<Record<string, string[]>>;
  defaultInputModes: string[];
  defaultOutputModes: string[];
  supportsAuthenticatedExtendedCard: boolean;
  defaultPrompt?: string;
}

export class Agent {
  private config: AgentConfig;
  private graphFactory: (agent: Agent, authToken?: string) => StateGraph<any>;
  private authToken?: string;
  private subAgents: Agent[] = [];
  private shortname: string;
  private defaultPrompt?: string;

  constructor(
    config: AgentConfig,
    graphFactory: (agent: Agent, authToken?: string) => StateGraph<any>,
    authToken?: string,
    shortname?: string,
    defaultPrompt?: string
  ) {
    this.config = config;
    this.graphFactory = graphFactory;
    this.authToken = authToken;
    this.shortname = shortname || config.shortname || config.name;
    this.defaultPrompt = defaultPrompt || config.defaultPrompt;
  }

  public getStateGraph(): StateGraph<any> {
    return this.graphFactory(this, this.authToken);
  }

  public getCompiledGraph(): any {
    return this.graphFactory(this, this.authToken).compile();
  }

  public async getGraph(): Promise<StateGraph<any>> {
    return this.graphFactory(this, this.authToken);
  }

  public getConfig(): AgentConfig {
    return this.config;
  }

  public getCapabilities(): AgentCapabilities {
    return this.config.capabilities;
  }

  public getSkills(): AgentSkill[] {
    // Combine this agent's skills with all sub-agents' skills
    const ownSkills = this.config.skills || [];
    const subAgentSkills = this.subAgents.flatMap(agent => agent.getSkills());
    // Optionally deduplicate by skill name or id if needed
    const allSkills = [...ownSkills, ...subAgentSkills];
    // Remove duplicates by skill name (customize as needed)
    const uniqueSkills = allSkills.filter((skill, index, self) =>
      index === self.findIndex(s => s.name === skill.name)
    );
    return uniqueSkills;
  }

  public setSkills(skills: AgentSkill[]): void {
    this.config.skills = skills;
  }

  private getAgentCard(): AgentCard {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    
    return {
      name: this.config.name,
      description: this.config.description,
      url: "",
      version: this.config.version,
      capabilities: this.config.capabilities,
      skills: this.config.skills,
      securitySchemes: this.config.securitySchemes,
      security: this.config.security,
      defaultInputModes: this.config.defaultInputModes,
      defaultOutputModes: this.config.defaultOutputModes,
      supportsAuthenticatedExtendedCard: this.config.supportsAuthenticatedExtendedCard
    };
  }
  /**
   * Stream the agent's response
   * @param body - The body of the request
   * @param config - The configuration for the stream
   * @returns A promise that resolves to an iterable readable stream
   */
  public stream(body: any, config?: Record<string, any>) {
    return this.getCompiledGraph().stream(
      body,
      config
    );
  }

  public getAuthToken(): string | undefined {
    return this.authToken;
  }

  /**
   * Add a sub-agent to this agent
   * @param agent - The sub-agent to add
   */
  public addSubAgent(agent: Agent): void {
    this.subAgents.push(agent);
  }

  /**
   * Remove a sub-agent from this agent
   * @param agent - The sub-agent to remove
   */
  public removeSubAgent(agent: Agent): void {
    this.subAgents = this.subAgents.filter(a => a !== agent);
  }

  /**
   * Get all sub-agents of this agent
   * @returns Array of sub-agents
   */
  public getSubAgents(): Agent[] {
    return this.subAgents;
  }

  public getShortname(): string {
    return this.shortname;
  }

  public getDefaultPrompt(): string | undefined {
    return this.defaultPrompt;
  }

  public setDefaultPrompt(prompt: string): void {
    this.defaultPrompt = prompt;
  }
}

export enum AgentType {
  CORE = 'core',
  PLUGIN = 'plugin',
  EXTERNAL = 'external'
}

export enum AgentStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ERROR = 'error',
  STARTING = 'starting',
  STOPPING = 'stopping'
}

// Additional agent configuration for different use cases
export interface AgentMetadata {
  id: string;
  name: string;
  type: AgentType;
  capabilities: string[];
} 