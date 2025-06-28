import { defineStore } from 'pinia'
import type { 
  Resource,
  WorkspaceResource,
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
  WorkspaceResourceModel,
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
  const currentWorkspace = ref<WorkspaceResource | null>(null)
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

  const workspaces = computed(() => getResourcesByType<WorkspaceResource>(RESOURCE_TYPES.WORKSPACE))
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

  // Workspace creation and management
  const createWorkspace = (data: Partial<WorkspaceResource>): WorkspaceResourceModel => {
    const workspace = new WorkspaceResourceModel(data)
    addResource(workspace.toJSON())
    return workspace
  }

  const setCurrentWorkspace = (workspace: WorkspaceResource | null): void => {
    currentWorkspace.value = workspace
    // Clear current idea when switching workspaces
    if (workspace) {
      // Find the first idea in this workspace
      const workspaceIdeas = getIdeasForWorkspace(workspace['@id'])
      currentIdea.value = workspaceIdeas.length > 0 ? workspaceIdeas[0] : null
    } else {
      currentIdea.value = null
    }
  }

  // Entity creation methods - all entities belong to current workspace
  const createIdea = (data: Partial<IdeaResource>): IdeaResourceModel => {
    const idea = new IdeaResourceModel(data)
    addResource(idea.toJSON())
    
    // Create belongs relationship to current workspace
    if (currentWorkspace.value) {
      createRelationship({
        sourceId: idea.toJSON()['@id'],
        targetId: currentWorkspace.value['@id'],
        relationshipType: RELATIONSHIP_TYPES.BELONGS
      })
    }
    
    return idea
  }

  const createProblem = (data: Partial<ProblemResource>): ProblemResourceModel => {
    const problem = new ProblemResourceModel(data)
    addResource(problem.toJSON())
    
    // Create belongs relationship to current workspace
    if (currentWorkspace.value) {
      createRelationship({
        sourceId: problem.toJSON()['@id'],
        targetId: currentWorkspace.value['@id'],
        relationshipType: RELATIONSHIP_TYPES.BELONGS
      })
    }
    
    return problem
  }

  const createCustomer = (data: Partial<CustomerResource>): CustomerResourceModel => {
    const customer = new CustomerResourceModel(data)
    addResource(customer.toJSON())
    
    // Create belongs relationship to current workspace
    if (currentWorkspace.value) {
      createRelationship({
        sourceId: customer.toJSON()['@id'],
        targetId: currentWorkspace.value['@id'],
        relationshipType: RELATIONSHIP_TYPES.BELONGS
      })
    }
    
    return customer
  }

  const createProduct = (data: Partial<ProductResource>): ProductResourceModel => {
    const product = new ProductResourceModel(data)
    addResource(product.toJSON())
    
    // Create belongs relationship to current workspace
    if (currentWorkspace.value) {
      createRelationship({
        sourceId: product.toJSON()['@id'],
        targetId: currentWorkspace.value['@id'],
        relationshipType: RELATIONSHIP_TYPES.BELONGS
      })
    }
    
    return product
  }

  const createFeature = (data: Partial<FeatureResource>): FeatureResourceModel => {
    const feature = new FeatureResourceModel(data)
    addResource(feature.toJSON())
    
    // Create belongs relationship to current workspace
    if (currentWorkspace.value) {
      createRelationship({
        sourceId: feature.toJSON()['@id'],
        targetId: currentWorkspace.value['@id'],
        relationshipType: RELATIONSHIP_TYPES.BELONGS
      })
    }
    
    return feature
  }

  const createJob = (data: Partial<JobResource>): JobResourceModel => {
    const job = new JobResourceModel(data)
    addResource(job.toJSON())
    
    // Create belongs relationship to current workspace
    if (currentWorkspace.value) {
      createRelationship({
        sourceId: job.toJSON()['@id'],
        targetId: currentWorkspace.value['@id'],
        relationshipType: RELATIONSHIP_TYPES.BELONGS
      })
    }
    
    return job
  }

  const createPain = (data: Partial<PainResource>): PainResourceModel => {
    const pain = new PainResourceModel(data)
    addResource(pain.toJSON())
    
    // Create belongs relationship to current workspace
    if (currentWorkspace.value) {
      createRelationship({
        sourceId: pain.toJSON()['@id'],
        targetId: currentWorkspace.value['@id'],
        relationshipType: RELATIONSHIP_TYPES.BELONGS
      })
    }
    
    return pain
  }

  const createGain = (data: Partial<GainResource>): GainResourceModel => {
    const gain = new GainResourceModel(data)
    addResource(gain.toJSON())
    
    // Create belongs relationship to current workspace
    if (currentWorkspace.value) {
      createRelationship({
        sourceId: gain.toJSON()['@id'],
        targetId: currentWorkspace.value['@id'],
        relationshipType: RELATIONSHIP_TYPES.BELONGS
      })
    }
    
    return gain
  }

  const createCustomerJourney = (data: Partial<CustomerJourneyResource>): CustomerJourneyResourceModel => {
    const journey = new CustomerJourneyResourceModel(data)
    addResource(journey.toJSON())
    
    // Create belongs relationship to current workspace
    if (currentWorkspace.value) {
      createRelationship({
        sourceId: journey.toJSON()['@id'],
        targetId: currentWorkspace.value['@id'],
        relationshipType: RELATIONSHIP_TYPES.BELONGS
      })
    }
    
    return journey
  }

  const createCustomerJourneyStep = (data: Partial<CustomerJourneyStepResource>): CustomerJourneyStepResourceModel => {
    const step = new CustomerJourneyStepResourceModel(data)
    addResource(step.toJSON())
    
    // Create belongs relationship to current workspace
    if (currentWorkspace.value) {
      createRelationship({
        sourceId: step.toJSON()['@id'],
        targetId: currentWorkspace.value['@id'],
        relationshipType: RELATIONSHIP_TYPES.BELONGS
      })
    }
    
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

  // Workspace-specific queries
  const getIdeasForWorkspace = (workspaceId: string): IdeaResource[] => {
    return getRelatedResources<IdeaResource>(
      workspaceId, 
      RELATIONSHIP_TYPES.BELONGS, 
      RESOURCE_TYPES.IDEA, 
      false
    )
  }

  const getProblemsForWorkspace = (workspaceId: string): ProblemResource[] => {
    return getRelatedResources<ProblemResource>(
      workspaceId, 
      RELATIONSHIP_TYPES.BELONGS, 
      RESOURCE_TYPES.PROBLEM, 
      false
    )
  }

  const getCustomersForWorkspace = (workspaceId: string): CustomerResource[] => {
    return getRelatedResources<CustomerResource>(
      workspaceId, 
      RELATIONSHIP_TYPES.BELONGS, 
      RESOURCE_TYPES.CUSTOMER, 
      false
    )
  }

  const getProductsForWorkspace = (workspaceId: string): ProductResource[] => {
    return getRelatedResources<ProductResource>(
      workspaceId, 
      RELATIONSHIP_TYPES.BELONGS, 
      RESOURCE_TYPES.PRODUCT, 
      false
    )
  }

  const getFeaturesForWorkspace = (workspaceId: string): FeatureResource[] => {
    return getRelatedResources<FeatureResource>(
      workspaceId, 
      RELATIONSHIP_TYPES.BELONGS, 
      RESOURCE_TYPES.FEATURE, 
      false
    )
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

  // Current workspace filtered collections
  const currentWorkspaceIdeas = computed(() => {
    if (!currentWorkspace.value) return []
    return getIdeasForWorkspace(currentWorkspace.value['@id'])
  })

  const currentWorkspaceProblems = computed(() => {
    if (!currentWorkspace.value) return []
    return getProblemsForWorkspace(currentWorkspace.value['@id'])
  })

  const currentWorkspaceCustomers = computed(() => {
    if (!currentWorkspace.value) return []
    return getCustomersForWorkspace(currentWorkspace.value['@id'])
  })

  const currentWorkspaceProducts = computed(() => {
    if (!currentWorkspace.value) return []
    return getProductsForWorkspace(currentWorkspace.value['@id'])
  })

  const currentWorkspaceFeatures = computed(() => {
    if (!currentWorkspace.value) return []
    return getFeaturesForWorkspace(currentWorkspace.value['@id'])
  })

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
  const updateWorkspace = (id: string, data: Partial<WorkspaceResource>): void => {
    updateResource(id, data)
  }

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
  const deleteWorkspace = (id: string): void => {
    deleteResource(id)
  }

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
    currentWorkspace: readonly(currentWorkspace),
    currentIdea: readonly(currentIdea),

    // Computed collections
    workspaces,
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

    // Current workspace filtered collections
    currentWorkspaceIdeas,
    currentWorkspaceProblems,
    currentWorkspaceCustomers,
    currentWorkspaceProducts,
    currentWorkspaceFeatures,

    // Generic operations
    addResource,
    getResource,
    updateResource,
    deleteResource,

    // Workspace operations
    createWorkspace,
    setCurrentWorkspace,

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
    updateWorkspace,
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
    deleteWorkspace,
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
    getIdeasForWorkspace,
    getProblemsForWorkspace,
    getCustomersForWorkspace,
    getProductsForWorkspace,
    getFeaturesForWorkspace,
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