import type {
  Account, User, Idea, Problem, Customer, CustomerJourney, CustomerJourneyStep,
  Product, Feature, Job, Pain, Gain
} from '~/types/entities'
import type { EntityRelationship } from '~/types/relationships'

// Composable for managing entities
export const useEntities = () => {
  // Entity collections
  const accounts = ref<Account[]>([])
  const users = ref<User[]>([])
  const ideas = ref<Idea[]>([])
  const problems = ref<Problem[]>([])
  const customers = ref<Customer[]>([])
  const customerJourneys = ref<CustomerJourney[]>([])
  const customerJourneySteps = ref<CustomerJourneyStep[]>([])
  const products = ref<Product[]>([])
  const features = ref<Feature[]>([])
  const jobs = ref<Job[]>([])
  const pains = ref<Pain[]>([])
  const gains = ref<Gain[]>([])
  const relationships = ref<EntityRelationship[]>([])

  // Generic CRUD operations
  const addEntity = <T extends { id: string }>(collection: Ref<T[]>, entity: T) => {
    collection.value.push(entity)
  }

  const updateEntity = <T extends { id: string }>(collection: Ref<T[]>, entityId: string, updates: Partial<T>) => {
    const index = collection.value.findIndex(item => item.id === entityId)
    if (index !== -1) {
      collection.value[index] = { ...collection.value[index], ...updates }
    }
  }

  const removeEntity = <T extends { id: string }>(collection: Ref<T[]>, entityId: string) => {
    collection.value = collection.value.filter(item => item.id !== entityId)
  }

  const findEntity = <T extends { id: string }>(collection: Ref<T[]>, entityId: string): T | undefined => {
    return collection.value.find(item => item.id === entityId)
  }

  // Relationship helpers
  const getRelatedEntities = <T extends { id: string }>(
    entityId: string,
    relationshipType: string,
    targetCollection: Ref<T[]>,
    asSource: boolean = true
  ): T[] => {
    const relatedIds = relationships.value
      .filter(rel => {
        if (asSource) {
          return rel.sourceId === entityId && rel.relationshipType === relationshipType
        } else {
          return rel.targetId === entityId && rel.relationshipType === relationshipType
        }
      })
      .map(rel => asSource ? rel.targetId : rel.sourceId)

    return targetCollection.value.filter(entity => relatedIds.includes(entity.id))
  }

  const addRelationship = (relationship: EntityRelationship) => {
    relationships.value.push(relationship)
  }

  const removeRelationship = (relationshipId: string) => {
    relationships.value = relationships.value.filter(rel => rel.id !== relationshipId)
  }

  // Specific entity operations
  const getIdeasByUser = (userId: string): Idea[] => {
    return getRelatedEntities(userId, 'owns', ideas)
  }

  const getProblemsForIdea = (ideaId: string): Problem[] => {
    return getRelatedEntities(ideaId, 'belongs', problems, false)
  }

  const getCustomersForIdea = (ideaId: string): Customer[] => {
    return getRelatedEntities(ideaId, 'belongs', customers, false)
  }

  const getJobsForCustomer = (customerId: string): Job[] => {
    return getRelatedEntities(customerId, 'performs', jobs)
  }

  const getPainsForCustomer = (customerId: string): Pain[] => {
    return getRelatedEntities(customerId, 'experiences', pains)
  }

  const getGainsForCustomer = (customerId: string): Gain[] => {
    return getRelatedEntities(customerId, 'desires', gains)
  }

  const getFeaturesForProduct = (productId: string): Feature[] => {
    return getRelatedEntities(productId, 'belongs', features, false)
  }

  const getProductsForIdea = (ideaId: string): Product[] => {
    return getRelatedEntities(ideaId, 'mvp', products)
  }

  // Journey-related operations
  const getJourneysForCustomer = (customerId: string): CustomerJourney[] => {
    return getRelatedEntities(customerId, 'belongs', customerJourneys, false)
  }

  const getStepsForJourney = (journeyId: string): CustomerJourneyStep[] => {
    return getRelatedEntities(journeyId, 'belongs', customerJourneySteps, false)
  }

  // Feature-pain/gain relationships
  const getPainsRelievedByFeature = (featureId: string): Pain[] => {
    return getRelatedEntities(featureId, 'relieves', pains)
  }

  const getGainsCreatedByFeature = (featureId: string): Gain[] => {
    return getRelatedEntities(featureId, 'creates', gains)
  }

  return {
    // Collections
    accounts: readonly(accounts),
    users: readonly(users),
    ideas: readonly(ideas),
    problems: readonly(problems),
    customers: readonly(customers),
    customerJourneys: readonly(customerJourneys),
    customerJourneySteps: readonly(customerJourneySteps),
    products: readonly(products),
    features: readonly(features),
    jobs: readonly(jobs),
    pains: readonly(pains),
    gains: readonly(gains),
    relationships: readonly(relationships),

    // Generic operations
    addEntity,
    updateEntity,
    removeEntity,
    findEntity,

    // Relationship operations
    addRelationship,
    removeRelationship,
    getRelatedEntities,

    // Specific operations
    getIdeasByUser,
    getProblemsForIdea,
    getCustomersForIdea,
    getJobsForCustomer,
    getPainsForCustomer,
    getGainsForCustomer,
    getFeaturesForProduct,
    getProductsForIdea,
    getJourneysForCustomer,
    getStepsForJourney,
    getPainsRelievedByFeature,
    getGainsCreatedByFeature
  }
}