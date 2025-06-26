import type { ExportData, FormattedContent } from '~/types/export'
import { ExportFormat } from '~/types/export'

export interface IExportFormatter {
  format(data: ExportData): Promise<FormattedContent>
}

export class MarkdownFormatter implements IExportFormatter {
  async format(data: ExportData): Promise<FormattedContent> {
    let content = `# ${data.title}\n\n`
    
    if (data.description) {
      content += `${data.description}\n\n`
    }

    content += `---\n\n`
    content += `**Exported:** ${data.metadata.exportedAt.toLocaleDateString()}\n`
    content += `**Type:** ${data.metadata.exportType}\n\n`

    // Format based on export type
    switch (data.metadata.exportType) {
      case 'business_model_canvas':
        content += this.formatBusinessModelCanvas(data.content)
        break
      case 'swot_analysis':
        content += this.formatSWOTAnalysis(data.content)
        break
      case 'design_sprint':
        content += this.formatDesignSprint(data.content)
        break
      case 'customer_journey':
        content += this.formatCustomerJourney(data.content)
        break
      case 'feature_roadmap':
        content += this.formatFeatureRoadmap(data.content)
        break
      case 'idea_summary':
        content += this.formatIdeaSummary(data.content)
        break
      case 'all_entities':
        content += this.formatAllEntities(data.content)
        break
    }

    return {
      content,
      mimeType: 'text/markdown',
      filename: `${data.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`
    }
  }

  private formatBusinessModelCanvas(canvas: any): string {
    let content = '## Business Model Canvas\n\n'
    
    const sections = [
      { title: 'Key Partners', items: canvas.keyPartners },
      { title: 'Key Activities', items: canvas.keyActivities },
      { title: 'Key Resources', items: canvas.keyResources },
      { title: 'Value Propositions', items: canvas.valuePropositions },
      { title: 'Customer Relationships', items: canvas.customerRelationships },
      { title: 'Channels', items: canvas.channels },
      { title: 'Customer Segments', items: canvas.customerSegments },
      { title: 'Cost Structure', items: canvas.costStructure },
      { title: 'Revenue Streams', items: canvas.revenueStreams }
    ]

    sections.forEach(section => {
      content += `### ${section.title}\n`
      if (section.items && section.items.length > 0) {
        section.items.forEach((item: string) => {
          content += `- ${item}\n`
        })
      } else {
        content += `- *To be defined*\n`
      }
      content += '\n'
    })

    return content
  }

  private formatSWOTAnalysis(swot: any): string {
    let content = '## SWOT Analysis\n\n'
    
    const sections = [
      { title: 'Strengths', items: swot.strengths },
      { title: 'Weaknesses', items: swot.weaknesses },
      { title: 'Opportunities', items: swot.opportunities },
      { title: 'Threats', items: swot.threats }
    ]

    sections.forEach(section => {
      content += `### ${section.title}\n`
      section.items.forEach((item: string) => {
        content += `- ${item}\n`
      })
      content += '\n'
    })

    return content
  }

  private formatDesignSprint(sprint: any): string {
    let content = '## Design Sprint\n\n'
    
    const phases = [
      { title: 'Understand', items: sprint.understand },
      { title: 'Define', items: sprint.define },
      { title: 'Sketch', items: sprint.sketch },
      { title: 'Decide', items: sprint.decide },
      { title: 'Prototype', items: sprint.prototype },
      { title: 'Test', items: sprint.test }
    ]

    phases.forEach(phase => {
      content += `### ${phase.title}\n`
      phase.items.forEach((item: string) => {
        content += `- ${item}\n`
      })
      content += '\n'
    })

    return content
  }

  private formatCustomerJourney(journey: any): string {
    let content = '## Customer Journey Map\n\n'
    
    journey.stages.forEach((stage: any, index: number) => {
      content += `### Stage ${index + 1}: ${stage.name}\n\n`
      
      content += '**Actions:**\n'
      stage.actions.forEach((action: string) => {
        content += `- ${action}\n`
      })
      content += '\n'
      
      content += '**Thoughts:**\n'
      stage.thoughts.forEach((thought: string) => {
        content += `- ${thought}\n`
      })
      content += '\n'
      
      content += '**Emotions:**\n'
      stage.emotions.forEach((emotion: string) => {
        content += `- ${emotion}\n`
      })
      content += '\n'
      
      content += '**Pain Points:**\n'
      stage.painPoints.forEach((pain: string) => {
        content += `- ${pain}\n`
      })
      content += '\n'
      
      content += '**Opportunities:**\n'
      stage.opportunities.forEach((opportunity: string) => {
        content += `- ${opportunity}\n`
      })
      content += '\n'
    })

    return content
  }

  private formatFeatureRoadmap(roadmap: any): string {
    let content = '## Feature Roadmap\n\n'
    
    roadmap.phases.forEach((phase: any) => {
      content += `### ${phase.name} (${phase.timeframe})\n\n`
      
      phase.features.forEach((feature: any) => {
        content += `#### ${feature.title}\n`
        content += `**Description:** ${feature.description}\n`
        content += `**Priority:** ${feature.priority}\n`
        content += `**Status:** ${feature.status}\n\n`
      })
    })

    return content
  }

  private formatIdeaSummary(summary: any): string {
    let content = '## Idea Summary\n\n'
    
    content += `### ${summary.idea.title}\n`
    content += `**Identifier:** ${summary.idea.identifier}\n`
    content += `**Description:** ${summary.idea.description}\n`
    content += `**Created:** ${summary.idea.created.toLocaleDateString()}\n`
    content += `**Updated:** ${summary.idea.updated.toLocaleDateString()}\n\n`

    content += '### Problems Solved\n'
    summary.problems.forEach((problem: any) => {
      content += `- **${problem.title}:** ${problem.description}\n`
    })
    content += '\n'

    content += '### Target Customers\n'
    summary.customers.forEach((customer: any) => {
      content += `- **${customer.name}** (${customer.role} at ${customer.organization})\n`
    })
    content += '\n'

    content += '### Products\n'
    summary.products.forEach((product: any) => {
      content += `- **${product.title}:** ${product.description}\n`
    })
    content += '\n'

    content += '### Features\n'
    summary.features.forEach((feature: any) => {
      content += `- **${feature.title}:** ${feature.description} (${feature.type}, ${feature.status})\n`
    })
    content += '\n'

    content += '### Statistics\n'
    content += `- Total Problems: ${summary.statistics.totalProblems}\n`
    content += `- Total Customers: ${summary.statistics.totalCustomers}\n`
    content += `- Total Products: ${summary.statistics.totalProducts}\n`
    content += `- Total Features: ${summary.statistics.totalFeatures}\n`
    content += `- Completed Features: ${summary.statistics.completedFeatures}\n`
    content += `- In Progress Features: ${summary.statistics.inProgressFeatures}\n`

    return content
  }

  private formatAllEntities(entities: any): string {
    let content = '## All Entities\n\n'
    
    // Statistics
    content += '### Statistics\n\n'
    content += `- **Total Ideas:** ${entities.statistics.totalIdeas}\n`
    content += `- **Total Problems:** ${entities.statistics.totalProblems}\n`
    content += `- **Total Customers:** ${entities.statistics.totalCustomers}\n`
    content += `- **Total Products:** ${entities.statistics.totalProducts}\n`
    content += `- **Total Features:** ${entities.statistics.totalFeatures}\n`
    content += `- **Total Jobs:** ${entities.statistics.totalJobs}\n`
    content += `- **Total Pains:** ${entities.statistics.totalPains}\n`
    content += `- **Total Gains:** ${entities.statistics.totalGains}\n`
    content += `- **Total Relationships:** ${entities.statistics.totalRelationships}\n\n`
    
    // Ideas
    if (entities.ideas.length > 0) {
      content += '### Ideas\n\n'
      entities.ideas.forEach((idea: any) => {
        content += `#### ${idea.title}\n`
        content += `**ID:** ${idea.id}\n`
        content += `**Identifier:** ${idea.identifier}\n`
        content += `**Description:** ${idea.description}\n`
        content += `**Created:** ${idea.created.toLocaleDateString()}\n`
        content += `**Updated:** ${idea.updated.toLocaleDateString()}\n\n`
      })
    }
    
    // Problems
    if (entities.problems.length > 0) {
      content += '### Problems\n\n'
      entities.problems.forEach((problem: any) => {
        content += `#### ${problem.title}\n`
        content += `**ID:** ${problem.id}\n`
        content += `**Description:** ${problem.description}\n`
        content += `**Created:** ${problem.created.toLocaleDateString()}\n`
        content += `**Updated:** ${problem.updated.toLocaleDateString()}\n\n`
      })
    }
    
    // Customers
    if (entities.customers.length > 0) {
      content += '### Customers\n\n'
      entities.customers.forEach((customer: any) => {
        content += `#### ${customer.fullName}\n`
        content += `**ID:** ${customer.id}\n`
        content += `**Title:** ${customer.title}\n`
        content += `**Role:** ${customer.role}\n`
        content += `**Organization:** ${customer.organization}\n`
        content += `**Email:** ${customer.email}\n`
        content += `**Phone:** ${customer.phone}\n`
        content += `**Created:** ${customer.created.toLocaleDateString()}\n`
        content += `**Updated:** ${customer.updated.toLocaleDateString()}\n\n`
      })
    }
    
    // Products
    if (entities.products.length > 0) {
      content += '### Products\n\n'
      entities.products.forEach((product: any) => {
        content += `#### ${product.title}\n`
        content += `**ID:** ${product.id}\n`
        content += `**Description:** ${product.description}\n`
        content += `**Created:** ${product.created.toLocaleDateString()}\n`
        content += `**Updated:** ${product.updated.toLocaleDateString()}\n\n`
      })
    }
    
    // Features
    if (entities.features.length > 0) {
      content += '### Features\n\n'
      entities.features.forEach((feature: any) => {
        content += `#### ${feature.title}\n`
        content += `**ID:** ${feature.id}\n`
        content += `**Description:** ${feature.description}\n`
        content += `**Type:** ${feature.type}\n`
        content += `**Status:** ${feature.status}\n`
        content += `**Created:** ${feature.created.toLocaleDateString()}\n`
        content += `**Updated:** ${feature.updated.toLocaleDateString()}\n\n`
      })
    }
    
    // Jobs
    if (entities.jobs.length > 0) {
      content += '### Jobs\n\n'
      entities.jobs.forEach((job: any) => {
        content += `#### ${job.title}\n`
        content += `**ID:** ${job.id}\n`
        content += `**Description:** ${job.description}\n`
        content += `**Created:** ${job.created.toLocaleDateString()}\n`
        content += `**Updated:** ${job.updated.toLocaleDateString()}\n\n`
      })
    }
    
    // Pains
    if (entities.pains.length > 0) {
      content += '### Pains\n\n'
      entities.pains.forEach((pain: any) => {
        content += `#### ${pain.title}\n`
        content += `**ID:** ${pain.id}\n`
        content += `**Description:** ${pain.description}\n`
        content += `**Created:** ${pain.created.toLocaleDateString()}\n`
        content += `**Updated:** ${pain.updated.toLocaleDateString()}\n\n`
      })
    }
    
    // Gains
    if (entities.gains.length > 0) {
      content += '### Gains\n\n'
      entities.gains.forEach((gain: any) => {
        content += `#### ${gain.title}\n`
        content += `**ID:** ${gain.id}\n`
        content += `**Description:** ${gain.description}\n`
        content += `**Created:** ${gain.created.toLocaleDateString()}\n`
        content += `**Updated:** ${gain.updated.toLocaleDateString()}\n\n`
      })
    }
    
    // Relationships
    if (entities.relationships.length > 0) {
      content += '### Relationships\n\n'
      entities.relationships.forEach((relationship: any) => {
        content += `#### Relationship ${relationship.id}\n`
        content += `**Source ID:** ${relationship.sourceId}\n`
        content += `**Target ID:** ${relationship.targetId}\n`
        content += `**Type:** ${relationship.relationshipType}\n`
        content += `**Created:** ${relationship.created.toLocaleDateString()}\n\n`
      })
    }

    return content
  }
}

export class JSONFormatter implements IExportFormatter {
  async format(data: ExportData): Promise<FormattedContent> {
    const content = JSON.stringify(data, null, 2)
    
    return {
      content,
      mimeType: 'application/json',
      filename: `${data.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`
    }
  }
}

export class CSVFormatter implements IExportFormatter {
  async format(data: ExportData): Promise<FormattedContent> {
    let content = 'Type,Title,Description,Value\n'
    
    // Flatten the data structure for CSV
    const flattenData = (obj: any, prefix = ''): string[][] => {
      const rows: string[][] = []
      
      for (const [key, value] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key
        
        if (Array.isArray(value)) {
          value.forEach((item, index) => {
            if (typeof item === 'string') {
              rows.push([fullKey, `${key}_${index + 1}`, '', item])
            } else if (typeof item === 'object') {
              rows.push(...flattenData(item, `${fullKey}_${index + 1}`))
            }
          })
        } else if (typeof value === 'object' && value !== null) {
          rows.push(...flattenData(value, fullKey))
        } else {
          rows.push([fullKey, key, '', String(value)])
        }
      }
      
      return rows
    }

    const rows = flattenData(data.content)
    rows.forEach(row => {
      content += row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',') + '\n'
    })

    return {
      content,
      mimeType: 'text/csv',
      filename: `${data.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.csv`
    }
  }
}

export class PDFFormatter implements IExportFormatter {
  async format(data: ExportData): Promise<FormattedContent> {
    // For now, we'll convert markdown to PDF using a simple approach
    // In a real implementation, you might use libraries like jsPDF or puppeteer
    const markdownFormatter = new MarkdownFormatter()
    const markdownContent = await markdownFormatter.format(data)
    
    // This is a placeholder - in a real implementation, you'd convert markdown to PDF
    // For now, we'll return the markdown content with PDF mime type
    return {
      content: markdownContent.content,
      mimeType: 'application/pdf',
      filename: `${data.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`
    }
  }
}

export class ImageFormatter implements IExportFormatter {
  async format(data: ExportData): Promise<FormattedContent> {
    // This is a placeholder - in a real implementation, you'd generate an image
    // You might use canvas API or libraries like html2canvas
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (ctx) {
      canvas.width = 800
      canvas.height = 600
      
      // Set background
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Add title
      ctx.fillStyle = '#000000'
      ctx.font = '24px Arial'
      ctx.fillText(data.title, 50, 50)
      
      // Add description
      ctx.font = '16px Arial'
      if (data.description) {
        ctx.fillText(data.description, 50, 80)
      }
      
      // Add export info
      ctx.font = '12px Arial'
      ctx.fillText(`Exported: ${data.metadata.exportedAt.toLocaleDateString()}`, 50, 100)
      ctx.fillText(`Type: ${data.metadata.exportType}`, 50, 120)
    }
    
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve({
          content: blob!,
          mimeType: 'image/png',
          filename: `${data.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`
        })
      }, 'image/png')
    })
  }
}

export class ExportFormatterFactory {
  static createFormatter(format: ExportFormat): IExportFormatter {
    switch (format) {
      case ExportFormat.MARKDOWN:
        return new MarkdownFormatter()
      case ExportFormat.JSON:
        return new JSONFormatter()
      case ExportFormat.CSV:
        return new CSVFormatter()
      case ExportFormat.PDF:
        return new PDFFormatter()
      case ExportFormat.IMAGE:
        return new ImageFormatter()
      default:
        throw new Error(`Unsupported format: ${format}`)
    }
  }
} 