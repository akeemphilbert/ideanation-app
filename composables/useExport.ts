import { ref, computed } from 'vue'
import { ExportPipeline } from '~/services/export/ExportPipeline'
import { LocalStorageDestination } from '~/services/export/ExportDestination'
import { 
  ExportType, 
  ExportFormat, 
  ExportDestination 
} from '~/types/export'
import type { 
  ExportConfig, 
  ExportResult
} from '~/types/export'

export function useExport() {
  const pipeline = new ExportPipeline()
  
  // Reactive state
  const isExporting = ref(false)
  const exportProgress = ref(0)
  const lastExportResult = ref<ExportResult | null>(null)
  const exportHistory = ref<ExportResult[]>([])

  // Available options
  const exportTypes = computed(() => pipeline.getAvailableExportTypes())
  const exportFormats = computed(() => pipeline.getAvailableExportFormats())
  const exportDestinations = computed(() => pipeline.getAvailableExportDestinations())

  /**
   * Execute a complete export
   */
  const executeExport = async (config: ExportConfig, ideaId?: string): Promise<ExportResult> => {
    isExporting.value = true
    exportProgress.value = 0
    
    try {
      // Validate config
      const validation = pipeline.validateConfig(config)
      if (!validation.valid) {
        throw new Error(`Invalid export configuration: ${validation.errors.join(', ')}`)
      }

      // Update progress for each stage
      exportProgress.value = 10
      await new Promise(resolve => setTimeout(resolve, 100))

      exportProgress.value = 30
      await new Promise(resolve => setTimeout(resolve, 100))

      exportProgress.value = 60
      await new Promise(resolve => setTimeout(resolve, 100))

      // Execute the pipeline
      const result = await pipeline.execute(config, ideaId)
      
      exportProgress.value = 100
      
      // Store result
      lastExportResult.value = result
      if (result.success) {
        exportHistory.value.unshift(result)
        // Keep only last 10 exports
        if (exportHistory.value.length > 10) {
          exportHistory.value = exportHistory.value.slice(0, 10)
        }
      }

      return result
    } catch (error) {
      const errorResult: ExportResult = {
        success: false,
        message: 'Export failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
      lastExportResult.value = errorResult
      return errorResult
    } finally {
      isExporting.value = false
      // Reset progress after a delay
      setTimeout(() => {
        exportProgress.value = 0
      }, 1000)
    }
  }

  /**
   * Quick export helpers for common use cases
   */
  const exportAsMarkdown = async (type: ExportType, ideaId?: string): Promise<ExportResult> => {
    return executeExport({
      type,
      format: ExportFormat.MARKDOWN,
      destination: ExportDestination.DISK
    }, ideaId)
  }

  const exportAsPDF = async (type: ExportType, ideaId?: string): Promise<ExportResult> => {
    return executeExport({
      type,
      format: ExportFormat.PDF,
      destination: ExportDestination.DISK
    }, ideaId)
  }

  const exportToClipboard = async (type: ExportType, ideaId?: string): Promise<ExportResult> => {
    return executeExport({
      type,
      format: ExportFormat.MARKDOWN,
      destination: ExportDestination.CLIPBOARD
    }, ideaId)
  }

  const exportToGoogleDrive = async (type: ExportType, format: ExportFormat, ideaId?: string): Promise<ExportResult> => {
    return executeExport({
      type,
      format,
      destination: ExportDestination.GOOGLE_DRIVE
    }, ideaId)
  }

  const exportToLocalStorage = async (type: ExportType, format: ExportFormat, ideaId?: string, key?: string): Promise<ExportResult> => {
    return executeExport({
      type,
      format,
      destination: ExportDestination.LOCAL_STORAGE
    }, ideaId)
  }

  /**
   * Export business model canvas
   */
  const exportBusinessModelCanvas = async (format: ExportFormat, destination: ExportDestination, ideaId?: string): Promise<ExportResult> => {
    return executeExport({
      type: ExportType.BUSINESS_MODEL_CANVAS,
      format,
      destination
    }, ideaId)
  }

  /**
   * Export SWOT analysis
   */
  const exportSWOTAnalysis = async (format: ExportFormat, destination: ExportDestination, ideaId?: string): Promise<ExportResult> => {
    return executeExport({
      type: ExportType.SWOT_ANALYSIS,
      format,
      destination
    }, ideaId)
  }

  /**
   * Export design sprint
   */
  const exportDesignSprint = async (format: ExportFormat, destination: ExportDestination, ideaId?: string): Promise<ExportResult> => {
    return executeExport({
      type: ExportType.DESIGN_SPRINT,
      format,
      destination
    }, ideaId)
  }

  /**
   * Export customer journey
   */
  const exportCustomerJourney = async (format: ExportFormat, destination: ExportDestination, ideaId?: string): Promise<ExportResult> => {
    return executeExport({
      type: ExportType.CUSTOMER_JOURNEY,
      format,
      destination
    }, ideaId)
  }

  /**
   * Export feature roadmap
   */
  const exportFeatureRoadmap = async (format: ExportFormat, destination: ExportDestination, ideaId?: string): Promise<ExportResult> => {
    return executeExport({
      type: ExportType.FEATURE_ROADMAP,
      format,
      destination
    }, ideaId)
  }

  /**
   * Export idea summary
   */
  const exportIdeaSummary = async (format: ExportFormat, destination: ExportDestination, ideaId?: string): Promise<ExportResult> => {
    return executeExport({
      type: ExportType.IDEA_SUMMARY,
      format,
      destination
    }, ideaId)
  }

  /**
   * Clear export history
   */
  const clearExportHistory = () => {
    exportHistory.value = []
  }

  /**
   * Get export statistics
   */
  const exportStats = computed(() => {
    const total = exportHistory.value.length
    const successful = exportHistory.value.filter(r => r.success).length
    const failed = total - successful

    return {
      total,
      successful,
      failed,
      successRate: total > 0 ? (successful / total) * 100 : 0
    }
  })

  /**
   * Get recent successful exports
   */
  const recentSuccessfulExports = computed(() => {
    return exportHistory.value.filter(r => r.success).slice(0, 5)
  })

  // Local storage utility methods
  const getSavedExports = () => {
    return LocalStorageDestination.getSavedExports()
  }

  const deleteSavedExport = (key: string) => {
    return LocalStorageDestination.deleteExport(key)
  }

  const clearAllSavedExports = () => {
    return LocalStorageDestination.clearAllExports()
  }

  return {
    // State
    isExporting,
    exportProgress,
    lastExportResult,
    exportHistory,
    exportStats,
    recentSuccessfulExports,

    // Available options
    exportTypes,
    exportFormats,
    exportDestinations,

    // Main export function
    executeExport,

    // Quick export helpers
    exportAsMarkdown,
    exportAsPDF,
    exportToClipboard,
    exportToGoogleDrive,
    exportToLocalStorage,

    // Specific export functions
    exportBusinessModelCanvas,
    exportSWOTAnalysis,
    exportDesignSprint,
    exportCustomerJourney,
    exportFeatureRoadmap,
    exportIdeaSummary,

    // Utility functions
    clearExportHistory,

    // Local storage utility methods
    getSavedExports,
    deleteSavedExport,
    clearAllSavedExports
  }
} 