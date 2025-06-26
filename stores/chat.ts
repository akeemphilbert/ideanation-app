import { defineStore } from 'pinia'
import { ApiService } from '~/services/api'

export interface ChatMessage {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
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

  const addMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    }
    messages.value.push(newMessage)
  }

  const sendMessage = async (content: string) => {
    // Add user message
    addMessage({
      type: 'user',
      content
    })

    isTyping.value = true

    try {
      // Generate AI response (mock implementation)
      const aiResponse = await generateAIResponse(content)
      
      addMessage({
        type: 'ai',
        content: aiResponse.content,
        suggestions: aiResponse.suggestions
      })
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
    
    if (lowerMessage.includes('problem') || lowerMessage.includes('issue')) {
      return {
        content: "Great question about problems! Understanding the core problem is crucial for any startup. I can help you identify pain points your customers face.",
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
        content: "Understanding your customers is key! Let me help you define who would benefit most from your solution.",
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
        content: "Features should directly address your customers' pain points. What specific functionality would provide the most value?",
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
    
    if (lowerMessage.includes('solution') || lowerMessage.includes('solve')) {
      return {
        content: "Your solution should elegantly address the problems you've identified. How might we connect the dots between problems and solutions?",
        suggestions: [
          {
            id: 'sug-4',
            title: 'Connect Problem to Solution',
            type: 'relationship',
            data: {
              source: 'comp-1', // This would be dynamically determined
              target: 'comp-3',
              relationship: 'addresses',
              strength: 0.9
            }
          }
        ]
      }
    }
    
    // Default response
    return {
      content: "That's an interesting point! Can you tell me more about what specific aspect of your idea you'd like to explore? I can help you break it down into problems, customers, solutions, or features."
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
    clearMessages
  }
})