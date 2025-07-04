import { BaseMessage } from "@langchain/core/messages";
import { StateGraph, MessagesAnnotation, Annotation } from "@langchain/langgraph";
import type { 
  WorkspaceResource,
  IdeaResource,
  ProblemResource,
  CustomerResource,
  ProductResource,
  FeatureResource,
  JobResource,
  PainResource,
  GainResource,
  RelationshipResource,
  BaseResource
} from '~/types/resources'
import { Event } from '../types/event';
import { AgentGraphError } from '../types/error';

/**
 * WorkspaceState represents the complete state of a workspace
 * for the LangGraph JS agent to operate on using annotation-based state management
 */
export const WorkspaceState = Annotation.Root({
  isGlobalState: Annotation<boolean>({
    reducer: (x: boolean, y: boolean) => y, // Latest value wins
    default: () => true,
  }),
  // Chat conversation history using LangChain's BaseMessage
  messages: Annotation<BaseMessage[]>({
    reducer: (x: BaseMessage[], y: BaseMessage[]) => x.concat(y),
    default: () => [],
  }),
  
  events: Annotation<Event[]>({
      reducer: (x: Event[], y: Event[]) => x.concat(y),
      default: () => [],
  }),

  error: Annotation<AgentGraphError | null>({
      reducer: (x: AgentGraphError | null, y: AgentGraphError | null) => y,
      default: () => null,
  }),

  // Track the routes taken by the agent as RouteState objects
  routes: Annotation<RoutingStateType[]>({
      reducer: (x: RoutingStateType[], y: RoutingStateType[]) => x.concat(y),
      default: () => [],
  }),

  // Current workspace context
  workspace: Annotation<WorkspaceResource | null>({
    reducer: (x: WorkspaceResource | null, y: WorkspaceResource | null) => y, // Latest value wins
    default: () => null,
  }),
  
  currentResource: Annotation<BaseResource | null>({
    reducer: (x: BaseResource | null, y: BaseResource | null) => y, // Latest value wins
    default: () => null,
  }),

  // All entities in the workspace
  ideas: Annotation<IdeaResource[]>({
    reducer: (x: IdeaResource[], y: IdeaResource[]) => x.concat(y),
    default: () => [],
  }),
  
  problems: Annotation<ProblemResource[]>({
    reducer: (x: ProblemResource[], y: ProblemResource[]) => x.concat(y),
    default: () => [],
  }),
  
  customers: Annotation<CustomerResource[]>({
    reducer: (x: CustomerResource[], y: CustomerResource[]) => x.concat(y),
    default: () => [],
  }),
  
  products: Annotation<ProductResource[]>({
    reducer: (x: ProductResource[], y: ProductResource[]) => x.concat(y),
    default: () => [],
  }),
  
  features: Annotation<FeatureResource[]>({
    reducer: (x: FeatureResource[], y: FeatureResource[]) => x.concat(y),
    default: () => [],
  }),
  
  jobs: Annotation<JobResource[]>({
    reducer: (x: JobResource[], y: JobResource[]) => x.concat(y),
    default: () => [],
  }),
  
  pains: Annotation<PainResource[]>({
    reducer: (x: PainResource[], y: PainResource[]) => x.concat(y),
    default: () => [],
  }),
  
  gains: Annotation<GainResource[]>({
    reducer: (x: GainResource[], y: GainResource[]) => x.concat(y),
    default: () => [],
  }),
  
  // Relationships between entities
  relationships: Annotation<RelationshipResource[]>({
    reducer: (x: RelationshipResource[], y: RelationshipResource[]) => x.concat(y),
    default: () => [],
  }),
  
  // Agent state
  isProcessing: Annotation<boolean>({
    reducer: (x: boolean, y: boolean) => y, // Latest value wins
    default: () => false,
  }),
  
  lastAction: Annotation<string | null>({
    reducer: (x: string | null, y: string | null) => y, // Latest value wins
    default: () => null,
  }),
  
  selectedEntityIds: Annotation<string[]>({
    reducer: (x: string[], y: string[]) => y, // Latest selection wins
    default: () => [],
  }),
  
  // Context for entity creation
  entityCreationContext: Annotation<{
    targetEntityId?: string
    suggestedRelationshipType?: string
    pendingEntityType?: string
  }>({
    reducer: (x: any, y: any) => ({ ...x, ...y }), // Merge objects
    default: () => ({}),
  }),
  
  // Analysis results
  insights: Annotation<{
    problemSolutionFit: number
    customerProblemFit: number
    featureCompleteness: number
    relationshipDensity: number
  }>({
    reducer: (x: any, y: any) => ({ ...x, ...y }), // Merge objects
    default: () => ({
      problemSolutionFit: 0,
      customerProblemFit: 0,
      featureCompleteness: 0,
      relationshipDensity: 0
    }),
  }),
})

// Type alias for the state type
export type WorkspaceStateType = typeof WorkspaceState.State;

/**
 * Initial state factory for WorkspaceState
 */
export function createInitialWorkspaceState() {
  return {
    messages: [],
    workspace: null,
    currentIdea: null,
    ideas: [],
    problems: [],
    customers: [],
    products: [],
    features: [],
    jobs: [],
    pains: [],
    gains: [],
    relationships: [],
    isProcessing: false,
    lastAction: null,
    selectedEntityIds: [],
    entityCreationContext: {},
    insights: {
      problemSolutionFit: 0,
      customerProblemFit: 0,
      featureCompleteness: 0,
      relationshipDensity: 0
    }
  }
}

/**
 * State update helpers for the LangGraph agent
 * These functions now work with the annotation-based state
 */
export class WorkspaceStateManager {
  /**
   * Add a message to the conversation history
   */
  static addMessage(state: any, message: BaseMessage) {
    return {
      messages: [message]
    }
  }

  /**
   * Set the current workspace
   */
  static setWorkspace(state: any, workspace: WorkspaceResource) {
    return {
      workspace,
      // Reset current idea when workspace changes
      currentIdea: null
    }
  }

  /**
   * Set the current idea
   */
  static setCurrentIdea(state: any, idea: IdeaResource) {
    return {
      currentIdea: idea
    }
  }

  /**
   * Add an entity to the appropriate collection
   */
  static addEntity(state: any, entity: any) {
    switch (entity['@type']) {
      case 'ideanation:Idea':
        return { ideas: [entity as IdeaResource] }
      case 'ideanation:Problem':
        return { problems: [entity as ProblemResource] }
      case 'ideanation:Customer':
        return { customers: [entity as CustomerResource] }
      case 'ideanation:Product':
        return { products: [entity as ProductResource] }
      case 'ideanation:Feature':
        return { features: [entity as FeatureResource] }
      case 'ideanation:Job':
        return { jobs: [entity as JobResource] }
      case 'ideanation:Pain':
        return { pains: [entity as PainResource] }
      case 'ideanation:Gain':
        return { gains: [entity as GainResource] }
      default:
        return {}
    }
  }

  /**
   * Add a relationship
   */
  static addRelationship(state: any, relationship: RelationshipResource) {
    return {
      relationships: [relationship]
    }
  }

  /**
   * Update entity selection
   */
  static setSelectedEntities(state: any, entityIds: string[]) {
    return {
      selectedEntityIds: entityIds
    }
  }

  /**
   * Set processing state
   */
  static setProcessing(state: any, isProcessing: boolean) {
    return {
      isProcessing
    }
  }

  /**
   * Set last action
   */
  static setLastAction(state: any, action: string) {
    return {
      lastAction: action
    }
  }

  /**
   * Update entity creation context
   */
  static setEntityCreationContext(
    state: any, 
    context: Partial<{
      targetEntityId?: string
      suggestedRelationshipType?: string
      pendingEntityType?: string
    }>
  ) {
    return {
      entityCreationContext: context
    }
  }

  /**
   * Update insights
   */
  static updateInsights(
    state: any, 
    insights: Partial<{
      problemSolutionFit: number
      customerProblemFit: number
      featureCompleteness: number
      relationshipDensity: number
    }>
  ) {
    return {
      insights
    }
  }

  /**
   * Add export history entry
   */
  static addExportHistory(
    state: any, 
    exportEntry: {
      timestamp: Date
      type: string
      format: string
      success: boolean
    }
  ) {
    return {
      exportHistory: [exportEntry]
    }
  }

  /**
   * Get all entities as a flat array for analysis
   */
  static getAllEntities(state: any): Array<any> {
    return [
      ...(state.ideas || []),
      ...(state.problems || []),
      ...(state.customers || []),
      ...(state.products || []),
      ...(state.features || []),
      ...(state.jobs || []),
      ...(state.pains || []),
      ...(state.gains || [])
    ]
  }

  /**
   * Find entity by ID across all collections
   */
  static findEntityById(state: any, entityId: string): any | null {
    const allEntities = WorkspaceStateManager.getAllEntities(state)
    return allEntities.find(entity => entity['@id'] === entityId || entity.id === entityId) || null
  }

  /**
   * Get entities related to a specific entity
   */
  static getRelatedEntities(
    state: any, 
    entityId: string, 
    relationshipType?: string
  ): Array<{ entity: any, relationship: RelationshipResource }> {
    const relatedPairs: Array<{ entity: any, relationship: RelationshipResource }> = []
    const relationships = state.relationships || []
    
    relationships.forEach((relationship: RelationshipResource) => {
      if (relationshipType && relationship.relationshipType !== relationshipType) {
        return
      }
      
      let relatedEntityId: string | null = null
      
      if (relationship.sourceId === entityId) {
        relatedEntityId = relationship.targetId
      } else if (relationship.targetId === entityId) {
        relatedEntityId = relationship.sourceId
      }
      
      if (relatedEntityId) {
        const relatedEntity = WorkspaceStateManager.findEntityById(state, relatedEntityId)
        if (relatedEntity) {
          relatedPairs.push({ entity: relatedEntity, relationship })
        }
      }
    })
    
    return relatedPairs
  }

  /**
   * Calculate workspace statistics
   */
  static getWorkspaceStats(state: any): {
    totalEntities: number
    totalRelationships: number
    entitiesByType: Record<string, number>
    avgRelationshipsPerEntity: number
  } {
    const allEntities = WorkspaceStateManager.getAllEntities(state)
    const entitiesByType: Record<string, number> = {}
    
    allEntities.forEach(entity => {
      const type = entity['@type']
      entitiesByType[type] = (entitiesByType[type] || 0) + 1
    })
    
    const totalRelationships = (state.relationships || []).length
    
    return {
      totalEntities: allEntities.length,
      totalRelationships,
      entitiesByType,
      avgRelationshipsPerEntity: allEntities.length > 0 
        ? (totalRelationships * 2) / allEntities.length 
        : 0
    }
  }

  /**
   * Validate state consistency
   */
  static validateState(state: any): { isValid: boolean, errors: string[] } {
    const errors: string[] = []
    
    // Check if current idea exists in ideas array
    if (state.currentIdea && !(state.ideas || []).find((idea: any) => idea['@id'] === state.currentIdea!['@id'])) {
      errors.push('Current idea not found in ideas array')
    }
    
    // Check if all relationship targets exist
    const allEntityIds = WorkspaceStateManager.getAllEntities(state).map((e: any) => e['@id'])
    const relationships = state.relationships || []
    relationships.forEach((rel: RelationshipResource) => {
      if (!allEntityIds.includes(rel.sourceId)) {
        errors.push(`Relationship source ${rel.sourceId} not found`)
      }
      if (!allEntityIds.includes(rel.targetId)) {
        errors.push(`Relationship target ${rel.targetId} not found`)
      }
    })
    
    // Check if selected entities exist
    const selectedIds = state.selectedEntityIds || []
    selectedIds.forEach((id: string) => {
      if (!WorkspaceStateManager.findEntityById(state, id)) {
        errors.push(`Selected entity ${id} not found`)
      }
    })
    
    return {
      isValid: errors.length === 0,
      errors
    }
  }
}

/**
 * Type guards for state validation
 */
export function isWorkspaceState(obj: any): boolean {
  return (
    obj &&
    Array.isArray(obj.messages) &&
    Array.isArray(obj.ideas) &&
    Array.isArray(obj.problems) &&
    Array.isArray(obj.customers) &&
    Array.isArray(obj.products) &&
    Array.isArray(obj.features) &&
    Array.isArray(obj.jobs) &&
    Array.isArray(obj.pains) &&
    Array.isArray(obj.gains) &&
    Array.isArray(obj.relationships) &&
    typeof obj.isProcessing === 'boolean' &&
    Array.isArray(obj.selectedEntityIds) &&
    typeof obj.entityCreationContext === 'object' &&
    typeof obj.insights === 'object' &&
    Array.isArray(obj.exportHistory)
  )
}


// Shared RoutingState for routing agents
export const RoutingState = Annotation.Root({
  input: Annotation<string>({
    reducer: (_: string, update: string) => update,
    default: () => "",
  }),
  route: Annotation<string | undefined>({
    reducer: (_: string | undefined, update: string | undefined) => update,
    default: () => undefined,
  }),
  explanation: Annotation<string | undefined>({
    reducer: (_: string | undefined, update: string | undefined) => update,
    default: () => undefined,
  }),
  nextInput: Annotation<string | undefined>({
    reducer: (_: string | undefined, update: string | undefined) => update,
    default: () => undefined,
  }),
  nextInputData: Annotation<any>({
    reducer: (_: any, update: any) => update,
    default: () => undefined,
  }),
});

export type RoutingStateType = typeof RoutingState.State; 