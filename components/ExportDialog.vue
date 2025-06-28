<template>
  <div class="export-dialog" v-if="visible">
    <div class="modal-overlay" @click="handleCancel">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="handwritten">Export Your Idea</h3>
          <button class="close-button" @click="handleCancel">×</button>
        </div>
        
        <div class="export-form">
          <!-- Export Type Selection -->
          <div class="form-section">
            <h3>What would you like to export?</h3>
            <div class="export-type-group">
              <label 
                v-for="type in exportTypes" 
                :key="type.value" 
                class="export-type-button"
                :class="{ 'selected': selectedType === type.value }"
              >
                <input 
                  type="radio" 
                  :value="type.value"
                  v-model="selectedType"
                  class="radio-input"
                />
                <div class="export-type-content">
                  <div class="export-type-title">{{ type.label }}</div>
                  <div class="export-type-description">{{ type.description }}</div>
                </div>
              </label>
            </div>
          </div>

          <!-- Export Format Selection -->
          <div class="form-section">
            <h3>Choose your format</h3>
            <div class="export-format-group">
              <label 
                v-for="format in exportFormats" 
                :key="format.value" 
                class="export-format-button"
                :class="{ 'selected': selectedFormat === format.value }"
              >
                <input 
                  type="radio" 
                  :value="format.value"
                  v-model="selectedFormat"
                  class="radio-input"
                />
                <div class="export-format-content">
                  <div class="export-format-title">{{ format.label }}</div>
                  <div class="export-format-description">{{ format.description }}</div>
                </div>
              </label>
            </div>
          </div>

          <!-- Export Destination Selection -->
          <div class="form-section">
            <h3>Where would you like to save it?</h3>
            <div class="export-destination-group">
              <label 
                v-for="destination in exportDestinations" 
                :key="destination.value" 
                class="export-destination-button"
                :class="{ 'selected': selectedDestination === destination.value }"
              >
                <input 
                  type="radio" 
                  :value="destination.value"
                  v-model="selectedDestination"
                  class="radio-input"
                />
                <div class="export-destination-content">
                  <div class="export-destination-title">{{ destination.label }}</div>
                  <div class="export-destination-description">{{ destination.description }}</div>
                </div>
              </label>
            </div>
          </div>

          <!-- Progress Bar -->
          <div v-if="isExporting" class="export-progress">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: exportProgress + '%' }"></div>
            </div>
            <div class="progress-text">
              {{ getProgressText() }}
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="lastExportResult && !lastExportResult.success" class="export-error">
            <div class="alert alert-error">
              <strong>{{ lastExportResult.message }}</strong>
              <div v-if="lastExportResult.error">{{ lastExportResult.error }}</div>
            </div>
          </div>

          <!-- Success Message -->
          <div v-if="lastExportResult && lastExportResult.success" class="export-success">
            <div class="alert alert-success">
              <strong>{{ lastExportResult.message }}</strong>
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div class="form-actions">
            <button class="btn-sketch" @click="handleCancel">
              Cancel
            </button>
            <button 
              class="btn-sketch btn-primary" 
              @click="handleExport"
              :disabled="!selectedType || !selectedFormat || !selectedDestination || isExporting"
            >
              {{ isExporting ? 'Exporting...' : 'Export' }}
            </button>
          </div>
        </div>
      </div>
    </div>
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
  emit('update:visible', false)
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
      emit('update:visible', false)
    }, 2000)
  }
})
</script>

<style scoped>
.export-dialog {
  font-family: var(--font-handwritten);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border: 3px solid var(--color-primary);
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  transform: rotate(-0.3deg);
  box-shadow: 8px 8px 0px rgba(0,0,0,0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 2px solid var(--color-primary);
  background: #f9f9f9;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.3rem;
  color: var(--color-primary);
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--color-secondary);
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-button:hover {
  background: #f0f0f0;
  color: var(--color-primary);
}

.export-form {
  padding: 20px;
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
  display: block;
  width: 100%;
  padding: 12px 16px;
  text-align: left;
  border-radius: 8px;
  border: 1px solid #d9d9d9;
  background: #fafafa;
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
}

.export-type-button:hover,
.export-format-button:hover,
.export-destination-button:hover {
  border-color: var(--color-primary);
  background: #f0f8ff;
}

.export-type-button.selected,
.export-format-button.selected,
.export-destination-button.selected {
  border-color: var(--color-primary);
  background: #e6f7ff;
  color: var(--color-primary);
}

.radio-input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
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

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--color-primary);
  transition: width 0.3s ease;
}

.progress-text {
  margin-top: 8px;
  text-align: center;
  font-size: 14px;
  color: #595959;
}

.alert {
  padding: 12px;
  border-radius: 6px;
  margin-top: 16px;
}

.alert-error {
  background: #ffebee;
  border: 1px solid #f44336;
  color: #d32f2f;
}

.alert-success {
  background: #e8f5e8;
  border: 1px solid #4caf50;
  color: #2e7d32;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.btn-primary {
  background: var(--color-primary);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: var(--color-accent);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
    padding: 10px 12px;
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
  
  .form-actions {
    flex-direction: column;
  }
}
</style>