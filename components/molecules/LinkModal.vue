<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3 class="handwritten">Create Relationship</h3>
        <button class="close-button" @click="closeModal">×</button>
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
            <label class="handwritten">Relationship Type</label>
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
            <label class="handwritten">Description (Optional)</label>
            <textarea
              v-model="formData.description"
              class="form-input form-textarea"
              :placeholder="getDescriptionPlaceholder()"
              rows="3"
            ></textarea>
          </div>
          
          <div class="relationship-preview" v-if="formData.relationshipType">
            <div class="preview-text">
              <strong>{{ sourceNode?.title }}</strong> 
              <em>{{ getRelationshipLabel(formData.relationshipType) }}</em> 
              <strong>{{ targetNode?.title }}</strong>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" class="btn-sketch" @click="closeModal">
              Cancel
            </button>
            <button type="submit" class="btn-sketch btn-primary" :disabled="!formData.relationshipType">
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

.modal-body {
  padding: 20px;
}

.nodes-preview {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
  padding: 16px;
  background: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}

.node-preview {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
}

.node-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.node-info {
  min-width: 0;
}

.node-title {
  font-weight: 600;
  color: var(--color-primary);
  font-family: var(--font-handwritten);
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.node-type {
  font-size: 0.8rem;
  color: var(--color-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.relationship-arrow {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  color: var(--color-secondary);
}

.arrow-line {
  width: 30px;
  height: 1px;
  background: var(--color-secondary);
}

.arrow-head {
  font-size: 1.2rem;
  font-weight: bold;
}

.relationship-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 0.9rem;
  color: var(--color-primary);
  font-weight: 600;
}

.form-input {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid var(--color-primary);
  border-radius: 4px;
  font-family: var(--font-handwritten);
  font-size: 0.9rem;
  color: var(--color-primary);
  background: white;
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 2px rgba(26, 26, 26, 0.1);
  transform: rotate(0deg);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
}

select.form-input {
  cursor: pointer;
}

.relationship-preview {
  background: #e8f5e8;
  border: 1px solid #4caf50;
  border-radius: 6px;
  padding: 12px;
  margin: 16px 0;
}

.preview-text {
  font-family: var(--font-handwritten);
  font-size: 1rem;
  color: var(--color-primary);
  text-align: center;
  line-height: 1.4;
}

.preview-text strong {
  color: var(--color-primary);
}

.preview-text em {
  color: var(--color-secondary);
  font-style: normal;
  font-weight: 600;
  margin: 0 8px;
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

@media (max-width: 768px) {
  .nodes-preview {
    flex-direction: column;
    gap: 12px;
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
}
</style>