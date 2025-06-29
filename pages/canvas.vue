<template>
  <div class="canvas-page">
    <div class="canvas-layout">
      <!-- Chat Sidebar on Left -->
      <div class="chat-sidebar">
        <ChatInterface
          :selected-node-ids="selectedNodeIds"
          :has-workspace="!!resourcesStore.currentWorkspace"
          @entity-created="handleEntityCreated"
          @workspace-created="handleWorkspaceCreated"
          @relationship-created="handleRelationshipCreated"
        />
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
import GraphVisualization from '~/components/organisms/GraphVisualization.vue'
import LinkModal from '~/components/molecules/LinkModal.vue'
import ChatInterface from '~/components/organisms/ChatInterface.vue'
import { ExportDataBuilder } from '~/services/export/ExportDataBuilder'
import { MarkdownFormatter, JSONFormatter } from '~/services/export/ExportFormatter'
import { ExportType } from '~/types/export'

// Protect this route with authentication
definePageMeta({
  middleware: 'auth'
})

const chatStore = useChatStore()
const entitiesStore = useEntitiesStore()
const resourcesStore = useResourcesStore()
const graphContainer = ref<HTMLElement>()

const showComponentModal = ref(false)
const showLinkModal = ref(false)
const selectedComponent = ref<any>(null)
const selectedNodeIds = ref<string[]>([])

// Convert entities to graph format - EXCLUDE workspace from nodes
const graphNodes = computed(() => {
  const nodes: any[] = []
  
  // DO NOT add workspace as a node - it's just the container
  
  // Add ideas
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
}

// Event handlers for ChatInterface emissions
const handleEntityCreated = (entity: any) => {
  console.log('Entity created:', entity)
  // Additional logic if needed
}

const handleWorkspaceCreated = (workspace: any) => {
  console.log('Workspace created:', workspace)
  // Additional logic if needed
}

const handleRelationshipCreated = (relationship: any) => {
  console.log('Relationship created:', relationship)
  // Additional logic if needed
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
    
  } catch (error) {
    console.error('Export failed:', error)
    
    // Show error message
    chatStore.addMessage({
      type: 'ai',
      content: `❌ Sorry, there was an error exporting your business model canvas. Please try again.`
    })
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
    
  } catch (error) {
    console.error('Export failed:', error)
    
    // Show error message
    chatStore.addMessage({
      type: 'ai',
      content: `❌ Sorry, there was an error exporting all entities. Please try again.`
    })
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
    
  } catch (error) {
    console.error('Save to local storage failed:', error)
    
    // Show error message
    chatStore.addMessage({
      type: 'ai',
      content: `❌ Sorry, there was an error saving to local storage. Please try again.`
    })
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
}

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
  transform: rotate(-0.3deg);
  box-shadow: 4px 4px 0px rgba(0,0,0,0.1);
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