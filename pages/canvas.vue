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
              <button v-if="resourcesStore.currentWorkspace" class="share-button" @click="showShareOptions">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
                  </svg>
                </button>
                <!-- User Menu -->
              <div class="user-menu" ref="userMenuRef">
                <button class="user-button" @click="toggleUserMenu">
                  <div class="user-avatar">
                    <img 
                      v-if="profile?.avatar_url" 
                      :src="profile.avatar_url" 
                      :alt="profile?.full_name || user?.email || 'User'"
                      class="avatar-image"
                    />
                    <div v-else class="avatar-initials">
                      {{ getUserInitials() }}
                    </div>
                  </div>
                </button>
                
                <div v-if="showUserMenu" class="user-dropdown">
                  <div class="dropdown-header">
                    <div class="user-info">
                      <div class="user-name-full">{{ profile?.full_name || 'User' }}</div>
                      <div class="user-email">{{ user?.email }}</div>
                    </div>
                  </div>
                  <div class="dropdown-divider"></div>
                  <div class="dropdown-items">
                    <button class="dropdown-item" @click="manageSubscription">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
                      </svg>
                      Manage Subscription
                    </button>
                    <button class="dropdown-item" @click="manageTools">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
                      </svg>
                      Manage Tools
                    </button>
                    <button class="dropdown-item" @click="handleSignOut">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M10 22H5a2 2 0 01-2-2V4a2 2 0 012-2h5v2H5v16h5v2zm7-10l-4-4v3H7v2h6v3l4-4z"/>
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
             <!-- Tools Panel - Expanded to fill remaining width -->
             <div class="tools-section" v-if="resourcesStore.currentWorkspace">
                <ToolsPanel 
                  :has-workspace="!!resourcesStore.currentWorkspace" 
                  @show-business-model-canvas="showBusinessModelCanvas = true"
                />
              </div>
          </div>
          
          <div class="graph-controls" v-if="resourcesStore.currentWorkspace">
            <!-- Entity Stats with Create Buttons -->
            <div class="entity-stats">
              <div class="stat-item" @click="openCreateModal('problem')">
                <span class="stat-count">{{ entitiesStore.problems.length }}</span>
                <span class="stat-label">Problems</span>
                <button class="stat-add-button" title="Add new problem">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                </button>
              </div>
              
              <div class="stat-item" @click="openCreateModal('customer')">
                <span class="stat-count">{{ entitiesStore.customers.length }}</span>
                <span class="stat-label">Customers</span>
                <button class="stat-add-button" title="Add new customer">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                </button>
              </div>
              
              <div class="stat-item" @click="openCreateModal('feature')">
                <span class="stat-count">{{ entitiesStore.features.length }}</span>
                <span class="stat-label">Features</span>
                <button class="stat-add-button" title="Add new feature">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                </button>
              </div>
              
              <div class="stat-item" @click="openCreateModal('product')">
                <span class="stat-count">{{ entitiesStore.products.length }}</span>
                <span class="stat-label">Products</span>
                <button class="stat-add-button" title="Add new product">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                </button>
              </div>
              
              <div class="stat-item" @click="openCreateModal('job')">
                <span class="stat-count">{{ entitiesStore.jobs.length }}</span>
                <span class="stat-label">Jobs</span>
                <button class="stat-add-button" title="Add new job">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                </button>
              </div>
              
              <div class="stat-item" @click="openCreateModal('pain')">
                <span class="stat-count">{{ entitiesStore.pains.length }}</span>
                <span class="stat-label">Pains</span>
                <button class="stat-add-button" title="Add new pain">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                </button>
              </div>
              
              <div class="stat-item" @click="openCreateModal('gain')">
                <span class="stat-count">{{ entitiesStore.gains.length }}</span>
                <span class="stat-label">Gains</span>
                <button class="stat-add-button" title="Add new gain">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                </button>
              </div>
              
              <div class="stat-item">
                <span class="stat-count">{{ entitiesStore.relationships.length }}</span>
                <span class="stat-label">Links</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="graph-container" ref="graphContainer">
          <!-- Selection Panel - Top Left of Graph Area -->
          <div v-if="selectedNodeIds.length > 0" class="selection-panel">
            <div class="selection-panel-header">
              <div class="selection-title">
                <span class="selection-icon">🎯</span>
                <span>Selected {{ selectedNodeIds.length === 1 ? 'Node' : 'Nodes' }}</span>
              </div>
              <button class="close-selection" @click="clearSelection" title="Clear selection">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
            
            <div class="selection-content">
              <div v-for="nodeId in selectedNodeIds" :key="nodeId" class="selected-node-info">
                <div class="node-header">
                  <span class="node-type-icon">{{ getNodeIcon(nodeId) }}</span>
                  <div class="node-details">
                    <div class="node-title">{{ getNodeTitle(nodeId) }}</div>
                    <div class="node-type">{{ getNodeType(nodeId) }}</div>
                  </div>
                </div>
                <div class="node-description">
                  {{ getNodeDescription(nodeId) }}
                </div>
              </div>
            </div>
            
            <div class="selection-actions">
              <button 
                v-if="selectedNodeIds.length === 1" 
                class="action-button action-button--primary"
                @click="handleEditSelectedNode"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
                Edit
              </button>
              <button 
                v-if="selectedNodeIds.length === 2" 
                class="action-button action-button--primary"
                @click="showLinkModal = true"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
                </svg>
                Link Nodes
              </button>
              <button 
                v-if="selectedNodeIds.length === 1" 
                class="action-button action-button--secondary"
                @click="handleDuplicateSelectedNode"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                </svg>
                Duplicate
              </button>
              <button 
                class="action-button action-button--danger"
                @click="handleDeleteSelectedNodes"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
                Delete
              </button>
            </div>
          </div>

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
          
          <!-- Business Model Canvas View -->
          <div v-if="showBusinessModelCanvas" class="bmc-overlay">
            <div class="bmc-modal">
              <div class="bmc-modal-header">
                <h3>Business Model Canvas</h3>
                <button class="close-bmc" @click="showBusinessModelCanvas = false">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </button>
              </div>
              <BusinessModelCanvas />
            </div>
          </div>
          
          <client-only>
            <GraphVisualization
              v-if="resourcesStore.currentWorkspace && graphNodes.length > 0 && !showBusinessModelCanvas"
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

    <!-- Entity Creation Modal -->
    <EntityCreateModal
      v-if="showCreateModal"
      :entity-type="createEntityType"
      @save="handleEntityCreate"
      @close="showCreateModal = false"
    />


    <!-- Share Options Modal -->
    <div v-if="showShareModal" class="modal-overlay" @click="closeShareModal">
      <div class="share-modal" @click.stop>
        <div class="modal-header">
          <h3>Share Workspace</h3>
          <button class="close-button" @click="closeShareModal">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
        
        <div class="modal-body">
          <div class="share-options">
            <div class="share-option">
              <h4>Share Link</h4>
              <div class="share-link-container">
                <input 
                  type="text" 
                  class="share-link-input" 
                  :value="shareLink" 
                  readonly
                  ref="shareLinkInput"
                />
                <button class="copy-link-button" @click="copyShareLink">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                  </svg>
                  Copy
                </button>
              </div>
              <div v-if="linkCopied" class="copy-confirmation">Link copied to clipboard!</div>
            </div>
            
            <div class="share-divider"></div>
            
            <div class="share-option">
              <h4>Email Invite</h4>
              <div class="email-invite-form">
                <input 
                  type="email" 
                  class="email-input" 
                  v-model="inviteEmail" 
                  placeholder="Enter email address"
                />
                <select v-model="invitePermission" class="permission-select">
                  <option value="view">Can view</option>
                  <option value="edit">Can edit</option>
                  <option value="admin">Admin</option>
                </select>
                <button class="send-invite-button" @click="sendEmailInvite" :disabled="!isValidEmail">
                  Send Invite
                </button>
              </div>
              <div v-if="inviteSent" class="invite-confirmation">Invitation sent successfully!</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import GraphVisualization from '~/components/organisms/GraphVisualization.vue'
import BusinessModelCanvas from '~/components/organisms/BusinessModelCanvas.vue'
import LinkModal from '~/components/molecules/LinkModal.vue'
import ComponentModal from '~/components/molecules/ComponentModal.vue'
import EntityCreateModal from '~/components/molecules/EntityCreateModal.vue'
import ChatInterface from '~/components/organisms/ChatInterface.vue'
import ToolsPanel from '~/components/organisms/ToolsPanel.vue'
import { useCanvasInit } from '~/composables/useCanvasInit'
import { useResourcesStore } from '~/stores/resources'
import { useWorkspaces } from '~/composables/useWorkspaces'
import { ApiService } from '~/services/api'

// Protect this route with authentication
definePageMeta({
  middleware: 'auth'
})

const chatStore = useChatStore()
const entitiesStore = useEntitiesStore()
const resourcesStore = useResourcesStore()
const graphContainer = ref<HTMLElement>()
const { initializeCanvas } = useCanvasInit()
const { workspaces, isLoading, error, fetchWorkspaces } = useWorkspaces()
const apiService = new ApiService()

const showLinkModal = ref(false)
const showComponentModal = ref(false)
const showCreateModal = ref(false)
const showBusinessModelCanvas = ref(false)
const showShareModal = ref(false)
const showUserMenu = ref(false)
const selectedComponent = ref<any>(null)
const selectedNodeIds = ref<string[]>([])
const createEntityType = ref('')

const userMenuRef = ref<HTMLElement>()
  const router = useRouter()
  const { user, profile, signOut, getAccessToken } = useAuth()

// Share modal state
const shareLink = ref('')
const linkCopied = ref(false)
const inviteEmail = ref('')
const invitePermission = ref('view')
const inviteSent = ref(false)

// Close user menu when clicking outside
onClickOutside(userMenuRef, () => {
  showUserMenu.value = false
})

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
      title: customer.title || `${customer.givenName} ${customer.familyName}`,
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

// Computed property for email validation
const isValidEmail = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(inviteEmail.value)
})

onMounted(async () => {
  
  // Check if we have a workspace from route params
  const route = useRoute()
  if (route.params.workspaceId) {
    const workspace = resourcesStore.workspaces.find(w => w.id === route.params.workspaceId)
    if (workspace) {
      resourcesStore.setCurrentWorkspace(workspace)
      try {
        await initializeCanvas(workspace)
      } catch (err) {
        console.error('Failed to initialize canvas on mount:', err)
      }
    }
  } else { //get the list of workspaces and user on 
    try {
      const token = await getAccessToken()
      await fetchWorkspaces(token)
      if (workspaces.value.length > 0) {
        //since the workspaces are not in the store yet and wthe workspaces we retreived are not Worksspace resources let's use the first one to get it using the api 
        const workspace = workspaces.value[0]
        
        const workspaceState = await apiService.getWorkspaceState(workspace.identifier, token)
        resourcesStore.setCurrentWorkspace(workspaceState.workspace)
        try {
          await initializeCanvas(workspaceState)
          //add all the resources to the store
          for (const resource of workspaceState.ideas) {
            resourcesStore.addResource(resource)
          }
          for (const resource of workspaceState.problems) {
            resourcesStore.addResource(resource)
          }
          for (const resource of workspaceState.customers) {
            resourcesStore.addResource(resource)
          }
          for (const resource of workspaceState.features) {
            resourcesStore.addResource(resource)
          }
          for (const resource of workspaceState.products) {
            resourcesStore.addResource(resource)
          }
          for (const resource of workspaceState.jobs) {
            resourcesStore.addResource(resource)
          }
          for (const resource of workspaceState.pains) {
            resourcesStore.addResource(resource)
          }
          for (const resource of workspaceState.gains) {
            resourcesStore.addResource(resource)
          }
          for (const resource of workspaceState.relationships) {
            resourcesStore.addResource(resource)
          }

        
        } catch (err) {
          console.error('Failed to initialize canvas on mount:', err)
        }
      }
    } catch (err) {
      console.error('Failed to get workspaces:', err)
    }
  }
})

const openCreateModal = (entityType: string) => {
  createEntityType.value = entityType
  showCreateModal.value = true
}

const handleEntityCreate = (entityData: any) => {
  let newEntity = null
  
  // Create the entity in the appropriate store
  switch (createEntityType.value) {
    case 'problem':
      newEntity = entitiesStore.createProblem(entityData)
      break
    case 'customer':
      newEntity = entitiesStore.createCustomer(entityData)
      break
    case 'feature':
      newEntity = entitiesStore.createFeature(entityData)
      break
    case 'product':
      newEntity = entitiesStore.createProduct(entityData)
      break
    case 'job':
      newEntity = entitiesStore.createJob(entityData)
      break
    case 'pain':
      newEntity = entitiesStore.createPain(entityData)
      break
    case 'gain':
      newEntity = entitiesStore.createGain(entityData)
      break
  }
  
  if (newEntity) {
    // Create relationship to workspace
    entitiesStore.createRelationship({
      sourceId: newEntity.id,
      targetId: resourcesStore.currentWorkspace?.id || '',
      relationshipType: 'belongs'
    })
    
    // Add success message to chat
    chatStore.addMessage({
      type: 'ai',
      content: `✅ Created new ${createEntityType.value} "${entityData.title}" successfully! It has been added to your canvas.`
    })
  }
  
  showCreateModal.value = false
  createEntityType.value = ''
}

const getNodeTitle = (nodeId: string) => {
  const node = graphNodes.value.find(n => n.id === nodeId)
  return node ? node.title : ''
}

const getNodeType = (nodeId: string) => {
  const node = graphNodes.value.find(n => n.id === nodeId)
  if (!node) return ''
  
  const typeNames: Record<string, string> = {
    'ideanation:Problem': 'Problem',
    'ideanation:Idea': 'Idea',
    'customer': 'Customer',
    'feature': 'Feature',
    'solution': 'Product',
    'job': 'Job',
    'ideanation:Pain': 'Pain',
    'ideanation:Gain': 'Gain'
  }
  
  return typeNames[node.type] || node.type
}

const getNodeDescription = (nodeId: string) => {
  const node = graphNodes.value.find(n => n.id === nodeId)
  return node ? node.description : ''
}

const getNodeIcon = (nodeId: string) => {
  const node = graphNodes.value.find(n => n.id === nodeId)
  if (!node) return '📝'
  
  const icons: Record<string, string> = {
    'ideanation:Problem': '⚠️',
    'ideanation:Idea': '💡',
    'customer': '👤',
    'feature': '⚙️',
    'solution': '📦',
    'job': '⚡',
    'ideanation:Pain': '😤',
    'ideanation:Gain': '📈'
  }
  
  return icons[node.type] || '📝'
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

const handleEditSelectedNode = () => {
  if (selectedNodeIds.value.length !== 1) return
  
  const nodeId = selectedNodeIds.value[0]
  const node = getNodeById(nodeId)
  if (node) {
    handleNodeEdit(node)
  }
}

const handleDuplicateSelectedNode = () => {
  if (selectedNodeIds.value.length !== 1) return
  
  const nodeId = selectedNodeIds.value[0]
  const node = getNodeById(nodeId)
  if (node) {
    handleNodeDuplicate(node)
  }
}

const handleDeleteSelectedNodes = () => {
  if (selectedNodeIds.value.length === 0) return
  
  const nodeNames = selectedNodeIds.value.map(id => getNodeTitle(id)).join(', ')
  const confirmMessage = selectedNodeIds.value.length === 1 
    ? `Are you sure you want to delete "${nodeNames}"?`
    : `Are you sure you want to delete these ${selectedNodeIds.value.length} nodes: ${nodeNames}?`
  
  if (confirm(confirmMessage + ' This action cannot be undone.')) {
    selectedNodeIds.value.forEach(nodeId => {
      const node = getNodeById(nodeId)
      if (node) {
        handleNodeDelete(node)
      }
    })
    selectedNodeIds.value = []
  }
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
      description = (entity as any).description || ''
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
      description: (entity as any).description || '',
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

// User menu functions
const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const getUserInitials = () => {
  if (profile.value?.full_name) {
    return profile.value.full_name
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }
  if (user.value?.email) {
    return user.value.email.charAt(0).toUpperCase()
  }
  return 'U'
}

const handleSignOut = async () => {
  showUserMenu.value = false
  await signOut()
  router.push('/')
}

const manageSubscription = () => {
  showUserMenu.value = false
  chatStore.addMessage({
    type: 'ai',
    content: `💳 To manage your subscription, please visit our pricing page. You can upgrade to Pro to unlock all premium features!`
  })
}

const manageTools = () => {
  showUserMenu.value = false
  // Trigger the tools manager modal in ToolsPanel
  const toolsPanel = document.querySelector('.tools-panel')
  if (toolsPanel) {
    const manageToolsLink = toolsPanel.querySelector('.manage-tools-link a')
    if (manageToolsLink) {
      (manageToolsLink as HTMLElement).click()
    }
  }
}

// Share functions
const showShareOptions = () => {
  // Generate share link
  const workspaceId = resourcesStore.currentWorkspace?.id
  shareLink.value = `${window.location.origin}/canvas?workspace=${workspaceId}`
  
  // Reset state
  linkCopied.value = false
  inviteEmail.value = ''
  invitePermission.value = 'view'
  inviteSent.value = false
  
  // Show modal
  showShareModal.value = true
}

const closeShareModal = () => {
  showShareModal.value = false
}

const copyShareLink = async () => {
  try {
    await navigator.clipboard.writeText(shareLink.value)
    linkCopied.value = true
    setTimeout(() => {
      linkCopied.value = false
    }, 3000)
  } catch (error) {
    console.error('Failed to copy link:', error)
  }
}

const sendEmailInvite = () => {
  if (!isValidEmail.value) return
  
  // In a real app, this would send an API request
  console.log('Sending invite to:', inviteEmail.value, 'with permission:', invitePermission.value)
  
  // Show success message
  inviteSent.value = true
  setTimeout(() => {
    inviteSent.value = false
    inviteEmail.value = ''
  }, 3000)
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

/* Enhanced Entity Stats with Create Buttons */
.entity-stats {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  background: #333;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #444;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  letter-spacing: 0.025em;
  transition: all 0.2s ease;
  white-space: nowrap;
  cursor: pointer;
  position: relative;
}

.stat-item:hover {
  background: #444;
  border-color: #555;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.stat-count {
  font-weight: 700;
  font-size: 14px;
  color: #4f46e5;
}

.stat-label {
  font-weight: 500;
}

.stat-add-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: #4f46e5;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0.8;
}

.stat-add-button:hover {
  background: #4338ca;
  opacity: 1;
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(79, 70, 229, 0.3);
}

.stat-add-button svg {
  width: 10px;
  height: 10px;
}

/* Special styling for Links stat (no add button) */
.stat-item:last-child {
  cursor: default;
}

.stat-item:last-child:hover {
  transform: none;
  background: #333;
  border-color: #444;
  box-shadow: none;
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

/* Business Model Canvas Overlay */
.bmc-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.bmc-modal {
  background: white;
  border: 2px solid var(--color-primary);
  border-radius: 8px;
  width: 100%;
  height: 100%;
  max-width: 1400px;
  max-height: 900px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transform: rotate(-0.1deg);
  box-shadow: 8px 8px 0px rgba(0,0,0,0.2);
}

.bmc-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: var(--color-primary);
  color: white;
  border-bottom: 2px solid var(--color-primary);
}

.bmc-modal-header h3 {
  margin: 0;
  font-family: var(--font-handwritten);
  font-size: 1.3rem;
  font-weight: 700;
}

.close-bmc {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-bmc:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: scale(1.1);
}

/* Selection Panel - Top Left of Graph Area */
.selection-panel {
  position: absolute;
  top: 20px;
  left: 20px;
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  z-index: 100;
  min-width: 280px;
  max-width: 400px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  animation: slideInFromLeft 0.3s ease-out;
}

.selection-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #000;
  border-bottom: 1px solid #333;
  border-radius: 12px 12px 0 0;
}

.selection-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
}

.selection-icon {
  font-size: 16px;
}

.close-selection {
  background: transparent;
  border: none;
  color: #888;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-selection:hover {
  background: #2a2a2a;
  color: #fff;
}

.selection-content {
  padding: 16px 20px;
  max-height: 300px;
  overflow-y: auto;
}

.selected-node-info {
  margin-bottom: 16px;
}

.selected-node-info:last-child {
  margin-bottom: 0;
}

.node-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.node-type-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.node-details {
  flex: 1;
  min-width: 0;
}

.node-title {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.node-type {
  font-size: 12px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
}

.node-description {
  font-size: 13px;
  color: #ccc;
  line-height: 1.4;
  margin-left: 30px;
  padding-left: 12px;
  border-left: 2px solid #333;
}

.selection-actions {
  display: flex;
  gap: 8px;
  padding: 16px 20px;
  border-top: 1px solid #333;
  flex-wrap: wrap;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px solid #333;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  background: transparent;
}

.action-button--primary {
  background: #4f46e5;
  border-color: #4f46e5;
  color: white;
}

.action-button--primary:hover {
  background: #4338ca;
  border-color: #4338ca;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

.action-button--secondary {
  background: #2a2a2a;
  border-color: #333;
  color: #ccc;
}

.action-button--secondary:hover {
  background: #333;
  border-color: #444;
  color: #fff;
  transform: translateY(-1px);
}

.action-button--danger {
  background: transparent;
  border-color: #dc2626;
  color: #dc2626;
}

.action-button--danger:hover {
  background: #dc2626;
  border-color: #dc2626;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
}

.action-button svg {
  flex-shrink: 0;
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
@keyframes slideInFromLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Custom scrollbar for selection panel */
.selection-content::-webkit-scrollbar {
  width: 4px;
}

.selection-content::-webkit-scrollbar-track {
  background: #2a2a2a;
}

.selection-content::-webkit-scrollbar-thumb {
  background: #444;
  border-radius: 2px;
}

.selection-content::-webkit-scrollbar-thumb:hover {
  background: #555;
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
  
  .selection-panel {
    min-width: 260px;
    max-width: 320px;
  }
  
  .bmc-overlay {
    padding: 10px;
  }
  
  .bmc-modal {
    max-height: 95vh;
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
  
  .selection-panel {
    top: 10px;
    left: 10px;
    right: 10px;
    min-width: auto;
    max-width: none;
  }
  
  .selection-actions {
    flex-direction: column;
  }
  
  .action-button {
    justify-content: center;
  }
  
  .bmc-overlay {
    padding: 5px;
  }
  
  .bmc-modal {
    max-height: 98vh;
  }
  
  .bmc-modal-header {
    padding: 12px 16px;
  }

  .share-link-container {
    flex-direction: column;
  }
  
  .copy-link-button {
    justify-content: center;
  }
}

/* User Menu */
.user-menu {
  position: relative;
  margin-left: 16px;
}

.user-button {
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #333;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
  border: 2px solid #444;
  overflow: hidden;
  transition: all 0.2s ease;
}

.user-button:hover .user-avatar {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border-color: #4f46e5;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-initials {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 8px;
  width: 220px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  overflow: hidden;
  animation: dropdownSlideIn 0.2s ease-out;
}

.dropdown-header {
  padding: 16px;
  background: #000;
  border-bottom: 1px solid #333;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-name-full {
  font-weight: 600;
  color: white;
  font-size: 14px;
}

.user-email {
  color: #888;
  font-size: 12px;
  word-break: break-all;
}

.dropdown-divider {
  height: 1px;
  background: #333;
}

.dropdown-items {
  padding: 8px;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  width: 100%;
  text-align: left;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: #ccc;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.dropdown-item:hover {
  background: #2a2a2a;
  color: white;
}

.dropdown-item svg {
  color: #888;
  flex-shrink: 0;
}

.dropdown-item:hover svg {
  color: #4f46e5;
}

/* Share button */
.share-button {
  background: #4f46e5;
  color: white;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.share-button:hover {
  background: #4338ca;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

/* Share Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  backdrop-filter: blur(4px);
}

.share-modal {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  animation: modalSlideIn 0.3s ease-out;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: #000;
  border-bottom: 1px solid #333;
  border-radius: 12px 12px 0 0;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  letter-spacing: 0.5px;
}

.close-button {
  background: transparent;
  border: none;
  color: #888;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
}

.close-button:hover {
  background: #2a2a2a;
  color: #fff;
}

.modal-body {
  padding: 24px;
}

.share-options {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.share-option {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.share-option h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
}

.share-link-container {
  display: flex;
  gap: 8px;
}

.share-link-input {
  flex: 1;
  padding: 12px 16px;
  background: #2a2a2a;
  border: 1px solid #333;
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  font-family: inherit;
}

.copy-link-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 16px;
  background: #4f46e5;
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  white-space: nowrap;
}

.copy-link-button:hover {
  background: #4338ca;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

.copy-link-button svg {
  flex-shrink: 0;
}

.copy-confirmation {
  font-size: 13px;
  color: #10b981;
  font-weight: 500;
}

.share-divider {
  height: 1px;
  background: #333;
  margin: 8px 0;
}

.email-invite-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.email-input {
  padding: 12px 16px;
  background: #2a2a2a;
  border: 1px solid #333;
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  font-family: inherit;
}

.permission-select {
  padding: 12px 16px;
  background: #2a2a2a;
  border: 1px solid #333;
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  font-family: inherit;
  cursor: pointer;
}

.send-invite-button {
  padding: 12px 16px;
  background: #4f46e5;
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.send-invite-button:hover:not(:disabled) {
  background: #4338ca;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

.send-invite-button:disabled {
  background: #333;
  color: #666;
  cursor: not-allowed;
}

.invite-confirmation {
  font-size: 13px;
  color: #10b981;
  font-weight: 500;
}
</style>