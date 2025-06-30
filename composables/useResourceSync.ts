import { ResourceSyncService, type ResourceStateUpdate, type WorkspaceState } from '~/services/resourceSync'
import { useResourcesStore } from '~/stores/resources'

export const useResourceSync = () => {
  const resourceSync = new ResourceSyncService()
  const resourcesStore = useResourcesStore()

  /**
   * Load initial state from server and sync to frontend store
   */
  const loadInitialState = async (workspaceId: string = 'ws-001'): Promise<WorkspaceState> => {
    return await resourceSync.loadInitialState(workspaceId)
  }

  /**
   * Sync resources from LangGraph state update
   */
  const syncFromLangGraph = (update: ResourceStateUpdate) => {
    resourceSync.syncResources(update)
  }

  /**
   * Sync a complete state object
   */
  const syncState = (state: WorkspaceState) => {
    resourceSync.syncState(state)
  }

  /**
   * Get current state for sending to LangGraph
   */
  const getCurrentState = () => {
    return resourceSync.getCurrentState()
  }

  /**
   * Clear all resources (useful for workspace switching)
   */
  const clearAllResources = () => {
    resourceSync.clearResources()
  }

  /**
   * Watch for resource changes and sync to LangGraph if needed
   */
  const watchResources = () => {
    // This could be used to sync frontend changes back to LangGraph
    // For now, we're primarily syncing from LangGraph to frontend
    watch(() => resourcesStore.resources, (newResources) => {
      console.log('Resources updated:', newResources.size)
    }, { deep: true })
  }

  /**
   * Initialize resource sync for a new workspace
   */
  const initializeWorkspace = async (workspaceId: string) => {
    clearAllResources()
    await loadInitialState(workspaceId)
  }

  return {
    loadInitialState,
    syncFromLangGraph,
    syncState,
    getCurrentState,
    clearAllResources,
    watchResources,
    initializeWorkspace,
    resourcesStore
  }
} 