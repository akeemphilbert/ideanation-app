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
          <div class="header-top">
            <div class="title-and-tools">
              <h2 class="workspace-title">
                {{ resourcesStore.currentWorkspace?.title || 'Your Idea Canvas' }}
              </h2>
            </div>
             <!-- Tools Panel - Expanded to fill remaining width -->
             <div class="tools-section" v-if="resourcesStore.currentWorkspace">
                <ToolsPanel :has-workspace="!!resourcesStore.currentWorkspace" />
              </div>
          </div>
          
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
              @node-edit="handleNodeEdit"
              @node-duplicate="handleNodeDuplicate"
              @node-link="handleNodeLink"
              @node-delete="handleNodeDelete"
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

    <!-- Component Edit Modal -->
    <ComponentModal
      v-if="showComponentModal"
      :component="selectedComponent"
      @save="handleComponentSave"
      @close="showComponentModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import GraphVisualization from '~/components/organisms/GraphVisualization.vue'
import LinkModal from '~/components/molecules/LinkModal.vue'
import ComponentModal from '~/components/molecules/ComponentModal.vue'
import ChatInterface from '~/components/organisms/ChatInterface.vue'
import ToolsPanel from '~/components/organisms/ToolsPanel.vue'

// Protect this route with authentication
definePageMeta({
  middleware: 'auth'
})

const chatStore = useChatStore()
const entitiesStore = useEntitiesStore()
const resourcesStore = useResourcesStore()
const graphContainer = ref<HTMLElement>()

const showLinkModal = ref(false)
const showComponentModal = ref(false)
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

const findEntityByNode = (node: any) => {
  switch (node.type) {
    case 'ideanation:Problem':
      return entitiesStore.problems.find(p => p.id === node.id)
    case 'customer':
      return entitiesStore.customers.find(c => c.id === node.id)
    case 'feature':
      return entitiesStore.features.find(f => f.id === node.id)
    case 'solution':
      return entitiesStore.products.find(p => p.id === node.id)
    case 'job':
      return entitiesStore.jobs.find(j => j.id === node.id)
    case 'ideanation:Pain':
      return entitiesStore.pains.find(p => p.id === node.id)
    case 'ideanation:Gain':
      return entitiesStore.gains.find(g => g.id === node.id)
    default:
      return null
  }
}

const handleNodeClick = (node: any) => {
  console.log('Node clicked:', node)
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

const handleNodeEdit = (node: any) => {
  const entity = findEntityByNode(node)
  if (entity) {
    let description = ''
    
    // Handle different entity types and their description properties
    if (node.type === 'customer') {
      const customer = entity as any
      description = `${customer.role} at ${customer.organization}`
    } else {
      description = entity.description || ''
    }
    
    selectedComponent.value = {
      id: entity.id,
      type: node.type === 'solution' ? 'product' : node.type.replace('ideanation:', '').toLowerCase(),
      title: entity.title,
      description: description,
      tags: []
    }
    showComponentModal.value = true
  }
}

const handleNodeDuplicate = (node: any) => {
  const entity = findEntityByNode(node)
  if (entity) {
    const duplicateData = {
      title: `${entity.title} (Copy)`,
      description: entity.description || '',
    }
    
    let newEntity = null
    
    switch (node.type) {
      case 'ideanation:Problem':
        newEntity = entitiesStore.createProblem(duplicateData)
        break
      case 'customer':
        const customer = entity as any
        newEntity = entitiesStore.createCustomer({
          ...duplicateData,
          givenName: customer.givenName,
          familyName: customer.familyName,
          role: customer.role,
          organization: customer.organization
        })
        break
      case 'feature':
        const feature = entity as any
        newEntity = entitiesStore.createFeature({
          ...duplicateData,
          type: feature.type,
          status: feature.status
        })
        break
      case 'solution':
        newEntity = entitiesStore.createProduct(duplicateData)
        break
      case 'job':
        newEntity = entitiesStore.createJob(duplicateData)
        break
      case 'ideanation:Pain':
        newEntity = entitiesStore.createPain(duplicateData)
        break
      case 'ideanation:Gain':
        newEntity = entitiesStore.createGain(duplicateData)
        break
    }
    
    if (newEntity) {
      chatStore.addMessage({
        type: 'ai',
        content: `✅ Duplicated "${entity.title}" successfully! The copy has been added to your canvas.`
      })
    }
  }
}

const handleNodeLink = (node: any) => {
  // Add the node to selection for linking
  if (!selectedNodeIds.value.includes(node.id)) {
    if (selectedNodeIds.value.length === 0) {
      selectedNodeIds.value = [node.id]
      chatStore.addMessage({
        type: 'ai',
        content: `Selected "${node.title}" for linking. Now select another node to create a relationship.`
      })
    } else if (selectedNodeIds.value.length === 1) {
      selectedNodeIds.value.push(node.id)
      showLinkModal.value = true
    }
  }
}

const handleNodeDelete = (node: any) => {
  if (confirm(`Are you sure you want to delete "${node.title}"? This action cannot be undone.`)) {
    const entity = findEntityByNode(node)
    if (entity) {
      switch (node.type) {
        case 'ideanation:Problem':
          entitiesStore.deleteProblem(entity.id)
          break
        case 'customer':
          entitiesStore.deleteCustomer(entity.id)
          break
        case 'feature':
          entitiesStore.deleteFeature(entity.id)
          break
        case 'solution':
          entitiesStore.deleteProduct(entity.id)
          break
        case 'job':
          entitiesStore.deleteJob(entity.id)
          break
        case 'ideanation:Pain':
          entitiesStore.deletePain(entity.id)
          break
        case 'ideanation:Gain':
          entitiesStore.deleteGain(entity.id)
          break
      }
      
      // Remove from selection if it was selected
      selectedNodeIds.value = selectedNodeIds.value.filter(id => id !== node.id)
      
      chatStore.addMessage({
        type: 'ai',
        content: `🗑️ Deleted "${node.title}" and all its relationships from your canvas.`
      })
    }
  }
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

const handleComponentSave = (component: any) => {
  let updatedEntity = null
  
  // Update the entity in the appropriate store
  switch (component.type) {
    case 'problem':
      entitiesStore.updateProblem(component.id, component)
      updatedEntity = entitiesStore.problems.find(p => p.id === component.id)
      break
    case 'customer':
      entitiesStore.updateCustomer(component.id, component)
      updatedEntity = entitiesStore.customers.find(c => c.id === component.id)
      break
    case 'feature':
      entitiesStore.updateFeature(component.id, component)
      updatedEntity = entitiesStore.features.find(f => f.id === component.id)
      break
    case 'product':
      entitiesStore.updateProduct(component.id, component)
      updatedEntity = entitiesStore.products.find(p => p.id === component.id)
      break
    case 'job':
      entitiesStore.updateJob(component.id, component)
      updatedEntity = entitiesStore.jobs.find(j => j.id === component.id)
      break
    case 'pain':
      entitiesStore.updatePain(component.id, component)
      updatedEntity = entitiesStore.pains.find(p => p.id === component.id)
      break
    case 'gain':
      entitiesStore.updateGain(component.id, component)
      updatedEntity = entitiesStore.gains.find(g => g.id === component.id)
      break
  }
  
  if (updatedEntity) {
    chatStore.addMessage({
      type: 'ai',
      content: `✅ Updated "${component.title}" successfully!`
    })
  }
  
  showComponentModal.value = false
  selectedComponent.value = null
}

// Event handlers for ChatInterface emissions
const handleEntityCreated = (entity: any) => {
  console.log('Entity created:', entity)
}

const handleWorkspaceCreated = (workspace: any) => {
  console.log('Workspace created:', workspace)
}

const handleRelationshipCreated = (relationship: any) => {
  console.log('Relationship created:', relationship)
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
  margin-bottom: 20px;
  padding: 0 10px;
}

.header-top {
  margin-bottom: 20px;
}

/* Title and Tools Layout - EXPANDED TOOLS */
.title-and-tools {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  width: 100%;
}

/* Professional workspace title - NOT handwritten */
.workspace-title {
  margin: 0;
  font-size: 1.8rem;
  color: var(--color-primary);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-weight: 600;
  letter-spacing: -0.025em;
  flex-shrink: 0;
  white-space: nowrap;
}

/* Tools Section - EXPANDED TO FILL REMAINING WIDTH */
.tools-section {
  flex: 1;
  min-width: 0;
  width: 100%;
}

.graph-controls {
  display: flex;
  flex-direction: column;
  gap: 16px;
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

/* Professional Entity Stats - matching header design */
.entity-stats {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.stat-item {
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  background: #333;
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #444;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  letter-spacing: 0.025em;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.stat-item:hover {
  background: #444;
  border-color: #555;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
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
  
  .title-and-tools {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .workspace-title {
    font-size: 1.6rem;
    white-space: normal;
  }
  
  .tools-section {
    width: 100%;
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
  
  .title-and-tools {
    flex-direction: column;
    gap: 8px;
  }
  
  .workspace-title {
    font-size: 1.4rem;
  }
  
  .graph-controls {
    gap: 8px;
  }
  
  .entity-stats {
    flex-direction: column;
    gap: 4px;
  }
  
  .stat-item {
    text-align: center;
  }
}
</style>