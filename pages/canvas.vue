<template>
  <div class="canvas-page">
    <!-- Main Canvas Layout -->
    <div class="canvas-layout">
      <!-- Left Panel - Graph Visualization -->
      <div class="graph-panel">
        <div class="panel-header">
          <h2 class="panel-title handwritten">Your Idea Canvas</h2>
          <div class="panel-actions">
            <button 
              class="btn-sketch btn-small"
              @click="showBusinessModelCanvas"
              :disabled="!hasWorkspace"
              title="View Business Model Canvas"
            >
              📊 BMC
            </button>
            <button 
              class="btn-sketch btn-small"
              @click="showExportDialog = true"
              :disabled="!hasWorkspace"
              title="Export your idea"
            >
              📤 Export
            </button>
          </div>
        </div>
        
        <!-- Graph Visualization Component -->
        <GraphVisualization
          :nodes="graphNodes"
          :edges="graphEdges"
          :selected-node-ids="selectedNodeIds"
          @node-select="handleNodeSelect"
          @node-edit="handleNodeEdit"
          @node-duplicate="handleNodeDuplicate"
          @node-delete="handleNodeDelete"
        />
        
        <!-- Selection Actions -->
        <div class="selection-actions" v-if="selectedNodeIds.length > 0">
          <div class="selection-info">
            <span v-if="selectedNodeIds.length === 1">
              1 node selected
            </span>
            <span v-else>
              {{ selectedNodeIds.length }} nodes selected
            </span>
          </div>
          
          <div class="action-buttons">
            <button 
              v-if="selectedNodeIds.length === 2"
              class="btn-sketch btn-small"
              @click="showLinkModal = true"
            >
              🔗 Link Nodes
            </button>
            
            <button 
              v-if="selectedNodeIds.length === 1"
              class="btn-sketch btn-small"
              @click="handleNodeEdit(getSelectedNode())"
            >
              ✏️ Edit
            </button>
            
            <button 
              class="btn-sketch btn-small btn-danger"
              @click="handleDeleteSelected"
            >
              🗑️ Delete
            </button>
            
            <button 
              class="btn-sketch btn-small"
              @click="clearSelection"
            >
              ✖️ Clear
            </button>
          </div>
        </div>
      </div>

      <!-- Right Panel - Chat Interface -->
      <div class="chat-panel">
        <ChatInterface 
          :selected-node-ids="selectedNodeIds"
          :has-workspace="hasWorkspace"
          @entity-created="handleEntityCreated"
          @workspace-created="handleWorkspaceCreated"
          @relationship-created="handleRelationshipCreated"
        />
      </div>
    </div>

    <!-- Tools Panel at Bottom -->
    <div class="tools-panel-container">
      <ToolsPanel 
        :has-workspace="hasWorkspace"
        @show-business-model-canvas="showBusinessModelCanvas"
      />
    </div>

    <!-- Business Model Canvas Modal -->
    <div v-if="showBMCModal" class="modal-overlay" @click="closeBMCModal">
      <div class="modal-content bmc-modal" @click.stop>
        <div class="modal-header">
          <h3>Business Model Canvas</h3>
          <button class="close-button" @click="closeBMCModal">×</button>
        </div>
        <div class="modal-body">
          <BusinessModelCanvas />
        </div>
      </div>
    </div>

    <!-- Entity Creation Modal -->
    <EntityCreateModal
      v-if="showEntityModal"
      :entity-type="entityModalType"
      @save="handleEntitySave"
      @close="closeEntityModal"
    />

    <!-- Component Edit Modal -->
    <ComponentModal
      v-if="showComponentModal"
      :component="editingComponent"
      @save="handleComponentSave"
      @close="closeComponentModal"
    />

    <!-- Link Modal -->
    <LinkModal
      v-if="showLinkModal"
      :source-node="getNodeById(selectedNodeIds[0])"
      :target-node="getNodeById(selectedNodeIds[1])"
      @save="handleLinkSave"
      @close="closeLinkModal"
    />

    <!-- Export Dialog -->
    <ExportDialog
      v-model:visible="showExportDialog"
      :idea-id="currentWorkspace?.id"
      @export-complete="handleExportComplete"
    />
  </div>
</template>

<script setup lang="ts">
import GraphVisualization from '~/components/organisms/GraphVisualization.vue'
import ChatInterface from '~/components/organisms/ChatInterface.vue'
import ToolsPanel from '~/components/organisms/ToolsPanel.vue'
import BusinessModelCanvas from '~/components/organisms/BusinessModelCanvas.vue'
import EntityCreateModal from '~/components/molecules/EntityCreateModal.vue'
import ComponentModal from '~/components/molecules/ComponentModal.vue'
import LinkModal from '~/components/molecules/LinkModal.vue'
import ExportDialog from '~/components/ExportDialog.vue'

// Add authentication middleware
definePageMeta({
  middleware: 'auth'
})

const resourcesStore = useResourcesStore()
const chatStore = useChatStore()

// Reactive state
const selectedNodeIds = ref<string[]>([])
const showBMCModal = ref(false)
const showEntityModal = ref(false)
const showComponentModal = ref(false)
const showLinkModal = ref(false)
const showExportDialog = ref(false)
const entityModalType = ref('')
const editingComponent = ref(null)

// Computed properties
const currentWorkspace = computed(() => resourcesStore.currentWorkspace)
const hasWorkspace = computed(() => !!currentWorkspace.value)

const graphNodes = computed(() => {
  if (!currentWorkspace.value) return []
  
  const nodes = []
  
  // Add workspace ideas
  resourcesStore.currentWorkspaceIdeas.forEach(idea => {
    nodes.push({
      id: idea['@id'],
      title: idea.title,
      type: 'idea',
      description: idea.description || ''
    })
  })
  
  // Add workspace problems
  resourcesStore.currentWorkspaceProblems.forEach(problem => {
    nodes.push({
      id: problem['@id'],
      title: problem.title,
      type: 'problem',
      description: problem.description
    })
  })
  
  // Add workspace customers
  resourcesStore.currentWorkspaceCustomers.forEach(customer => {
    nodes.push({
      id: customer['@id'],
      title: customer.title || customer.fullName,
      type: 'customer',
      description: `${customer.role} at ${customer.organization}`
    })
  })
  
  // Add workspace products
  resourcesStore.currentWorkspaceProducts.forEach(product => {
    nodes.push({
      id: product['@id'],
      title: product.title,
      type: 'product',
      description: product.description
    })
  })
  
  // Add workspace features
  resourcesStore.currentWorkspaceFeatures.forEach(feature => {
    nodes.push({
      id: feature['@id'],
      title: feature.title,
      type: 'feature',
      description: feature.description
    })
  })
  
  return nodes
})

const graphEdges = computed(() => {
  return resourcesStore.relationships.map(rel => ({
    source: rel.sourceId,
    target: rel.targetId,
    relationship: rel.relationshipType
  }))
})

// Event handlers
const handleNodeSelect = (nodeId: string | null, isMultiSelect: boolean) => {
  if (nodeId === null) {
    selectedNodeIds.value = []
    return
  }
  
  if (isMultiSelect) {
    if (selectedNodeIds.value.includes(nodeId)) {
      selectedNodeIds.value = selectedNodeIds.value.filter(id => id !== nodeId)
    } else if (selectedNodeIds.value.length < 2) {
      selectedNodeIds.value.push(nodeId)
    }
  } else {
    selectedNodeIds.value = [nodeId]
  }
}

const handleNodeEdit = (node: any) => {
  editingComponent.value = node
  showComponentModal.value = true
}

const handleNodeDuplicate = (node: any) => {
  // Implementation for node duplication
  console.log('Duplicate node:', node)
}

const handleNodeDelete = (node: any) => {
  const confirmed = confirm(`Are you sure you want to delete "${node.title}"?`)
  if (confirmed) {
    resourcesStore.deleteResource(node.id)
    selectedNodeIds.value = selectedNodeIds.value.filter(id => id !== node.id)
  }
}

const handleDeleteSelected = () => {
  const nodeCount = selectedNodeIds.value.length
  const confirmed = confirm(`Are you sure you want to delete ${nodeCount} selected node(s)?`)
  
  if (confirmed) {
    selectedNodeIds.value.forEach(nodeId => {
      resourcesStore.deleteResource(nodeId)
    })
    selectedNodeIds.value = []
  }
}

const clearSelection = () => {
  selectedNodeIds.value = []
}

const getSelectedNode = () => {
  if (selectedNodeIds.value.length === 1) {
    return getNodeById(selectedNodeIds.value[0])
  }
  return null
}

const getNodeById = (nodeId: string) => {
  return graphNodes.value.find(node => node.id === nodeId)
}

const handleEntityCreated = (entity: any) => {
  // Entity is already created by the chat interface
  // Just clear selection and show success
  selectedNodeIds.value = []
}

const handleWorkspaceCreated = (workspace: any) => {
  // Workspace is already set by the chat interface
  console.log('Workspace created:', workspace)
}

const handleRelationshipCreated = (relationship: any) => {
  // Relationship is already created by the chat interface
  console.log('Relationship created:', relationship)
}

const handleEntitySave = (entityData: any) => {
  // Create entity based on type
  switch (entityModalType.value) {
    case 'problem':
      resourcesStore.createProblem(entityData)
      break
    case 'customer':
      resourcesStore.createCustomer(entityData)
      break
    case 'feature':
      resourcesStore.createFeature(entityData)
      break
    case 'product':
      resourcesStore.createProduct(entityData)
      break
  }
  
  closeEntityModal()
  selectedNodeIds.value = []
}

const handleComponentSave = (componentData: any) => {
  // Update existing component
  if (editingComponent.value) {
    resourcesStore.updateResource(editingComponent.value.id, componentData)
  }
  
  closeComponentModal()
}

const handleLinkSave = (linkData: any) => {
  if (selectedNodeIds.value.length === 2) {
    resourcesStore.createRelationship({
      sourceId: selectedNodeIds.value[0],
      targetId: selectedNodeIds.value[1],
      relationshipType: linkData.relationshipType
    })
  }
  
  closeLinkModal()
  selectedNodeIds.value = []
}

const handleExportComplete = (result: any) => {
  console.log('Export completed:', result)
}

// Modal controls
const showBusinessModelCanvas = () => {
  showBMCModal.value = true
}

const closeBMCModal = () => {
  showBMCModal.value = false
}

const closeEntityModal = () => {
  showEntityModal.value = false
  entityModalType.value = ''
}

const closeComponentModal = () => {
  showComponentModal.value = false
  editingComponent.value = null
}

const closeLinkModal = () => {
  showLinkModal.value = false
}

// SEO
useHead({
  title: 'Canvas - Ideanation',
  meta: [
    { name: 'description', content: 'Build and visualize your startup ideas on the Ideanation canvas.' },
    { name: 'robots', content: 'noindex' } // Private page
  ]
})
</script>

<style scoped>
.canvas-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-background);
  font-family: var(--font-body);
  overflow: hidden;
}

.canvas-layout {
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 400px;
  min-height: 0;
}

.graph-panel {
  display: flex;
  flex-direction: column;
  background: white;
  border-right: 2px solid var(--color-primary);
  position: relative;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #f9f9f9;
  border-bottom: 2px solid var(--color-primary);
}

.panel-title {
  margin: 0;
  font-size: 1.5rem;
  color: var(--color-primary);
  font-weight: 700;
}

.panel-actions {
  display: flex;
  gap: 8px;
}

.chat-panel {
  background: #1a1a1a;
  display: flex;
  flex-direction: column;
}

.tools-panel-container {
  background: #000;
  border-top: 1px solid #333;
}

.selection-actions {
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  background: white;
  border: 2px solid var(--color-primary);
  border-radius: 8px;
  padding: 12px 16px;
  box-shadow: 4px 4px 0px rgba(0,0,0,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
}

.selection-info {
  font-family: var(--font-handwritten);
  font-weight: 600;
  color: var(--color-primary);
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.btn-danger {
  border-color: #d32f2f;
  color: #d32f2f;
}

.btn-danger:hover {
  background: #d32f2f;
  color: white;
}

/* Modal Styles */
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
  max-width: 90vw;
  max-height: 90vh;
  overflow: auto;
  transform: rotate(-0.3deg);
  box-shadow: 8px 8px 0px rgba(0,0,0,0.2);
}

.bmc-modal {
  max-width: 95vw;
  max-height: 95vh;
  width: 1200px;
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
  font-family: var(--font-handwritten);
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

.modal-body {
  padding: 0;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .canvas-layout {
    grid-template-columns: 1fr 350px;
  }
}

@media (max-width: 768px) {
  .canvas-layout {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr auto;
  }
  
  .chat-panel {
    max-height: 400px;
  }
  
  .selection-actions {
    position: static;
    margin: 16px;
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
  
  .action-buttons {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .panel-header {
    padding: 12px 16px;
  }
  
  .panel-title {
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  .panel-actions {
    flex-direction: column;
    gap: 4px;
  }
  
  .btn-small {
    font-size: 0.7rem;
    padding: 4px 8px;
  }
  
  .modal-content {
    margin: 10px;
    max-width: calc(100vw - 20px);
    max-height: calc(100vh - 20px);
  }
}
</style>