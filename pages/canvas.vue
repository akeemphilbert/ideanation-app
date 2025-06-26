<template>
  <div class="canvas-page">
    <div class="canvas-layout">
      <!-- Chat Sidebar on Left -->
      <div class="chat-sidebar">
        <div class="chat-header">
          <h3 class="handwritten">AI Assistant</h3>
          <div class="chat-status">
            <span class="status-dot status-dot--online"></span>
            Online
          </div>
        </div>
        
        <div class="chat-messages" ref="messagesContainer">
          <div v-if="chatStore.messages.length === 0" class="chat-welcome">
            <div class="welcome-message">
              <p class="handwritten">👋 Hi! I'm here to help you structure your startup idea.</p>
              <p>Try creating entities by typing:</p>
              <ul>
                <li><strong>problem:</strong> your problem description</li>
                <li><strong>customer:</strong> your customer description</li>
                <li><strong>feature:</strong> your feature description</li>
                <li><strong>pain:</strong> customer pain point</li>
                <li><strong>gain:</strong> customer gain</li>
              </ul>
              <p class="help-note">Or ask me questions about your idea!</p>
            </div>
          </div>
          
          <ChatMessage
            v-for="message in chatStore.messages"
            :key="message.id"
            :message="message"
            @apply-suggestion="handleSuggestionApply"
          />
          
          <div v-if="chatStore.isTyping" class="typing-indicator">
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
              placeholder="Type 'problem: your problem' or ask me anything..."
              class="message-input handwritten"
              :disabled="chatStore.isTyping"
              @focus="showQuickSuggestions = true"
              @blur="hideQuickSuggestions"
            />
            <button
              type="submit"
              class="btn-sketch send-button"
              :disabled="!chatMessage.trim() || chatStore.isTyping"
            >
              Send
            </button>
          </form>
          
          <div class="quick-suggestions" v-if="showQuickSuggestions && !chatMessage.trim()">
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
      
      <!-- Main Graph Section on Right -->
      <div class="graph-section">
        <div class="graph-header">
          <h2 class="handwritten">Your Idea Canvas</h2>
          <div class="graph-controls">
            <div class="entity-stats">
              <span class="stat-item">
                {{ entitiesStore.problems.length }} Problems
              </span>
              <span class="stat-item">
                {{ entitiesStore.customers.length }} Customers
              </span>
              <span class="stat-item">
                {{ entitiesStore.features.length }} Features
              </span>
            </div>
            <button class="btn-sketch" @click="addNewComponent">
              Add Component
            </button>
            <button class="btn-sketch" @click="saveIdea">
              Save Idea
            </button>
          </div>
        </div>
        
        <div class="graph-container" ref="graphContainer">
          <GraphVisualization
            :nodes="graphNodes"
            :edges="graphEdges"
            @node-click="handleNodeClick"
            @node-hover="handleNodeHover"
          />
        </div>
      </div>
    </div>
    
    <!-- Component Modal -->
    <ComponentModal
      v-if="showComponentModal"
      :component="selectedComponent"
      @save="handleComponentSave"
      @close="showComponentModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { useEntityParser } from '~/composables/useEntityParser'

const ideaStore = useIdeaStore()
const chatStore = useChatStore()
const entitiesStore = useEntitiesStore()
const graphContainer = ref<HTMLElement>()
const messagesContainer = ref<HTMLElement>()

const showComponentModal = ref(false)
const selectedComponent = ref(null)
const chatMessage = ref('')
const showQuickSuggestions = ref(false)
const showEntityHelp = ref(false)

const { getAvailablePrefixes, looksLikeEntityCommand } = useEntityParser()
const entityPrefixes = getAvailablePrefixes()

const quickSuggestions = [
  "problem: not having a place for pets to stay when I'm on vacation",
  "customer: busy pet owners who travel frequently",
  "feature: real-time pet monitoring",
  "What problems does this solve?",
  "How do these components connect?"
]

// Convert entities to graph format
const graphNodes = computed(() => {
  const nodes: any[] = []
  
  // Add problems
  entitiesStore.problems.forEach(problem => {
    nodes.push({
      id: problem.id,
      title: problem.title,
      type: 'problem',
      description: problem.description
    })
  })
  
  // Add customers
  entitiesStore.customers.forEach(customer => {
    nodes.push({
      id: customer.id,
      title: customer.title || customer.fullName,
      type: 'customer',
      description: customer.description
    })
  })
  
  // Add features
  entitiesStore.features.forEach(feature => {
    nodes.push({
      id: feature.id,
      title: feature.title,
      type: 'feature',
      description: feature.description
    })
  })
  
  // Add other entities...
  entitiesStore.products.forEach(product => {
    nodes.push({
      id: product.id,
      title: product.title,
      type: 'solution',
      description: product.description
    })
  })
  
  entitiesStore.jobs.forEach(job => {
    nodes.push({
      id: job.id,
      title: job.title,
      type: 'job',
      description: job.description
    })
  })
  
  entitiesStore.pains.forEach(pain => {
    nodes.push({
      id: pain.id,
      title: pain.title,
      type: 'pain',
      description: pain.description
    })
  })
  
  entitiesStore.gains.forEach(gain => {
    nodes.push({
      id: gain.id,
      title: gain.title,
      type: 'gain',
      description: gain.description
    })
  })
  
  return nodes
})

const graphEdges = computed(() => {
  return entitiesStore.relationships.map(rel => ({
    source: rel.sourceId,
    target: rel.targetId,
    relationship: rel.relationshipType
  }))
})

onMounted(() => {
  // Initialize with sample data if empty
  if (entitiesStore.problems.length === 0 && entitiesStore.customers.length === 0) {
    initializeSampleData()
  }
})

const initializeSampleData = () => {
  // Create sample entities
  const problem = entitiesStore.createProblem({
    title: 'Pet owners need reliable pet care when traveling',
    description: 'Many pet owners struggle to find trustworthy, convenient pet care options when they travel'
  })
  
  const customer = entitiesStore.createCustomer({
    title: 'Frequent Business Travelers with Pets',
    description: 'Professionals who travel regularly for work and own pets',
    givenName: 'Sarah',
    familyName: 'Johnson',
    role: 'Sales Manager',
    organization: 'Tech Corp'
  })
  
  const feature = entitiesStore.createFeature({
    title: 'Pet Sitter Matching',
    description: 'Algorithm to match pet owners with qualified pet sitters in their area'
  })
  
  // Create sample idea and set as current
  const idea = entitiesStore.createIdea({
    title: 'PetCare Connect',
    description: 'Platform connecting pet owners with trusted pet sitters'
  })
  
  entitiesStore.setCurrentIdea(idea)
  
  // Create relationships
  entitiesStore.createRelationship({
    sourceId: problem.id,
    targetId: idea.id,
    relationshipType: 'belongs'
  })
  
  entitiesStore.createRelationship({
    sourceId: customer.id,
    targetId: idea.id,
    relationshipType: 'belongs'
  })
}

const addNewComponent = () => {
  selectedComponent.value = null
  showComponentModal.value = true
}

const handleNodeClick = (node: any) => {
  selectedComponent.value = node
  showComponentModal.value = true
}

const handleNodeHover = (node: any) => {
  console.log('Hovering node:', node)
}

const handleComponentSave = (component: any) => {
  if (component.id) {
    ideaStore.updateComponent(component)
  } else {
    ideaStore.addComponent(component)
  }
  showComponentModal.value = false
}

const handleChatMessage = async () => {
  if (!chatMessage.value.trim() || chatStore.isTyping) return
  
  const message = chatMessage.value.trim()
  chatMessage.value = ''
  showQuickSuggestions.value = false
  showEntityHelp.value = false
  
  await chatStore.sendMessage(message)
  
  // Scroll to bottom after message is sent
  nextTick(() => scrollToBottom())
}

const handleSuggestionApply = (suggestion: any) => {
  if (suggestion.type === 'component') {
    ideaStore.addComponent(suggestion.data)
  } else if (suggestion.type === 'relationship') {
    ideaStore.addRelationship(suggestion.data)
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

const saveIdea = async () => {
  // In a real app, this would save to backend
  console.log('Saving idea with entities:', {
    problems: entitiesStore.problems.length,
    customers: entitiesStore.customers.length,
    features: entitiesStore.features.length,
    relationships: entitiesStore.relationships.length
  })
}

// Watch for new messages and scroll to bottom
watch(() => chatStore.messages.length, () => {
  nextTick(() => scrollToBottom())
})

// Watch chat input for entity commands
watch(chatMessage, (newValue) => {
  showEntityHelp.value = looksLikeEntityCommand(newValue)
})

// SEO
useHead({
  title: 'Canvas - Ideanation',
  meta: [
    { name: 'description', content: 'Interactive canvas for structuring and visualizing your startup idea components.' }
  ]
})
</script>

<style scoped>
.canvas-page {
  min-height: 100vh;
  background: var(--color-background);
  padding: 20px;
}

.canvas-layout {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 20px;
  height: calc(100vh - 40px);
}

/* Chat Sidebar Styles */
.chat-sidebar {
  display: flex;
  flex-direction: column;
  background: white;
  border: 2px solid var(--color-primary);
  border-radius: 8px;
  overflow: hidden;
  transform: rotate(-0.3deg);
  box-shadow: 4px 4px 0px rgba(0,0,0,0.1);
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

/* Graph Section Styles */
.graph-section {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.graph-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 10px;
}

.graph-header h2 {
  margin: 0;
  font-size: 1.8rem;
  color: var(--color-primary);
}

.graph-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.entity-stats {
  display: flex;
  gap: 10px;
}

.stat-item {
  font-size: 0.8rem;
  color: var(--color-secondary);
  font-family: var(--font-handwritten);
  background: #f0f0f0;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.graph-container {
  flex: 1;
  min-height: 0;
  background: white;
  position: relative;
  overflow: hidden;
  border: 2px solid var(--color-primary);
  border-radius: 8px;
  transform: rotate(0.2deg);
  box-shadow: 4px 4px 0px rgba(0,0,0,0.1);
}

/* Animations */
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

/* Responsive Design */
@media (max-width: 1024px) {
  .canvas-layout {
    grid-template-columns: 300px 1fr;
  }
}

@media (max-width: 768px) {
  .canvas-layout {
    grid-template-columns: 1fr;
    grid-template-rows: 300px 1fr;
  }
  
  .chat-sidebar {
    transform: rotate(0deg);
  }
  
  .graph-container {
    transform: rotate(0deg);
  }
  
  .entity-stats {
    flex-direction: column;
    gap: 4px;
  }
}
</style>