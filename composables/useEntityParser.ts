import { useEntitiesStore } from '~/stores/entities'

// Entity type mapping for parsing
export const ENTITY_PREFIXES = {
  'problem': 'problem',
  'customer': 'customer', 
  'idea': 'idea',
  'product': 'product',
  'feature': 'feature',
  'job': 'job',
  'pain': 'pain',
  'gain': 'gain',
  'journey': 'customerJourney',
  'step': 'customerJourneyStep'
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
  const entitiesStore = useEntitiesStore()

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
      case 'problem':
        return entitiesStore.createProblem(baseData)
      
      case 'customer':
        return entitiesStore.createCustomer({
          ...baseData,
          givenName: '',
          familyName: '',
          role: '',
          organization: ''
        })
      
      case 'idea':
        const idea = entitiesStore.createIdea(baseData)
        // Set as current idea if none is set
        if (!entitiesStore.currentIdea) {
          entitiesStore.setCurrentIdea(idea)
        }
        return idea
      
      case 'product':
        return entitiesStore.createProduct(baseData)
      
      case 'feature':
        return entitiesStore.createFeature(baseData)
      
      case 'job':
        return entitiesStore.createJob(baseData)
      
      case 'pain':
        return entitiesStore.createPain(baseData)
      
      case 'gain':
        return entitiesStore.createGain(baseData)
      
      case 'customerJourney':
        return entitiesStore.createCustomerJourney(baseData)
      
      case 'customerJourneyStep':
        return entitiesStore.createCustomerJourneyStep(baseData)
      
      default:
        console.warn(`Unknown entity type: ${parsed.type}`)
        return null
    }
  }

  // Auto-create relationships for new entities
  const createAutoRelationships = (entity: any, entityType: EntityType): void => {
    const currentIdea = entitiesStore.currentIdea
    const currentUser = entitiesStore.currentUser

    if (!currentIdea || !currentUser) return

    // Create relationships based on entity type and current context
    switch (entityType) {
      case 'problem':
        // Link problem to current idea
        entitiesStore.createRelationship({
          sourceId: entity.id,
          targetId: currentIdea.id,
          relationshipType: 'belongs'
        })
        break

      case 'customer':
        // Link customer to current idea
        entitiesStore.createRelationship({
          sourceId: entity.id,
          targetId: currentIdea.id,
          relationshipType: 'belongs'
        })
        break

      case 'product':
        // Link product to current idea as MVP
        entitiesStore.createRelationship({
          sourceId: currentIdea.id,
          targetId: entity.id,
          relationshipType: 'mvp'
        })
        break

      case 'feature':
        // Link feature to products of current idea
        const currentProducts = entitiesStore.currentIdeaProducts
        if (currentProducts.length > 0) {
          // Link to first product (or could be more sophisticated)
          entitiesStore.createRelationship({
            sourceId: entity.id,
            targetId: currentProducts[0].id,
            relationshipType: 'belongs'
          })
        }
        break

      case 'job':
      case 'pain':
      case 'gain':
        // Link to customers of current idea
        const currentCustomers = entitiesStore.currentIdeaCustomers
        if (currentCustomers.length > 0) {
          const relationshipType = entityType === 'job' ? 'performs' : 
                                  entityType === 'pain' ? 'experiences' : 'desires'
          
          // Link to first customer (could be more sophisticated)
          entitiesStore.createRelationship({
            sourceId: currentCustomers[0].id,
            targetId: entity.id,
            relationshipType
          })
        }
        break
    }
  }

  // Main function to process entity text
  const processEntityText = (text: string): { 
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
        // Create auto-relationships
        createAutoRelationships(entity, parsed.type)
        
        return { entity, parsed, wasCreated: true }
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
    ENTITY_PREFIXES
  }
}