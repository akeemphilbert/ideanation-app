<template>
  <div class="chat-interface">
    <div class="chat-header">
      <h3>AI Assistant</h3>
      <div class="chat-status">
        <span class="status-dot" :class="{ 'status-dot--online': isOnline }"></span>
        {{ isOnline ? 'Online' : 'Offline' }}
      </div>
    </div>
    
    <div class="chat-messages" ref="messagesContainer">
      <div v-if="messages.length === 0" class="chat-welcome">
        <div class="welcome-message">
          <p>👋 Hi! Let's start building your startup idea.</p>
          <p v-if="!hasWorkspace"><strong>First, what's your idea called?</strong></p>
          <p v-else>Great! Now you can create entities by typing:</p>
          <ul v-if="hasWorkspace">
            <li><strong>problem:</strong> your problem description</li>
            <li><strong>customer:</strong> your customer description</li>
            <li><strong>feature:</strong> your feature description</li>
            <li><strong>pain:</strong> customer pain point</li>
            <li><strong>gain:</strong> customer gain</li>
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
          @focus="showQuickSuggestions = true"
          @blur="hideQuickSuggestions"
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
      
      <div class="quick-suggestions" v-if="showQuickSuggestions && !chatMessage.trim() && hasWorkspace">
        <button
          v-for="suggestion in quickSuggestions"
          :key="suggestion"
          class="suggestion-chip"
          @click="selectSuggestion(suggestion)"
        >
          {{ suggestion }}
        </button>
      </div>
      
      <div class="entity-help" v-if="showEntityHelp">
        <div class="help-content">
          <h4>Quick Entity Creation:</h4>
          <div class="entity-examples">
            <span v-for="prefix in entityPrefixes" :key="prefix" class="prefix-example">
              {{ prefix }}:
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEntityParser } from '~/composables/useEntityParser'
import ChatMessage from '~/components/molecules/ChatMessage.vue'

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
const showQuickSuggestions = ref(false)
const showEntityHelp = ref(false)
const isOnline = ref(true)

const { getAvailablePrefixes, looksLikeEntityCommand } = useEntityParser()
const entityPrefixes = getAvailablePrefixes()

const quickSuggestions = [
  "problem: not having a place for pets to stay when I'm on vacation",
  "customer: busy pet owners who travel frequently",
  "feature: real-time pet monitoring",
  "What problems does this solve?",
  "How do these components connect?"
]

// Computed properties
const messages = computed(() => chatStore.messages)
const isTyping = computed(() => chatStore.isTyping)

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
  showQuickSuggestions.value = false
  showEntityHelp.value = false

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

const selectSuggestion = (suggestion: string) => {
  chatMessage.value = suggestion
  showQuickSuggestions.value = false
}

const hideQuickSuggestions = () => {
  setTimeout(() => {
    showQuickSuggestions.value = false
  }, 200)
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

// Watch chat input for entity commands
watch(chatMessage, (newValue) => {
  if (props.hasWorkspace) {
    showEntityHelp.value = looksLikeEntityCommand(newValue)
  }
})

onMounted(() => {
  scrollToBottom()
})
</script>

<style scoped>
/* Professional black theme for chat interface */
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #000;
  border-bottom: 1px solid #333;
}

.chat-header h3 {
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

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  min-height: 0;
  background: #1a1a1a;
}

.chat-welcome {
  text-align: center;
  padding: 20px 0;
}

.welcome-message {
  background: #2a2a2a;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 20px;
  color: #e5e5e5;
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
  color: #ccc;
}

.welcome-message li {
  margin-bottom: 6px;
  font-size: 13px;
}

.welcome-message strong {
  color: #fff;
  font-weight: 600;
}

.help-note {
  font-style: italic;
  color: #888;
  font-size: 13px;
  margin-top: 8px;
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  color: #888;
}

.typing-dots {
  display: flex;
  gap: 4px;
}

.typing-dots span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #666;
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

.quick-suggestions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
}

.suggestion-chip {
  background: #2a2a2a;
  border: 1px solid #333;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 13px;
  color: #ccc;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  font-family: inherit;
}

.suggestion-chip:hover {
  border-color: #4f46e5;
  background: #333;
  color: #fff;
  transform: translateY(-1px);
}

.entity-help {
  margin-top: 12px;
  background: #2a2a2a;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 12px;
}

.help-content h4 {
  margin: 0 0 8px 0;
  font-size: 13px;
  color: #fff;
  font-weight: 600;
}

.entity-examples {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.prefix-example {
  background: #333;
  border: 1px solid #444;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 11px;
  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
  color: #4f46e5;
  font-weight: 500;
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

/* Custom scrollbar for dark theme */
.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: #1a1a1a;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #444;
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .chat-header {
    padding: 12px 16px;
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