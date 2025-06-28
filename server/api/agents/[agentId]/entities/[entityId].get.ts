export default defineEventHandler(async (event) => {
  const agentId = getRouterParam(event, 'agentId')
  const entityId = getRouterParam(event, 'entityId')
  
  if (agentId !== 'ideanation-assistant') {
    throw createError({
      statusCode: 404,
      statusMessage: 'Agent not found'
    })
  }

  // Mock entity lookup - in a real implementation, query database
  const entity = {
    id: entityId,
    type: 'problem',
    title: 'High Transportation Costs',
    description: 'Commuters spend too much on gas, parking, and maintenance',
    metadata: {
      priority: 'high',
      tags: ['transportation', 'cost', 'urban']
    },
    created: new Date().toISOString(),
    updated: new Date().toISOString()
  }

  if (!entity) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Entity not found'
    })
  }

  return { entity }
})