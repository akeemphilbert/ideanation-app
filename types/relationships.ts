// Simplified relationship interfaces
export interface EntityRelationship {
  id: string
  sourceId: string
  targetId: string
  relationshipType: string
  created: Date
  updated: Date
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

// Common relationship types as constants for consistency
export const RELATIONSHIP_TYPES = {
  // Ownership relationships
  HAS: 'has',
  OWNS: 'owns',
  BELONGS: 'belongs',
  
  // Product relationships
  MVP: 'mvp',
  PLANNED: 'planned',
  
  // Customer relationships
  PERFORMS: 'performs',
  EXPERIENCES: 'experiences',
  DESIRES: 'desires',
  
  // Feature relationships
  ASSOCIATED: 'associated',
  RELIEVES: 'relieves',
  CREATES: 'creates',
  USES: 'uses',
  
  // Generic relationships
  RELATED: 'related',
  DEPENDS: 'depends',
  INFLUENCES: 'influences',
  SUPPORTS: 'supports',
  ADDRESSES: 'addresses',
  SOLVES: 'solves'
} as const

export type RelationshipType = typeof RELATIONSHIP_TYPES[keyof typeof RELATIONSHIP_TYPES]