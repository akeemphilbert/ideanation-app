<template>
  <div class="chat-interface">
    <div class="chat-header">
      <div class="header-left">
        <h3 class="chat-title">AI Assistant</h3>
        <div class="workspace-selector" v-if="workspaces.length > 0">
          <select 
            v-model="selectedWorkspaceId" 
            @change="handleWorkspaceChange"
            class="workspace-select"
          >
            <option value="">Select workspace...</option>
            <option 
              v-for="workspace in workspaces" 
              :key="workspace['@id']" 
              :value="workspace['@id']"
            >
              {{ workspace.title }}
            </option>
          </select>
        </div>
      </div>
      <div class="header-right">
        <div class="chat-status">
          <span class="status-dot" :class="{ 'status-dot--online': isOnline }"></span>
          {{ isOnline ? 'Online' : 'Offline' }}
        </div>
        <button 
          v-if="workspaces.length > 0"
          @click="showCreateWorkspace = !showCreateWorkspace"
          class="new-workspace-btn"
          title="Create new workspace"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>
    </div>

    <!-- Create Workspace Form -->
    <div v-if="showCreateWorkspace" class="create-workspace">
      <form @submit.prevent="createNewWorkspace" class="workspace-form">
        <input
          v-model="newWorkspaceName"
          type="text"
          placeholder="Enter workspace name..."
          class="workspace-input"
          required
        />
        <div class="workspace-actions">
          <button type="submit" class="create-btn" :disabled="!newWorkspaceName.trim()">
            Create
          </button>
          <button type="button" @click="cancelCreateWorkspace" class="cancel-btn">
            Cancel
          </button>
        </div>
      </form>
    </div>
    
    <div class="chat-messages" ref="messagesContainer">
      <div v-if="messages.length === 0" class="chat-welcome">
        <div class="welcome-message">
          <div v-if="!currentWorkspace">
            <p class="welcome-text">👋 Welcome to Ideanation!</p>
            <p class="welcome-subtitle">
              {{ workspaces.length > 0 ? 'Select a workspace above or create a new one to get started.' : 'Let\'s create your first workspace to organize your startup ideas.' }}
            </p>
            <button 
              v-if="workspaces.length === 0"
              @click="showCreateWorkspace = true"
              class="create-first-workspace-btn"
            >
              Create Your First Workspace
            </button>
          </div>
          <div v-else>
            <p class="welcome-text">👋 Hi! I'm here to help you structure your startup idea.</p>
            <p class="welcome-subtitle">Try asking me about:</p>
            <ul class="welcome-list">
              <li>What problems does your idea solve?</li>
              <li>Who are your target customers?</li>
              <li>What features should you prioritize?</li>
            </ul>
          </div>
        </div>
      </div>
      
      <ChatMessage
        v-for="message in messages"
        :key="message.id"
        :message="message"
        @apply-suggestion="handleSuggestion"
      />
      
      <div v-if="isTyping" class="typing-indicator">
        <div class="typing-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <span class="typing-text">AI is thinking...</span>
      </div>
    </div>
    
    <div class="chat-input">
      <form @submit.prevent="sendMessage" class="input-form">
        <input
          v-model="inputMessage"
          type="text"
          :placeholder="getInputPlaceholder()"
          class="message-input"
          :disabled="isTyping || !currentWorkspace"
        />
        <button
          type="submit"
          class="send-button"
          :disabled="!inputMessage.trim() || isTyping || !currentWorkspace"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22,2 15,22 11,13 2,9"></polygon>
          </svg>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  messages: Array<{
    id: string
    type: 'user' | 'ai'
    content: string
    timestamp: Date
    suggestions?: any[]
  }>
}

const props = defineProps<Props>()
const emit = defineEmits(['send-message', 'apply-suggestion'])

const resourcesStore = useResourcesStore()

const messagesContainer = ref<HTMLElement>()
const inputMessage = ref('')
const isTyping = ref(false)
const isOnline = ref(true)
const showCreateWorkspace = ref(false)
const newWorkspaceName = ref('')
const selectedWorkspaceId = ref('')

// Computed properties
const workspaces = computed(() => resourcesStore.workspaces)
const currentWorkspace = computed(() => resourcesStore.currentWorkspace)

// Initialize selected workspace
watch(currentWorkspace, (newWorkspace) => {
  if (newWorkspace) {
    selectedWorkspaceId.value = newWorkspace['@id']
  } else {
    selectedWorkspaceId.value = ''
  }
}, { immediate: true })

// Auto-select first workspace if none selected
onMounted(() => {
  if (!currentWorkspace.value && workspaces.value.length > 0) {
    resourcesStore.setCurrentWorkspace(workspaces.value[0])
  }
})

const getInputPlaceholder = () => {
  if (!currentWorkspace.value) {
    return "Select a workspace to start chatting..."
  }
  return "Ask me about your idea..."
}

const handleWorkspaceChange = () => {
  const workspace = workspaces.value.find(w => w['@id'] === selectedWorkspaceId.value)
  if (workspace) {
    resourcesStore.setCurrentWorkspace(workspace)
  } else {
    resourcesStore.setCurrentWorkspace(null)
  }
}

const createNewWorkspace = () => {
  if (!newWorkspaceName.value.trim()) return
  
  const workspace = resourcesStore.createWorkspace({
    title: newWorkspaceName.value.trim(),
    description: `Workspace for ${newWorkspaceName.value.trim()}`
  })
  
  resourcesStore.setCurrentWorkspace(workspace.toJSON())
  
  // Reset form
  newWorkspaceName.value = ''
  showCreateWorkspace.value = false
}

const cancelCreateWorkspace = () => {
  newWorkspaceName.value = ''
  showCreateWorkspace.value = false
}

const sendMessage = async () => {
  if (!inputMessage.value.trim() || isTyping.value || !currentWorkspace.value) return
  
  const message = inputMessage.value.trim()
  inputMessage.value = ''
  isTyping.value = true
  
  try {
    emit('send-message', message)
    await nextTick()
    scrollToBottom()
  } finally {
    // Simulate AI response delay
    setTimeout(() => {
      isTyping.value = false
      nextTick(() => scrollToBottom())
    }, 1500)
  }
}

const handleSuggestion = (suggestion: any) => {
  emit('apply-suggestion', suggestion)
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

watch(() => props.messages.length, () => {
  nextTick(() => scrollToBottom())
})

onMounted(() => {
  scrollToBottom()
})
</script>

<style scoped>
.chat-interface {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  background: #000000;
  min-height: 64px;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.chat-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: white;
}

.workspace-selector {
  display: flex;
  align-items: center;
}

.workspace-select {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: white;
  font-size: 12px;
  padding: 4px 8px;
  min-width: 160px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.workspace-select:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.4);
  background: rgba(255, 255, 255, 0.15);
}

.workspace-select option {
  background: #1f2937;
  color: white;
}

.chat-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
}

.status-dot--online {
  background: #10b981;
}

.new-workspace-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: white;
  padding: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.new-workspace-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

.create-workspace {
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  padding: 16px 20px;
}

.workspace-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.workspace-input {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  color: #111827;
  font-family: inherit;
}

.workspace-input:focus {
  outline: none;
  border-color: #000000;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
}

.workspace-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.create-btn {
  background: #000000;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.create-btn:hover:not(:disabled) {
  background: #1f2937;
}

.create-btn:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}

.cancel-btn {
  background: white;
  color: #6b7280;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn:hover {
  background: #f3f4f6;
  border-color: #9ca3af;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  min-height: 0;
}

.chat-welcome {
  text-align: center;
  padding: 20px;
  color: #6b7280;
}

.welcome-message {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
  max-width: 280px;
  margin: 0 auto;
}

.welcome-text {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 500;
  color: #111827;
}

.welcome-subtitle {
  margin: 0 0 16px 0;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
}

.welcome-list {
  text-align: left;
  margin: 0;
  padding-left: 20px;
  font-size: 14px;
  line-height: 1.6;
}

.welcome-list li {
  margin-bottom: 8px;
  color: #6b7280;
}

.create-first-workspace-btn {
  background: #000000;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 8px;
}

.create-first-workspace-btn:hover {
  background: #1f2937;
  transform: translateY(-1px);
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  color: #6b7280;
}

.typing-dots {
  display: flex;
  gap: 4px;
}

.typing-dots span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #9ca3af;
  animation: typing-bounce 1.4s infinite ease-in-out;
}

.typing-dots span:nth-child(1) { animation-delay: -0.32s; }
.typing-dots span:nth-child(2) { animation-delay: -0.16s; }
.typing-dots span:nth-child(3) { animation-delay: 0; }

.typing-text {
  font-size: 14px;
  font-weight: 500;
}

.chat-input {
  border-top: 1px solid #e5e7eb;
  padding: 16px 20px;
  background: white;
}

.input-form {
  display: flex;
  gap: 12px;
  align-items: center;
}

.message-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  color: #111827;
  transition: all 0.2s ease;
  font-family: inherit;
}

.message-input:focus {
  outline: none;
  border-color: #000000;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
}

.message-input:disabled {
  background: #f3f4f6;
  color: #9ca3af;
  cursor: not-allowed;
}

.message-input::placeholder {
  color: #9ca3af;
}

.send-button {
  padding: 12px;
  background: #000000;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  height: 44px;
}

.send-button:hover:not(:disabled) {
  background: #1f2937;
  transform: translateY(-1px);
}

.send-button:disabled {
  background: #d1d5db;
  cursor: not-allowed;
  transform: none;
}

@keyframes typing-bounce {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Scrollbar styling */
.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: #f3f4f6;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Responsive design */
@media (max-width: 768px) {
  .chat-header {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    padding: 12px 16px;
  }
  
  .header-left {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
  
  .header-right {
    justify-content: space-between;
  }
  
  .workspace-select {
    min-width: 120px;
    font-size: 11px;
  }
  
  .chat-messages {
    padding: 16px;
  }
  
  .chat-input {
    padding: 12px 16px;
  }
}
</style>