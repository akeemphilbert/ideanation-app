<template>
  <div class="landing-page">
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title title-sketch">
          Ideanation
        </h1>
        <p class="hero-subtitle handwritten">
          Transform your startup ideas into structured atomic components and visualize their relationships
        </p>
        
        <div class="hero-features">
          <div class="feature-card sketch-border" v-for="feature in features" :key="feature.title">
            <h3 class="handwritten">{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </div>
        
        <div class="hero-actions">
          <button 
            class="btn-sketch btn-primary" 
            @click="startNewIdea"
          >
            Start Building Your Idea
          </button>
          
          <button 
            class="btn-sketch btn-secondary" 
            @click="showWorkspaceSelector = true"
            v-if="resourcesStore.workspaces.length > 0"
          >
            Open Existing Workspace
          </button>
        </div>
      </div>
      
      <div class="hero-visual">
        <div class="idea-preview">
          <svg width="300" height="200" class="preview-graph">
            <circle cx="80" cy="60" r="20" fill="none" stroke="#1a1a1a" stroke-width="2" class="preview-node"/>
            <circle cx="220" cy="60" r="20" fill="none" stroke="#1a1a1a" stroke-width="2" class="preview-node"/>
            <circle cx="150" cy="140" r="20" fill="none" stroke="#1a1a1a" stroke-width="2" class="preview-node"/>
            <line x1="100" y1="60" x2="200" y2="60" stroke="#666" stroke-width="1" class="preview-edge"/>
            <line x1="90" y1="75" x2="140" y2="125" stroke="#666" stroke-width="1" class="preview-edge"/>
            <line x1="210" y1="75" x2="160" y2="125" stroke="#666" stroke-width="1" class="preview-edge"/>
            <text x="80" y="65" text-anchor="middle" class="preview-label handwritten" font-size="10">Problem</text>
            <text x="220" y="65" text-anchor="middle" class="preview-label handwritten" font-size="10">Customer</text>
            <text x="150" y="145" text-anchor="middle" class="preview-label handwritten" font-size="10">Solution</text>
          </svg>
        </div>
      </div>
    </div>

    <!-- Workspace Selector Modal -->
    <div v-if="showWorkspaceSelector" class="modal-overlay" @click="showWorkspaceSelector = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="handwritten">Select Workspace</h3>
          <button class="close-button" @click="showWorkspaceSelector = false">×</button>
        </div>
        
        <div class="workspace-list">
          <div 
            v-for="workspace in resourcesStore.workspaces" 
            :key="workspace['@id']"
            class="workspace-item"
            @click="openWorkspace(workspace)"
          >
            <div class="workspace-icon">🚀</div>
            <div class="workspace-info">
              <h4 class="workspace-title">{{ workspace.title }}</h4>
              <p class="workspace-description">{{ workspace.description }}</p>
              <div class="workspace-stats">
                <span class="stat">{{ getWorkspaceStats(workspace['@id']).ideas }} ideas</span>
                <span class="stat">{{ getWorkspaceStats(workspace['@id']).entities }} entities</span>
                <span class="stat">Updated {{ formatDate(workspace.updated) }}</span>
              </div>
            </div>
            <div class="workspace-actions">
              <button class="btn-sketch btn-small" @click.stop="deleteWorkspace(workspace['@id'])">
                Delete
              </button>
            </div>
          </div>
        </div>
        
        <div class="modal-actions">
          <button class="btn-sketch" @click="showWorkspaceSelector = false">
            Cancel
          </button>
          <button class="btn-sketch btn-primary" @click="startNewIdea">
            Create New Workspace
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const resourcesStore = useResourcesStore()

const showWorkspaceSelector = ref(false)

const features = [
  {
    title: 'Atomic Components',
    description: 'Break down your idea into problems, customers, jobs, gains, and pains'
  },
  {
    title: 'Visual Relationships',
    description: 'See how different components connect and influence each other'
  },
  {
    title: 'AI-Powered Chat',
    description: 'Get suggestions and refine your idea through natural conversation'
  }
]

const startNewIdea = () => {
  // Create a new workspace
  const workspace = resourcesStore.createWorkspace({
    title: `New Workspace ${new Date().toLocaleDateString()}`,
    description: 'A new workspace for your startup idea'
  })
  
  // Set as current workspace
  resourcesStore.setCurrentWorkspace(workspace.toJSON())
  
  // Navigate to canvas
  router.push('/canvas')
}

const openWorkspace = (workspace: any) => {
  resourcesStore.setCurrentWorkspace(workspace)
  showWorkspaceSelector.value = false
  router.push('/canvas')
}

const deleteWorkspace = (workspaceId: string) => {
  if (confirm('Are you sure you want to delete this workspace? This action cannot be undone.')) {
    resourcesStore.deleteWorkspace(workspaceId)
  }
}

const getWorkspaceStats = (workspaceId: string) => {
  const ideas = resourcesStore.getIdeasForWorkspace(workspaceId)
  const problems = resourcesStore.getProblemsForWorkspace(workspaceId)
  const customers = resourcesStore.getCustomersForWorkspace(workspaceId)
  const products = resourcesStore.getProductsForWorkspace(workspaceId)
  const features = resourcesStore.getFeaturesForWorkspace(workspaceId)
  
  return {
    ideas: ideas.length,
    entities: problems.length + customers.length + products.length + features.length
  }
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString()
}

// SEO
useHead({
  title: 'Ideanation - Structure Your Startup Ideas',
  meta: [
    { name: 'description', content: 'Transform your startup ideas into structured atomic components and visualize their relationships with AI-powered insights.' }
  ]
})
</script>

<style scoped>
.landing-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #fefefe 0%, #f8f8f8 100%);
  padding: 40px 20px;
}

.hero-section {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  min-height: 80vh;
}

.hero-content {
  max-width: 500px;
}

.hero-title {
  font-size: 4rem;
  margin-bottom: 1rem;
  color: var(--color-primary);
  line-height: 1.1;
}

.hero-subtitle {
  font-size: 1.2rem;
  color: var(--color-secondary);
  margin-bottom: 2rem;
  line-height: 1.5;
}

.hero-features {
  display: grid;
  gap: 1rem;
  margin-bottom: 2rem;
}

.feature-card {
  padding: 1rem;
  transform: rotate(0.3deg);
  transition: transform 0.2s ease;
}

.feature-card:nth-child(even) {
  transform: rotate(-0.2deg);
}

.feature-card:hover {
  transform: rotate(0deg) scale(1.02);
}

.feature-card h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: var(--color-primary);
}

.feature-card p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--color-secondary);
}

.hero-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-primary {
  background: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background: var(--color-accent);
}

.btn-secondary {
  background: white;
  color: var(--color-primary);
}

.hero-visual {
  display: flex;
  justify-content: center;
  align-items: center;
}

.idea-preview {
  padding: 2rem;
  background: white;
  border: 3px solid var(--color-primary);
  border-radius: 8px;
  transform: rotate(-1deg);
  box-shadow: 8px 8px 0px rgba(0,0,0,0.1);
}

.preview-node {
  animation: float 3s ease-in-out infinite;
}

.preview-node:nth-child(2) {
  animation-delay: 1s;
}

.preview-node:nth-child(3) {
  animation-delay: 2s;
}

.preview-edge {
  stroke-dasharray: 5,5;
  animation: dash 2s linear infinite;
}

.preview-label {
  fill: var(--color-primary);
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
  width: 100%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  transform: rotate(-0.3deg);
  box-shadow: 8px 8px 0px rgba(0,0,0,0.2);
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

.workspace-list {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.workspace-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  transform: rotate(0.1deg);
}

.workspace-item:hover {
  border-color: var(--color-primary);
  transform: rotate(0deg) scale(1.02);
  box-shadow: 4px 4px 0px rgba(0,0,0,0.1);
}

.workspace-item:nth-child(even) {
  transform: rotate(-0.1deg);
}

.workspace-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.workspace-info {
  flex: 1;
  min-width: 0;
}

.workspace-title {
  margin: 0 0 4px 0;
  font-size: 1.1rem;
  color: var(--color-primary);
  font-family: var(--font-handwritten);
  font-weight: 700;
}

.workspace-description {
  margin: 0 0 8px 0;
  font-size: 0.9rem;
  color: var(--color-secondary);
  line-height: 1.4;
}

.workspace-stats {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.stat {
  font-size: 0.8rem;
  color: var(--color-secondary);
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.workspace-actions {
  flex-shrink: 0;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 20px;
  border-top: 1px solid #eee;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
}

@keyframes dash {
  to { stroke-dashoffset: -10; }
}

@media (max-width: 768px) {
  .hero-section {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-actions {
    justify-content: center;
  }
  
  .workspace-item {
    flex-direction: column;
    text-align: center;
  }
  
  .workspace-stats {
    justify-content: center;
  }
}
</style>