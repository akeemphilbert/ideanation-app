import { useResourcesStore } from '~/stores/resources'
import { RESOURCE_TYPES } from '~/types/resources'

// Entity type mapping for parsing
export const ENTITY_PREFIXES = {
  'problem': RESOURCE_TYPES.PROBLEM,
  'customer': RESOURCE_TYPES.CUSTOMER, 
  'idea': RESOURCE_TYPES.IDEA,
  'product': RESOURCE_TYPES.PRODUCT,
  'feature': RESOURCE_TYPES.FEATURE,
  'job': RESOURCE_TYPES.JOB,
  'pain': RESOURCE_TYPES.PAIN,
  'gain': RESOURCE_TYPES.GAIN,
  'journey': RESOURCE_TYPES.CUSTOMER_JOURNEY,
  'step': RESOURCE_TYPES.CUSTOMER_JOURNEY_STEP
} as const

export type EntityPrefix = keyof typeof ENTITY_PREFIXES
export type EntityType = typeof ENTITY_PREFIXES[EntityPrefix]

export interface ParsedEntity {
  type: EntityType
  title: string
  originalText: string
  prefix: string
}

export const useEntityParser = () => {
  const resourcesStore = useResourcesStore()

  // Parse text for entity prefixes
  const parseEntityText = (text: string): ParsedEntity | null => {
    const trimmedText = text.trim()
    
    // Check if text contains a colon
    const colonIndex = trimmedText.indexOf(':')
    if (colonIndex === -1) return null
    
    const prefix = trimmedText.substring(0, colonIndex).toLowerCase().trim()
    const title = trimmedText.substring(colonIndex + 1).trim()
    
    // Check if prefix matches any entity type
    if (!(prefix in ENTITY_PREFIXES)) return null
    if (!title) return null // Don't create empty entities
    
    const entityType = ENTITY_PREFIXES[prefix as EntityPrefix]
    
    return {
      type: entityType,
      title,
      originalText: trimmedText,
      prefix
    }
  }

  // Create entity based on parsed data
  const createEntityFromParsed = (parsed: ParsedEntity): any => {
    const baseData = {
      title: parsed.title,
      description: `Auto-created from chat: "${parsed.originalText}"`
    }

    switch (parsed.type) {
      case RESOURCE_TYPES.PROBLEM:
        return resourcesStore.createProblem(baseData)
      
      case RESOURCE_TYPES.CUSTOMER:
        return resourcesStore.createCustomer({
          ...baseData,
          givenName: '',
          familyName: '',
          role: '',
          organization: ''
        })
      
      case RESOURCE_TYPES.IDEA:
        const idea = resourcesStore.createIdea(baseData)
        // Set as current idea if none is set
        if (!resourcesStore.currentIdea) {
          resourcesStore.setCurrentIdea(idea.toJSON())
        }
        return idea
      
      case RESOURCE_TYPES.PRODUCT:
        return resourcesStore.createProduct(baseData)
      
      case RESOURCE_TYPES.FEATURE:
        return resourcesStore.createFeature(baseData)
      
      case RESOURCE_TYPES.JOB:
        return resourcesStore.createJob(baseData)
      
      case RESOURCE_TYPES.PAIN:
        return resourcesStore.createPain(baseData)
      
      case RESOURCE_TYPES.GAIN:
        return resourcesStore.createGain(baseData)
      
      case RESOURCE_TYPES.CUSTOMER_JOURNEY:
        return resourcesStore.createCustomerJourney(baseData)
      
      case RESOURCE_TYPES.CUSTOMER_JOURNEY_STEP:
        return resourcesStore.createCustomerJourneyStep(baseData)
      
      default:
        console.warn(`Unknown entity type: ${parsed.type}`)
        return null
    }
  }

  // Auto-create relationships for new entities with smart linking
  const createAutoRelationships = (entity: any, entityType: EntityType, targetNodeId?: string): void => {
    const currentIdea = resourcesStore.currentIdea

    if (!currentIdea) return

    // If a specific target node is provided, create relationship to it
    if (targetNodeId) {
      createRelationshipToTarget(entity, entityType, targetNodeId)
      return
    }

    // Default relationships based on entity type and current context
    switch (entityType) {
      case RESOURCE_TYPES.PROBLEM:
        // Link problem to current idea
        resourcesStore.createRelationship({
          sourceId: entity['@id'],
          targetId: currentIdea['@id'],
          relationshipType: 'belongs'
        })
        break

      case RESOURCE_TYPES.CUSTOMER:
        // Link customer to current idea
        resourcesStore.createRelationship({
          sourceId: entity['@id'],
          targetId: currentIdea['@id'],
          relationshipType: 'belongs'
        })
        break

      case RESOURCE_TYPES.PRODUCT:
        // Link product to current idea as MVP
        resourcesStore.createRelationship({
          sourceId: currentIdea['@id'],
          targetId: entity['@id'],
          relationshipType: 'mvp'
        })
        break

      case RESOURCE_TYPES.FEATURE:
        // Link feature to products of current idea
        const currentProducts = resourcesStore.currentIdeaProducts
        if (currentProducts.length > 0) {
          // Link to first product (or could be more sophisticated)
          resourcesStore.createRelationship({
            sourceId: entity['@id'],
            targetId: currentProducts[0]['@id'],
            relationshipType: 'belongs'
          })
        }
        break

      case RESOURCE_TYPES.JOB:
      case RESOURCE_TYPES.PAIN:
      case RESOURCE_TYPES.GAIN:
        // Link to customers of current idea
        const currentCustomers = resourcesStore.currentIdeaCustomers
        if (currentCustomers.length > 0) {
          const relationshipType = entityType === RESOURCE_TYPES.JOB ? 'performs' : 
                                  entityType === RESOURCE_TYPES.PAIN ? 'experiences' : 'desires'
          
          // Link to first customer (could be more sophisticated)
          resourcesStore.createRelationship({
            sourceId: currentCustomers[0]['@id'],
            targetId: entity['@id'],
            relationshipType
          })
        }
        break
    }
  }

  // Create relationship to a specific target node
  const createRelationshipToTarget = (entity: any, entityType: EntityType, targetNodeId: string): void => {
    // Find the target entity to determine its type
    const targetEntity = findEntityById(targetNodeId)
    if (!targetEntity) return

    let relationshipType = 'related'
    let sourceId = entity['@id']
    let targetId = targetNodeId

    // Define specific relationship patterns based on entity types
    if (entityType === RESOURCE_TYPES.PROBLEM && targetEntity.type === RESOURCE_TYPES.IDEA) {
      relationshipType = 'belongs'
    } else if (entityType === RESOURCE_TYPES.CUSTOMER && targetEntity.type === RESOURCE_TYPES.IDEA) {
      relationshipType = 'belongs'
    } else if (entityType === RESOURCE_TYPES.PRODUCT && targetEntity.type === RESOURCE_TYPES.IDEA) {
      relationshipType = 'mvp'
      sourceId = targetNodeId
      targetId = entity['@id']
    } else if (entityType === RESOURCE_TYPES.FEATURE && targetEntity.type === RESOURCE_TYPES.PRODUCT) {
      relationshipType = 'belongs'
    } else if (entityType === RESOURCE_TYPES.JOB && targetEntity.type === RESOURCE_TYPES.CUSTOMER) {
      relationshipType = 'performs'
      sourceId = targetNodeId
      targetId = entity['@id']
    } else if (entityType === RESOURCE_TYPES.PAIN && targetEntity.type === RESOURCE_TYPES.CUSTOMER) {
      relationshipType = 'experiences'
      sourceId = targetNodeId
      targetId = entity['@id']
    } else if (entityType === RESOURCE_TYPES.GAIN && targetEntity.type === RESOURCE_TYPES.CUSTOMER) {
      relationshipType = 'desires'
      sourceId = targetNodeId
      targetId = entity['@id']
    } else if (entityType === RESOURCE_TYPES.FEATURE && targetEntity.type === RESOURCE_TYPES.PAIN) {
      relationshipType = 'relieves'
    } else if (entityType === RESOURCE_TYPES.FEATURE && targetEntity.type === RESOURCE_TYPES.GAIN) {
      relationshipType = 'creates'
    }

    resourcesStore.createRelationship({
      sourceId,
      targetId,
      relationshipType
    })
  }

  // Helper to find entity by ID across all collections
  const findEntityById = (entityId: string): { type: string, entity: any } | null => {
    return resourcesStore.findResourceById(entityId)
  }

  // Main function to process entity text with target node support
  const processEntityText = (text: string, targetNodeId?: string): { 
    entity: any | null, 
    parsed: ParsedEntity | null,
    wasCreated: boolean 
  } => {
    const parsed = parseEntityText(text)
    
    if (!parsed) {
      return { entity: null, parsed: null, wasCreated: false }
    }

    try {
      const entity = createEntityFromParsed(parsed)
      
      if (entity) {
        // Create auto-relationships with target node support
        createAutoRelationships(entity.toJSON(), parsed.type, targetNodeId)
        
        return { entity: entity.toJSON(), parsed, wasCreated: true }
      }
    } catch (error) {
      console.error('Failed to create entity:', error)
    }

    return { entity: null, parsed, wasCreated: false }
  }

  // Get available entity prefixes for help/autocomplete
  const getAvailablePrefixes = (): string[] => {
    return Object.keys(ENTITY_PREFIXES)
  }

  // Generate help text for entity creation
  const getEntityHelp = (): string => {
    const prefixes = getAvailablePrefixes()
    return `You can create entities by typing: ${prefixes.map(p => `"${p}: your text"`).join(', ')}`
  }

  // Check if text looks like an entity command
  const looksLikeEntityCommand = (text: string): boolean => {
    const trimmed = text.trim()
    const colonIndex = trimmed.indexOf(':')
    
    if (colonIndex === -1) return false
    
    const prefix = trimmed.substring(0, colonIndex).toLowerCase().trim()
    return prefix in ENTITY_PREFIXES
  }

  return {
    parseEntityText,
    createEntityFromParsed,
    processEntityText,
    getAvailablePrefixes,
    getEntityHelp,
    looksLikeEntityCommand,
    createAutoRelationships,
    findEntityById,
    ENTITY_PREFIXES
  }
}