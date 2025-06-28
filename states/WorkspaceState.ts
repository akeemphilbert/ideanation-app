import { BaseMessage } from "@langchain/core/messages";
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
  RelationshipResource
} from '~/types/resources'

/**
 * WorkspaceState represents the complete state of a workspace
 * for the LangGraph JS agent to operate on
 */
export interface WorkspaceState {
  // Chat conversation history using LangChain's BaseMessage
  messages: BaseMessage[]
  
  // Current workspace context
  workspace: WorkspaceResource | null
  currentIdea: IdeaResource | null
  
  // All entities in the workspace
  ideas: IdeaResource[]
  problems: ProblemResource[]
  customers: CustomerResource[]
  products: ProductResource[]
  features: FeatureResource[]
  jobs: JobResource[]
  pains: PainResource[]
  gains: GainResource[]
  
  // Relationships between entities
  relationships: RelationshipResource[]
  
  // Agent state
  isProcessing: boolean
  lastAction: string | null
  selectedEntityIds: string[]
  
  // Context for entity creation
  entityCreationContext: {
    targetEntityId?: string
    suggestedRelationshipType?: string
    pendingEntityType?: string
  }
  
  // Analysis results
  insights: {
    problemSolutionFit: number
    customerProblemFit: number
    featureCompleteness: number
    relationshipDensity: number
  }
  
  // Export state
  exportHistory: Array<{
    timestamp: Date
    type: string
    format: string
    success: boolean
  }>
}

/**
 * Initial state factory for WorkspaceState
 */
export function createInitialWorkspaceState(): WorkspaceState {
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
    },
    exportHistory: []
  }
}

/**
 * State update helpers for the LangGraph agent
 */
export class WorkspaceStateManager {
  /**
   * Add a message to the conversation history
   */
  static addMessage(state: WorkspaceState, message: BaseMessage): WorkspaceState {
    return {
      ...state,
      messages: [...state.messages, message]
    }
  }

  /**
   * Set the current workspace
   */
  static setWorkspace(state: WorkspaceState, workspace: WorkspaceResource): WorkspaceState {
    return {
      ...state,
      workspace,
      // Reset current idea when workspace changes
      currentIdea: null
    }
  }

  /**
   * Set the current idea
   */
  static setCurrentIdea(state: WorkspaceState, idea: IdeaResource): WorkspaceState {
    return {
      ...state,
      currentIdea: idea
    }
  }

  /**
   * Add an entity to the appropriate collection
   */
  static addEntity(state: WorkspaceState, entity: any): WorkspaceState {
    const newState = { ...state }
    
    switch (entity['@type']) {
      case 'ideanation:Idea':
        newState.ideas = [...state.ideas, entity as IdeaResource]
        break
      case 'ideanation:Problem':
        newState.problems = [...state.problems, entity as ProblemResource]
        break
      case 'ideanation:Customer':
        newState.customers = [...state.customers, entity as CustomerResource]
        break
      case 'ideanation:Product':
        newState.products = [...state.products, entity as ProductResource]
        break
      case 'ideanation:Feature':
        newState.features = [...state.features, entity as FeatureResource]
        break
      case 'ideanation:Job':
        newState.jobs = [...state.jobs, entity as JobResource]
        break
      case 'ideanation:Pain':
        newState.pains = [...state.pains, entity as PainResource]
        break
      case 'ideanation:Gain':
        newState.gains = [...state.gains, entity as GainResource]
        break
    }
    
    return newState
  }

  /**
   * Add a relationship
   */
  static addRelationship(state: WorkspaceState, relationship: RelationshipResource): WorkspaceState {
    return {
      ...state,
      relationships: [...state.relationships, relationship]
    }
  }

  /**
   * Update entity selection
   */
  static setSelectedEntities(state: WorkspaceState, entityIds: string[]): WorkspaceState {
    return {
      ...state,
      selectedEntityIds: entityIds
    }
  }

  /**
   * Set processing state
   */
  static setProcessing(state: WorkspaceState, isProcessing: boolean): WorkspaceState {
    return {
      ...state,
      isProcessing
    }
  }

  /**
   * Set last action
   */
  static setLastAction(state: WorkspaceState, action: string): WorkspaceState {
    return {
      ...state,
      lastAction: action
    }
  }

  /**
   * Update entity creation context
   */
  static setEntityCreationContext(
    state: WorkspaceState, 
    context: Partial<WorkspaceState['entityCreationContext']>
  ): WorkspaceState {
    return {
      ...state,
      entityCreationContext: {
        ...state.entityCreationContext,
        ...context
      }
    }
  }

  /**
   * Update insights
   */
  static updateInsights(
    state: WorkspaceState, 
    insights: Partial<WorkspaceState['insights']>
  ): WorkspaceState {
    return {
      ...state,
      insights: {
        ...state.insights,
        ...insights
      }
    }
  }

  /**
   * Add export history entry
   */
  static addExportHistory(
    state: WorkspaceState, 
    exportEntry: WorkspaceState['exportHistory'][0]
  ): WorkspaceState {
    return {
      ...state,
      exportHistory: [...state.exportHistory, exportEntry]
    }
  }

  /**
   * Get all entities as a flat array for analysis
   */
  static getAllEntities(state: WorkspaceState): Array<any> {
    return [
      ...state.ideas,
      ...state.problems,
      ...state.customers,
      ...state.products,
      ...state.features,
      ...state.jobs,
      ...state.pains,
      ...state.gains
    ]
  }

  /**
   * Find entity by ID across all collections
   */
  static findEntityById(state: WorkspaceState, entityId: string): any | null {
    const allEntities = WorkspaceStateManager.getAllEntities(state)
    return allEntities.find(entity => entity['@id'] === entityId || entity.id === entityId) || null
  }

  /**
   * Get entities related to a specific entity
   */
  static getRelatedEntities(
    state: WorkspaceState, 
    entityId: string, 
    relationshipType?: string
  ): Array<{ entity: any, relationship: RelationshipResource }> {
    const relatedPairs: Array<{ entity: any, relationship: RelationshipResource }> = []
    
    state.relationships.forEach(relationship => {
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
  static getWorkspaceStats(state: WorkspaceState): {
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
    
    return {
      totalEntities: allEntities.length,
      totalRelationships: state.relationships.length,
      entitiesByType,
      avgRelationshipsPerEntity: allEntities.length > 0 
        ? (state.relationships.length * 2) / allEntities.length 
        : 0
    }
  }

  /**
   * Validate state consistency
   */
  static validateState(state: WorkspaceState): { isValid: boolean, errors: string[] } {
    const errors: string[] = []
    
    // Check if current idea exists in ideas array
    if (state.currentIdea && !state.ideas.find(idea => idea['@id'] === state.currentIdea!['@id'])) {
      errors.push('Current idea not found in ideas array')
    }
    
    // Check if all relationship targets exist
    const allEntityIds = WorkspaceStateManager.getAllEntities(state).map(e => e['@id'])
    state.relationships.forEach(rel => {
      if (!allEntityIds.includes(rel.sourceId)) {
        errors.push(`Relationship source ${rel.sourceId} not found`)
      }
      if (!allEntityIds.includes(rel.targetId)) {
        errors.push(`Relationship target ${rel.targetId} not found`)
      }
    })
    
    // Check if selected entities exist
    state.selectedEntityIds.forEach(id => {
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
export function isWorkspaceState(obj: any): obj is WorkspaceState {
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