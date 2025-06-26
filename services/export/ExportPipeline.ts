import { ExportDataBuilder } from './ExportDataBuilder'
import { ExportFormatterFactory } from './ExportFormatter'
import { ExportDestinationFactory } from './ExportDestination'
import type { 
  ExportConfig, 
  ExportResult, 
  ExportType, 
  ExportFormat, 
  ExportDestination 
} from '~/types/export'

export class ExportPipeline {
  private dataBuilder: ExportDataBuilder

  constructor() {
    this.dataBuilder = new ExportDataBuilder()
  }

  /**
   * Execute the complete 3-stage export pipeline
   * Stage 1: Build export data
   * Stage 2: Format the data
   * Stage 3: Save to destination
   */
  async execute(config: ExportConfig, ideaId?: string): Promise<ExportResult> {
    try {
      console.log('Starting export pipeline...', config)

      // Stage 1: Build export data
      console.log('Stage 1: Building export data...')
      const exportData = await this.dataBuilder.buildExportData(config.type, ideaId)
      console.log('Export data built successfully:', exportData.title)

      // Stage 2: Format the data
      console.log('Stage 2: Formatting data...')
      const formatter = ExportFormatterFactory.createFormatter(config.format)
      const formattedContent = await formatter.format(exportData)
      console.log('Data formatted successfully:', formattedContent.filename)

      // Stage 3: Save to destination
      console.log('Stage 3: Saving to destination...')
      const destination = ExportDestinationFactory.createDestination(config.destination, config)
      const result = await destination.save(formattedContent, config)
      console.log('Export completed:', result.success ? 'Success' : 'Failed')

      return result
    } catch (error) {
      console.error('Export pipeline failed:', error)
      return {
        success: false,
        message: 'Export pipeline failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Execute export with custom data builder
   */
  async executeWithCustomData(
    config: ExportConfig,
    customDataBuilder: (type: ExportType, ideaId?: string) => Promise<any>
  ): Promise<ExportResult> {
    try {
      console.log('Starting export pipeline with custom data...', config)

      // Stage 1: Build export data using custom builder
      console.log('Stage 1: Building custom export data...')
      const customData = await customDataBuilder(config.type)
      const exportData = {
        title: `Custom Export - ${config.type}`,
        description: 'Custom export data',
        content: customData,
        metadata: {
          exportedAt: new Date(),
          exportType: config.type,
          exportFormat: config.format,
          version: '1.0'
        }
      }
      console.log('Custom export data built successfully')

      // Stage 2: Format the data
      console.log('Stage 2: Formatting data...')
      const formatter = ExportFormatterFactory.createFormatter(config.format)
      const formattedContent = await formatter.format(exportData)
      console.log('Data formatted successfully:', formattedContent.filename)

      // Stage 3: Save to destination
      console.log('Stage 3: Saving to destination...')
      const destination = ExportDestinationFactory.createDestination(config.destination, config)
      const result = await destination.save(formattedContent, config)
      console.log('Export completed:', result.success ? 'Success' : 'Failed')

      return result
    } catch (error) {
      console.error('Custom export pipeline failed:', error)
      return {
        success: false,
        message: 'Custom export pipeline failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Execute only the data building stage
   */
  async buildData(type: ExportType, ideaId?: string) {
    return await this.dataBuilder.buildExportData(type, ideaId)
  }

  /**
   * Execute only the formatting stage
   */
  async formatData(data: any, format: ExportFormat) {
    const formatter = ExportFormatterFactory.createFormatter(format)
    return await formatter.format(data)
  }

  /**
   * Execute only the destination stage
   */
  async saveToDestination(content: any, destination: ExportDestination, config?: any) {
    const dest = ExportDestinationFactory.createDestination(destination, config)
    return await dest.save(content, config)
  }

  /**
   * Get available export types
   */
  getAvailableExportTypes(): { value: ExportType; label: string; description: string }[] {
    return [
      {
        value: ExportType.BUSINESS_MODEL_CANVAS,
        label: 'Business Model Canvas',
        description: 'Export your idea as a structured business model canvas'
      },
      {
        value: ExportType.SWOT_ANALYSIS,
        label: 'SWOT Analysis',
        description: 'Export strengths, weaknesses, opportunities, and threats analysis'
      },
      {
        value: ExportType.DESIGN_SPRINT,
        label: 'Design Sprint',
        description: 'Export your idea as a design sprint framework'
      },
      {
        value: ExportType.CUSTOMER_JOURNEY,
        label: 'Customer Journey',
        description: 'Export customer journey mapping and touchpoints'
      },
      {
        value: ExportType.FEATURE_ROADMAP,
        label: 'Feature Roadmap',
        description: 'Export your feature development roadmap'
      },
      {
        value: ExportType.IDEA_SUMMARY,
        label: 'Idea Summary',
        description: 'Export a comprehensive summary of your idea'
      }
    ]
  }

  /**
   * Get available export formats
   */
  getAvailableExportFormats(): { value: ExportFormat; label: string; description: string }[] {
    return [
      {
        value: ExportFormat.MARKDOWN,
        label: 'Markdown',
        description: 'Export as formatted markdown text'
      },
      {
        value: ExportFormat.JSON,
        label: 'JSON',
        description: 'Export as structured JSON data'
      },
      {
        value: ExportFormat.CSV,
        label: 'CSV',
        description: 'Export as comma-separated values'
      },
      {
        value: ExportFormat.PDF,
        label: 'PDF',
        description: 'Export as PDF document'
      },
      {
        value: ExportFormat.IMAGE,
        label: 'Image',
        description: 'Export as PNG image'
      }
    ]
  }

  /**
   * Get available export destinations
   */
  getAvailableExportDestinations(): { value: ExportDestination; label: string; description: string }[] {
    return [
      {
        value: ExportDestination.DISK,
        label: 'Download to Disk',
        description: 'Download file to your computer'
      },
      {
        value: ExportDestination.GOOGLE_DRIVE,
        label: 'Google Drive',
        description: 'Save to your Google Drive account'
      },
      {
        value: ExportDestination.EMAIL,
        label: 'Email',
        description: 'Send via email'
      },
      {
        value: ExportDestination.CLIPBOARD,
        label: 'Copy to Clipboard',
        description: 'Copy content to clipboard'
      },
      {
        value: ExportDestination.LOCAL_STORAGE,
        label: 'Local Storage',
        description: 'Save to browser local storage for later access'
      }
    ]
  }

  /**
   * Validate export configuration
   */
  validateConfig(config: ExportConfig): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    if (!config.type) {
      errors.push('Export type is required')
    }

    if (!config.format) {
      errors.push('Export format is required')
    }

    if (!config.destination) {
      errors.push('Export destination is required')
    }

    // Validate format compatibility with destination
    if (config.format === ExportFormat.IMAGE && config.destination === ExportDestination.CLIPBOARD) {
      errors.push('Image format is not compatible with clipboard destination')
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }
} 