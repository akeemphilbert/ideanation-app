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
            @click="learnMore"
          >
            Learn More
          </button>
        </div>

        <!-- Recent Workspaces -->
        <div v-if="recentWorkspaces.length > 0" class="recent-workspaces">
          <h3 class="handwritten">Recent Workspaces</h3>
          <div class="workspace-list">
            <div 
              v-for="workspace in recentWorkspaces" 
              :key="workspace.id"
              class="workspace-item sketch-border"
              @click="openWorkspace(workspace)"
            >
              <div class="workspace-info">
                <h4 class="handwritten">{{ workspace.title }}</h4>
                <p class="workspace-description">{{ workspace.description }}</p>
                <div class="workspace-meta">
                  <span class="workspace-date">{{ formatDate(workspace.updated) }}</span>
                </div>
              </div>
            </div>
          </div>
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
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const resourcesStore = useResourcesStore()

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

const recentWorkspaces = computed(() => {
  return resourcesStore.workspaces
    .slice()
    .sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime())
    .slice(0, 3)
})

const startNewIdea = () => {
  // Create a new workspace
  const workspace = resourcesStore.createWorkspace({
    title: 'New Workspace',
    description: 'A new workspace for your startup idea'
  })
  
  // Set as current workspace
  resourcesStore.setCurrentWorkspace(workspace)
  
  // Navigate to canvas
  router.push('/canvas')
}

const openWorkspace = (workspace: any) => {
  resourcesStore.setCurrentWorkspace(workspace)
  router.push('/canvas')
}

const learnMore = () => {
  // Scroll to features or show modal
  console.log('Learn more clicked')
}

const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
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
  margin-bottom: 2rem;
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

.recent-workspaces {
  margin-top: 2rem;
}

.recent-workspaces h3 {
  margin: 0 0 1rem 0;
  font-size: 1.3rem;
  color: var(--color-primary);
}

.workspace-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.workspace-item {
  padding: 1rem;
  cursor: pointer;
  transition: transform 0.2s ease;
  transform: rotate(0.1deg);
}

.workspace-item:nth-child(even) {
  transform: rotate(-0.1deg);
}

.workspace-item:hover {
  transform: rotate(0deg) scale(1.02);
}

.workspace-info h4 {
  margin: 0 0 0.3rem 0;
  font-size: 1rem;
  color: var(--color-primary);
}

.workspace-description {
  margin: 0 0 0.5rem 0;
  font-size: 0.8rem;
  color: var(--color-secondary);
  line-height: 1.3;
}

.workspace-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.workspace-date {
  font-size: 0.7rem;
  color: var(--color-secondary);
  font-family: var(--font-handwritten);
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
}
</style>