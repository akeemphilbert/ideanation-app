<template>
  <div class="canvas-container">
    <!-- Loading state -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>Loading your workspace...</p>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="error-state">
      <h3>Failed to load workspace</h3>
      <p>{{ error }}</p>
      <button @click="retryLoad" class="retry-btn">
        Try Again
      </button>
    </div>

    <!-- Canvas content -->
    <div v-else class="canvas-content">
      <!-- Workspace header -->
      <div v-if="currentWorkspace" class="workspace-header">
        <h1>{{ currentWorkspace.title }}</h1>
        <p>{{ currentWorkspace.description }}</p>
      </div>

      <!-- Resource counts -->
      <div class="resource-summary">
        <div class="resource-count">
          <span class="count">{{ ideas.length }}</span>
          <span class="label">Ideas</span>
        </div>
        <div class="resource-count">
          <span class="count">{{ problems.length }}</span>
          <span class="label">Problems</span>
        </div>
        <div class="resource-count">
          <span class="count">{{ customers.length }}</span>
          <span class="label">Customers</span>
        </div>
        <div class="resource-count">
          <span class="count">{{ products.length }}</span>
          <span class="label">Products</span>
        </div>
        <div class="resource-count">
          <span class="count">{{ features.length }}</span>
          <span class="label">Features</span>
        </div>
      </div>

      <!-- Canvas grid -->
      <div class="canvas-grid">
        <!-- Your existing canvas content here -->
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCanvasInit } from '~/composables/useCanvasInit'
import { useResourcesStore } from '~/stores/resources'

// Props
interface Props {
  workspaceId?: string
}

const props = withDefaults(defineProps<Props>(), {
  workspaceId: 'ws-001'
})

// Composables
const { initializeCanvas, isLoading, error, isCanvasInitialized } = useCanvasInit()
const resourcesStore = useResourcesStore()

// Computed
const currentWorkspace = computed(() => resourcesStore.currentWorkspace)
const ideas = computed(() => resourcesStore.ideas)
const problems = computed(() => resourcesStore.problems)
const customers = computed(() => resourcesStore.customers)
const products = computed(() => resourcesStore.products)
const features = computed(() => resourcesStore.features)

// Methods
const retryLoad = async () => {
  try {
    await initializeCanvas(props.workspaceId)
  } catch (err) {
    console.error('Retry failed:', err)
  }
}

// Initialize canvas on mount
onMounted(async () => {
  try {
    await initializeCanvas(props.workspaceId)
  } catch (err) {
    console.error('Failed to initialize canvas on mount:', err)
  }
})

// Watch for workspace ID changes
watch(() => props.workspaceId, async (newWorkspaceId) => {
  if (newWorkspaceId) {
    try {
      await initializeCanvas(newWorkspaceId)
    } catch (err) {
      console.error('Failed to initialize canvas for new workspace:', err)
    }
  }
})
</script>

<style scoped>
.canvas-container {
  position: relative;
  min-height: 100vh;
  background: #f8f9fa;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.loading-spinner {
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e3e3e3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-state {
  text-align: center;
  padding: 2rem;
}

.retry-btn {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.retry-btn:hover {
  background: #0056b3;
}

.canvas-content {
  padding: 2rem;
}

.workspace-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e3e3e3;
}

.workspace-header h1 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.workspace-header p {
  margin: 0;
  color: #666;
}

.resource-summary {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.resource-count {
  text-align: center;
}

.resource-count .count {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
  color: #007bff;
}

.resource-count .label {
  font-size: 0.875rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.canvas-grid {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  min-height: 400px;
}
</style> 