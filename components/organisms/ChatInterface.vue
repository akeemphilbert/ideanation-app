<template>
  <div class="chat-interface">
    <div class="chat-header">
      <h3 class="handwritten">AI Assistant</h3>
      <div class="chat-status">
        <span class="status-dot" :class="{ 'status-dot--online': isOnline }"></span>
        {{ isOnline ? 'Online' : 'Offline' }}
      </div>
    </div>
    
    <div class="chat-messages" ref="messagesContainer">
      <div v-if="messages.length === 0" class="chat-welcome">
        <div class="welcome-message">
          <p class="handwritten">👋 Hi! Let's start building your startup idea.</p>
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
        <span class="typing-text handwritten">AI is thinking...</span>
      </div>
    </div>
    
    <div class="chat-input">
      <form @submit.prevent="handleChatMessage" class="input-form">
        <input
          v-model="chatMessage"
          type="text"
          :placeholder="getInputPlaceholder()"
          class="message-input handwritten"
          :disabled="isTyping"
          @focus="showQuickSuggestions = true"
          @blur="hideQuickSuggestions"
        />
        <button
          type="submit"
          class="btn-sketch send-button"
          :disabled="!chatMessage.trim() || isTyping"
        >
          Send
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
.chat-interface {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: white;
  border: 2px solid var(--color-primary);
  border-radius: 8px;
  overflow: hidden;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 2px solid var(--color-primary);
  background: #f9f9f9;
}

.chat-header h3 {
  margin: 0;
  font-size: 1.2rem;
  color: var(--color-primary);
}

.chat-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: var(--color-secondary);
  font-family: var(--font-handwritten);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ccc;
}

.status-dot--online {
  background: #4caf50;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  min-height: 0;
}

.chat-welcome {
  text-align: center;
  padding: 20px;
  color: var(--color-secondary);
}

.welcome-message {
  background: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  transform: rotate(-0.3deg);
}

.welcome-message p {
  margin: 0 0 8px 0;
}

.welcome-message ul {
  text-align: left;
  margin: 8px 0;
  padding-left: 20px;
}

.welcome-message li {
  margin-bottom: 4px;
  font-size: 0.9rem;
}

.welcome-message strong {
  color: var(--color-primary);
  font-family: var(--font-handwritten);
}

.help-note {
  font-style: italic;
  color: var(--color-secondary);
  font-size: 0.9rem;
}

.typing-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  color: var(--color-secondary);
}

.typing-dots {
  display: flex;
  gap: 4px;
}

.typing-dots span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-secondary);
  animation: typing-bounce 1.4s infinite ease-in-out;
}

.typing-dots span:nth-child(1) { animation-delay: -0.32s; }
.typing-dots span:nth-child(2) { animation-delay: -0.16s; }
.typing-dots span:nth-child(3) { animation-delay: 0; }

.typing-text {
  font-size: 0.8rem;
}

.chat-input {
  border-top: 2px solid var(--color-primary);
  padding: 16px;
  background: #f9f9f9;
}

.input-form {
  display: flex;
  gap: 8px;
}

.message-input {
  flex: 1;
  padding: 10px 12px;
  border: 2px solid var(--color-primary);
  border-radius: 4px;
  font-family: var(--font-handwritten);
  font-size: 0.9rem;
  background: white;
  color: var(--color-primary);
}

.message-input:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 2px rgba(26, 26, 26, 0.1);
}

.message-input:disabled {
  background: #f5f5f5;
  color: #ccc;
}

.send-button {
  padding: 10px 16px;
  white-space: nowrap;
}

.send-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quick-suggestions {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 8px;
}

.suggestion-chip {
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 6px 8px;
  font-size: 0.8rem;
  font-family: var(--font-handwritten);
  color: var(--color-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  transform: rotate(0.1deg);
  text-align: left;
}

.suggestion-chip:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  transform: rotate(0deg);
  background: #f0f0f0;
}

.suggestion-chip:nth-child(even) {
  transform: rotate(-0.1deg);
}

.entity-help {
  margin-top: 8px;
  background: #e8f5e8;
  border: 1px solid #4caf50;
  border-radius: 4px;
  padding: 8px;
}

.help-content h4 {
  margin: 0 0 6px 0;
  font-size: 0.8rem;
  color: var(--color-primary);
  font-family: var(--font-handwritten);
}

.entity-examples {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.prefix-example {
  background: white;
  border: 1px solid #4caf50;
  border-radius: 3px;
  padding: 2px 6px;
  font-size: 0.7rem;
  font-family: monospace;
  color: var(--color-primary);
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
  background: #f1f1f1;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: #999;
}
</style>