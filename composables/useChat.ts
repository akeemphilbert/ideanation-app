export const useChat = () => {
  const chatStore = useChatStore()

  const messages = computed(() => chatStore.messages)
  const isTyping = computed(() => chatStore.isTyping)

  const sendMessage = async (content: string) => {
    try {
      await chatStore.sendMessage(content)
    } catch (error) {
      console.error('Failed to send message:', error)
      throw error
    }
  }

  const applySuggestion = async (suggestion: any) => {
    const ideaStore = useIdeaStore()
    
    try {
      if (suggestion.type === 'component') {
        ideaStore.addComponent(suggestion.data)
      } else if (suggestion.type === 'relationship') {
        ideaStore.addRelationship(suggestion.data)
      }
      
      // Add confirmation message
      chatStore.addMessage({
        type: 'ai',
        content: `Great! I've added "${suggestion.title}" to your idea canvas.`
      })
    } catch (error) {
      console.error('Failed to apply suggestion:', error)
      chatStore.addMessage({
        type: 'ai',
        content: 'Sorry, I had trouble applying that suggestion. Please try again.'
      })
    }
  }

  const clearChat = () => {
    chatStore.clearMessages()
  }

  const getQuickPrompts = () => {
    return [
      "What problems does my idea solve?",
      "Who are my target customers?",
      "What features should I prioritize?",
      "How do these components connect?",
      "What are the potential pain points?",
      "Suggest some gain creators for my customers"
    ]
  }

  return {
    messages,
    isTyping,
    sendMessage,
    applySuggestion,
    clearChat,
    getQuickPrompts
  }
}