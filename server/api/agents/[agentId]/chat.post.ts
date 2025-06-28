export default defineEventHandler(async (event) => {
  const agentId = getRouterParam(event, 'agentId')
  const body = await readBody(event)
  
  if (agentId !== 'ideanation-assistant') {
    throw createError({
      statusCode: 404,
      statusMessage: 'Agent not found'
    })
  }

  const { message, context, sessionId } = body

  if (!message) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Message is required'
    })
  }

  try {
    // Process the message and generate response
    const response = await processAgentMessage(message, context, sessionId)
    
    return {
      success: true,
      response: response.content,
      entities: response.entities || [],
      relationships: response.relationships || [],
      suggestions: response.suggestions || [],
      sessionId: sessionId || generateSessionId(),
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to process message',
      data: { error: error.message }
    })
  }
})

async function processAgentMessage(message: string, context?: any, sessionId?: string) {
  // Mock AI processing - in a real implementation, this would use LangChain/OpenAI
  const lowerMessage = message.toLowerCase()
  
  // Check for entity creation patterns
  const entityPattern = /^(problem|customer|feature|pain|gain|job|idea|product):\s*(.+)$/i
  const entityMatch = message.match(entityPattern)
  
  if (entityMatch) {
    const [, entityType, entityTitle] = entityMatch
    
    return {
      content: `I've created a new ${entityType} called "${entityTitle}" and added it to your idea canvas.`,
      entities: [{
        type: entityType.toLowerCase(),
        title: entityTitle.trim(),
        description: `Auto-created from chat: "${message}"`,
        id: `${entityType.toLowerCase()}-${Date.now()}`
      }],
      relationships: context?.selectedNodeId ? [{
        sourceId: context.selectedNodeId,
        targetId: `${entityType.toLowerCase()}-${Date.now()}`,
        relationshipType: 'related'
      }] : []
    }
  }
  
  // Generate contextual responses
  if (lowerMessage.includes('help')) {
    return {
      content: `I can help you build your startup idea! You can create entities by typing:
      
• problem: describe a problem your idea solves
• customer: describe your target customers  
• feature: describe a key feature
• pain: describe customer pain points
• gain: describe customer gains

You can also ask me about problems, customers, features, or how to connect different components.`,
      suggestions: [
        { type: 'entity', text: 'problem: users struggle with finding reliable services' },
        { type: 'entity', text: 'customer: busy professionals in urban areas' },
        { type: 'entity', text: 'feature: real-time service tracking' }
      ]
    }
  }
  
  if (lowerMessage.includes('problem')) {
    return {
      content: "Understanding problems is crucial for any startup. What specific problems are you trying to solve? You can create a problem by typing 'problem: your problem description'.",
      suggestions: [
        { type: 'entity', text: 'problem: high transportation costs for daily commuters' },
        { type: 'entity', text: 'problem: lack of reliable pet care services' }
      ]
    }
  }
  
  if (lowerMessage.includes('customer')) {
    return {
      content: "Understanding your customers is key! Who would benefit most from your solution? Try typing 'customer: your customer description' to add them.",
      suggestions: [
        { type: 'entity', text: 'customer: eco-conscious millennials in urban areas' },
        { type: 'entity', text: 'customer: busy parents with young children' }
      ]
    }
  }
  
  // Default response
  return {
    content: "That's interesting! I can help you structure your idea by creating different components. Try typing things like 'problem: your problem', 'customer: your customer', or 'feature: your feature' to quickly add them to your canvas."
  }
}

function generateSessionId(): string {
  return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}