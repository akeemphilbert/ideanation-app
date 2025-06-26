import { useEntitiesStore } from '~/stores/entities'
import { 
  ExportType, 
  ExportFormat 
} from '~/types/export'
import type { 
  ExportData, 
  BusinessModelCanvas, 
  SWOTAnalysis, 
  DesignSprint, 
  CustomerJourneyMap, 
  FeatureRoadmap 
} from '~/types/export'

export class ExportDataBuilder {
  private entitiesStore = useEntitiesStore()

  async buildExportData(type: ExportType, ideaId?: string): Promise<ExportData> {
    const idea = ideaId ? this.entitiesStore.ideas.find(i => i.id === ideaId) : this.entitiesStore.currentIdea
    
    if (!idea) {
      throw new Error('No idea selected for export')
    }

    switch (type) {
      case ExportType.BUSINESS_MODEL_CANVAS:
        return this.buildBusinessModelCanvas(idea.id)
      case ExportType.SWOT_ANALYSIS:
        return this.buildSWOTAnalysis(idea.id)
      case ExportType.DESIGN_SPRINT:
        return this.buildDesignSprint(idea.id)
      case ExportType.CUSTOMER_JOURNEY:
        return this.buildCustomerJourney(idea.id)
      case ExportType.FEATURE_ROADMAP:
        return this.buildFeatureRoadmap(idea.id)
      case ExportType.IDEA_SUMMARY:
        return this.buildIdeaSummary(idea.id)
      case ExportType.ALL_ENTITIES:
        return this.buildAllEntities(idea.id)
      default:
        throw new Error(`Unsupported export type: ${type}`)
    }
  }

  private buildBusinessModelCanvas(ideaId: string): ExportData {
    const idea = this.entitiesStore.ideas.find(i => i.id === ideaId)!
    const customers = this.entitiesStore.getRelatedEntities(ideaId, 'has_customer', [...this.entitiesStore.customers])
    const problems = this.entitiesStore.getRelatedEntities(ideaId, 'solves', [...this.entitiesStore.problems])
    const products = this.entitiesStore.getRelatedEntities(ideaId, 'has_product', [...this.entitiesStore.products])
    const features = this.entitiesStore.getRelatedEntities(ideaId, 'has_feature', [...this.entitiesStore.features])
    const jobs = this.entitiesStore.getRelatedEntities(ideaId, 'addresses_job', [...this.entitiesStore.jobs])
    const pains = this.entitiesStore.getRelatedEntities(ideaId, 'addresses_pain', [...this.entitiesStore.pains])
    const gains = this.entitiesStore.getRelatedEntities(ideaId, 'provides_gain', [...this.entitiesStore.gains])

    const canvas: BusinessModelCanvas = {
      keyPartners: [], // Would be populated from partnerships/relationships
      keyActivities: features.map(f => f.title),
      keyResources: [], // Would be populated from resources
      valuePropositions: [
        ...problems.map(p => `Solves: ${p.title}`),
        ...pains.map(p => `Addresses: ${p.title}`),
        ...gains.map(g => `Provides: ${g.title}`)
      ],
      customerRelationships: customers.map(c => `${c.fullName} (${c.role} at ${c.organization})`),
      channels: [], // Would be populated from channels
      customerSegments: customers.map(c => `${c.role} at ${c.organization}`),
      costStructure: [], // Would be populated from costs
      revenueStreams: [] // Would be populated from revenue models
    }

    return {
      title: `Business Model Canvas - ${idea.title}`,
      description: idea.description,
      content: canvas,
      metadata: {
        exportedAt: new Date(),
        exportType: ExportType.BUSINESS_MODEL_CANVAS,
        exportFormat: ExportFormat.MARKDOWN, // Will be overridden by formatter
        version: '1.0'
      }
    }
  }

  private buildSWOTAnalysis(ideaId: string): ExportData {
    const idea = this.entitiesStore.ideas.find(i => i.id === ideaId)!
    const problems = this.entitiesStore.getRelatedEntities(ideaId, 'solves', this.entitiesStore.problems)
    const features = this.entitiesStore.getRelatedEntities(ideaId, 'has_feature', this.entitiesStore.features)
    const customers = this.entitiesStore.getRelatedEntities(ideaId, 'has_customer', this.entitiesStore.customers)

    const swot: SWOTAnalysis = {
      strengths: [
        ...features.filter(f => f.status === 'completed').map(f => f.title),
        `Clear problem definition: ${problems.map(p => p.title).join(', ')}`,
        `Target customers identified: ${customers.length} customers`
      ],
      weaknesses: [
        ...features.filter(f => f.status === 'planned').map(f => `Missing: ${f.title}`),
        'Market validation needed',
        'Revenue model not defined'
      ],
      opportunities: [
        'Large addressable market',
        'Growing customer demand',
        'Technology advancement',
        'Partnership opportunities'
      ],
      threats: [
        'Competition from established players',
        'Market saturation',
        'Regulatory changes',
        'Technology disruption'
      ]
    }

    return {
      title: `SWOT Analysis - ${idea.title}`,
      description: idea.description,
      content: swot,
      metadata: {
        exportedAt: new Date(),
        exportType: ExportType.SWOT_ANALYSIS,
        exportFormat: ExportFormat.MARKDOWN,
        version: '1.0'
      }
    }
  }

  private buildDesignSprint(ideaId: string): ExportData {
    const idea = this.entitiesStore.ideas.find(i => i.id === ideaId)!
    const problems = this.entitiesStore.getRelatedEntities(ideaId, 'solves', this.entitiesStore.problems)
    const customers = this.entitiesStore.getRelatedEntities(ideaId, 'has_customer', this.entitiesStore.customers)
    const features = this.entitiesStore.getRelatedEntities(ideaId, 'has_feature', this.entitiesStore.features)

    const sprint: DesignSprint = {
      understand: [
        `Problem: ${problems.map(p => p.title).join(', ')}`,
        `Target users: ${customers.map(c => c.fullName).join(', ')}`,
        `Market research needed`,
        `Competitor analysis required`
      ],
      define: [
        `Core value proposition: ${idea.description}`,
        `Key success metrics`,
        `User journey mapping`,
        `Feature prioritization`
      ],
      sketch: [
        `User interface mockups`,
        `User flow diagrams`,
        `Information architecture`,
        `Visual design concepts`
      ],
      decide: [
        `Feature selection: ${features.map(f => f.title).join(', ')}`,
        `Technology stack decision`,
        `Development timeline`,
        `Resource allocation`
      ],
      prototype: [
        `Interactive prototype`,
        `User interface implementation`,
        `Backend development`,
        `Integration testing`
      ],
      test: [
        `User testing with ${customers.length} customers`,
        `Feedback collection`,
        `Iteration planning`,
        `Launch preparation`
      ]
    }

    return {
      title: `Design Sprint - ${idea.title}`,
      description: idea.description,
      content: sprint,
      metadata: {
        exportedAt: new Date(),
        exportType: ExportType.DESIGN_SPRINT,
        exportFormat: ExportFormat.MARKDOWN,
        version: '1.0'
      }
    }
  }

  private buildCustomerJourney(ideaId: string): ExportData {
    const idea = this.entitiesStore.ideas.find(i => i.id === ideaId)!
    const customerJourneys = this.entitiesStore.getRelatedEntities(ideaId, 'has_journey', this.entitiesStore.customerJourneys)
    const customerJourneySteps = this.entitiesStore.customerJourneySteps.filter(step => 
      customerJourneys.some(journey => 
        this.entitiesStore.relationships.some(rel => 
          rel.sourceId === journey.id && rel.targetId === step.id && rel.relationshipType === 'has_step'
        )
      )
    )

    const journeyMap: CustomerJourneyMap = {
      stages: customerJourneys.map(journey => ({
        name: journey.title,
        actions: customerJourneySteps
          .filter(step => this.entitiesStore.relationships.some(rel => 
            rel.sourceId === journey.id && rel.targetId === step.id && rel.relationshipType === 'has_step'
          ))
          .map(step => step.title),
        thoughts: ['User considers options', 'Evaluates value proposition'],
        emotions: ['Curious', 'Interested', 'Satisfied'],
        painPoints: ['Complex onboarding', 'Limited features'],
        opportunities: ['Streamlined process', 'Enhanced features']
      }))
    }

    return {
      title: `Customer Journey - ${idea.title}`,
      description: idea.description,
      content: journeyMap,
      metadata: {
        exportedAt: new Date(),
        exportType: ExportType.CUSTOMER_JOURNEY,
        exportFormat: ExportFormat.MARKDOWN,
        version: '1.0'
      }
    }
  }

  private buildFeatureRoadmap(ideaId: string): ExportData {
    const idea = this.entitiesStore.ideas.find(i => i.id === ideaId)!
    const features = this.entitiesStore.getRelatedEntities(ideaId, 'has_feature', this.entitiesStore.features)

    const roadmap: FeatureRoadmap = {
      phases: [
        {
          name: 'MVP (Phase 1)',
          timeframe: 'Q1 2024',
          features: features
            .filter(f => f.type === 'core' && f.status === 'completed')
            .map(f => ({
              title: f.title,
              description: f.description,
              priority: 'high' as const,
              status: f.status as 'planned' | 'in_progress' | 'completed'
            }))
        },
        {
          name: 'Enhancement (Phase 2)',
          timeframe: 'Q2 2024',
          features: features
            .filter(f => f.type === 'enhancement')
            .map(f => ({
              title: f.title,
              description: f.description,
              priority: 'medium' as const,
              status: f.status as 'planned' | 'in_progress' | 'completed'
            }))
        },
        {
          name: 'Integration (Phase 3)',
          timeframe: 'Q3 2024',
          features: features
            .filter(f => f.type === 'integration')
            .map(f => ({
              title: f.title,
              description: f.description,
              priority: 'low' as const,
              status: f.status as 'planned' | 'in_progress' | 'completed'
            }))
        }
      ]
    }

    return {
      title: `Feature Roadmap - ${idea.title}`,
      description: idea.description,
      content: roadmap,
      metadata: {
        exportedAt: new Date(),
        exportType: ExportType.FEATURE_ROADMAP,
        exportFormat: ExportFormat.MARKDOWN,
        version: '1.0'
      }
    }
  }

  private buildIdeaSummary(ideaId: string): ExportData {
    const idea = this.entitiesStore.ideas.find(i => i.id === ideaId)!
    const problems = this.entitiesStore.getRelatedEntities(ideaId, 'solves', this.entitiesStore.problems)
    const customers = this.entitiesStore.getRelatedEntities(ideaId, 'has_customer', this.entitiesStore.customers)
    const products = this.entitiesStore.getRelatedEntities(ideaId, 'has_product', this.entitiesStore.products)
    const features = this.entitiesStore.getRelatedEntities(ideaId, 'has_feature', this.entitiesStore.features)

    const summary = {
      idea: {
        title: idea.title,
        description: idea.description,
        identifier: idea.identifier,
        created: idea.created,
        updated: idea.updated
      },
      problems: problems.map(p => ({ title: p.title, description: p.description })),
      customers: customers.map(c => ({ 
        name: c.fullName, 
        role: c.role, 
        organization: c.organization 
      })),
      products: products.map(p => ({ title: p.title, description: p.description })),
      features: features.map(f => ({ 
        title: f.title, 
        description: f.description, 
        type: f.type, 
        status: f.status 
      })),
      statistics: {
        totalProblems: problems.length,
        totalCustomers: customers.length,
        totalProducts: products.length,
        totalFeatures: features.length,
        completedFeatures: features.filter(f => f.status === 'completed').length,
        inProgressFeatures: features.filter(f => f.status === 'in_progress').length
      }
    }

    return {
      title: `Idea Summary - ${idea.title}`,
      description: idea.description,
      content: summary,
      metadata: {
        exportedAt: new Date(),
        exportType: ExportType.IDEA_SUMMARY,
        exportFormat: ExportFormat.MARKDOWN,
        version: '1.0'
      }
    }
  }

  private buildAllEntities(ideaId: string): ExportData {
    const idea = this.entitiesStore.ideas.find(i => i.id === ideaId)!
    
    // Get all entities from the store
    const allEntities = {
      ideas: this.entitiesStore.ideas.map(i => ({
        id: i.id,
        title: i.title,
        description: i.description,
        identifier: i.identifier,
        created: i.created,
        updated: i.updated
      })),
      problems: this.entitiesStore.problems.map(p => ({
        id: p.id,
        title: p.title,
        description: p.description,
        created: p.created,
        updated: p.updated
      })),
      customers: this.entitiesStore.customers.map(c => ({
        id: c.id,
        title: c.title,
        givenName: c.givenName,
        familyName: c.familyName,
        fullName: c.fullName,
        role: c.role,
        organization: c.organization,
        created: c.created,
        updated: c.updated
      })),
      products: this.entitiesStore.products.map(p => ({
        id: p.id,
        title: p.title,
        description: p.description,
        created: p.created,
        updated: p.updated
      })),
      features: this.entitiesStore.features.map(f => ({
        id: f.id,
        title: f.title,
        description: f.description,
        type: f.type,
        status: f.status,
        created: f.created,
        updated: f.updated
      })),
      jobs: this.entitiesStore.jobs.map(j => ({
        id: j.id,
        title: j.title,
        description: j.description,
        created: j.created,
        updated: j.updated
      })),
      pains: this.entitiesStore.pains.map(p => ({
        id: p.id,
        title: p.title,
        description: p.description,
        created: p.created,
        updated: p.updated
      })),
      gains: this.entitiesStore.gains.map(g => ({
        id: g.id,
        title: g.title,
        description: g.description,
        created: g.created,
        updated: g.updated
      })),
      relationships: this.entitiesStore.relationships.map(r => ({
        id: r.id,
        sourceId: r.sourceId,
        targetId: r.targetId,
        relationshipType: r.relationshipType,
        created: r.created
      })),
      statistics: {
        totalIdeas: this.entitiesStore.ideas.length,
        totalProblems: this.entitiesStore.problems.length,
        totalCustomers: this.entitiesStore.customers.length,
        totalProducts: this.entitiesStore.products.length,
        totalFeatures: this.entitiesStore.features.length,
        totalJobs: this.entitiesStore.jobs.length,
        totalPains: this.entitiesStore.pains.length,
        totalGains: this.entitiesStore.gains.length,
        totalRelationships: this.entitiesStore.relationships.length
      }
    }

    return {
      title: `All Entities - ${idea.title}`,
      description: `Complete export of all entities and relationships for ${idea.title}`,
      content: allEntities,
      metadata: {
        exportedAt: new Date(),
        exportType: ExportType.ALL_ENTITIES,
        exportFormat: ExportFormat.MARKDOWN,
        version: '1.0'
      }
    }
  }
} 