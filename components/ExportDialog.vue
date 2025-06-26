<template>
  <div class="export-dialog">
    <a-modal
      v-model:open="visible"
      title="Export Your Idea"
      :confirm-loading="isExporting"
      @ok="handleExport"
      @cancel="handleCancel"
      width="600px"
    >
      <div class="export-form">
        <!-- Export Type Selection -->
        <div class="form-section">
          <h3>What would you like to export?</h3>
          <a-radio-group v-model:value="selectedType" class="export-type-group">
            <a-radio-button 
              v-for="type in exportTypes" 
              :key="type.value" 
              :value="type.value"
              class="export-type-button"
            >
              <div class="export-type-content">
                <div class="export-type-title">{{ type.label }}</div>
                <div class="export-type-description">{{ type.description }}</div>
              </div>
            </a-radio-button>
          </a-radio-group>
        </div>

        <!-- Export Format Selection -->
        <div class="form-section">
          <h3>Choose your format</h3>
          <a-radio-group v-model:value="selectedFormat" class="export-format-group">
            <a-radio-button 
              v-for="format in exportFormats" 
              :key="format.value" 
              :value="format.value"
              class="export-format-button"
            >
              <div class="export-format-content">
                <div class="export-format-title">{{ format.label }}</div>
                <div class="export-format-description">{{ format.description }}</div>
              </div>
            </a-radio-button>
          </a-radio-group>
        </div>

        <!-- Export Destination Selection -->
        <div class="form-section">
          <h3>Where would you like to save it?</h3>
          <a-radio-group v-model:value="selectedDestination" class="export-destination-group">
            <a-radio-button 
              v-for="destination in exportDestinations" 
              :key="destination.value" 
              :value="destination.value"
              class="export-destination-button"
            >
              <div class="export-destination-content">
                <div class="export-destination-title">{{ destination.label }}</div>
                <div class="export-destination-description">{{ destination.description }}</div>
              </div>
            </a-radio-button>
          </a-radio-group>
        </div>

        <!-- Progress Bar -->
        <div v-if="isExporting" class="export-progress">
          <a-progress 
            :percent="exportProgress" 
            :show-info="false"
            status="active"
          />
          <div class="progress-text">
            {{ getProgressText() }}
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="lastExportResult && !lastExportResult.success" class="export-error">
          <a-alert
            :message="lastExportResult.message"
            :description="lastExportResult.error"
            type="error"
            show-icon
          />
        </div>

        <!-- Success Message -->
        <div v-if="lastExportResult && lastExportResult.success" class="export-success">
          <a-alert
            :message="lastExportResult.message"
            type="success"
            show-icon
          />
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useExport } from '~/composables/useExport'
import { 
  ExportType, 
  ExportFormat, 
  ExportDestination 
} from '~/types/export'
import type { ExportConfig } from '~/types/export'

interface Props {
  visible: boolean
  ideaId?: string
}

interface Emits {
  (e: 'update:visible', value: boolean): void
  (e: 'export-complete', result: any): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Export composable
const {
  isExporting,
  exportProgress,
  lastExportResult,
  exportTypes,
  exportFormats,
  exportDestinations,
  executeExport
} = useExport()

// Form state
const selectedType = ref<ExportType>(ExportType.IDEA_SUMMARY)
const selectedFormat = ref<ExportFormat>(ExportFormat.MARKDOWN)
const selectedDestination = ref<ExportDestination>(ExportDestination.DISK)

// Computed
const visible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

// Methods
const handleExport = async () => {
  const config: ExportConfig = {
    type: selectedType.value,
    format: selectedFormat.value,
    destination: selectedDestination.value
  }

  const result = await executeExport(config, props.ideaId)
  emit('export-complete', result)
}

const handleCancel = () => {
  visible.value = false
}

const getProgressText = () => {
  if (exportProgress.value < 30) {
    return 'Building export data...'
  } else if (exportProgress.value < 60) {
    return 'Formatting content...'
  } else if (exportProgress.value < 100) {
    return 'Saving to destination...'
  } else {
    return 'Export complete!'
  }
}

// Watch for export completion
watch(lastExportResult, (result) => {
  if (result && result.success) {
    // Auto-close dialog after successful export
    setTimeout(() => {
      visible.value = false
    }, 2000)
  }
})
</script>

<style scoped>
.export-dialog {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.export-form {
  padding: 16px 0;
}

.form-section {
  margin-bottom: 24px;
}

.form-section h3 {
  margin-bottom: 12px;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.export-type-group,
.export-format-group,
.export-destination-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.export-type-button,
.export-format-button,
.export-destination-button {
  width: 100% !important;
  height: auto !important;
  padding: 12px 16px !important;
  text-align: left !important;
  border-radius: 8px !important;
  border: 1px solid #d9d9d9 !important;
  background: #fafafa !important;
  transition: all 0.2s ease;
}

.export-type-button:hover,
.export-format-button:hover,
.export-destination-button:hover {
  border-color: #1890ff !important;
  background: #f0f8ff !important;
}

.export-type-button.ant-radio-button-wrapper-checked,
.export-format-button.ant-radio-button-wrapper-checked,
.export-destination-button.ant-radio-button-wrapper-checked {
  border-color: #1890ff !important;
  background: #e6f7ff !important;
  color: #1890ff !important;
}

.export-type-content,
.export-format-content,
.export-destination-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.export-type-title,
.export-format-title,
.export-destination-title {
  font-weight: 600;
  font-size: 14px;
  color: inherit;
}

.export-type-description,
.export-format-description,
.export-destination-description {
  font-size: 12px;
  color: #8c8c8c;
  line-height: 1.4;
}

.export-progress {
  margin-top: 16px;
  padding: 16px;
  background: #f5f5f5;
  border-radius: 8px;
}

.progress-text {
  margin-top: 8px;
  text-align: center;
  font-size: 14px;
  color: #595959;
}

.export-error,
.export-success {
  margin-top: 16px;
}

/* Responsive design */
@media (max-width: 768px) {
  .export-type-group,
  .export-format-group,
  .export-destination-group {
    gap: 6px;
  }

  .export-type-button,
  .export-format-button,
  .export-destination-button {
    padding: 10px 12px !important;
  }

  .export-type-title,
  .export-format-title,
  .export-destination-title {
    font-size: 13px;
  }

  .export-type-description,
  .export-format-description,
  .export-destination-description {
    font-size: 11px;
  }
}
</style> 