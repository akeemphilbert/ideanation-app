import { defineStore } from 'pinia'
import {
  AccountModel, UserModel, IdeaModel, ProblemModel, CustomerModel,
  CustomerJourneyModel, CustomerJourneyStepModel, ProductModel,
  FeatureModel, JobModel, PainModel, GainModel
} from '~/types/entities'
import { RelationshipModel } from '~/types/relationships'
import type {
  Account, User, Idea, Problem, Customer, CustomerJourney, CustomerJourneyStep,
  Product, Feature, Job, Pain, Gain
} from '~/types/entities'
import type { EntityRelationship } from '~/types/relationships'

export const useEntitiesStore = defineStore('entities', () => {
  // State
  const accounts = ref<AccountModel[]>([])
  const users = ref<UserModel[]>([])
  const ideas = ref<IdeaModel[]>([])
  const problems = ref<ProblemModel[]>([])
  const customers = ref<CustomerModel[]>([])
  const customerJourneys = ref<CustomerJourneyModel[]>([])
  const customerJourneySteps = ref<CustomerJourneyStepModel[]>([])
  const products = ref<ProductModel[]>([])
  const features = ref<FeatureModel[]>([])
  const jobs = ref<JobModel[]>([])
  const pains = ref<PainModel[]>([])
  const gains = ref<GainModel[]>([])
  const relationships = ref<RelationshipModel[]>([])

  // Current active entities
  const currentUser = ref<UserModel | null>(null)
  const currentIdea = ref<IdeaModel | null>(null)

  // Actions - Account operations
  const createAccount = (data: Partial<Account>): AccountModel => {
    const account = new AccountModel(data)
    accounts.value.push(account)
    return account
  }

  const updateAccount = (accountId: string, data: Partial<Account>): void => {
    const account = accounts.value.find(a => a.id === accountId)
    if (account) {
      account.update(data)
    }
  }

  const deleteAccount = (accountId: string): void => {
    accounts.value = accounts.value.filter(a => a.id !== accountId)
  }

  // Actions - User operations
  const createUser = (data: Partial<User>): UserModel => {
    const user = new UserModel(data)
    users.value.push(user)
    return user
  }

  const updateUser = (userId: string, data: Partial<User>): void => {
    const user = users.value.find(u => u.id === userId)
    if (user) {
      user.update(data)
    }
  }

  const deleteUser = (userId: string): void => {
    users.value = users.value.filter(u => u.id !== userId)
  }

  const setCurrentUser = (user: UserModel | null): void => {
    currentUser.value = user
  }

  // Actions - Idea operations
  const createIdea = (data: Partial<Idea>): IdeaModel => {
    const idea = new IdeaModel(data)
    ideas.value.push(idea)
    return idea
  }

  const updateIdea = (ideaId: string, data: Partial<Idea>): void => {
    const idea = ideas.value.find(i => i.id === ideaId)
    if (idea) {
      idea.update(data)
    }
  }

  const deleteIdea = (ideaId: string): void => {
    ideas.value = ideas.value.filter(i => i.id !== ideaId)
    // Also remove related entities and relationships
    removeRelationshipsForEntity(ideaId)
  }

  const setCurrentIdea = (idea: IdeaModel | null): void => {
    currentIdea.value = idea
  }

  // Actions - Problem operations
  const createProblem = (data: Partial<Problem>): ProblemModel => {
    const problem = new ProblemModel(data)
    problems.value.push(problem)
    return problem
  }

  const updateProblem = (problemId: string, data: Partial<Problem>): void => {
    const problem = problems.value.find(p => p.id === problemId)
    if (problem) {
      problem.update(data)
    }
  }

  const deleteProblem = (problemId: string): void => {
    problems.value = problems.value.filter(p => p.id !== problemId)
    removeRelationshipsForEntity(problemId)
  }

  // Actions - Customer operations
  const createCustomer = (data: Partial<Customer>): CustomerModel => {
    const customer = new CustomerModel(data)
    customers.value.push(customer)
    return customer
  }

  const updateCustomer = (customerId: string, data: Partial<Customer>): void => {
    const customer = customers.value.find(c => c.id === customerId)
    if (customer) {
      customer.update(data)
    }
  }

  const deleteCustomer = (customerId: string): void => {
    customers.value = customers.value.filter(c => c.id !== customerId)
    removeRelationshipsForEntity(customerId)
  }

  // Actions - Product operations
  const createProduct = (data: Partial<Product>): ProductModel => {
    const product = new ProductModel(data)
    products.value.push(product)
    return product
  }

  const updateProduct = (productId: string, data: Partial<Product>): void => {
    const product = products.value.find(p => p.id === productId)
    if (product) {
      product.update(data)
    }
  }

  const deleteProduct = (productId: string): void => {
    products.value = products.value.filter(p => p.id !== productId)
    removeRelationshipsForEntity(productId)
  }

  // Actions - Feature operations
  const createFeature = (data: Partial<Feature>): FeatureModel => {
    const feature = new FeatureModel(data)
    features.value.push(feature)
    return feature
  }

  const updateFeature = (featureId: string, data: Partial<Feature>): void => {
    const feature = features.value.find(f => f.id === featureId)
    if (feature) {
      feature.update(data)
    }
  }

  const deleteFeature = (featureId: string): void => {
    features.value = features.value.filter(f => f.id !== featureId)
    removeRelationshipsForEntity(featureId)
  }

  // Actions - Job operations
  const createJob = (data: Partial<Job>): JobModel => {
    const job = new JobModel(data)
    jobs.value.push(job)
    return job
  }

  const updateJob = (jobId: string, data: Partial<Job>): void => {
    const job = jobs.value.find(j => j.id === jobId)
    if (job) {
      job.update(data)
    }
  }

  const deleteJob = (jobId: string): void => {
    jobs.value = jobs.value.filter(j => j.id !== jobId)
    removeRelationshipsForEntity(jobId)
  }

  // Actions - Pain operations
  const createPain = (data: Partial<Pain>): PainModel => {
    const pain = new PainModel(data)
    pains.value.push(pain)
    return pain
  }

  const updatePain = (painId: string, data: Partial<Pain>): void => {
    const pain = pains.value.find(p => p.id === painId)
    if (pain) {
      pain.update(data)
    }
  }

  const deletePain = (painId: string): void => {
    pains.value = pains.value.filter(p => p.id !== painId)
    removeRelationshipsForEntity(painId)
  }

  // Actions - Gain operations
  const createGain = (data: Partial<Gain>): GainModel => {
    const gain = new GainModel(data)
    gains.value.push(gain)
    return gain
  }

  const updateGain = (gainId: string, data: Partial<Gain>): void => {
    const gain = gains.value.find(g => g.id === gainId)
    if (gain) {
      gain.update(data)
    }
  }

  const deleteGain = (gainId: string): void => {
    gains.value = gains.value.filter(g => g.id !== gainId)
    removeRelationshipsForEntity(gainId)
  }

  // Actions - CustomerJourney operations
  const createCustomerJourney = (data: Partial<CustomerJourney>): CustomerJourneyModel => {
    const journey = new CustomerJourneyModel(data)
    customerJourneys.value.push(journey)
    return journey
  }

  const updateCustomerJourney = (journeyId: string, data: Partial<CustomerJourney>): void => {
    const journey = customerJourneys.value.find(j => j.id === journeyId)
    if (journey) {
      journey.update(data)
    }
  }

  const deleteCustomerJourney = (journeyId: string): void => {
    customerJourneys.value = customerJourneys.value.filter(j => j.id !== journeyId)
    removeRelationshipsForEntity(journeyId)
  }

  // Actions - CustomerJourneyStep operations
  const createCustomerJourneyStep = (data: Partial<CustomerJourneyStep>): CustomerJourneyStepModel => {
    const step = new CustomerJourneyStepModel(data)
    customerJourneySteps.value.push(step)
    return step
  }

  const updateCustomerJourneyStep = (stepId: string, data: Partial<CustomerJourneyStep>): void => {
    const step = customerJourneySteps.value.find(s => s.id === stepId)
    if (step) {
      step.update(data)
    }
  }

  const deleteCustomerJourneyStep = (stepId: string): void => {
    customerJourneySteps.value = customerJourneySteps.value.filter(s => s.id !== stepId)
    removeRelationshipsForEntity(stepId)
  }

  // Actions - Relationship operations
  const createRelationship = (data: {
    sourceId: string
    targetId: string
    relationshipType: string
  }): RelationshipModel => {
    const relationship = new RelationshipModel(data)
    relationships.value.push(relationship)
    return relationship
  }

  const updateRelationship = (relationshipId: string, data: Partial<EntityRelationship>): void => {
    const relationship = relationships.value.find(r => r.id === relationshipId)
    if (relationship) {
      relationship.update(data)
    }
  }

  const deleteRelationship = (relationshipId: string): void => {
    relationships.value = relationships.value.filter(r => r.id !== relationshipId)
  }

  const removeRelationshipsForEntity = (entityId: string): void => {
    relationships.value = relationships.value.filter(
      r => r.sourceId !== entityId && r.targetId !== entityId
    )
  }

  // Getters - Relationship queries
  const getRelatedEntities = <T extends { id: string }>(
    entityId: string,
    relationshipType: string,
    targetCollection: T[],
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

    return targetCollection.filter(entity => relatedIds.includes(entity.id))
  }

  // Computed getters for current context
  const currentUserIdeas = computed(() => {
    if (!currentUser.value) return []
    return getRelatedEntities(currentUser.value.id, 'owns', ideas.value)
  })

  const currentIdeaProblems = computed(() => {
    if (!currentIdea.value) return []
    return getRelatedEntities(currentIdea.value.id, 'belongs', problems.value, false)
  })

  const currentIdeaCustomers = computed(() => {
    if (!currentIdea.value) return []
    return getRelatedEntities(currentIdea.value.id, 'belongs', customers.value, false)
  })

  const currentIdeaProducts = computed(() => {
    if (!currentIdea.value) return []
    return getRelatedEntities(currentIdea.value.id, 'mvp', products.value)
  })

  return {
    // State
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

    // Current context
    currentUser: readonly(currentUser),
    currentIdea: readonly(currentIdea),

    // Actions
    createAccount, updateAccount, deleteAccount,
    createUser, updateUser, deleteUser, setCurrentUser,
    createIdea, updateIdea, deleteIdea, setCurrentIdea,
    createProblem, updateProblem, deleteProblem,
    createCustomer, updateCustomer, deleteCustomer,
    createProduct, updateProduct, deleteProduct,
    createFeature, updateFeature, deleteFeature,
    createJob, updateJob, deleteJob,
    createPain, updatePain, deletePain,
    createGain, updateGain, deleteGain,
    createCustomerJourney, updateCustomerJourney, deleteCustomerJourney,
    createCustomerJourneyStep, updateCustomerJourneyStep, deleteCustomerJourneyStep,
    createRelationship, updateRelationship, deleteRelationship,

    // Computed getters
    currentUserIdeas,
    currentIdeaProblems,
    currentIdeaCustomers,
    currentIdeaProducts,

    // Utility functions
    getRelatedEntities
  }
})