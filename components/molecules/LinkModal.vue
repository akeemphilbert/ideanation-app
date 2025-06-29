<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <div class="header-content">
          <h3>Create Relationship</h3>
          <div class="relationship-status">
            <span class="status-dot status-dot--active"></span>
            Ready to link
          </div>
        </div>
        <button class="close-button" @click="closeModal">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>
      
      <div class="modal-body">
        <div class="nodes-preview">
          <div class="node-preview">
            <div class="node-icon">{{ getNodeIcon(sourceNode?.type) }}</div>
            <div class="node-info">
              <div class="node-title">{{ sourceNode?.title }}</div>
              <div class="node-type">{{ formatNodeType(sourceNode?.type) }}</div>
            </div>
          </div>
          
          <div class="relationship-arrow">
            <div class="arrow-line"></div>
            <div class="arrow-head">→</div>
          </div>
          
          <div class="node-preview">
            <div class="node-icon">{{ getNodeIcon(targetNode?.type) }}</div>
            <div class="node-info">
              <div class="node-title">{{ targetNode?.title }}</div>
              <div class="node-type">{{ formatNodeType(targetNode?.type) }}</div>
            </div>
          </div>
        </div>
        
        <form @submit.prevent="saveRelationship" class="relationship-form">
          <div class="form-group">
            <label class="form-label">Relationship Type</label>
            <select v-model="formData.relationshipType" class="form-input" required>
              <option value="">Select relationship...</option>
              <option 
                v-for="relationship in availableRelationships" 
                :key="relationship.value"
                :value="relationship.value"
              >
                {{ relationship.label }}
              </option>
            </select>
          </div>
          
          <div class="form-group" v-if="formData.relationshipType">
            <label class="form-label">Description (Optional)</label>
            <textarea
              v-model="formData.description"
              class="form-input form-textarea"
              :placeholder="getDescriptionPlaceholder()"
              rows="3"
            ></textarea>
          </div>
          
          <div class="relationship-preview" v-if="formData.relationshipType">
            <div class="preview-content">
              <div class="preview-icon">🔗</div>
              <div class="preview-text">
                <strong>{{ sourceNode?.title }}</strong> 
                <em>{{ getRelationshipLabel(formData.relationshipType) }}</em> 
                <strong>{{ targetNode?.title }}</strong>
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
              :disabled="!formData.relationshipType"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
              </svg>
              Create Link
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Node {
  id: string
  title: string
  type: string
  description: string
}

interface Props {
  sourceNode: Node | null
  targetNode: Node | null
}

const props = defineProps<Props>()
const emit = defineEmits(['save', 'close'])

const formData = reactive({
  relationshipType: '',
  description: ''
})

const availableRelationships = computed(() => {
  if (!props.sourceNode || !props.targetNode) return []
  
  const sourceType = props.sourceNode.type
  const targetType = props.targetNode.type
  
  // Define available relationships based on node types
  const relationships = [
    // Generic relationships (always available)
    { value: 'related', label: 'is related to' },
    { value: 'depends', label: 'depends on' },
    { value: 'influences', label: 'influences' },
    { value: 'supports', label: 'supports' },
    
    // Specific relationships based on types
    ...(sourceType === 'problem' && targetType === 'idea' ? [
      { value: 'belongs', label: 'belongs to' }
    ] : []),
    
    ...(sourceType === 'customer' && targetType === 'idea' ? [
      { value: 'belongs', label: 'belongs to' }
    ] : []),
    
    ...(sourceType === 'feature' && targetType === 'problem' ? [
      { value: 'solves', label: 'solves' },
      { value: 'addresses', label: 'addresses' }
    ] : []),
    
    ...(sourceType === 'feature' && targetType === 'pain' ? [
      { value: 'relieves', label: 'relieves' },
      { value: 'reduces', label: 'reduces' }
    ] : []),
    
    ...(sourceType === 'feature' && targetType === 'gain' ? [
      { value: 'creates', label: 'creates' },
      { value: 'enables', label: 'enables' }
    ] : []),
    
    ...(sourceType === 'customer' && targetType === 'job' ? [
      { value: 'performs', label: 'performs' }
    ] : []),
    
    ...(sourceType === 'customer' && targetType === 'pain' ? [
      { value: 'experiences', label: 'experiences' }
    ] : []),
    
    ...(sourceType === 'customer' && targetType === 'gain' ? [
      { value: 'desires', label: 'desires' }
    ] : []),
    
    ...(sourceType === 'idea' && targetType === 'solution' ? [
      { value: 'mvp', label: 'has MVP' }
    ] : []),
    
    ...(sourceType === 'feature' && targetType === 'solution' ? [
      { value: 'belongs', label: 'belongs to' }
    ] : [])
  ]
  
  // Remove duplicates
  const uniqueRelationships = relationships.filter((rel, index, self) => 
    index === self.findIndex(r => r.value === rel.value)
  )
  
  return uniqueRelationships
})

const getNodeIcon = (type?: string): string => {
  const icons: Record<string, string> = {
    idea: '💡',
    problem: '⚠️',
    customer: '👤',
    job: '⚡',
    gain: '📈',
    pain: '😤',
    feature: '⚙️',
    solution: '🏗️'
  }
  return icons[type || ''] || '📝'
}

const formatNodeType = (type?: string): string => {
  const typeNames: Record<string, string> = {
    idea: 'Idea',
    problem: 'Problem',
    customer: 'Customer',
    job: 'Job',
    gain: 'Gain',
    pain: 'Pain',
    feature: 'Feature',
    solution: 'Solution'
  }
  return typeNames[type || ''] || type || ''
}

const getRelationshipLabel = (relationshipType: string): string => {
  const relationship = availableRelationships.value.find(r => r.value === relationshipType)
  return relationship ? relationship.label : relationshipType
}

const getDescriptionPlaceholder = (): string => {
  const examples: Record<string, string> = {
    'solves': 'Explain how this feature solves the problem...',
    'relieves': 'Describe how this feature relieves the pain...',
    'creates': 'Explain how this feature creates the gain...',
    'performs': 'Describe how the customer performs this job...',
    'experiences': 'Explain how the customer experiences this pain...',
    'desires': 'Describe why the customer desires this gain...',
    'belongs': 'Explain the relationship...',
    'related': 'Describe how these are related...'
  }
  return examples[formData.relationshipType] || 'Add additional context about this relationship...'
}

const saveRelationship = () => {
  if (!formData.relationshipType) return
  
  emit('save', {
    relationshipType: formData.relationshipType,
    description: formData.description.trim() || undefined
  })
}

const closeModal = () => {
  emit('close')
}

// Auto-select the most appropriate relationship if there's only one specific option
watch(() => availableRelationships.value, (newRelationships) => {
  if (newRelationships.length > 0 && !formData.relationshipType) {
    // If there are specific relationships (not just generic ones), prefer those
    const specificRelationships = newRelationships.filter(r => 
      !['related', 'depends', 'influences', 'supports'].includes(r.value)
    )
    
    if (specificRelationships.length === 1) {
      formData.relationshipType = specificRelationships[0].value
    }
  }
}, { immediate: true })
</script>

<style scoped>
/* Professional black theme matching tools section */
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
  max-width: 600px;
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

.relationship-status {
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

.nodes-preview {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 32px;
  padding: 20px;
  background: #2a2a2a;
  border: 1px solid #333;
  border-radius: 12px;
}

.node-preview {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.node-icon {
  font-size: 20px;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #4f46e5;
  border-radius: 8px;
}

.node-info {
  min-width: 0;
  flex: 1;
}

.node-title {
  font-weight: 600;
  color: #fff;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 2px;
}

.node-type {
  font-size: 12px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
}

.relationship-arrow {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  color: #888;
}

.arrow-line {
  width: 30px;
  height: 2px;
  background: #888;
  border-radius: 1px;
}

.arrow-head {
  font-size: 16px;
  font-weight: bold;
  color: #4f46e5;
}

.relationship-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
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

select.form-input {
  cursor: pointer;
}

select.form-input option {
  background: #2a2a2a;
  color: #fff;
  padding: 8px;
}

.relationship-preview {
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

.preview-text em {
  color: #10b981;
  font-style: normal;
  font-weight: 600;
  margin: 0 8px;
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
  
  .nodes-preview {
    flex-direction: column;
    gap: 16px;
    padding: 16px;
  }
  
  .relationship-arrow {
    transform: rotate(90deg);
  }
  
  .arrow-line {
    width: 20px;
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
  
  .nodes-preview {
    padding: 12px;
  }
  
  .node-icon {
    width: 36px;
    height: 36px;
    font-size: 18px;
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