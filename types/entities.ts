// Base interface for all entities with common fields
export interface BaseEntity {
  id: string
  created: Date
  updated: Date
}

// Base interface for entities with identifier
export interface IdentifiableEntity extends BaseEntity {
  identifier: string
}

// Account entity
export interface Account extends BaseEntity {
  name: string
}

export class AccountModel implements Account {
  id: string
  name: string
  created: Date
  updated: Date

  constructor(data: Partial<Account> = {}) {
    this.id = data.id || this.generateId()
    this.name = data.name || ''
    this.created = data.created || new Date()
    this.updated = data.updated || new Date()
  }

  private generateId(): string {
    return `acc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  update(data: Partial<Account>): void {
    Object.assign(this, data)
    this.updated = new Date()
  }

  toJSON(): Account {
    return {
      id: this.id,
      name: this.name,
      created: this.created,
      updated: this.updated
    }
  }
}

// User entity
export interface User extends BaseEntity {
  uri: string
}

export class UserModel implements User {
  id: string
  uri: string
  created: Date
  updated: Date

  constructor(data: Partial<User> = {}) {
    this.id = data.id || this.generateId()
    this.uri = data.uri || ''
    this.created = data.created || new Date()
    this.updated = data.updated || new Date()
  }

  private generateId(): string {
    return `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  update(data: Partial<User>): void {
    Object.assign(this, data)
    this.updated = new Date()
  }

  toJSON(): User {
    return {
      id: this.id,
      uri: this.uri,
      created: this.created,
      updated: this.updated
    }
  }
}

// Idea entity
export interface Idea extends IdentifiableEntity {
  title: string
  description: string
}

export class IdeaModel implements Idea {
  id: string
  identifier: string
  title: string
  description: string
  created: Date
  updated: Date

  constructor(data: Partial<Idea> = {}) {
    this.id = data.id || this.generateId()
    this.identifier = data.identifier || this.generateIdentifier()
    this.title = data.title || ''
    this.description = data.description || ''
    this.created = data.created || new Date()
    this.updated = data.updated || new Date()
  }

  private generateId(): string {
    return `idea-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private generateIdentifier(): string {
    return `IDEA-${Date.now()}`
  }

  update(data: Partial<Idea>): void {
    Object.assign(this, data)
    this.updated = new Date()
  }

  toJSON(): Idea {
    return {
      id: this.id,
      identifier: this.identifier,
      title: this.title,
      description: this.description,
      created: this.created,
      updated: this.updated
    }
  }
}

// Problem entity
export interface Problem extends IdentifiableEntity {
  title: string
  description: string
}

export class ProblemModel implements Problem {
  id: string
  identifier: string
  title: string
  description: string
  created: Date
  updated: Date

  constructor(data: Partial<Problem> = {}) {
    this.id = data.id || this.generateId()
    this.identifier = data.identifier || this.generateIdentifier()
    this.title = data.title || ''
    this.description = data.description || ''
    this.created = data.created || new Date()
    this.updated = data.updated || new Date()
  }

  private generateId(): string {
    return `prob-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private generateIdentifier(): string {
    return `PROB-${Date.now()}`
  }

  update(data: Partial<Problem>): void {
    Object.assign(this, data)
    this.updated = new Date()
  }

  toJSON(): Problem {
    return {
      id: this.id,
      identifier: this.identifier,
      title: this.title,
      description: this.description,
      created: this.created,
      updated: this.updated
    }
  }
}

// Customer entity
export interface Customer extends IdentifiableEntity {
  title: string
  givenName: string
  familyName: string
  role: string
  organization: string
}

export class CustomerModel implements Customer {
  id: string
  identifier: string
  title: string
  givenName: string
  familyName: string
  role: string
  organization: string
  created: Date
  updated: Date

  constructor(data: Partial<Customer> = {}) {
    this.id = data.id || this.generateId()
    this.identifier = data.identifier || this.generateIdentifier()
    this.title = data.title || ''
    this.givenName = data.givenName || ''
    this.familyName = data.familyName || ''
    this.role = data.role || ''
    this.organization = data.organization || ''
    this.created = data.created || new Date()
    this.updated = data.updated || new Date()
  }

  private generateId(): string {
    return `cust-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private generateIdentifier(): string {
    return `CUST-${Date.now()}`
  }

  get fullName(): string {
    return `${this.givenName} ${this.familyName}`.trim()
  }

  update(data: Partial<Customer>): void {
    Object.assign(this, data)
    this.updated = new Date()
  }

  toJSON(): Customer {
    return {
      id: this.id,
      identifier: this.identifier,
      title: this.title,
      givenName: this.givenName,
      familyName: this.familyName,
      role: this.role,
      organization: this.organization,
      created: this.created,
      updated: this.updated
    }
  }
}

// CustomerJourney entity
export interface CustomerJourney extends IdentifiableEntity {
  title: string
}

export class CustomerJourneyModel implements CustomerJourney {
  id: string
  identifier: string
  title: string
  created: Date
  updated: Date

  constructor(data: Partial<CustomerJourney> = {}) {
    this.id = data.id || this.generateId()
    this.identifier = data.identifier || this.generateIdentifier()
    this.title = data.title || ''
    this.created = data.created || new Date()
    this.updated = data.updated || new Date()
  }

  private generateId(): string {
    return `journey-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private generateIdentifier(): string {
    return `JOURNEY-${Date.now()}`
  }

  update(data: Partial<CustomerJourney>): void {
    Object.assign(this, data)
    this.updated = new Date()
  }

  toJSON(): CustomerJourney {
    return {
      id: this.id,
      identifier: this.identifier,
      title: this.title,
      created: this.created,
      updated: this.updated
    }
  }
}

// CustomerJourneyStep entity
export interface CustomerJourneyStep extends IdentifiableEntity {
  title: string
}

export class CustomerJourneyStepModel implements CustomerJourneyStep {
  id: string
  identifier: string
  title: string
  created: Date
  updated: Date

  constructor(data: Partial<CustomerJourneyStep> = {}) {
    this.id = data.id || this.generateId()
    this.identifier = data.identifier || this.generateIdentifier()
    this.title = data.title || ''
    this.created = data.created || new Date()
    this.updated = data.updated || new Date()
  }

  private generateId(): string {
    return `step-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private generateIdentifier(): string {
    return `STEP-${Date.now()}`
  }

  update(data: Partial<CustomerJourneyStep>): void {
    Object.assign(this, data)
    this.updated = new Date()
  }

  toJSON(): CustomerJourneyStep {
    return {
      id: this.id,
      identifier: this.identifier,
      title: this.title,
      created: this.created,
      updated: this.updated
    }
  }
}

// Product entity
export interface Product extends BaseEntity {
  title: string
  description: string
}

export class ProductModel implements Product {
  id: string
  title: string
  description: string
  created: Date
  updated: Date

  constructor(data: Partial<Product> = {}) {
    this.id = data.id || this.generateId()
    this.title = data.title || ''
    this.description = data.description || ''
    this.created = data.created || new Date()
    this.updated = data.updated || new Date()
  }

  private generateId(): string {
    return `prod-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  update(data: Partial<Product>): void {
    Object.assign(this, data)
    this.updated = new Date()
  }

  toJSON(): Product {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      created: this.created,
      updated: this.updated
    }
  }
}

// Feature entity
export interface Feature extends BaseEntity {
  title: string
  description: string
  type: FeatureType
  status: FeatureStatus
}

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

export class FeatureModel implements Feature {
  id: string
  title: string
  description: string
  type: FeatureType
  status: FeatureStatus
  created: Date
  updated: Date

  constructor(data: Partial<Feature> = {}) {
    this.id = data.id || this.generateId()
    this.title = data.title || ''
    this.description = data.description || ''
    this.type = data.type || FeatureType.CORE
    this.status = data.status || FeatureStatus.PLANNED
    this.created = data.created || new Date()
    this.updated = data.updated || new Date()
  }

  private generateId(): string {
    return `feat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  update(data: Partial<Feature>): void {
    Object.assign(this, data)
    this.updated = new Date()
  }

  isCompleted(): boolean {
    return this.status === FeatureStatus.COMPLETED
  }

  isInProgress(): boolean {
    return this.status === FeatureStatus.IN_PROGRESS
  }

  toJSON(): Feature {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      type: this.type,
      status: this.status,
      created: this.created,
      updated: this.updated
    }
  }
}

// Job entity
export interface Job extends IdentifiableEntity {
  title: string
  description: string
}

export class JobModel implements Job {
  id: string
  identifier: string
  title: string
  description: string
  created: Date
  updated: Date

  constructor(data: Partial<Job> = {}) {
    this.id = data.id || this.generateId()
    this.identifier = data.identifier || this.generateIdentifier()
    this.title = data.title || ''
    this.description = data.description || ''
    this.created = data.created || new Date()
    this.updated = data.updated || new Date()
  }

  private generateId(): string {
    return `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private generateIdentifier(): string {
    return `JOB-${Date.now()}`
  }

  update(data: Partial<Job>): void {
    Object.assign(this, data)
    this.updated = new Date()
  }

  toJSON(): Job {
    return {
      id: this.id,
      identifier: this.identifier,
      title: this.title,
      description: this.description,
      created: this.created,
      updated: this.updated
    }
  }
}

// Pain entity
export interface Pain extends IdentifiableEntity {
  title: string
  description: string
}

export class PainModel implements Pain {
  id: string
  identifier: string
  title: string
  description: string
  created: Date
  updated: Date

  constructor(data: Partial<Pain> = {}) {
    this.id = data.id || this.generateId()
    this.identifier = data.identifier || this.generateIdentifier()
    this.title = data.title || ''
    this.description = data.description || ''
    this.created = data.created || new Date()
    this.updated = data.updated || new Date()
  }

  private generateId(): string {
    return `pain-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private generateIdentifier(): string {
    return `PAIN-${Date.now()}`
  }

  update(data: Partial<Pain>): void {
    Object.assign(this, data)
    this.updated = new Date()
  }

  toJSON(): Pain {
    return {
      id: this.id,
      identifier: this.identifier,
      title: this.title,
      description: this.description,
      created: this.created,
      updated: this.updated
    }
  }
}

// Gain entity
export interface Gain extends IdentifiableEntity {
  title: string
  description: string
}

export class GainModel implements Gain {
  id: string
  identifier: string
  title: string
  description: string
  created: Date
  updated: Date

  constructor(data: Partial<Gain> = {}) {
    this.id = data.id || this.generateId()
    this.identifier = data.identifier || this.generateIdentifier()
    this.title = data.title || ''
    this.description = data.description || ''
    this.created = data.created || new Date()
    this.updated = data.updated || new Date()
  }

  private generateId(): string {
    return `gain-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private generateIdentifier(): string {
    return `GAIN-${Date.now()}`
  }

  update(data: Partial<Gain>): void {
    Object.assign(this, data)
    this.updated = new Date()
  }

  toJSON(): Gain {
    return {
      id: this.id,
      identifier: this.identifier,
      title: this.title,
      description: this.description,
      created: this.created,
      updated: this.updated
    }
  }
}