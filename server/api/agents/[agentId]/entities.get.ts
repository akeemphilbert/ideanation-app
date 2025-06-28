export default defineEventHandler(async (event) => {
  const agentId = getRouterParam(event, 'agentId')
  const query = getQuery(event)
  
  if (agentId !== 'ideanation-assistant') {
    throw createError({
      statusCode: 404,
      statusMessage: 'Agent not found'
    })
  }

  const { ideaId, type, limit = 100 } = query

  // Mock entity data - in a real implementation, this would query a database
  const entities = [
    {
      id: 'idea-1',
      type: 'idea',
      title: 'EcoCommute App',
      description: 'Sustainable transportation solution for urban commuters',
      created: new Date().toISOString(),
      updated: new Date().toISOString()
    },
    {
      id: 'problem-1',
      type: 'problem',
      title: 'High Transportation Costs',
      description: 'Commuters spend too much on gas, parking, and maintenance',
      created: new Date().toISOString(),
      updated: new Date().toISOString()
    },
    {
      id: 'customer-1',
      type: 'customer',
      title: 'Urban Professionals',
      description: 'Working professionals in metropolitan areas',
      created: new Date().toISOString(),
      updated: new Date().toISOString()
    }
  ]

  let filteredEntities = entities

  if (type) {
    filteredEntities = entities.filter(e => e.type === type)
  }

  if (ideaId) {
    // In a real implementation, filter by idea relationships
    filteredEntities = entities.filter(e => e.id.includes(ideaId) || e.type === 'idea')
  }

  return {
    entities: filteredEntities.slice(0, Number(limit)),
    total: filteredEntities.length,
    filters: { ideaId, type, limit }
  }
})