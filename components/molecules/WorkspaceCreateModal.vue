<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <div class="header-content">
          <h3>Create New Workspace</h3>
          <div class="workspace-status">
            <span class="status-dot status-dot--active"></span>
            Ready to create
          </div>
        </div>
        <button class="close-button" @click="closeModal">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>
      
      <div class="modal-body">
        <div class="workspace-preview">
          <div class="workspace-icon">🏢</div>
          <div class="workspace-info">
            <div class="workspace-type-name">Workspace</div>
            <div class="workspace-description">A dedicated space for organizing your startup ideas</div>
          </div>
        </div>
        
        <form @submit.prevent="saveWorkspace" class="workspace-form">
          <div class="form-group">
            <label class="form-label">Workspace Name</label>
            <input
              v-model="formData.title"
              type="text"
              class="form-input"
              placeholder="e.g., My Startup Ideas, Q1 2024 Projects, Innovation Lab"
              required
              ref="titleInput"
            />
          </div>
          
          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea
              v-model="formData.description"
              class="form-input form-textarea"
              placeholder="Describe what you'll be working on in this workspace..."
              rows="3"
              required
            ></textarea>
          </div>
          
          <div class="workspace-preview-result" v-if="formData.title">
            <div class="preview-content">
              <div class="preview-icon">🏢</div>
              <div class="preview-text">
                <strong>{{ formData.title }}</strong>
                <span v-if="formData.description"> - {{ formData.description.substring(0, 50) }}{{ formData.description.length > 50 ? '...' : '' }}</span>
              </div>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" class="action-button action-button--secondary" @click="closeModal">
              Cancel
            </button>
            <button 
              type="submit" 
              class="action-button action-button--primary" 
              :disabled="!formData.title.trim() || !formData.description.trim()"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
              </svg>
              Create Workspace
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  visible: boolean
}

interface Emits {
  (e: 'save', data: { title: string; description: string }): void
  (e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const titleInput = ref<HTMLInputElement>()

const formData = reactive({
  title: '',
  description: ''
})

const saveWorkspace = () => {
  if (!formData.title.trim() || !formData.description.trim()) return
  
  const workspaceData = {
    title: formData.title.trim(),
    description: formData.description.trim()
  }
  
  emit('save', workspaceData)
}

const closeModal = () => {
  // Reset form data
  formData.title = ''
  formData.description = ''
  emit('close')
}

// Focus title input when modal opens
watch(() => props.visible, (newVisible) => {
  if (newVisible) {
    nextTick(() => {
      titleInput.value?.focus()
    })
  }
})
</script>

<style scoped>
/* Professional black theme matching other modals */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  animation: modalSlideIn 0.3s ease-out;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: #000;
  border-bottom: 1px solid #333;
  border-radius: 12px 12px 0 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
  margin-right: 16px;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  letter-spacing: 0.5px;
}

.workspace-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #888;
  font-weight: 500;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #666;
  transition: background-color 0.2s ease;
}

.status-dot--active {
  background: #10b981;
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.3);
}

.close-button {
  background: transparent;
  border: none;
  color: #888;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
}

.close-button:hover {
  background: #2a2a2a;
  color: #fff;
}

.modal-body {
  padding: 24px;
}

.workspace-preview {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
  padding: 20px;
  background: #2a2a2a;
  border: 1px solid #333;
  border-radius: 12px;
}

.workspace-icon {
  font-size: 24px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #4f46e5;
  border-radius: 8px;
  flex-shrink: 0;
}

.workspace-info {
  flex: 1;
}

.workspace-type-name {
  font-weight: 600;
  color: #fff;
  font-size: 16px;
  margin-bottom: 4px;
}

.workspace-description {
  font-size: 13px;
  color: #888;
  line-height: 1.4;
}

.workspace-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  color: #fff;
  font-weight: 600;
  letter-spacing: 0.25px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #333;
  border-radius: 8px;
  font-size: 14px;
  color: #fff;
  background: #2a2a2a;
  transition: all 0.2s ease;
  font-family: inherit;
}

.form-input::placeholder {
  color: #666;
}

.form-input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  background: #333;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
  line-height: 1.5;
}

.workspace-preview-result {
  background: #2a2a2a;
  border: 1px solid #10b981;
  border-radius: 8px;
  padding: 16px;
  margin: 16px 0;
}

.preview-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.preview-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.preview-text {
  font-size: 14px;
  color: #fff;
  line-height: 1.4;
  flex: 1;
}

.preview-text strong {
  color: #fff;
  font-weight: 600;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 8px;
  padding-top: 24px;
  border-top: 1px solid #333;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: 1px solid #333;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  background: transparent;
  letter-spacing: 0.25px;
}

.action-button--primary {
  background: #4f46e5;
  border-color: #4f46e5;
  color: white;
}

.action-button--primary:hover:not(:disabled) {
  background: #4338ca;
  border-color: #4338ca;
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(79, 70, 229, 0.3);
}

.action-button--primary:disabled {
  background: #333;
  border-color: #333;
  color: #666;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.action-button--secondary {
  background: #2a2a2a;
  border-color: #333;
  color: #ccc;
}

.action-button--secondary:hover {
  background: #333;
  border-color: #444;
  color: #fff;
  transform: translateY(-1px);
}

.action-button svg {
  flex-shrink: 0;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Custom scrollbar */
.modal-content::-webkit-scrollbar {
  width: 6px;
}

.modal-content::-webkit-scrollbar-track {
  background: #2a2a2a;
}

.modal-content::-webkit-scrollbar-thumb {
  background: #444;
  border-radius: 3px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Responsive Design */
@media (max-width: 768px) {
  .modal-overlay {
    padding: 16px;
  }
  
  .modal-content {
    max-width: none;
    border-radius: 8px;
  }
  
  .modal-header {
    padding: 16px 20px;
    border-radius: 8px 8px 0 0;
  }
  
  .modal-header h3 {
    font-size: 16px;
  }
  
  .modal-body {
    padding: 20px;
  }
  
  .workspace-preview {
    padding: 16px;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .action-button {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .modal-overlay {
    padding: 12px;
  }
  
  .modal-header {
    padding: 12px 16px;
  }
  
  .modal-body {
    padding: 16px;
  }
  
  .workspace-preview {
    padding: 12px;
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
  
  .workspace-icon {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
  
  .form-input {
    padding: 10px 14px;
    font-size: 16px; /* Prevent zoom on iOS */
  }
  
  .action-button {
    padding: 10px 16px;
    font-size: 14px;
  }
}
</style>