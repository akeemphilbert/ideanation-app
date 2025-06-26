// Relationship interfaces based on the ERD
export interface EntityRelationship {
  id: string
  sourceId: string
  targetId: string
  relationshipType: string
  created: Date
  updated: Date
}

// Account-User relationship
export interface AccountUserRelationship extends EntityRelationship {
  relationshipType: 'has'
}

// User-Idea relationship
export interface UserIdeaRelationship extends EntityRelationship {
  relationshipType: 'owns'
}

// User-Problem relationship
export interface UserProblemRelationship extends EntityRelationship {
  relationshipType: 'experiences'
}

// Idea-Product relationship
export interface IdeaProductRelationship extends EntityRelationship {
  relationshipType: 'mvp'
}

// Feature-Product relationships
export interface FeatureProductRelationship extends EntityRelationship {
  relationshipType: 'belongs' | 'planned'
}

// Problem-Idea relationship
export interface ProblemIdeaRelationship extends EntityRelationship {
  relationshipType: 'belongs'
}

// Customer-Idea relationship
export interface CustomerIdeaRelationship extends EntityRelationship {
  relationshipType: 'belongs'
}

// Customer relationships
export interface CustomerJobRelationship extends EntityRelationship {
  relationshipType: 'performs'
}

export interface CustomerPainRelationship extends EntityRelationship {
  relationshipType: 'experiences'
}

export interface CustomerGainRelationship extends EntityRelationship {
  relationshipType: 'desires'
}

// CustomerJourney relationships
export interface CustomerJourneyCustomerRelationship extends EntityRelationship {
  relationshipType: 'belongs'
}

export interface CustomerJourneyStepJourneyRelationship extends EntityRelationship {
  relationshipType: 'belongs'
}

// CustomerJourneyStep relationships
export interface CustomerJourneyStepProductRelationship extends EntityRelationship {
  relationshipType: 'uses'
}

export interface CustomerJourneyStepPainRelationship extends EntityRelationship {
  relationshipType: 'associated'
}

export interface CustomerJourneyStepGainRelationship extends EntityRelationship {
  relationshipType: 'associated'
}

// Feature relationships
export interface FeatureJobRelationship extends EntityRelationship {
  relationshipType: 'associated'
}

export interface FeaturePainRelationship extends EntityRelationship {
  relationshipType: 'associated' | 'relieves'
}

export interface FeatureGainRelationship extends EntityRelationship {
  relationshipType: 'associated' | 'creates'
}

// Generic relationship model class
export class RelationshipModel implements EntityRelationship {
  id: string
  sourceId: string
  targetId: string
  relationshipType: string
  created: Date
  updated: Date

  constructor(data: Partial<EntityRelationship> & { sourceId: string; targetId: string; relationshipType: string }) {
    this.id = data.id || this.generateId()
    this.sourceId = data.sourceId
    this.targetId = data.targetId
    this.relationshipType = data.relationshipType
    this.created = data.created || new Date()
    this.updated = data.updated || new Date()
  }

  private generateId(): string {
    return `rel-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  update(data: Partial<EntityRelationship>): void {
    Object.assign(this, data)
    this.updated = new Date()
  }

  toJSON(): EntityRelationship {
    return {
      id: this.id,
      sourceId: this.sourceId,
      targetId: this.targetId,
      relationshipType: this.relationshipType,
      created: this.created,
      updated: this.updated
    }
  }
}

// Relationship type unions for type safety
export type AllRelationshipTypes = 
  | AccountUserRelationship
  | UserIdeaRelationship
  | UserProblemRelationship
  | IdeaProductRelationship
  | FeatureProductRelationship
  | ProblemIdeaRelationship
  | CustomerIdeaRelationship
  | CustomerJobRelationship
  | CustomerPainRelationship
  | CustomerGainRelationship
  | CustomerJourneyCustomerRelationship
  | CustomerJourneyStepJourneyRelationship
  | CustomerJourneyStepProductRelationship
  | CustomerJourneyStepPainRelationship
  | CustomerJourneyStepGainRelationship
  | FeatureJobRelationship
  | FeaturePainRelationship
  | FeatureGainRelationship