import { ApiService } from '~/services/api'

export interface WorkspaceSummary {
  id: string
  title: string
  description: string
  identifier: string
  created: Date
  updated: Date
  resourceCount: number
  lastActivity: Date | null
}

export interface WorkspaceListResponse {
  workspaces: WorkspaceSummary[]
  total: number
}


export const useWorkspaces = () => {
  const apiService = new ApiService()
  
  const workspaces = ref<WorkspaceSummary[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Fetch the list of workspaces for the current user
   */
  const fetchWorkspaces = async (token: string) => {
    isLoading.value = true
    error.value = null
    
    try {
      console.log('🔄 Fetching workspaces...')
      
      const response: WorkspaceListResponse = await apiService.getWorkspaceList(token)
      workspaces.value = response.workspaces
      
      console.log('✅ Workspaces fetched successfully', {
        total: response.total,
        workspaces: response.workspaces.map(w => w.title)
      })
      
      return response
      
    } catch (err) {
      console.error('❌ Failed to fetch workspaces:', err)
      error.value = err instanceof Error ? err.message : 'Failed to fetch workspaces'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Get a specific workspace by ID
   */
  const getWorkspaceById = (id: string): WorkspaceSummary | undefined => {
    return workspaces.value.find(w => w.id === id)
  }

  /**
   * Get a specific workspace by identifier
   */
  const getWorkspaceByIdentifier = (identifier: string): WorkspaceSummary | undefined => {
    return workspaces.value.find(w => w.identifier === identifier)
  }

  /**
   * Get the most recently active workspace
   */
  const getMostRecentWorkspace = (): WorkspaceSummary | undefined => {
    return workspaces.value[0] // Already sorted by last activity
  }

  /**
   * Check if a workspace exists
   */
  const workspaceExists = (id: string): boolean => {
    return workspaces.value.some(w => w.id === id)
  }

  /**
   * Get workspaces sorted by different criteria
   */
  const getWorkspacesByActivity = () => {
    return [...workspaces.value].sort((a, b) => {
      const aDate = a.lastActivity || a.updated
      const bDate = b.lastActivity || b.updated
      return bDate.getTime() - aDate.getTime()
    })
  }

  const getWorkspacesByCreation = () => {
    return [...workspaces.value].sort((a, b) => {
      return b.created.getTime() - a.created.getTime()
    })
  }

  const getWorkspacesByResourceCount = () => {
    return [...workspaces.value].sort((a, b) => {
      return b.resourceCount - a.resourceCount
    })
  }

  /**
   * Get workspace statistics
   */
  const getWorkspaceStats = () => {
    const total = workspaces.value.length
    const totalResources = workspaces.value.reduce((sum, w) => sum + w.resourceCount, 0)
    const avgResources = total > 0 ? Math.round(totalResources / total) : 0
    
    return {
      total,
      totalResources,
      avgResources,
      mostActive: getMostRecentWorkspace(),
      mostResources: getWorkspacesByResourceCount()[0]
    }
  }

  return {
    // State
    workspaces: readonly(workspaces),
    isLoading: readonly(isLoading),
    error: readonly(error),
    
    // Actions
    fetchWorkspaces,
    getWorkspaceById,
    getWorkspaceByIdentifier,
    getMostRecentWorkspace,
    workspaceExists,
    
    // Sorting
    getWorkspacesByActivity,
    getWorkspacesByCreation,
    getWorkspacesByResourceCount,
    
    // Statistics
    getWorkspaceStats
  }
} 