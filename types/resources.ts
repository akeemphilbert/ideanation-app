// Base resource interface - all entities and relationships are resources
export interface BaseResource {
  '@id': string
  '@type': string
  id: string
  created: Date
  updated: Date
}

// Entity resource types
export interface IdeaResource extends BaseResource {
  '@type': 'ideanation:Idea'
  title: string
  description: string
  identifier: string
}

export interface ProblemResource extends BaseResource {
  '@type': 'ideanation:Problem'
  title: string
  description: string
  identifier: string
}

export interface CustomerResource extends BaseResource {
  '@type': 'ideanation:Customer'
  title: string
  givenName: string
  familyName: string
  role: string
  organization: string
  identifier: string
}

export interface ProductResource extends BaseResource {
  '@type': 'ideanation:Product'
  title: string
  description: string
}

export interface FeatureResource extends BaseResource {
  '@type': 'ideanation:Feature'
  title: string
  description: string
  type: FeatureType
  status: FeatureStatus
}

export interface JobResource extends BaseResource {
  '@type': 'ideanation:Job'
  title: string
  description: string
  identifier: string
}

export interface PainResource extends BaseResource {
  '@type': 'ideanation:Pain'
  title: string
  description: string
  identifier: string
}

export interface GainResource extends BaseResource {
  '@type': 'ideanation:Gain'
  title: string
  description: string
  identifier: string
}

export interface CustomerJourneyResource extends BaseResource {
  '@type': 'ideanation:CustomerJourney'
  title: string
  identifier: string
}

export interface CustomerJourneyStepResource extends BaseResource {
  '@type': 'ideanation:CustomerJourneyStep'
  title: string
  identifier: string
}

// Relationship resource (triple)
export interface RelationshipResource extends BaseResource {
  '@type': 'ideanation:Relationship'
  sourceId: string
  targetId: string
  relationshipType: string
}

// Union type for all resources
export type Resource = 
  | IdeaResource
  | ProblemResource
  | CustomerResource
  | ProductResource
  | FeatureResource
  | JobResource
  | PainResource
  | GainResource
  | CustomerJourneyResource
  | CustomerJourneyStepResource
  | RelationshipResource

// Enums
export enum FeatureType {
  CORE = 'core',
  ENHANCEMENT = 'enhancement',
  INTEGRATION = 'integration',
  EXPERIMENTAL = 'experimental'
}

export enum FeatureStatus {
  PLANNED = 'planned',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  ON_HOLD = 'on_hold'
}

// Resource type mapping
export const RESOURCE_TYPES = {
  IDEA: 'ideanation:Idea',
  PROBLEM: 'ideanation:Problem',
  CUSTOMER: 'ideanation:Customer',
  PRODUCT: 'ideanation:Product',
  FEATURE: 'ideanation:Feature',
  JOB: 'ideanation:Job',
  PAIN: 'ideanation:Pain',
  GAIN: 'ideanation:Gain',
  CUSTOMER_JOURNEY: 'ideanation:CustomerJourney',
  CUSTOMER_JOURNEY_STEP: 'ideanation:CustomerJourneyStep',
  RELATIONSHIP: 'ideanation:Relationship'
} as const

// URL path mapping for @id generation
export const RESOURCE_PATHS = {
  'ideanation:Idea': '/ideas',
  'ideanation:Problem': '/problems',
  'ideanation:Customer': '/customers',
  'ideanation:Product': '/products',
  'ideanation:Feature': '/features',
  'ideanation:Job': '/jobs',
  'ideanation:Pain': '/pains',
  'ideanation:Gain': '/gains',
  'ideanation:CustomerJourney': '/customer-journeys',
  'ideanation:CustomerJourneyStep': '/customer-journey-steps',
  'ideanation:Relationship': '/relationships'
} as const

// Relationship types
export const RELATIONSHIP_TYPES = {
  HAS: 'has',
  OWNS: 'owns',
  BELONGS: 'belongs',
  MVP: 'mvp',
  PLANNED: 'planned',
  PERFORMS: 'performs',
  EXPERIENCES: 'experiences',
  DESIRES: 'desires',
  ASSOCIATED: 'associated',
  RELIEVES: 'relieves',
  CREATES: 'creates',
  USES: 'uses',
  RELATED: 'related',
  DEPENDS: 'depends',
  INFLUENCES: 'influences',
  SUPPORTS: 'supports',
  ADDRESSES: 'addresses',
  SOLVES: 'solves'
} as const

// Utility functions
export function generateKSUID(): string {
  // Browser-compatible unique ID generation
  const timestamp = Date.now().toString(36)
  const randomPart = Math.random().toString(36).substring(2, 15)
  const additionalRandom = Math.random().toString(36).substring(2, 15)
  return `${timestamp}${randomPart}${additionalRandom}`
}

export function generateResourceId(type: string): string {
  const ksuid = generateKSUID()
  const path = RESOURCE_PATHS[type as keyof typeof RESOURCE_PATHS]
  return `${path}/${ksuid}`
}

export function extractKSUIDFromId(id: string): string {
  return id.split('/').pop() || ''
}

export function getResourceTypeFromId(id: string): string | null {
  const path = '/' + id.split('/').slice(1, -1).join('/')
  const entry = Object.entries(RESOURCE_PATHS).find(([, p]) => p === path)
  return entry ? entry[0] : null
}

// Base resource class
export abstract class BaseResourceModel implements BaseResource {
  '@id': string
  '@type': string
  id: string
  created: Date
  updated: Date

  constructor(type: string, data: Partial<BaseResource> = {}) {
    this.id = data.id || generateKSUID()
    this['@id'] = data['@id'] || generateResourceId(type)
    this['@type'] = type
    this.created = data.created || new Date()
    this.updated = data.updated || new Date()
  }

  update(data: Partial<BaseResource>): void {
    Object.assign(this, data)
    this.updated = new Date()
  }

  toJSON(): BaseResource {
    return {
      '@id': this['@id'],
      '@type': this['@type'],
      id: this.id,
      created: this.created,
      updated: this.updated
    }
  }
}

// Specific resource model classes
export class IdeaResourceModel extends BaseResourceModel implements IdeaResource {
  '@type': 'ideanation:Idea' = RESOURCE_TYPES.IDEA
  title: string
  description: string
  identifier: string

  constructor(data: Partial<IdeaResource> = {}) {
    super(RESOURCE_TYPES.IDEA, data)
    this.title = data.title || ''
    this.description = data.description || ''
    this.identifier = data.identifier || `IDEA-${this.id}`
  }

  toJSON(): IdeaResource {
    return {
      ...super.toJSON(),
      '@type': this['@type'],
      title: this.title,
      description: this.description,
      identifier: this.identifier
    }
  }
}

export class ProblemResourceModel extends BaseResourceModel implements ProblemResource {
  '@type': 'ideanation:Problem' = RESOURCE_TYPES.PROBLEM
  title: string
  description: string
  identifier: string

  constructor(data: Partial<ProblemResource> = {}) {
    super(RESOURCE_TYPES.PROBLEM, data)
    this.title = data.title || ''
    this.description = data.description || ''
    this.identifier = data.identifier || `PROB-${this.id}`
  }

  toJSON(): ProblemResource {
    return {
      ...super.toJSON(),
      '@type': this['@type'],
      title: this.title,
      description: this.description,
      identifier: this.identifier
    }
  }
}

export class CustomerResourceModel extends BaseResourceModel implements CustomerResource {
  '@type': 'ideanation:Customer' = RESOURCE_TYPES.CUSTOMER
  title: string
  givenName: string
  familyName: string
  role: string
  organization: string
  identifier: string

  constructor(data: Partial<CustomerResource> = {}) {
    super(RESOURCE_TYPES.CUSTOMER, data)
    this.title = data.title || ''
    this.givenName = data.givenName || ''
    this.familyName = data.familyName || ''
    this.role = data.role || ''
    this.organization = data.organization || ''
    this.identifier = data.identifier || `CUST-${this.id}`
  }

  get fullName(): string {
    return `${this.givenName} ${this.familyName}`.trim()
  }

  toJSON(): CustomerResource {
    return {
      ...super.toJSON(),
      '@type': this['@type'],
      title: this.title,
      givenName: this.givenName,
      familyName: this.familyName,
      role: this.role,
      organization: this.organization,
      identifier: this.identifier
    }
  }
}

export class ProductResourceModel extends BaseResourceModel implements ProductResource {
  '@type': 'ideanation:Product' = RESOURCE_TYPES.PRODUCT
  title: string
  description: string

  constructor(data: Partial<ProductResource> = {}) {
    super(RESOURCE_TYPES.PRODUCT, data)
    this.title = data.title || ''
    this.description = data.description || ''
  }

  toJSON(): ProductResource {
    return {
      ...super.toJSON(),
      '@type': this['@type'],
      title: this.title,
      description: this.description
    }
  }
}

export class FeatureResourceModel extends BaseResourceModel implements FeatureResource {
  '@type': 'ideanation:Feature' = RESOURCE_TYPES.FEATURE
  title: string
  description: string
  type: FeatureType
  status: FeatureStatus

  constructor(data: Partial<FeatureResource> = {}) {
    super(RESOURCE_TYPES.FEATURE, data)
    this.title = data.title || ''
    this.description = data.description || ''
    this.type = data.type || FeatureType.CORE
    this.status = data.status || FeatureStatus.PLANNED
  }

  toJSON(): FeatureResource {
    return {
      ...super.toJSON(),
      '@type': this['@type'],
      title: this.title,
      description: this.description,
      type: this.type,
      status: this.status
    }
  }
}

export class JobResourceModel extends BaseResourceModel implements JobResource {
  '@type': 'ideanation:Job' = RESOURCE_TYPES.JOB
  title: string
  description: string
  identifier: string

  constructor(data: Partial<JobResource> = {}) {
    super(RESOURCE_TYPES.JOB, data)
    this.title = data.title || ''
    this.description = data.description || ''
    this.identifier = data.identifier || `JOB-${this.id}`
  }

  toJSON(): JobResource {
    return {
      ...super.toJSON(),
      '@type': this['@type'],
      title: this.title,
      description: this.description,
      identifier: this.identifier
    }
  }
}

export class PainResourceModel extends BaseResourceModel implements PainResource {
  '@type': 'ideanation:Pain' = RESOURCE_TYPES.PAIN
  title: string
  description: string
  identifier: string

  constructor(data: Partial<PainResource> = {}) {
    super(RESOURCE_TYPES.PAIN, data)
    this.title = data.title || ''
    this.description = data.description || ''
    this.identifier = data.identifier || `PAIN-${this.id}`
  }

  toJSON(): PainResource {
    return {
      ...super.toJSON(),
      '@type': this['@type'],
      title: this.title,
      description: this.description,
      identifier: this.identifier
    }
  }
}

export class GainResourceModel extends BaseResourceModel implements GainResource {
  '@type': 'ideanation:Gain' = RESOURCE_TYPES.GAIN
  title: string
  description: string
  identifier: string

  constructor(data: Partial<GainResource> = {}) {
    super(RESOURCE_TYPES.GAIN, data)
    this.title = data.title || ''
    this.description = data.description || ''
    this.identifier = data.identifier || `GAIN-${this.id}`
  }

  toJSON(): GainResource {
    return {
      ...super.toJSON(),
      '@type': this['@type'],
      title: this.title,
      description: this.description,
      identifier: this.identifier
    }
  }
}

export class CustomerJourneyResourceModel extends BaseResourceModel implements CustomerJourneyResource {
  '@type': 'ideanation:CustomerJourney' = RESOURCE_TYPES.CUSTOMER_JOURNEY
  title: string
  identifier: string

  constructor(data: Partial<CustomerJourneyResource> = {}) {
    super(RESOURCE_TYPES.CUSTOMER_JOURNEY, data)
    this.title = data.title || ''
    this.identifier = data.identifier || `JOURNEY-${this.id}`
  }

  toJSON(): CustomerJourneyResource {
    return {
      ...super.toJSON(),
      '@type': this['@type'],
      title: this.title,
      identifier: this.identifier
    }
  }
}

export class CustomerJourneyStepResourceModel extends BaseResourceModel implements CustomerJourneyStepResource {
  '@type': 'ideanation:CustomerJourneyStep' = RESOURCE_TYPES.CUSTOMER_JOURNEY_STEP
  title: string
  identifier: string

  constructor(data: Partial<CustomerJourneyStepResource> = {}) {
    super(RESOURCE_TYPES.CUSTOMER_JOURNEY_STEP, data)
    this.title = data.title || ''
    this.identifier = data.identifier || `STEP-${this.id}`
  }

  toJSON(): CustomerJourneyStepResource {
    return {
      ...super.toJSON(),
      '@type': this['@type'],
      title: this.title,
      identifier: this.identifier
    }
  }
}

export class RelationshipResourceModel extends BaseResourceModel implements RelationshipResource {
  '@type': 'ideanation:Relationship' = RESOURCE_TYPES.RELATIONSHIP
  sourceId: string
  targetId: string
  relationshipType: string

  constructor(data: Partial<RelationshipResource> & { sourceId: string; targetId: string; relationshipType: string }) {
    super(RESOURCE_TYPES.RELATIONSHIP, data)
    this.sourceId = data.sourceId
    this.targetId = data.targetId
    this.relationshipType = data.relationshipType
  }

  toJSON(): RelationshipResource {
    return {
      ...super.toJSON(),
      '@type': this['@type'],
      sourceId: this.sourceId,
      targetId: this.targetId,
      relationshipType: this.relationshipType
    }
  }
}