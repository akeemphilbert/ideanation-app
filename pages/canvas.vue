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
              <p class="handwritten">👋 Hi! Let's start building your startup idea.</p>
              <p v-if="!entitiesStore.currentIdea"><strong>First, what's your idea called?</strong></p>
              <p v-else>Great! Now you can create entities by typing:</p>
              <ul v-if="entitiesStore.currentIdea">
                <li><strong>problem:</strong> your problem description</li>
                <li><strong>customer:</strong> your customer description</li>
                <li><strong>feature:</strong> your feature description</li>
                <li><strong>pain:</strong> customer pain point</li>
                <li><strong>gain:</strong> customer gain</li>
              </ul>
              <p v-if="entitiesStore.currentIdea" class="help-note">Or ask me questions about your idea!</p>
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
              :placeholder="getInputPlaceholder()"
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
          
          <div class="quick-suggestions" v-if="showQuickSuggestions && !chatMessage.trim() && entitiesStore.currentIdea">
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
          <h2 class="handwritten">
            {{ entitiesStore.currentIdea?.title || 'Your Idea Canvas' }}
          </h2>
          <div class="graph-controls" v-if="entitiesStore.currentIdea">
            <div class="selection-info" v-if="selectedNodeId">
              <span class="selected-node">
                Selected: {{ getSelectedNodeTitle() }}
              </span>
              <button class="btn-sketch btn-small" @click="clearSelection">
                Clear
              </button>
            </div>
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
              <span class="stat-item">
                {{ entitiesStore.products.length }} Products
              </span>
              <span class="stat-item">
                {{ entitiesStore.relationships.length }} Links
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
          <div v-if="!entitiesStore.currentIdea" class="empty-graph">
            <div class="empty-message">
              <h3 class="handwritten">Welcome to Ideanation!</h3>
              <p>Let's start by giving your startup idea a name.</p>
              <p>Just type it in the chat and I'll create your idea canvas!</p>
              <div class="example-commands">
                <div class="example-idea">💡 "PetCare Connect"</div>
                <div class="example-idea">💡 "EcoCommute App"</div>
                <div class="example-idea">💡 "Smart Garden Assistant"</div>
              </div>
            </div>
          </div>
          
          <div v-else-if="graphNodes.length === 0" class="empty-graph">
            <div class="empty-message">
              <h3 class="handwritten">Great! Now let's build "{{ entitiesStore.currentIdea.title }}"</h3>
              <p>Create your first entity by typing something like:</p>
              <div class="example-commands">
                <code>problem: users can't find reliable pet sitters</code>
                <code>customer: busy pet owners in urban areas</code>
                <code>feature: real-time pet monitoring</code>
              </div>
              <p>Your entities will appear here as an interactive graph!</p>
            </div>
          </div>
          
          <GraphVisualization
            v-else
            :nodes="graphNodes"
            :edges="graphEdges"
            :selectedNodeId="selectedNodeId"
            @node-click="handleNodeClick"
            @node-hover="handleNodeHover"
            @node-select="handleNodeSelect"
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
import GraphVisualization from '~/components/organisms/GraphVisualization.vue'

const chatStore = useChatStore()
const entitiesStore = useEntitiesStore()
const graphContainer = ref<HTMLElement>()
const messagesContainer = ref<HTMLElement>()

const showComponentModal = ref(false)
const selectedComponent = ref(null)
const selectedNodeId = ref<string | null>(null)
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
  
  // Add current idea as central node
  if (entitiesStore.currentIdea) {
    nodes.push({
      id: entitiesStore.currentIdea.id,
      title: entitiesStore.currentIdea.title,
      type: 'idea',
      description: entitiesStore.currentIdea.description
    })
  }
  
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
      description: customer.title || `${customer.role} at ${customer.organization}`.trim()
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
  
  // Add products
  entitiesStore.products.forEach(product => {
    nodes.push({
      id: product.id,
      title: product.title,
      type: 'solution',
      description: product.description
    })
  })
  
  // Add jobs
  entitiesStore.jobs.forEach(job => {
    nodes.push({
      id: job.id,
      title: job.title,
      type: 'job',
      description: job.description
    })
  })
  
  // Add pains
  entitiesStore.pains.forEach(pain => {
    nodes.push({
      id: pain.id,
      title: pain.title,
      type: 'pain',
      description: pain.description
    })
  })
  
  // Add gains
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
  // Don't initialize sample data - start completely empty
  // User must first provide idea name
})

const getInputPlaceholder = () => {
  if (!entitiesStore.currentIdea) {
    return "What's your startup idea called?"
  }
  
  if (selectedNodeId.value) {
    const selectedNode = graphNodes.value.find(n => n.id === selectedNodeId.value)
    if (selectedNode) {
      return `Add entity linked to "${selectedNode.title}" (e.g., problem: your problem)`
    }
  }
  
  return "Type 'problem: your problem' or ask me anything..."
}

const getSelectedNodeTitle = () => {
  if (!selectedNodeId.value) return ''
  const node = graphNodes.value.find(n => n.id === selectedNodeId.value)
  return node ? node.title : ''
}

const clearSelection = () => {
  selectedNodeId.value = null
}

const getTargetNodeForNewEntity = (): string | null => {
  // 1. If a node is selected, use that
  if (selectedNodeId.value) {
    return selectedNodeId.value
  }
  
  // 2. If only one node exists, use that
  if (graphNodes.value.length === 1) {
    return graphNodes.value[0].id
  }
  
  // 3. Default to the first idea node
  const ideaNode = graphNodes.value.find(n => n.type === 'idea')
  return ideaNode ? ideaNode.id : null
}

const createRelationshipForNewEntity = (newEntityId: string, newEntityType: string) => {
  const targetNodeId = getTargetNodeForNewEntity()
  if (!targetNodeId) return
  
  const targetNode = graphNodes.value.find(n => n.id === targetNodeId)
  if (!targetNode) return
  
  // Determine relationship type based on entity types
  let relationshipType = 'belongs'
  let sourceId = newEntityId
  let targetId = targetNodeId
  
  // Define specific relationship patterns
  if (newEntityType === 'problem' && targetNode.type === 'idea') {
    relationshipType = 'belongs'
    sourceId = newEntityId
    targetId = targetNodeId
  } else if (newEntityType === 'customer' && targetNode.type === 'idea') {
    relationshipType = 'belongs'
    sourceId = newEntityId
    targetId = targetNodeId
  } else if (newEntityType === 'product' && targetNode.type === 'idea') {
    relationshipType = 'mvp'
    sourceId = targetNodeId
    targetId = newEntityId
  } else if (newEntityType === 'feature' && targetNode.type === 'solution') {
    relationshipType = 'belongs'
    sourceId = newEntityId
    targetId = targetNodeId
  } else if (newEntityType === 'job' && targetNode.type === 'customer') {
    relationshipType = 'performs'
    sourceId = targetNodeId
    targetId = newEntityId
  } else if (newEntityType === 'pain' && targetNode.type === 'customer') {
    relationshipType = 'experiences'
    sourceId = targetNodeId
    targetId = newEntityId
  } else if (newEntityType === 'gain' && targetNode.type === 'customer') {
    relationshipType = 'desires'
    sourceId = targetNodeId
    targetId = newEntityId
  } else if (newEntityType === 'feature' && targetNode.type === 'pain') {
    relationshipType = 'relieves'
    sourceId = newEntityId
    targetId = targetNodeId
  } else if (newEntityType === 'feature' && targetNode.type === 'gain') {
    relationshipType = 'creates'
    sourceId = newEntityId
    targetId = targetNodeId
  } else {
    // Default relationship - just connect them
    relationshipType = 'related'
    sourceId = newEntityId
    targetId = targetNodeId
  }
  
  // Create the relationship
  entitiesStore.createRelationship({
    sourceId,
    targetId,
    relationshipType
  })
}

const addNewComponent = () => {
  selectedComponent.value = null
  showComponentModal.value = true
}

const handleNodeClick = (node: any) => {
  // Find the actual entity from the store
  let entity = null
  
  switch (node.type) {
    case 'idea':
      entity = entitiesStore.ideas.find(i => i.id === node.id)
      break
    case 'problem':
      entity = entitiesStore.problems.find(p => p.id === node.id)
      break
    case 'customer':
      entity = entitiesStore.customers.find(c => c.id === node.id)
      break
    case 'feature':
      entity = entitiesStore.features.find(f => f.id === node.id)
      break
    case 'solution':
      entity = entitiesStore.products.find(p => p.id === node.id)
      break
    case 'job':
      entity = entitiesStore.jobs.find(j => j.id === node.id)
      break
    case 'pain':
      entity = entitiesStore.pains.find(p => p.id === node.id)
      break
    case 'gain':
      entity = entitiesStore.gains.find(g => g.id === node.id)
      break
  }
  
  if (entity) {
    selectedComponent.value = {
      id: entity.id,
      type: node.type,
      title: entity.title,
      description: entity.description,
      tags: []
    }
    showComponentModal.value = true
  }
}

const handleNodeSelect = (nodeId: string | null) => {
  selectedNodeId.value = nodeId
}

const handleNodeHover = (node: any) => {
  console.log('Hovering node:', node)
}

const handleComponentSave = (component: any) => {
  let newEntity = null
  
  // Update or create the entity in the appropriate store
  switch (component.type) {
    case 'idea':
      if (component.id) {
        entitiesStore.updateIdea(component.id, component)
      } else {
        newEntity = entitiesStore.createIdea(component)
        entitiesStore.setCurrentIdea(newEntity)
      }
      break
    case 'problem':
      if (component.id) {
        entitiesStore.updateProblem(component.id, component)
      } else {
        newEntity = entitiesStore.createProblem(component)
      }
      break
    case 'customer':
      if (component.id) {
        entitiesStore.updateCustomer(component.id, component)
      } else {
        newEntity = entitiesStore.createCustomer(component)
      }
      break
    case 'feature':
      if (component.id) {
        entitiesStore.updateFeature(component.id, component)
      } else {
        newEntity = entitiesStore.createFeature(component)
      }
      break
    case 'solution':
      if (component.id) {
        entitiesStore.updateProduct(component.id, component)
      } else {
        newEntity = entitiesStore.createProduct(component)
      }
      break
    case 'job':
      if (component.id) {
        entitiesStore.updateJob(component.id, component)
      } else {
        newEntity = entitiesStore.createJob(component)
      }
      break
    case 'pain':
      if (component.id) {
        entitiesStore.updatePain(component.id, component)
      } else {
        newEntity = entitiesStore.createPain(component)
      }
      break
    case 'gain':
      if (component.id) {
        entitiesStore.updateGain(component.id, component)
      } else {
        newEntity = entitiesStore.createGain(component)
      }
      break
  }
  
  // If this is a new entity, create relationship to selected/target node
  if (newEntity) {
    createRelationshipForNewEntity(newEntity.id, component.type)
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
      createRelationshipForNewEntity(newEntity.id, suggestion.data.type)
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

const saveIdea = async () => {
  // In a real app, this would save to backend
  console.log('Saving idea with entities:', {
    idea: entitiesStore.currentIdea?.title,
    problems: entitiesStore.problems.length,
    customers: entitiesStore.customers.length,
    features: entitiesStore.features.length,
    products: entitiesStore.products.length,
    relationships: entitiesStore.relationships.length
  })
  
  // Show success message
  chatStore.addMessage({
    type: 'ai',
    content: `Your idea "${entitiesStore.currentIdea?.title}" has been saved! You have ${entitiesStore.problems.length + entitiesStore.customers.length + entitiesStore.features.length + entitiesStore.products.length} entities and ${entitiesStore.relationships.length} relationships.`
  })
}

// Watch for new messages and scroll to bottom
watch(() => chatStore.messages.length, () => {
  nextTick(() => scrollToBottom())
})

// Watch chat input for entity commands
watch(chatMessage, (newValue) => {
  if (entitiesStore.currentIdea) {
    showEntityHelp.value = looksLikeEntityCommand(newValue)
  }
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
  flex-wrap: wrap;
}

.selection-info {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #e8f5e8;
  border: 1px solid #4caf50;
  border-radius: 4px;
  padding: 4px 8px;
}

.selected-node {
  font-size: 0.8rem;
  color: var(--color-primary);
  font-family: var(--font-handwritten);
  font-weight: 600;
}

.entity-stats {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
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

.empty-graph {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 40px;
}

.empty-message {
  text-align: center;
  color: var(--color-secondary);
  max-width: 400px;
}

.empty-message h3 {
  margin: 0 0 16px 0;
  color: var(--color-primary);
  font-size: 1.5rem;
}

.empty-message p {
  margin: 0 0 16px 0;
  line-height: 1.5;
}

.example-commands {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 16px 0;
}

.example-commands code {
  background: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px 12px;
  font-family: var(--font-handwritten);
  font-size: 0.9rem;
  color: var(--color-primary);
  display: block;
  text-align: left;
}

.example-idea {
  background: #e8f5e8;
  border: 1px solid #4caf50;
  border-radius: 4px;
  padding: 8px 12px;
  font-family: var(--font-handwritten);
  font-size: 1rem;
  color: var(--color-primary);
  display: block;
  text-align: center;
  transform: rotate(0.2deg);
}

.example-idea:nth-child(even) {
  transform: rotate(-0.2deg);
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
  
  .graph-controls {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>