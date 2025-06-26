// Export Types and Interfaces

export enum ExportType {
  BUSINESS_MODEL_CANVAS = 'business_model_canvas',
  SWOT_ANALYSIS = 'swot_analysis',
  DESIGN_SPRINT = 'design_sprint',
  CUSTOMER_JOURNEY = 'customer_journey',
  FEATURE_ROADMAP = 'feature_roadmap',
  IDEA_SUMMARY = 'idea_summary',
  ALL_ENTITIES = 'all_entities'
}

export enum ExportFormat {
  MARKDOWN = 'markdown',
  PDF = 'pdf',
  IMAGE = 'image',
  JSON = 'json',
  CSV = 'csv'
}

export enum ExportDestination {
  DISK = 'disk',
  GOOGLE_DRIVE = 'google_drive',
  EMAIL = 'email',
  CLIPBOARD = 'clipboard',
  LOCAL_STORAGE = 'local_storage'
}

export interface ExportConfig {
  type: ExportType
  format: ExportFormat
  destination: ExportDestination
  filename?: string
  includeMetadata?: boolean
  includeRelationships?: boolean
}

export interface ExportData {
  title: string
  description?: string
  content: any
  metadata: {
    exportedAt: Date
    exportType: ExportType
    exportFormat: ExportFormat
    version: string
  }
}

export interface FormattedContent {
  content: string | Blob
  mimeType: string
  filename: string
}

export interface ExportResult {
  success: boolean
  message: string
  data?: FormattedContent
  error?: string
}

// Business Model Canvas specific types
export interface BusinessModelCanvas {
  keyPartners: string[]
  keyActivities: string[]
  keyResources: string[]
  valuePropositions: string[]
  customerRelationships: string[]
  channels: string[]
  customerSegments: string[]
  costStructure: string[]
  revenueStreams: string[]
}

// SWOT Analysis specific types
export interface SWOTAnalysis {
  strengths: string[]
  weaknesses: string[]
  opportunities: string[]
  threats: string[]
}

// Design Sprint specific types
export interface DesignSprint {
  understand: string[]
  define: string[]
  sketch: string[]
  decide: string[]
  prototype: string[]
  test: string[]
}

// Customer Journey specific types
export interface CustomerJourneyMap {
  stages: {
    name: string
    actions: string[]
    thoughts: string[]
    emotions: string[]
    painPoints: string[]
    opportunities: string[]
  }[]
}

// Feature Roadmap specific types
export interface FeatureRoadmap {
  phases: {
    name: string
    timeframe: string
    features: {
      title: string
      description: string
      priority: 'high' | 'medium' | 'low'
      status: 'planned' | 'in_progress' | 'completed'
    }[]
  }[]
}

// All Entities specific types
export interface AllEntities {
  ideas: {
    id: string
    title: string
    description: string
    identifier: string
    created: Date
    updated: Date
  }[]
  problems: {
    id: string
    title: string
    description: string
    created: Date
    updated: Date
  }[]
  customers: {
    id: string
    title: string
    givenName: string
    familyName: string
    fullName: string
    role: string
    organization: string
    created: Date
    updated: Date
  }[]
  products: {
    id: string
    title: string
    description: string
    created: Date
    updated: Date
  }[]
  features: {
    id: string
    title: string
    description: string
    type: string
    status: string
    created: Date
    updated: Date
  }[]
  jobs: {
    id: string
    title: string
    description: string
    created: Date
    updated: Date
  }[]
  pains: {
    id: string
    title: string
    description: string
    created: Date
    updated: Date
  }[]
  gains: {
    id: string
    title: string
    description: string
    created: Date
    updated: Date
  }[]
  relationships: {
    id: string
    sourceId: string
    targetId: string
    relationshipType: string
    created: Date
  }[]
  statistics: {
    totalIdeas: number
    totalProblems: number
    totalCustomers: number
    totalProducts: number
    totalFeatures: number
    totalJobs: number
    totalPains: number
    totalGains: number
    totalRelationships: number
  }
} 