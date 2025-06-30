import { useResourcesStore } from '~/stores/resources'
import { ApiService } from '~/services/api'
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

export interface ResourceStateUpdate {
  node: string
  state: {
    workspace: WorkspaceResource | null
    ideas: WorkspaceResource[]
    problems: ProblemResource[]
    customers: CustomerResource[]
    products: ProductResource[]
    features: FeatureResource[]
    jobs: JobResource[]
    pains: PainResource[]
    gains: GainResource[]
    relationships: RelationshipResource[]
    currentResource: any
    lastAction: string | null
    lastMessage: string | null
  }
}

export interface WorkspaceState {
  workspace: WorkspaceResource | null
  ideas: IdeaResource[]
  problems: ProblemResource[]
  customers: CustomerResource[]
  products: ProductResource[]
  features: FeatureResource[]
  jobs: JobResource[]
  pains: PainResource[]
  gains: GainResource[]
  relationships: RelationshipResource[]
  currentResource: any
  lastAction: string | null
  lastMessage: string | null
  messages: any[]
}

export class ResourceSyncService {
  private resourcesStore = useResourcesStore()
  private apiService = new ApiService()

  /**
   * Load initial state from server and sync to frontend store
   */
  async loadInitialState(workspaceId: string = 'ws-001'): Promise<WorkspaceState> {
    try {
      // Clear existing resources first
      this.clearResources()
      
      // Fetch state from server
      const state = await this.apiService.getWorkspaceState(workspaceId)
      
      // Sync the state to frontend store
      this.syncState(state)
      
      return state
    } catch (error) {
      console.error('Failed to load initial state:', error)
      throw error
    }
  }

  /**
   * Sync a complete state object to the frontend store
   */
  syncState(state: WorkspaceState): void {
    // Sync workspace
    if (state.workspace) {
      this.resourcesStore.addResource(state.workspace)
      this.resourcesStore.setCurrentWorkspace(state.workspace)
    }

    // Sync all resource arrays
    if (state.ideas && state.ideas.length > 0) {
      state.ideas.forEach(idea => this.resourcesStore.addResource(idea))
    }

    if (state.problems && state.problems.length > 0) {
      state.problems.forEach(problem => this.resourcesStore.addResource(problem))
    }

    if (state.customers && state.customers.length > 0) {
      state.customers.forEach(customer => this.resourcesStore.addResource(customer))
    }

    if (state.products && state.products.length > 0) {
      state.products.forEach(product => this.resourcesStore.addResource(product))
    }

    if (state.features && state.features.length > 0) {
      state.features.forEach(feature => this.resourcesStore.addResource(feature))
    }

    if (state.jobs && state.jobs.length > 0) {
      state.jobs.forEach(job => this.resourcesStore.addResource(job))
    }

    if (state.pains && state.pains.length > 0) {
      state.pains.forEach(pain => this.resourcesStore.addResource(pain))
    }

    if (state.gains && state.gains.length > 0) {
      state.gains.forEach(gain => this.resourcesStore.addResource(gain))
    }

    // Sync relationships
    if (state.relationships && state.relationships.length > 0) {
      state.relationships.forEach(relationship => this.resourcesStore.addResource(relationship))
    }

    // Set current resource if available
    if (state.currentResource) {
      this.resourcesStore.addResource(state.currentResource)
    }
  }

  /**
   * Sync resources from LangGraph state update
   */
  syncResources(update: ResourceStateUpdate): void {
    const { state } = update

    // Sync workspace
    if (state.workspace) {
      this.resourcesStore.addResource(state.workspace)
      this.resourcesStore.setCurrentWorkspace(state.workspace)
    }

    // Sync all resource arrays
    if (state.ideas && state.ideas.length > 0) {
      state.ideas.forEach(idea => this.resourcesStore.addResource(idea))
    }

    if (state.problems && state.problems.length > 0) {
      state.problems.forEach(problem => this.resourcesStore.addResource(problem))
    }

    if (state.customers && state.customers.length > 0) {
      state.customers.forEach(customer => this.resourcesStore.addResource(customer))
    }

    if (state.products && state.products.length > 0) {
      state.products.forEach(product => this.resourcesStore.addResource(product))
    }

    if (state.features && state.features.length > 0) {
      state.features.forEach(feature => this.resourcesStore.addResource(feature))
    }

    if (state.jobs && state.jobs.length > 0) {
      state.jobs.forEach(job => this.resourcesStore.addResource(job))
    }

    if (state.pains && state.pains.length > 0) {
      state.pains.forEach(pain => this.resourcesStore.addResource(pain))
    }

    if (state.gains && state.gains.length > 0) {
      state.gains.forEach(gain => this.resourcesStore.addResource(gain))
    }

    // Sync relationships
    if (state.relationships && state.relationships.length > 0) {
      state.relationships.forEach(relationship => this.resourcesStore.addResource(relationship))
    }

    // Set current resource if available
    if (state.currentResource) {
      this.resourcesStore.addResource(state.currentResource)
    }
  }

  /**
   * Get current state from frontend store
   */
  getCurrentState() {
    return {
      workspace: this.resourcesStore.currentWorkspace,
      ideas: this.resourcesStore.ideas,
      problems: this.resourcesStore.problems,
      customers: this.resourcesStore.customers,
      products: this.resourcesStore.products,
      features: this.resourcesStore.features,
      jobs: this.resourcesStore.jobs,
      pains: this.resourcesStore.pains,
      gains: this.resourcesStore.gains,
      relationships: this.resourcesStore.relationships
    }
  }

  /**
   * Clear all resources (useful for workspace switching)
   */
  clearResources(): void {
    // Get all resource IDs and delete them individually
    const resourceIds = Array.from(this.resourcesStore.resources.keys())
    resourceIds.forEach(id => {
      this.resourcesStore.deleteResource(id)
    })
    this.resourcesStore.setCurrentWorkspace(null)
  }
} 