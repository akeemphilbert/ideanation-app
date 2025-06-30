import { useResourceSync } from '~/composables/useResourceSync'
import { useChatStore } from '~/stores/chat'

export const useCanvasInit = () => {
  const { loadInitialState, resourcesStore } = useResourceSync()
  const chatStore = useChatStore()
  
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Initialize the canvas with the latest state
   */
  const initializeCanvas = async (state: any) => {
    isLoading.value = true
    error.value = null
    
    try {
      console.log('🔄 Initializing canvas...')

      
      // If there are messages in the state, load them into chat
      if (state.messages && state.messages.length > 0) {
        // Convert LangChain messages to chat messages
        state.messages.forEach((msg: any) => {
          if (msg.id.length > 2 && msg.id[2] === 'HumanMessage') {
            chatStore.addMessage({
              type: 'user',
              content: msg.kwargs?.content
            })
          } else {
            chatStore.addMessage({
              type: 'ai',
              content: msg.content
            })
          }
        })
      }
      
      console.log('✅ Canvas initialized successfully', {
        workspace: state.workspace?.title,
        ideas: state.ideas.length,
        problems: state.problems.length,
        customers: state.customers.length,
        products: state.products.length,
        features: state.features.length,
        jobs: state.jobs.length,
        pains: state.pains.length,
        gains: state.gains.length,
        relationships: state.relationships.length
      })
      
      return state
      
    } catch (err) {
      console.error('❌ Failed to initialize canvas:', err)
      error.value = err instanceof Error ? err.message : 'Failed to load workspace state'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Check if canvas has been initialized with data
   */
  const isCanvasInitialized = computed(() => {
    return resourcesStore.resources.size > 0
  })

  /**
   * Get initialization status
   */
  const getInitStatus = () => {
    return {
      isLoading: isLoading.value,
      error: error.value,
      isInitialized: isCanvasInitialized.value,
      resourceCount: resourcesStore.resources.size
    }
  }

  return {
    initializeCanvas,
    isLoading: readonly(isLoading),
    error: readonly(error),
    isCanvasInitialized,
    getInitStatus
  }
} 