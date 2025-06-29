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
              <p v-if="!resourcesStore.currentWorkspace"><strong>First, what's your idea called?</strong></p>
              <p v-else>Great! Now you can create entities by typing:</p>
              <ul v-if="resourcesStore.currentWorkspace">
                <li><strong>problem:</strong> your problem description</li>
                <li><strong>customer:</strong> your customer description</li>
                <li><strong>feature:</strong> your feature description</li>
                <li><strong>pain:</strong> customer pain point</li>
                <li><strong>gain:</strong> customer gain</li>
              </ul>
              <p v-if="resourcesStore.currentWorkspace" class="help-note">Or ask me questions about your idea!</p>
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
          
          <div class="quick-suggestions" v-if="showQuickSuggestions && !chatMessage.trim() && resourcesStore.currentWorkspace">
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
            {{ resourcesStore.currentWorkspace?.title || 'Your Idea Canvas' }}
          </h2>
          <div class="graph-controls" v-if="resourcesStore.currentWorkspace">
            <!-- Selection Info -->
            <div class="selection-info" v-if="selectedNodeIds.length > 0">
              <div class="selected-nodes">
                <span class="selection-label">Selected:</span>
                <div class="selected-list">
                  <span 
                    v-for="nodeId in selectedNodeIds" 
                    :key="nodeId"
                    class="selected-node"
                  >
                    {{ getNodeTitle(nodeId) }}
                  </span>
                </div>
              </div>
              <div class="selection-actions">
                <button 
                  v-if="selectedNodeIds.length === 2" 
                  class="btn-sketch btn-link"
                  @click="showLinkModal = true"
                >
                  🔗 Link Nodes
                </button>
                <button class="btn-sketch btn-small" @click="clearSelection">
                  Clear
                </button>
              </div>
            </div>
            
            <!-- Entity Stats -->
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
            
            <!-- Action Buttons -->
            <div class="action-buttons">
              <button class="btn-sketch" @click="addNewComponent">
                Add Component
              </button>
              <button class="btn-sketch" @click="saveIdea">
                Export Canvas
              </button>
              <button class="btn-sketch" @click="exportAllEntities">
                Export All Entities
              </button>
              <button class="btn-sketch" @click="saveToLocalStorage">
                Save to Storage
              </button>
              <button class="btn-sketch" @click="loadFromLocalStorage">
                Load from Storage
              </button>
            </div>
          </div>
        </div>
        
        <div class="graph-container" ref="graphContainer">
          <div v-if="!resourcesStore.currentWorkspace" class="empty-graph">
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
              <h3 class="handwritten">Great! Now let's build "{{ resourcesStore.currentWorkspace.title }}"</h3>
              <p>Create your first entity by typing something like:</p>
              <div class="example-commands">
                <code>problem: users can't find reliable pet sitters</code>
                <code>customer: busy pet owners in urban areas</code>
                <code>feature: real-time pet monitoring</code>
              </div>
              <p>Your entities will appear here as an interactive graph!</p>
            </div>
          </div>
          
          <client-only>
            <GraphVisualization
              v-if="resourcesStore.currentWorkspace && graphNodes.length > 0"
              :nodes="graphNodes"
              :edges="graphEdges"
              :selectedNodeIds="selectedNodeIds"
              @node-click="handleNodeClick"
              @node-hover="handleNodeHover"
              @node-select="handleNodeSelect"
            />
          </client-only>
        </div>
      </div>
    </div>
  
    
    <!-- Link Creation Modal -->
    <LinkModal
      v-if="showLinkModal"
      :sourceNode="getNodeById(selectedNodeIds[0])"
      :targetNode="getNodeById(selectedNodeIds[1])"
      @save="handleLinkSave"
      @close="showLinkModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { useEntityParser } from '~/composables/useEntityParser'
import GraphVisualization from '~/components/organisms/GraphVisualization.vue'
import LinkModal from '~/components/molecules/LinkModal.vue'
import { ExportDataBuilder } from '~/services/export/ExportDataBuilder'
import { MarkdownFormatter, JSONFormatter } from '~/services/export/ExportFormatter'
import { ExportType } from '~/types/export'
import ChatMessage from '~/components/molecules/ChatMessage.vue'

// Protect this route with authentication
definePageMeta({
  middleware: 'auth'
})

const chatStore = useChatStore()
const entitiesStore = useEntitiesStore()
const resourcesStore = useResourcesStore()
const graphContainer = ref<HTMLElement>()
const messagesContainer = ref<HTMLElement>()

const showComponentModal = ref(false)
const showLinkModal = ref(false)
const selectedComponent = ref<any>(null)
const selectedNodeIds = ref<string[]>([])
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

// Convert entities to graph format - EXCLUDE workspace from nodes
const graphNodes = computed(() => {
  const nodes: any[] = []
  
  // DO NOT add workspace as a node - it's just the container
  
  // Add problems
  resourcesStore.ideas.forEach(idea => {
    nodes.push({
      id: idea.id,
      title: idea.title,
      type: idea['@type'],
      description: idea.description
    })
  })

  // Add problems
  resourcesStore.problems.forEach(problem => {
    nodes.push({
      id: problem.id,
      title: problem.title,
      type: problem['@type'],
      description: problem.description
    })
  })
  
  // Add customers
  resourcesStore.customers.forEach(customer => {
    nodes.push({
      id: customer.id,
      title: customer.title || customer.fullName,
      type: 'customer',
      description: customer.title || `${customer.role} at ${customer.organization}`.trim()
    })
  })
  
  // Add features
  resourcesStore.features.forEach(feature => {
    nodes.push({
      id: feature.id,
      title: feature.title,
      type: 'feature',
      description: feature.description
    })
  })
  
  // Add products
  resourcesStore.products.forEach(product => {
    nodes.push({
      id: product.id,
      title: product.title,
      type: 'solution',
      description: product.description
    })
  })
  
  // Add jobs
  resourcesStore.jobs.forEach(job => {
    nodes.push({
      id: job.id,
      title: job.title,
      type: 'job',
      description: job.description
    })
  })
  
  // Add pains
  resourcesStore.pains.forEach(pain => {
    nodes.push({
      id: pain.id,
      title: pain.title,
      type: pain['@type'],
      description: pain.description
    })
  })
  
  // Add gains
  resourcesStore.gains.forEach(gain => {
    nodes.push({
      id: gain.id,
      title: gain.title,
      type: gain['@type'],
      description: gain.description
    })
  })
  
  return nodes
})

const graphEdges = computed(() => {
  // Filter out relationships that involve the workspace
  return resourcesStore.relationships
    .filter(rel => {
      // Exclude relationships where source or target is the workspace
      const sourceIsWorkspace = resourcesStore.currentWorkspace && rel.sourceId === resourcesStore.currentWorkspace['@id']
      const targetIsWorkspace = resourcesStore.currentWorkspace && rel.targetId === resourcesStore.currentWorkspace['@id']
      return !sourceIsWorkspace && !targetIsWorkspace
    })
    .map(rel => ({
      source: rel.sourceId,
      target: rel.targetId,
      relationship: rel.relationshipType
    }))
})

onMounted(() => {
  // Check if we have a workspace from route params
  const route = useRoute()
  if (route.params.workspaceId) {
    const workspace = resourcesStore.workspaces.find(w => w.id === route.params.workspaceId)
    if (workspace) {
      resourcesStore.setCurrentWorkspace(workspace)
    }
  }
})

const getInputPlaceholder = () => {
  if (!resourcesStore.currentWorkspace) {
    return "What's your startup idea called?"
  }
  
  if (selectedNodeIds.value.length === 1) {
    const selectedNode = graphNodes.value.find(n => n.id === selectedNodeIds.value[0])
    if (selectedNode) {
      return `Add entity linked to "${selectedNode.title}" (e.g., problem: your problem)`
    }
  } else if (selectedNodeIds.value.length === 2) {
    return "Click 'Link Nodes' to connect the selected entities"
  }
  
  return "Type 'problem: your problem' or ask me anything..."
}

const getNodeTitle = (nodeId: string) => {
  const node = graphNodes.value.find(n => n.id === nodeId)
  return node ? node.title : ''
}

const getNodeById = (nodeId: string) => {
  return graphNodes.value.find(n => n.id === nodeId) || null
}

const clearSelection = () => {
  selectedNodeIds.value = []
}

const getTargetNodeForNewEntity = (): string | null => {
  // 1. If exactly one node is selected, use that
  if (selectedNodeIds.value.length === 1) {
    return selectedNodeIds.value[0]
  }
  
  // 2. If only one node exists, use that
  if (graphNodes.value.length === 1) {
    return graphNodes.value[0].id
  }
  
  // 3. No default target - let entities exist independently
  return null
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
  if (newEntityType === 'problem' && targetNode.type === 'workspace') {
    relationshipType = 'belongs'
    sourceId = newEntityId
    targetId = targetNodeId
  } else if (newEntityType === 'customer' && targetNode.type === 'workspace') {
    relationshipType = 'belongs'
    sourceId = newEntityId
    targetId = targetNodeId
  } else if (newEntityType === 'product' && targetNode.type === 'workspace') {
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
    let description = ''
    
    // Handle different entity types and their description properties
    if (node.type === 'customer') {
      const customer = entity as any
      description = `${customer.role} at ${customer.organization}`
    } else if (node.type === 'problem') {
      const problem = entity as any
      description = problem.description || ''
    } else if (node.type === 'feature') {
      const feature = entity as any
      description = feature.description || ''
    } else if (node.type === 'solution') {
      const product = entity as any
      description = product.description || ''
    } else if (node.type === 'job') {
      const job = entity as any
      description = job.description || ''
    } else if (node.type === 'pain') {
      const pain = entity as any
      description = pain.description || ''
    } else if (node.type === 'gain') {
      const gain = entity as any
      description = gain.description || ''
    }
    
    selectedComponent.value = {
      id: entity.id,
      type: node.type,
      title: entity.title,
      description: description,
      tags: []
    }
    showComponentModal.value = true
  }
}

const handleNodeSelect = (nodeId: string | null, isMultiSelect: boolean = false) => {
  if (!nodeId) {
    selectedNodeIds.value = []
    return
  }
  
  if (isMultiSelect) {
    // Multi-select mode (Ctrl/Cmd + click)
    const index = selectedNodeIds.value.indexOf(nodeId)
    if (index > -1) {
      // Deselect if already selected
      selectedNodeIds.value.splice(index, 1)
    } else {
      // Add to selection (max 2 for linking)
      if (selectedNodeIds.value.length < 2) {
        selectedNodeIds.value.push(nodeId)
      } else {
        // Replace oldest selection
        selectedNodeIds.value.shift()
        selectedNodeIds.value.push(nodeId)
      }
    }
  } else {
    // Single select mode
    if (selectedNodeIds.value.includes(nodeId)) {
      selectedNodeIds.value = []
    } else {
      selectedNodeIds.value = [nodeId]
    }
  }
}

const handleNodeHover = (node: any) => {
  console.log('Hovering node:', node)
}

const handleComponentSave = (component: any) => {
  let newEntity = null
  
  // Update or create the entity in the appropriate store
  switch (component.type) {
    case 'workspace':
      if (component.id) {
        resourcesStore.updateWorkspace(component.id, component)
      } else {
        newEntity = resourcesStore.createWorkspace(component)
        resourcesStore.setCurrentWorkspace(newEntity)
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

const handleLinkSave = (linkData: { relationshipType: string, description?: string }) => {
  if (selectedNodeIds.value.length !== 2) return
  
  const [sourceId, targetId] = selectedNodeIds.value
  
  // Create the relationship
  entitiesStore.createRelationship({
    sourceId,
    targetId,
    relationshipType: linkData.relationshipType
  })
  
  // Add success message to chat
  const sourceNode = getNodeById(sourceId)
  const targetNode = getNodeById(targetId)
  
  chatStore.addMessage({
    type: 'ai',
    content: `Perfect! I've created a "${linkData.relationshipType}" relationship between "${sourceNode?.title}" and "${targetNode?.title}".`
  })
  
  // Clear selection and close modal
  selectedNodeIds.value = []
  showLinkModal.value = false
  
  nextTick(() => scrollToBottom())
}

const handleChatMessage = async () => {
  if (!chatMessage.value.trim() || chatStore.isTyping) return
  
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
      const { done,value } = await reader.read()
      if (done) break
      
      const rawChunk = decoder.decode(value, { stream: true })
      //split chunks by update: and loop through the chunks
      const chunks = rawChunk.split('update: ')
      for (const chunk of chunks) {
          const updateDetails = chunk.trim()
          if (updateDetails) {
            const agentUpdate = JSON.parse(updateDetails)
            if (agentUpdate.data?.lastMessage ) {
              aiMessageContent += agentUpdate.data.lastMessage
            }
            switch (agentUpdate.type) {
              case 'create_workspace':
                resourcesStore.createWorkspace(agentUpdate.data.workspace)
                resourcesStore.setCurrentWorkspace(agentUpdate.data.workspace)
                for (const idea of agentUpdate.data.ideas) {
                  resourcesStore.createIdea(idea)
                }
                for (const relationship of agentUpdate.data.relationships) {
                  resourcesStore.createRelationship(relationship)
                }
                break
              case 'create_problem':
                  for (const problem of agentUpdate.data.problems) {
                    resourcesStore.createProblem(problem)
                  }
                  for (const relationship of agentUpdate.data.relationships) {
                    resourcesStore.createRelationship(relationship)
                  }
                  break
              case 'create_idea':
                  for (const idea of agentUpdate.data.ideas) {
                    resourcesStore.createIdea(idea)
                  }
                  for (const relationship of agentUpdate.data.relationships) {
                    resourcesStore.createRelationship(relationship)
                  }
                  break
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
  try {
    // Build the business model canvas export data
    const exportBuilder = new ExportDataBuilder()
    const exportData = await exportBuilder.buildExportData(ExportType.BUSINESS_MODEL_CANVAS)
    
    // Format as markdown
    const markdownFormatter = new MarkdownFormatter()
    const formattedContent = await markdownFormatter.format(exportData)
    
    // Create and download the file
    const blob = new Blob([formattedContent.content as string], { 
      type: formattedContent.mimeType 
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = formattedContent.filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    // Show success message
    chatStore.addMessage({
      type: 'ai',
      content: `✅ Your business model canvas for "${resourcesStore.currentWorkspace?.title}" has been exported to markdown and downloaded! The file contains ${entitiesStore.problems.length} problems, ${entitiesStore.customers.length} customers, ${entitiesStore.features.length} features, and ${entitiesStore.relationships.length} relationships.`
    })
    
    nextTick(() => scrollToBottom())
    
  } catch (error) {
    console.error('Export failed:', error)
    
    // Show error message
    chatStore.addMessage({
      type: 'ai',
      content: `❌ Sorry, there was an error exporting your business model canvas. Please try again.`
    })
    
    nextTick(() => scrollToBottom())
  }
}

const exportAllEntities = async () => {
  try {
    // Build the all entities export data
    const exportBuilder = new ExportDataBuilder()
    const exportData = await exportBuilder.buildExportData(ExportType.ALL_ENTITIES)
    
    // Format as markdown
    const markdownFormatter = new MarkdownFormatter()
    const formattedContent = await markdownFormatter.format(exportData)
    
    // Create and download the file
    const blob = new Blob([formattedContent.content as string], { 
      type: formattedContent.mimeType 
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = formattedContent.filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    // Show success message
    chatStore.addMessage({
      type: 'ai',
      content: `✅ All entities for "${resourcesStore.currentWorkspace?.title}" have been exported to markdown and downloaded! The file contains all ${entitiesStore.ideas.length + entitiesStore.problems.length + entitiesStore.customers.length + entitiesStore.features.length + entitiesStore.products.length + entitiesStore.jobs.length + entitiesStore.pains.length + entitiesStore.gains.length} entities and ${entitiesStore.relationships.length} relationships.`
    })
    
    nextTick(() => scrollToBottom())
    
  } catch (error) {
    console.error('Export failed:', error)
    
    // Show error message
    chatStore.addMessage({
      type: 'ai',
      content: `❌ Sorry, there was an error exporting all entities. Please try again.`
    })
    
    nextTick(() => scrollToBottom())
  }
}

const saveToLocalStorage = async () => {
  try {
    // Build the all entities export data
    const exportBuilder = new ExportDataBuilder()
    const exportData = await exportBuilder.buildExportData(ExportType.ALL_ENTITIES)
    
    // Format as JSON
    const jsonFormatter = new JSONFormatter()
    const formattedContent = await jsonFormatter.format(exportData)
    
    // Save to local storage
    const storageKey = `ideanation_workspace_${resourcesStore.currentWorkspace?.id || 'default'}`
    const jsonData = formattedContent.content as string
    
    // Store the JSON data
    localStorage.setItem(storageKey, jsonData)
    
    // Also store a metadata entry for easy retrieval
    const metadata = {
      id: resourcesStore.currentWorkspace?.id,
      title: resourcesStore.currentWorkspace?.title,
      savedAt: new Date().toISOString(),
      entityCount: entitiesStore.ideas.length + entitiesStore.problems.length + entitiesStore.customers.length + entitiesStore.features.length + entitiesStore.products.length + entitiesStore.jobs.length + entitiesStore.pains.length + entitiesStore.gains.length,
      relationshipCount: entitiesStore.relationships.length
    }
    
    localStorage.setItem(`${storageKey}_metadata`, JSON.stringify(metadata))
    
    // Show success message
    chatStore.addMessage({
      type: 'ai',
      content: `💾 Your workspace "${resourcesStore.currentWorkspace?.title}" has been saved to local storage! The save includes ${metadata.entityCount} entities and ${metadata.relationshipCount} relationships. You can retrieve it later using the storage key: "${storageKey}"`
    })
    
    nextTick(() => scrollToBottom())
    
  } catch (error) {
    console.error('Save to local storage failed:', error)
    
    // Show error message
    chatStore.addMessage({
      type: 'ai',
      content: `❌ Sorry, there was an error saving to local storage. Please try again.`
    })
    
    nextTick(() => scrollToBottom())
  }
}

const loadFromLocalStorage = async () => {
  try {
    // Find saved workspaces in local storage
    const savedWorkspaces: Array<{key: string, metadata: any}> = []
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('ideanation_workspace_') && key.endsWith('_metadata')) {
        const metadataStr = localStorage.getItem(key)
        if (metadataStr) {
          try {
            const metadata = JSON.parse(metadataStr)
            const dataKey = key.replace('_metadata', '')
            savedWorkspaces.push({ key: dataKey, metadata })
          } catch (e) {
            console.warn('Invalid metadata for key:', key)
          }
        }
      }
    }
    
    if (savedWorkspaces.length === 0) {
      chatStore.addMessage({
        type: 'ai',
        content: `📭 No saved workspaces found in local storage. Save a workspace first using the "Save to Storage" button.`
      })
      return
    }
    
    // If there's only one saved workspace, load it directly
    if (savedWorkspaces.length === 1) {
      await loadSpecificWorkspace(savedWorkspaces[0].key)
      return
    }
    
    // If multiple saved workspaces, show a selection message
    const workspaceList = savedWorkspaces.map((workspace, index) => 
      `${index + 1}. "${workspace.metadata.title}" (${workspace.metadata.entityCount} entities, saved ${new Date(workspace.metadata.savedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })})`
    ).join('\n')
    
    chatStore.addMessage({
      type: 'ai',
      content: `📚 Found ${savedWorkspaces.length} saved workspaces:\n\n${workspaceList}\n\nTo load a specific workspace, type "load workspace [number]" (e.g., "load workspace 1")`
    })
    
    // Store the saved workspaces for reference
    ;(window as any).savedWorkspaces = savedWorkspaces
    
  } catch (error) {
    console.error('Load from local storage failed:', error)
    
    chatStore.addMessage({
      type: 'ai',
      content: `❌ Sorry, there was an error loading from local storage. Please try again.`
    })
  }
  
  nextTick(() => scrollToBottom())
}

const loadSpecificWorkspace = async (storageKey: string) => {
  try {
    const jsonData = localStorage.getItem(storageKey)
    if (!jsonData) {
      throw new Error('No data found for this key')
    }
    
    const exportData = JSON.parse(jsonData)
    
    // Clear current entities
    entitiesStore.ideas = []
    entitiesStore.problems = []
    entitiesStore.customers = []
    entitiesStore.products = []
    entitiesStore.features = []
    entitiesStore.jobs = []
    entitiesStore.pains = []
    entitiesStore.gains = []
    entitiesStore.relationships = []
    
    // Load workspace
    if (exportData.content.workspaces) {
      exportData.content.workspaces.forEach((workspace: any) => {
        const newWorkspace = resourcesStore.createWorkspace({
          title: workspace.title,
          description: workspace.description,
          identifier: workspace.identifier
        })
        // Set as current workspace
        resourcesStore.setCurrentWorkspace(newWorkspace)
      })
    }
    
    // Load problems
    if (exportData.content.problems) {
      exportData.content.problems.forEach((problem: any) => {
        entitiesStore.createProblem({
          title: problem.title,
          description: problem.description
        })
      })
    }
    
    // Load customers
    if (exportData.content.customers) {
      exportData.content.customers.forEach((customer: any) => {
        entitiesStore.createCustomer({
          title: customer.title,
          givenName: customer.givenName,
          familyName: customer.familyName,
          role: customer.role,
          organization: customer.organization
        })
      })
    }
    
    // Load products
    if (exportData.content.products) {
      exportData.content.products.forEach((product: any) => {
        entitiesStore.createProduct({
          title: product.title,
          description: product.description
        })
      })
    }
    
    // Load features
    if (exportData.content.features) {
      exportData.content.features.forEach((feature: any) => {
        entitiesStore.createFeature({
          title: feature.title,
          description: feature.description,
          type: feature.type,
          status: feature.status
        })
      })
    }
    
    // Load jobs
    if (exportData.content.jobs) {
      exportData.content.jobs.forEach((job: any) => {
        entitiesStore.createJob({
          title: job.title,
          description: job.description
        })
      })
    }
    
    // Load pains
    if (exportData.content.pains) {
      exportData.content.pains.forEach((pain: any) => {
        entitiesStore.createPain({
          title: pain.title,
          description: pain.description
        })
      })
    }
    
    // Load gains
    if (exportData.content.gains) {
      exportData.content.gains.forEach((gain: any) => {
        entitiesStore.createGain({
          title: gain.title,
          description: gain.description
        })
      })
    }
    
    // Load relationships
    if (exportData.content.relationships) {
      exportData.content.relationships.forEach((relationship: any) => {
        entitiesStore.createRelationship({
          sourceId: relationship.sourceId,
          targetId: relationship.targetId,
          relationshipType: relationship.relationshipType
        })
      })
    }
    
    const metadata = exportData.content.statistics
    chatStore.addMessage({
      type: 'ai',
      content: `✅ Successfully loaded "${exportData.title}" from local storage! Loaded ${metadata.totalIdeas + metadata.totalProblems + metadata.totalCustomers + metadata.totalProducts + metadata.totalFeatures + metadata.totalJobs + metadata.totalPains + metadata.totalGains} entities and ${metadata.totalRelationships} relationships.`
    })
    
  } catch (error) {
    console.error('Load specific workspace failed:', error)
    
    chatStore.addMessage({
      type: 'ai',
      content: `❌ Sorry, there was an error loading the workspace. Please try again.`
    })
  }
  
  nextTick(() => scrollToBottom())
}

// Watch for new messages and scroll to bottom
watch(() => chatStore.messages.length, () => {
  nextTick(() => scrollToBottom())
})

// Watch chat input for entity commands
watch(chatMessage, (newValue) => {
  if (resourcesStore.currentWorkspace) {
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
  align-items: flex-start;
  margin-bottom: 20px;
  padding: 0 10px;
  gap: 15px;
}

.graph-header h2 {
  margin: 0;
  font-size: 1.8rem;
  color: var(--color-primary);
  flex-shrink: 0;
}

.graph-controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
  min-width: 0;
}

/* Selection Info Styles */
.selection-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #e8f5e8;
  border: 1px solid #4caf50;
  border-radius: 4px;
  padding: 8px;
}

.selected-nodes {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.selection-label {
  font-size: 0.8rem;
  color: var(--color-primary);
  font-family: var(--font-handwritten);
  font-weight: 600;
}

.selected-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.selected-node {
  background: white;
  border: 1px solid #4caf50;
  border-radius: 3px;
  padding: 2px 6px;
  font-size: 0.7rem;
  color: var(--color-primary);
  font-family: var(--font-handwritten);
}

.selection-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.btn-link {
  background: #4caf50;
  color: white;
  border-color: #4caf50;
}

.btn-link:hover {
  background: #45a049;
  border-color: #45a049;
}

/* Entity Stats and Action Buttons */
.entity-stats {
  display: flex;
  gap: 8px;
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

.action-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
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
  
  .graph-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .graph-controls {
    flex-direction: row;
    flex-wrap: wrap;
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
  
  .graph-controls {
    flex-direction: column;
    gap: 8px;
  }
  
  .entity-stats {
    flex-direction: column;
    gap: 4px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}
</style>