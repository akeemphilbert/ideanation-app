<template>
  <div class="chat-interface">
    <div class="chat-header">
      <div class="header-main">
        <h3>AI Assistant</h3>
      </div>
      
      <!-- Workspace Dropdown Row - Only show if workspaces exist -->
      <div class="workspace-selector">
        <select 
          id="workspace-select"
          v-model="selectedWorkspaceId" 
          @change="handleWorkspaceChange"
          class="workspace-dropdown"
        >
          <option value="">Select workspace...</option>
          <option 
            v-for="workspace in availableWorkspaces" 
            :key="workspace.id"
            :value="workspace.id"
          >
            {{ workspace.title }}
          </option>
        </select>
        <div class="workspace-selector-actions">
          <button 
            class="workspace-selector-action"
            @click="showWorkspaceModal = true"
            title="Add new workspace"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
    
    <div class="chat-messages" ref="messagesContainer">
      <div v-if="messages.length === 0" class="chat-welcome">
        <div class="welcome-message">
          <p>👋 Hi! Let's start building your startup idea.</p>
          <p v-if="!hasWorkspace"><strong>First, what's your idea called?</strong></p>
          <p v-else>Great! Now you can create entities by typing:</p>
          <ul v-if="hasWorkspace">
            <li>your problem description</li>
            <li>your customer description</li>
            <li>your feature description</li>
            <li>customer pain point</li>
            <li>customer gain</li>
          </ul>
          <p v-if="hasWorkspace" class="help-note">Or ask me questions about your idea!</p>
        </div>
      </div>
      
      <ChatMessage
        v-for="message in messages"
        :key="message.id"
        :message="message"
        @apply-suggestion="handleSuggestionApply"
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
      <form @submit.prevent="handleChatMessage" class="input-form">
        <input
          v-model="chatMessage"
          type="text"
          :placeholder="getInputPlaceholder()"
          class="message-input"
          :disabled="isTyping"
        />
        <button
          type="submit"
          class="send-button"
          :disabled="!chatMessage.trim() || isTyping"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </form>
    </div>

    <!-- Workspace Create Modal -->
    <WorkspaceCreateModal
      v-if="showWorkspaceModal"
      :visible="showWorkspaceModal"
      @save="handleWorkspaceCreate"
      @close="showWorkspaceModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { useEntityParser } from '~/composables/useEntityParser'
import ChatMessage from '~/components/molecules/ChatMessage.vue'
import WorkspaceCreateModal from '~/components/molecules/WorkspaceCreateModal.vue'

interface Props {
  selectedNodeIds?: string[]
  hasWorkspace?: boolean
}

interface Emits {
  (e: 'entity-created', entity: any): void
  (e: 'workspace-created', workspace: any): void
  (e: 'relationship-created', relationship: any): void
}

const props = withDefaults(defineProps<Props>(), {
  selectedNodeIds: () => [],
  hasWorkspace: false
})

const emit = defineEmits<Emits>()

const chatStore = useChatStore()
const entitiesStore = useEntitiesStore()
const resourcesStore = useResourcesStore()
const messagesContainer = ref<HTMLElement>()

const chatMessage = ref('')
const isOnline = ref(true)
const selectedWorkspaceId = ref('')
const showWorkspaceModal = ref(false)

const { getAvailablePrefixes, looksLikeEntityCommand } = useEntityParser()
const entityPrefixes = getAvailablePrefixes()

// Computed properties
const messages = computed(() => chatStore.messages)
const isTyping = computed(() => chatStore.isTyping)

const availableWorkspaces = computed(() => resourcesStore.workspaces)

// Watch for current workspace changes
watch(() => resourcesStore.currentWorkspace, (newWorkspace) => {
  if (newWorkspace) {
    selectedWorkspaceId.value = newWorkspace.id
  } else {
    selectedWorkspaceId.value = ''
  }
}, { immediate: true })

const handleWorkspaceChange = () => {
  if (selectedWorkspaceId.value) {
    const workspace = availableWorkspaces.value.find(w => w.id === selectedWorkspaceId.value)
    if (workspace) {
      resourcesStore.setCurrentWorkspace(workspace)
      
      // Add a message to chat about workspace switch
      chatStore.addMessage({
        type: 'ai',
        content: `Switched to workspace "${workspace.title}". You can now work on this idea!`
      })
      
      nextTick(() => scrollToBottom())
    }
  } else {
    resourcesStore.setCurrentWorkspace(null)
  }
}

const handleWorkspaceCreate = (workspaceData: { title: string; description: string }) => {
  const newWorkspace = {
    '@id': `/workspaces/${Date.now()}`,
    '@type': 'ideanation:Workspace' as const,
    id: `workspace-${Date.now()}`,
    title: workspaceData.title,
    description: workspaceData.description,
    identifier: workspaceData.title.toLowerCase().replace(/\s+/g, '-'),
    created: new Date(),
    updated: new Date()
  }

  resourcesStore.createWorkspace(newWorkspace)
  resourcesStore.setCurrentWorkspace(newWorkspace)
  selectedWorkspaceId.value = newWorkspace.id

  // Close modal
  showWorkspaceModal.value = false

  // Add a message to chat about the new workspace
  chatStore.addMessage({
    type: 'ai',
    content: `Created new workspace "${newWorkspace.title}". You can now start building your idea!`
  })

  emit('workspace-created', newWorkspace)

  nextTick(() => scrollToBottom())
}

const getInputPlaceholder = () => {
  if (!props.hasWorkspace) {
    return "What's your startup idea called?"
  }
  
  if (props.selectedNodeIds.length === 1) {
    const selectedNode = getSelectedNodeTitle(props.selectedNodeIds[0])
    if (selectedNode) {
      return `Add entity linked to "${selectedNode}" (e.g., problem: your problem)`
    }
  } else if (props.selectedNodeIds.length === 2) {
    return "Click 'Link Nodes' to connect the selected entities"
  }
  
  return "Type 'problem: your problem' or ask me anything..."
}

const getSelectedNodeTitle = (nodeId: string): string => {
  // This would need to be passed from parent or accessed via store
  // For now, return a placeholder
  return 'selected node'
}

const handleChatMessage = async () => {
  if (!chatMessage.value.trim() || isTyping.value) return
  
  const message = chatMessage.value.trim()
  chatMessage.value = ''

  // Add user message first
  chatStore.addMessage({
    type: 'user',
    content: message
  })

  // Set typing indicator
  chatStore.setTyping(true)

  try {
    // Stream response from AI
    const response = await fetch('/api/message/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: message
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const reader = response.body?.getReader()
    if (!reader) {
      throw new Error('No reader available')
    }

    const decoder = new TextDecoder()
    let aiMessageContent = ''
    let aiMessageId: string | null = null

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      
      const rawChunk = decoder.decode(value, { stream: true })
      // Split chunks by update: and loop through the chunks
      const chunks = rawChunk.split('update: ')
      for (const chunk of chunks) {
        const updateDetails = chunk.trim()
        if (updateDetails) {
          const agentUpdate = JSON.parse(updateDetails)
          if (agentUpdate.data?.lastMessage) {
            aiMessageContent += agentUpdate.data.lastMessage
          }
          
          // Handle different update types
          switch (agentUpdate.type) {
            case 'create_workspace':
              const workspace = resourcesStore.createWorkspace(agentUpdate.data.workspace)
              resourcesStore.setCurrentWorkspace(agentUpdate.data.workspace)
              
              for (const idea of agentUpdate.data.ideas) {
                resourcesStore.createIdea(idea)
              }
              for (const relationship of agentUpdate.data.relationships) {
                resourcesStore.createRelationship(relationship)
              }
              
              emit('workspace-created', workspace)
              break
              
            case 'create_problem':
              for (const problem of agentUpdate.data.problems) {
                const createdProblem = resourcesStore.createProblem(problem)
                emit('entity-created', createdProblem)
              }
              for (const relationship of agentUpdate.data.relationships) {
                const createdRelationship = resourcesStore.createRelationship(relationship)
                emit('relationship-created', createdRelationship)
              }
              break
              
            case 'create_idea':
              for (const idea of agentUpdate.data.ideas) {
                const createdIdea = resourcesStore.createIdea(idea)
                emit('entity-created', createdIdea)
              }
              for (const relationship of agentUpdate.data.relationships) {
                const createdRelationship = resourcesStore.createRelationship(relationship)
                emit('relationship-created', createdRelationship)
              }
              break
          }
        }
      }

      // Update or create AI message
      if (!aiMessageId) {
        // Create new AI message
        const aiMessage = {
          type: 'ai' as const,
          content: aiMessageContent
        }
        chatStore.addMessage(aiMessage)
        aiMessageId = chatStore.messages[chatStore.messages.length - 1].id
      } else {
        // Update existing AI message
        chatStore.updateMessage(aiMessageId, { content: aiMessageContent })
      }

      // Scroll to bottom as content updates
      nextTick(() => scrollToBottom())
    }

  } catch (error) {
    console.error('Error streaming AI response:', error)
    chatStore.addMessage({
      type: 'ai',
      content: 'Sorry, I encountered an error while processing your message. Please try again.'
    })
  } finally {
    chatStore.setTyping(false)
    nextTick(() => scrollToBottom())
  }
}

const handleSuggestionApply = (suggestion: any) => {
  if (suggestion.type === 'component') {
    let newEntity = null
    
    // Add component to appropriate store
    switch (suggestion.data.type) {
      case 'problem':
        newEntity = entitiesStore.createProblem(suggestion.data)
        break
      case 'customer':
        newEntity = entitiesStore.createCustomer(suggestion.data)
        break
      case 'feature':
        newEntity = entitiesStore.createFeature(suggestion.data)
        break
    }
    
    // Create relationship if new entity was created
    if (newEntity) {
      emit('entity-created', newEntity)
    }
  }
  
  // Add confirmation message
  chatStore.addMessage({
    type: 'ai',
    content: `Great! I've added "${suggestion.title}" to your idea canvas.`
  })
  
  nextTick(() => scrollToBottom())
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// Watch for new messages and scroll to bottom
watch(() => chatStore.messages.length, () => {
  nextTick(() => scrollToBottom())
})

const handleAddWorkspace = () => {
  const workspaceName = prompt('Enter workspace name:')
  if (workspaceName && workspaceName.trim()) {
    const newWorkspace = {
      '@id': `/workspaces/${Date.now()}`,
      '@type': 'ideanation:Workspace' as const,
      id: `workspace-${Date.now()}`,
      title: workspaceName.trim(),
      description: `Workspace for ${workspaceName.trim()}`,
      identifier: workspaceName.trim().toLowerCase().replace(/\s+/g, '-'),
      created: new Date(),
      updated: new Date()
    }
    
    resourcesStore.createWorkspace(newWorkspace)
    resourcesStore.setCurrentWorkspace(newWorkspace)
    selectedWorkspaceId.value = newWorkspace.id
    
    // Add a message to chat about the new workspace
    chatStore.addMessage({
      type: 'ai',
      content: `Created new workspace "${newWorkspace.title}". You can now start building your idea!`
    })
    
    nextTick(() => scrollToBottom())
  }
}

onMounted(() => {
  scrollToBottom()
})
</script>

<style scoped>
/* Professional black theme for chat interface with white messages area */
.chat-interface {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.chat-header {
  background: #000;
  border-bottom: 1px solid #333;
}

.header-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
}

.header-main h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  letter-spacing: 0.5px;
}

.chat-status {
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

.status-dot--online {
  background: #10b981;
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.3);
}

/* Workspace Selector Row */
.workspace-selector {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  border-top: 1px solid #333;
  background: #111;
}

.workspace-label {
  font-size: 13px;
  color: #ccc;
  font-weight: 500;
  white-space: nowrap;
}

.workspace-dropdown {
  flex: 1;
  padding: 8px 12px;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 6px;
  color: #fff;
  font-size: 13px;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
}

.workspace-dropdown:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
}

.workspace-dropdown option {
  background: #2a2a2a;
  color: #fff;
  padding: 8px;
}

.workspace-selector-actions {
  display: flex;
  gap: 8px;
}

.workspace-selector-action {
  padding: 8px;
  background: #000;
  border: 1px solid #333;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  height: 32px;
}

.workspace-selector-action:hover {
  background: #1a1a1a;
  border-color: #444;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.workspace-selector-action svg {
  width: 14px;
  height: 14px;
}

/* WHITE MESSAGES AREA */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  min-height: 0;
  background: #ffffff; /* White background */
}

.chat-welcome {
  text-align: center;
  padding: 20px 0;
}

.welcome-message {
  background: #f8f9fa; /* Light gray background for welcome message */
  border-radius: 12px;
  padding: 20px;
  color: #495057; /* Dark gray text */
  line-height: 1.5;
}

.welcome-message p {
  margin: 0 0 12px 0;
  font-size: 14px;
}

.welcome-message ul {
  text-align: left;
  margin: 12px 0;
  padding-left: 20px;
  color: #6c757d;
}

.welcome-message li {
  margin-bottom: 6px;
  font-size: 13px;
}

.welcome-message strong {
  color: #212529;
  font-weight: 600;
}

.help-note {
  font-style: italic;
  color: #6c757d;
  font-size: 13px;
  margin-top: 8px;
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  color: #6c757d; /* Gray for white background */
}

.typing-dots {
  display: flex;
  gap: 4px;
}

.typing-dots span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #adb5bd; /* Gray for white background */
  animation: typing-bounce 1.4s infinite ease-in-out;
}

.typing-dots span:nth-child(1) { animation-delay: -0.32s; }
.typing-dots span:nth-child(2) { animation-delay: -0.16s; }
.typing-dots span:nth-child(3) { animation-delay: 0; }

.typing-text {
  font-size: 13px;
  font-weight: 500;
}

.chat-input {
  border-top: 1px solid #333;
  padding: 16px 20px;
  background: #000;
}

.input-form {
  display: flex;
  gap: 12px;
  align-items: center;
}

.message-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #333;
  border-radius: 8px;
  font-size: 14px;
  background: #2a2a2a;
  color: #fff;
  transition: all 0.2s ease;
  font-family: inherit;
}

.message-input::placeholder {
  color: #666;
}

.message-input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  background: #333;
}

.message-input:disabled {
  background: #1a1a1a;
  color: #555;
  cursor: not-allowed;
}

.send-button {
  padding: 12px;
  background: #4f46e5;
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  height: 44px;
}

.send-button:hover:not(:disabled) {
  background: #4338ca;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

.send-button:disabled {
  background: #333;
  color: #666;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
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

/* Custom scrollbar for white background */
.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: #f8f9fa;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #dee2e6;
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: #adb5bd;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .header-main {
    padding: 12px 16px;
  }
  
  .workspace-selector {
    padding: 10px 16px;
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
  
  .workspace-label {
    font-size: 12px;
  }
  
  .workspace-dropdown {
    font-size: 14px; /* Prevent zoom on iOS */
  }
  
  .chat-messages {
    padding: 16px;
  }
  
  .chat-input {
    padding: 12px 16px;
  }
  
  .input-form {
    gap: 8px;
  }
  
  .message-input {
    padding: 10px 12px;
    font-size: 16px; /* Prevent zoom on iOS */
  }
  
  .send-button {
    min-width: 40px;
    height: 40px;
    padding: 10px;
  }
}
</style>