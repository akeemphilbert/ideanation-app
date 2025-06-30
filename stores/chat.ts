import { defineStore } from 'pinia'
import { ApiService } from '~/services/api'
import { useEntityParser } from '~/composables/useEntityParser'
import { useResourceSync } from '~/composables/useResourceSync'
import type { ResourceStateUpdate } from '~/services/resourceSync'

export interface ChatMessage {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  entityCreated?: {
    type: string
    title: string
    id: string
  }
  suggestions?: Array<{
    id: string
    title: string
    type: 'component' | 'relationship'
    data: any
  }>
}

export const useChatStore = defineStore('chat', () => {
  const messages = ref<ChatMessage[]>([])
  const isTyping = ref(false)
  const apiService = new ApiService()
  const { syncFromLangGraph } = useResourceSync()

  const addMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    }
    messages.value.push(newMessage)
    return newMessage
  }

  const updateMessage = (messageId: string, updates: Partial<ChatMessage>) => {
    const messageIndex = messages.value.findIndex(m => m.id === messageId)
    if (messageIndex !== -1) {
      messages.value[messageIndex] = { ...messages.value[messageIndex], ...updates }
    }
  }

  const setTyping = (typing: boolean) => {
    isTyping.value = typing
  }

  const sendMessage = async (content: string, selectedNodeId?: string) => {
    const entitiesStore = useEntitiesStore()
    const { processEntityText, looksLikeEntityCommand, getEntityHelp } = useEntityParser()
    
    // Check if we need to create an idea first
    if (!entitiesStore.currentIdea) {
      // This is the idea name
      addMessage({
        type: 'user',
        content
      })

      // Create the idea
      const idea = entitiesStore.createIdea({
        title: content,
        description: `Startup idea: ${content}`
      })
      
      entitiesStore.setCurrentIdea(idea)

      // Add AI response
      addMessage({
        type: 'ai',
        content: `Perfect! I've created your idea "${content}". Now let's start building it out. You can create entities by typing things like:

• problem: describe a problem your idea solves
• customer: describe your target customers  
• feature: describe a key feature
• pain: describe customer pain points
• gain: describe customer gains

What would you like to add first?`,
        entityCreated: {
          type: 'idea',
          title: content,
          id: idea.id
        }
      })

      return
    }
    
    // Check if this is an entity creation command
    const entityResult = processEntityText(content, selectedNodeId)
    
    if (entityResult.wasCreated && entityResult.entity && entityResult.parsed) {
      // Add user message with entity creation info
      addMessage({
        type: 'user',
        content,
        entityCreated: {
          type: entityResult.parsed.type,
          title: entityResult.parsed.title,
          id: entityResult.entity.id
        }
      })

      // Generate relationship message based on selected node
      let relationshipMessage = getRelationshipMessage(entityResult.parsed.type)
      if (selectedNodeId) {
        // Find the target entity in the appropriate collection
        const targetEntity = entitiesStore.ideas.find(e => e.id === selectedNodeId) ||
                           entitiesStore.problems.find(e => e.id === selectedNodeId) ||
                           entitiesStore.customers.find(e => e.id === selectedNodeId) ||
                           entitiesStore.products.find(e => e.id === selectedNodeId) ||
                           entitiesStore.features.find(e => e.id === selectedNodeId)
        
        if (targetEntity) {
          relationshipMessage = `I've linked it to "${targetEntity.title}".`
        }
      }

      // Add AI confirmation message
      addMessage({
        type: 'ai',
        content: `Great! I've created a new ${entityResult.parsed.type} called "${entityResult.parsed.title}" and added it to your idea canvas. ${relationshipMessage}`
      })

      return
    }

    // If it looks like an entity command but failed, provide help
    if (looksLikeEntityCommand(content) && !entityResult.wasCreated) {
      addMessage({
        type: 'user',
        content
      })

      addMessage({
        type: 'ai',
        content: `I noticed you're trying to create an entity, but there was an issue. ${getEntityHelp()}. Make sure to include some text after the colon!`
      })

      return
    }

    // Regular chat message processing with LangGraph
    addMessage({
      type: 'user',
      content
    })

    isTyping.value = true

    try {
      // Send message to LangGraph workflow
      const response = await apiService.sendMessageStream(content)
      
      // Process streaming response
      for await (const update of response) {
        if (update.node && update.state) {
          // Sync resources from LangGraph state
          syncFromLangGraph(update as ResourceStateUpdate)
          
          // Add AI message if there's a lastMessage
          if (update.state.lastMessage) {
            addMessage({
              type: 'ai',
              content: update.state.lastMessage
            })
          }
        }
      }
    } catch (error) {
      console.error('Failed to get AI response:', error)
      addMessage({
        type: 'ai',
        content: 'Sorry, I encountered an error. Please try again.'
      })
    } finally {
      isTyping.value = false
    }
  }

  const getRelationshipMessage = (entityType: string): string => {
    switch (entityType) {
      case 'problem':
        return "I've linked it to your current idea."
      case 'customer':
        return "I've linked it to your current idea."
      case 'product':
        return "I've linked it as an MVP for your current idea."
      case 'feature':
        return "I've linked it to your product."
      case 'job':
        return "I've linked it to your customers."
      case 'pain':
        return "I've linked it to your customers as something they experience."
      case 'gain':
        return "I've linked it to your customers as something they desire."
      default:
        return "I've added it to your canvas."
    }
  }

  const generateAIResponse = async (userMessage: string): Promise<{
    content: string
    suggestions?: Array<{
      id: string
      title: string
      type: 'component' | 'relationship'
      data: any
    }>
  }> => {
    // Mock AI responses based on keywords
    const lowerMessage = userMessage.toLowerCase()
    
    if (lowerMessage.includes('help') || lowerMessage.includes('how')) {
      const { getEntityHelp } = useEntityParser()
      return {
        content: `I can help you build your startup idea! ${getEntityHelp()}. You can also ask me about problems, customers, features, or how to connect different components.

**Tip:** Click on any node in the graph to select it, then create new entities that will automatically link to it!`
      }
    }
    
    if (lowerMessage.includes('problem') || lowerMessage.includes('issue')) {
      return {
        content: "Understanding problems is crucial for any startup. What specific problems are you trying to solve? You can create a problem by typing 'problem: your problem description'.",
        suggestions: [
          {
            id: 'sug-1',
            title: 'Add Problem: High Transportation Costs',
            type: 'component',
            data: {
              type: 'problem',
              title: 'High Transportation Costs',
              description: 'Commuters spend too much money on gas, parking, and maintenance',
              tags: ['cost', 'transportation', 'commute']
            }
          }
        ]
      }
    }
    
    if (lowerMessage.includes('customer') || lowerMessage.includes('user')) {
      return {
        content: "Understanding your customers is key! Who would benefit most from your solution? Try typing 'customer: your customer description' to add them.",
        suggestions: [
          {
            id: 'sug-2',
            title: 'Add Customer: Eco-conscious Millennials',
            type: 'component',
            data: {
              type: 'customer',
              title: 'Eco-conscious Millennials',
              description: '25-40 year olds who prioritize environmental sustainability',
              tags: ['millennials', 'eco-friendly', 'sustainability']
            }
          }
        ]
      }
    }
    
    if (lowerMessage.includes('feature') || lowerMessage.includes('functionality')) {
      return {
        content: "Features should directly address your customers' pain points. What specific functionality would provide the most value? Use 'feature: your feature description' to add one.",
        suggestions: [
          {
            id: 'sug-3',
            title: 'Add Feature: Carbon Footprint Tracker',
            type: 'component',
            data: {
              type: 'feature',
              title: 'Carbon Footprint Tracker',
              description: 'Track and visualize environmental impact of transportation choices',
              tags: ['tracking', 'environment', 'data']
            }
          }
        ]
      }
    }
    
    if (lowerMessage.includes('pain')) {
      return {
        content: "Pain points are what drive customers to seek solutions. What frustrations or challenges do your customers face? Try 'pain: description of the pain point'."
      }
    }
    
    if (lowerMessage.includes('gain')) {
      return {
        content: "Gain creators are the benefits your solution provides. What positive outcomes do customers want? Use 'gain: description of the gain' to add one."
      }
    }
    
    if (lowerMessage.includes('job')) {
      return {
        content: "Jobs to be done represent what customers are trying to accomplish. What tasks or goals do they have? Try 'job: description of the job'."
      }
    }
    
    if (lowerMessage.includes('connect') || lowerMessage.includes('relationship')) {
      return {
        content: "Great question! You can create relationships by selecting a node (click on it) and then creating a new entity. It will automatically link to the selected node. You can also double-click nodes to edit them and see their connections."
      }
    }
    
    // Default response
    return {
      content: "That's interesting! I can help you structure your idea by creating different components. Try typing things like 'problem: your problem', 'customer: your customer', or 'feature: your feature' to quickly add them to your canvas.\n\n**Pro tip:** Select a node first by clicking on it, then create new entities to automatically link them!"
    }
  }

  const clearMessages = () => {
    messages.value = []
  }

  return {
    messages: readonly(messages),
    isTyping: readonly(isTyping),
    sendMessage,
    addMessage,
    updateMessage,
    setTyping,
    clearMessages
  }
})