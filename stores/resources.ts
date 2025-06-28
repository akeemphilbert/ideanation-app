import { defineStore } from 'pinia'
import type { 
  Resource,
  IdeaResource,
  ProblemResource,
  CustomerResource,
  ProductResource,
  FeatureResource,
  JobResource,
  PainResource,
  GainResource,
  CustomerJourneyResource,
  CustomerJourneyStepResource,
  RelationshipResource
} from '~/types/resources'
import {
  IdeaResourceModel,
  ProblemResourceModel,
  CustomerResourceModel,
  ProductResourceModel,
  FeatureResourceModel,
  JobResourceModel,
  PainResourceModel,
  GainResourceModel,
  CustomerJourneyResourceModel,
  CustomerJourneyStepResourceModel,
  RelationshipResourceModel,
  RESOURCE_TYPES,
  RELATIONSHIP_TYPES
} from '~/types/resources'

export const useResourcesStore = defineStore('resources', () => {
  // State - all resources in one collection
  const resources = ref<Map<string, Resource>>(new Map())
  
  // Current active resources
  const currentIdea = ref<IdeaResource | null>(null)

  // Generic resource operations
  const addResource = (resource: Resource): void => {
    resources.value.set(resource['@id'], resource)
  }

  const getResource = (id: string): Resource | undefined => {
    return resources.value.get(id)
  }

  const updateResource = (id: string, updates: Partial<Resource>): void => {
    const resource = resources.value.get(id)
    if (resource) {
      Object.assign(resource, updates, { updated: new Date() })
      resources.value.set(id, resource)
    }
  }

  const deleteResource = (id: string): void => {
    resources.value.delete(id)
    // Also remove any relationships involving this resource
    removeRelationshipsForResource(id)
  }

  // Type-specific getters
  const getResourcesByType = <T extends Resource>(type: string): T[] => {
    return Array.from(resources.value.values())
      .filter(resource => resource['@type'] === type) as T[]
  }

  const ideas = computed(() => getResourcesByType<IdeaResource>(RESOURCE_TYPES.IDEA))
  const problems = computed(() => getResourcesByType<ProblemResource>(RESOURCE_TYPES.PROBLEM))
  const customers = computed(() => getResourcesByType<CustomerResource>(RESOURCE_TYPES.CUSTOMER))
  const products = computed(() => getResourcesByType<ProductResource>(RESOURCE_TYPES.PRODUCT))
  const features = computed(() => getResourcesByType<FeatureResource>(RESOURCE_TYPES.FEATURE))
  const jobs = computed(() => getResourcesByType<JobResource>(RESOURCE_TYPES.JOB))
  const pains = computed(() => getResourcesByType<PainResource>(RESOURCE_TYPES.PAIN))
  const gains = computed(() => getResourcesByType<GainResource>(RESOURCE_TYPES.GAIN))
  const customerJourneys = computed(() => getResourcesByType<CustomerJourneyResource>(RESOURCE_TYPES.CUSTOMER_JOURNEY))
  const customerJourneySteps = computed(() => getResourcesByType<CustomerJourneyStepResource>(RESOURCE_TYPES.CUSTOMER_JOURNEY_STEP))
  const relationships = computed(() => getResourcesByType<RelationshipResource>(RESOURCE_TYPES.RELATIONSHIP))

  // Entity creation methods
  const createIdea = (data: Partial<IdeaResource>): IdeaResourceModel => {
    const idea = new IdeaResourceModel(data)
    addResource(idea.toJSON())
    return idea
  }

  const createProblem = (data: Partial<ProblemResource>): ProblemResourceModel => {
    const problem = new ProblemResourceModel(data)
    addResource(problem.toJSON())
    return problem
  }

  const createCustomer = (data: Partial<CustomerResource>): CustomerResourceModel => {
    const customer = new CustomerResourceModel(data)
    addResource(customer.toJSON())
    return customer
  }

  const createProduct = (data: Partial<ProductResource>): ProductResourceModel => {
    const product = new ProductResourceModel(data)
    addResource(product.toJSON())
    return product
  }

  const createFeature = (data: Partial<FeatureResource>): FeatureResourceModel => {
    const feature = new FeatureResourceModel(data)
    addResource(feature.toJSON())
    return feature
  }

  const createJob = (data: Partial<JobResource>): JobResourceModel => {
    const job = new JobResourceModel(data)
    addResource(job.toJSON())
    return job
  }

  const createPain = (data: Partial<PainResource>): PainResourceModel => {
    const pain = new PainResourceModel(data)
    addResource(pain.toJSON())
    return pain
  }

  const createGain = (data: Partial<GainResource>): GainResourceModel => {
    const gain = new GainResourceModel(data)
    addResource(gain.toJSON())
    return gain
  }

  const createCustomerJourney = (data: Partial<CustomerJourneyResource>): CustomerJourneyResourceModel => {
    const journey = new CustomerJourneyResourceModel(data)
    addResource(journey.toJSON())
    return journey
  }

  const createCustomerJourneyStep = (data: Partial<CustomerJourneyStepResource>): CustomerJourneyStepResourceModel => {
    const step = new CustomerJourneyStepResourceModel(data)
    addResource(step.toJSON())
    return step
  }

  // Relationship operations (triples)
  const createRelationship = (data: {
    sourceId: string
    targetId: string
    relationshipType: string
  }): RelationshipResourceModel => {
    const relationship = new RelationshipResourceModel(data)
    addResource(relationship.toJSON())
    return relationship
  }

  const removeRelationshipsForResource = (resourceId: string): void => {
    const relationsToRemove = relationships.value.filter(
      rel => rel.sourceId === resourceId || rel.targetId === resourceId
    )
    relationsToRemove.forEach(rel => resources.value.delete(rel['@id']))
  }

  // Query relationships (like SPARQL queries)
  const getRelatedResources = <T extends Resource>(
    resourceId: string,
    relationshipType: string,
    targetType?: string,
    asSource: boolean = true
  ): T[] => {
    const relatedIds = relationships.value
      .filter(rel => {
        const matchesRelationship = rel.relationshipType === relationshipType
        const matchesDirection = asSource 
          ? rel.sourceId === resourceId 
          : rel.targetId === resourceId
        return matchesRelationship && matchesDirection
      })
      .map(rel => asSource ? rel.targetId : rel.sourceId)

    return Array.from(resources.value.values())
      .filter(resource => {
        const matchesId = relatedIds.includes(resource['@id'])
        const matchesType = targetType ? resource['@type'] === targetType : true
        return matchesId && matchesType
      }) as T[]
  }

  // Convenience methods for common queries
  const getProblemsForIdea = (ideaId: string): ProblemResource[] => {
    return getRelatedResources<ProblemResource>(
      ideaId, 
      RELATIONSHIP_TYPES.BELONGS, 
      RESOURCE_TYPES.PROBLEM, 
      false
    )
  }

  const getCustomersForIdea = (ideaId: string): CustomerResource[] => {
    return getRelatedResources<CustomerResource>(
      ideaId, 
      RELATIONSHIP_TYPES.BELONGS, 
      RESOURCE_TYPES.CUSTOMER, 
      false
    )
  }

  const getProductsForIdea = (ideaId: string): ProductResource[] => {
    return getRelatedResources<ProductResource>(
      ideaId, 
      RELATIONSHIP_TYPES.MVP, 
      RESOURCE_TYPES.PRODUCT
    )
  }

  const getFeaturesForProduct = (productId: string): FeatureResource[] => {
    return getRelatedResources<FeatureResource>(
      productId, 
      RELATIONSHIP_TYPES.BELONGS, 
      RESOURCE_TYPES.FEATURE, 
      false
    )
  }

  const getJobsForCustomer = (customerId: string): JobResource[] => {
    return getRelatedResources<JobResource>(
      customerId, 
      RELATIONSHIP_TYPES.PERFORMS, 
      RESOURCE_TYPES.JOB
    )
  }

  const getPainsForCustomer = (customerId: string): PainResource[] => {
    return getRelatedResources<PainResource>(
      customerId, 
      RELATIONSHIP_TYPES.EXPERIENCES, 
      RESOURCE_TYPES.PAIN
    )
  }

  const getGainsForCustomer = (customerId: string): GainResource[] => {
    return getRelatedResources<GainResource>(
      customerId, 
      RELATIONSHIP_TYPES.DESIRES, 
      RESOURCE_TYPES.GAIN
    )
  }

  // Current context helpers
  const setCurrentIdea = (idea: IdeaResource | null): void => {
    currentIdea.value = idea
  }

  const currentIdeaProblems = computed(() => {
    if (!currentIdea.value) return []
    return getProblemsForIdea(currentIdea.value['@id'])
  })

  const currentIdeaCustomers = computed(() => {
    if (!currentIdea.value) return []
    return getCustomersForIdea(currentIdea.value['@id'])
  })

  const currentIdeaProducts = computed(() => {
    if (!currentIdea.value) return []
    return getProductsForIdea(currentIdea.value['@id'])
  })

  // Find resource by any identifier
  const findResourceById = (id: string): { type: string, resource: Resource } | null => {
    // Try to find by @id first
    const resource = getResource(id)
    if (resource) {
      return { type: resource['@type'], resource }
    }

    // Try to find by internal id
    const resourceByInternalId = Array.from(resources.value.values())
      .find(r => r.id === id)
    if (resourceByInternalId) {
      return { type: resourceByInternalId['@type'], resource: resourceByInternalId }
    }

    return null
  }

  // Serialization for storage
  const serializeResources = (): Record<string, any> => {
    const serialized: Record<string, any> = {}
    resources.value.forEach((resource, id) => {
      serialized[id] = resource
    })
    return serialized
  }

  const deserializeResources = (data: Record<string, any>): void => {
    resources.value.clear()
    Object.entries(data).forEach(([id, resource]) => {
      resources.value.set(id, resource as Resource)
    })
  }

  // Update methods for specific resource types
  const updateIdea = (id: string, data: Partial<IdeaResource>): void => {
    updateResource(id, data)
  }

  const updateProblem = (id: string, data: Partial<ProblemResource>): void => {
    updateResource(id, data)
  }

  const updateCustomer = (id: string, data: Partial<CustomerResource>): void => {
    updateResource(id, data)
  }

  const updateProduct = (id: string, data: Partial<ProductResource>): void => {
    updateResource(id, data)
  }

  const updateFeature = (id: string, data: Partial<FeatureResource>): void => {
    updateResource(id, data)
  }

  const updateJob = (id: string, data: Partial<JobResource>): void => {
    updateResource(id, data)
  }

  const updatePain = (id: string, data: Partial<PainResource>): void => {
    updateResource(id, data)
  }

  const updateGain = (id: string, data: Partial<GainResource>): void => {
    updateResource(id, data)
  }

  const updateCustomerJourney = (id: string, data: Partial<CustomerJourneyResource>): void => {
    updateResource(id, data)
  }

  const updateCustomerJourneyStep = (id: string, data: Partial<CustomerJourneyStepResource>): void => {
    updateResource(id, data)
  }

  const updateRelationship = (id: string, data: Partial<RelationshipResource>): void => {
    updateResource(id, data)
  }

  // Delete methods for specific resource types
  const deleteIdea = (id: string): void => {
    deleteResource(id)
  }

  const deleteProblem = (id: string): void => {
    deleteResource(id)
  }

  const deleteCustomer = (id: string): void => {
    deleteResource(id)
  }

  const deleteProduct = (id: string): void => {
    deleteResource(id)
  }

  const deleteFeature = (id: string): void => {
    deleteResource(id)
  }

  const deleteJob = (id: string): void => {
    deleteResource(id)
  }

  const deletePain = (id: string): void => {
    deleteResource(id)
  }

  const deleteGain = (id: string): void => {
    deleteResource(id)
  }

  const deleteCustomerJourney = (id: string): void => {
    deleteResource(id)
  }

  const deleteCustomerJourneyStep = (id: string): void => {
    deleteResource(id)
  }

  const deleteRelationship = (id: string): void => {
    deleteResource(id)
  }

  return {
    // State
    resources: readonly(resources),
    currentIdea: readonly(currentIdea),

    // Computed collections
    ideas,
    problems,
    customers,
    products,
    features,
    jobs,
    pains,
    gains,
    customerJourneys,
    customerJourneySteps,
    relationships,

    // Generic operations
    addResource,
    getResource,
    updateResource,
    deleteResource,

    // Creation methods
    createIdea,
    createProblem,
    createCustomer,
    createProduct,
    createFeature,
    createJob,
    createPain,
    createGain,
    createCustomerJourney,
    createCustomerJourneyStep,
    createRelationship,

    // Update methods
    updateIdea,
    updateProblem,
    updateCustomer,
    updateProduct,
    updateFeature,
    updateJob,
    updatePain,
    updateGain,
    updateCustomerJourney,
    updateCustomerJourneyStep,
    updateRelationship,

    // Delete methods
    deleteIdea,
    deleteProblem,
    deleteCustomer,
    deleteProduct,
    deleteFeature,
    deleteJob,
    deletePain,
    deleteGain,
    deleteCustomerJourney,
    deleteCustomerJourneyStep,
    deleteRelationship,

    // Relationship operations
    getRelatedResources,
    getProblemsForIdea,
    getCustomersForIdea,
    getProductsForIdea,
    getFeaturesForProduct,
    getJobsForCustomer,
    getPainsForCustomer,
    getGainsForCustomer,

    // Current context
    setCurrentIdea,
    currentIdeaProblems,
    currentIdeaCustomers,
    currentIdeaProducts,

    // Utility methods
    findResourceById,
    serializeResources,
    deserializeResources
  }
})