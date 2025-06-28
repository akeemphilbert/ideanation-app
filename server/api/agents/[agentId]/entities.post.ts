export default defineEventHandler(async (event) => {
  const agentId = getRouterParam(event, 'agentId')
  const body = await readBody(event)
  
  if (agentId !== 'ideanation-assistant') {
    throw createError({
      statusCode: 404,
      statusMessage: 'Agent not found'
    })
  }

  const { type, title, description, metadata } = body

  if (!type || !title) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Type and title are required'
    })
  }

  const validTypes = ['idea', 'problem', 'customer', 'feature', 'product', 'job', 'pain', 'gain']
  if (!validTypes.includes(type)) {
    throw createError({
      statusCode: 400,
      statusMessage: `Invalid entity type. Must be one of: ${validTypes.join(', ')}`
    })
  }

  try {
    const entity = {
      id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      title,
      description: description || '',
      metadata: metadata || {},
      created: new Date().toISOString(),
      updated: new Date().toISOString()
    }

    // In a real implementation, save to database
    
    return {
      success: true,
      entity,
      message: `${type} entity created successfully`
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create entity',
      data: { error: error.message }
    })
  }
})