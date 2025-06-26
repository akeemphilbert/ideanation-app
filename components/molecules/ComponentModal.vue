<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3 class="handwritten">
          {{ component ? 'Edit Component' : 'Add New Component' }}
        </h3>
        <button class="close-button" @click="closeModal">×</button>
      </div>
      
      <form @submit.prevent="saveComponent" class="component-form">
        <div class="form-group">
          <label class="handwritten">Type</label>
          <select v-model="formData.type" class="form-input" required>
            <option value="">Select type...</option>
            <option value="problem">Problem</option>
            <option value="customer">Customer</option>
            <option value="job">Job to be Done</option>
            <option value="gain">Gain Creator</option>
            <option value="pain">Pain Reliever</option>
            <option value="feature">Feature</option>
            <option value="solution">Solution</option>
          </select>
        </div>
        
        <div class="form-group">
          <label class="handwritten">Title</label>
          <input
            v-model="formData.title"
            type="text"
            class="form-input"
            placeholder="Enter component title..."
            required
          />
        </div>
        
        <div class="form-group">
          <label class="handwritten">Description</label>
          <textarea
            v-model="formData.description"
            class="form-input form-textarea"
            placeholder="Describe this component..."
            rows="4"
            required
          ></textarea>
        </div>
        
        <div class="form-group">
          <label class="handwritten">Tags (comma separated)</label>
          <input
            v-model="tagsInput"
            type="text"
            class="form-input"
            placeholder="tag1, tag2, tag3..."
          />
        </div>
        
        <div class="form-actions">
          <button type="button" class="btn-sketch" @click="closeModal">
            Cancel
          </button>
          <button type="submit" class="btn-sketch btn-primary">
            {{ component ? 'Update' : 'Create' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Component {
  id?: string
  type: string
  title: string
  description: string
  tags: string[]
}

interface Props {
  component?: Component | null
}

const props = defineProps<Props>()
const emit = defineEmits(['save', 'close'])

const formData = reactive({
  type: '',
  title: '',
  description: '',
  tags: [] as string[]
})

const tagsInput = ref('')

onMounted(() => {
  if (props.component) {
    formData.type = props.component.type
    formData.title = props.component.title
    formData.description = props.component.description
    formData.tags = [...props.component.tags]
    tagsInput.value = props.component.tags.join(', ')
  }
})

const saveComponent = () => {
  // Parse tags from input
  formData.tags = tagsInput.value
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0)
  
  const componentData = {
    ...formData,
    id: props.component?.id || `comp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }
  
  emit('save', componentData)
}

const closeModal = () => {
  emit('close')
}
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
  max-width: 500px;
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

.component-form {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
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

.btn-primary:hover {
  background: var(--color-accent);
}
</style>