export default defineEventHandler(async (event) => {
  // Get all available agents
  return {
    agents: [
      {
        id: 'ideanation-assistant',
        name: 'Ideanation Assistant',
        description: 'AI assistant for structuring startup ideas and creating entity relationships',
        version: '1.0.0',
        capabilities: [
          'entity_creation',
          'relationship_mapping',
          'idea_structuring',
          'business_model_analysis',
          'chat_interaction'
        ],
        endpoints: {
          chat: '/api/agents/ideanation-assistant/chat',
          entities: '/api/agents/ideanation-assistant/entities',
          relationships: '/api/agents/ideanation-assistant/relationships',
          analysis: '/api/agents/ideanation-assistant/analysis'
        },
        status: 'active'
      }
    ]
  }
})