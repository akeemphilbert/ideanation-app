<template>
  <div class="bmc-container">
    <div class="bmc-header">
      <h2 class="bmc-title">Business Model Canvas</h2>
      <div class="bmc-controls">
        <div class="zoom-controls">
          <button class="btn-sketch btn-small" @click="zoomIn" title="Zoom In">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
          </button>
          <button class="btn-sketch btn-small" @click="zoomOut" title="Zoom Out">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13H5v-2h14v2z"/>
            </svg>
          </button>
          <button class="btn-sketch btn-small" @click="resetZoom" title="Reset Zoom">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </button>
        </div>
        <button class="btn-sketch export-btn" @click="exportCanvas" :disabled="isExporting">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
          </svg>
          {{ isExporting ? 'Exporting...' : 'Export' }}
        </button>
      </div>
    </div>

    <div class="bmc-canvas-container" ref="canvasContainer">
      <div class="bmc-canvas" ref="canvas" :style="{ transform: `scale(${zoomLevel})` }">
        <!-- Key Partners -->
        <div class="bmc-section key-partners">
          <div class="section-header">
            <h3 class="section-title handwritten">Key Partners</h3>
            <div class="section-number">8</div>
          </div>
          <div class="section-content">
            <div v-if="keyPartners.length === 0" class="empty-section">
              <div class="empty-icon">🤝</div>
              <p>Who are your key partners and suppliers?</p>
            </div>
            <div v-for="partner in keyPartners" :key="partner.id" class="bmc-item">
              <div class="item-content">
                <div class="item-title">{{ partner.title }}</div>
                <div class="item-description">{{ partner.description }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Key Activities -->
        <div class="bmc-section key-activities">
          <div class="section-header">
            <h3 class="section-title handwritten">Key Activities</h3>
            <div class="section-number">7</div>
          </div>
          <div class="section-content">
            <div v-if="keyActivities.length === 0" class="empty-section">
              <div class="empty-icon">⚡</div>
              <p>What key activities does your value proposition require?</p>
            </div>
            <div v-for="activity in keyActivities" :key="activity.id" class="bmc-item">
              <div class="item-content">
                <div class="item-title">{{ activity.title }}</div>
                <div class="item-description">{{ activity.description }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Key Resources -->
        <div class="bmc-section key-resources">
          <div class="section-header">
            <h3 class="section-title handwritten">Key Resources</h3>
            <div class="section-number">6</div>
          </div>
          <div class="section-content">
            <div v-if="keyResources.length === 0" class="empty-section">
              <div class="empty-icon">🏗️</div>
              <p>What key resources does your value proposition require?</p>
            </div>
            <div v-for="resource in keyResources" :key="resource.id" class="bmc-item">
              <div class="item-content">
                <div class="item-title">{{ resource.title }}</div>
                <div class="item-description">{{ resource.description }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Value Propositions -->
        <div class="bmc-section value-propositions central">
          <div class="section-header">
            <h3 class="section-title handwritten">Value Propositions</h3>
            <div class="section-number">2</div>
          </div>
          <div class="section-content">
            <div v-if="valuePropositions.length === 0" class="empty-section">
              <div class="empty-icon">💎</div>
              <p>What value do you deliver to the customer?</p>
            </div>
            <div v-for="proposition in valuePropositions" :key="proposition.id" class="bmc-item central-item">
              <div class="item-content">
                <div class="item-title">{{ proposition.title }}</div>
                <div class="item-description">{{ proposition.description }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Customer Relationships -->
        <div class="bmc-section customer-relationships">
          <div class="section-header">
            <h3 class="section-title handwritten">Customer Relationships</h3>
            <div class="section-number">4</div>
          </div>
          <div class="section-content">
            <div v-if="customerRelationships.length === 0" class="empty-section">
              <div class="empty-icon">💬</div>
              <p>What type of relationship does each customer segment expect?</p>
            </div>
            <div v-for="relationship in customerRelationships" :key="relationship.id" class="bmc-item">
              <div class="item-content">
                <div class="item-title">{{ relationship.title }}</div>
                <div class="item-description">{{ relationship.description }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Channels -->
        <div class="bmc-section channels">
          <div class="section-header">
            <h3 class="section-title handwritten">Channels</h3>
            <div class="section-number">3</div>
          </div>
          <div class="section-content">
            <div v-if="channels.length === 0" class="empty-section">
              <div class="empty-icon">📡</div>
              <p>Through which channels do you reach your customers?</p>
            </div>
            <div v-for="channel in channels" :key="channel.id" class="bmc-item">
              <div class="item-content">
                <div class="item-title">{{ channel.title }}</div>
                <div class="item-description">{{ channel.description }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Customer Segments -->
        <div class="bmc-section customer-segments">
          <div class="section-header">
            <h3 class="section-title handwritten">Customer Segments</h3>
            <div class="section-number">1</div>
          </div>
          <div class="section-content">
            <div v-if="customerSegments.length === 0" class="empty-section">
              <div class="empty-icon">👥</div>
              <p>For whom are you creating value?</p>
            </div>
            <div v-for="segment in customerSegments" :key="segment.id" class="bmc-item">
              <div class="item-content">
                <div class="item-title">{{ segment.title }}</div>
                <div class="item-description">{{ segment.description }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Cost Structure -->
        <div class="bmc-section cost-structure bottom-section">
          <div class="section-header">
            <h3 class="section-title handwritten">Cost Structure</h3>
            <div class="section-number">9</div>
          </div>
          <div class="section-content">
            <div v-if="costStructure.length === 0" class="empty-section">
              <div class="empty-icon">💰</div>
              <p>What are the most important costs inherent in your business model?</p>
            </div>
            <div v-for="cost in costStructure" :key="cost.id" class="bmc-item">
              <div class="item-content">
                <div class="item-title">{{ cost.title }}</div>
                <div class="item-description">{{ cost.description }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Revenue Streams -->
        <div class="bmc-section revenue-streams bottom-section">
          <div class="section-header">
            <h3 class="section-title handwritten">Revenue Streams</h3>
            <div class="section-number">5</div>
          </div>
          <div class="section-content">
            <div v-if="revenueStreams.length === 0" class="empty-section">
              <div class="empty-icon">💵</div>
              <p>For what value are your customers really willing to pay?</p>
            </div>
            <div v-for="stream in revenueStreams" :key="stream.id" class="bmc-item">
              <div class="item-content">
                <div class="item-title">{{ stream.title }}</div>
                <div class="item-description">{{ stream.description }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Hand-drawn connecting lines -->
        <svg class="bmc-connections" viewBox="0 0 1200 800">
          <defs>
            <filter id="roughPaper" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence baseFrequency="0.04" numOctaves="5" result="noise" seed="1"/>
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="1"/>
            </filter>
          </defs>
          
          <!-- Connecting lines with hand-drawn effect -->
          <path d="M 400 200 Q 600 150 800 200" stroke="#666" stroke-width="2" fill="none" stroke-dasharray="5,5" opacity="0.3" filter="url(#roughPaper)"/>
          <path d="M 400 400 Q 600 350 800 400" stroke="#666" stroke-width="2" fill="none" stroke-dasharray="5,5" opacity="0.3" filter="url(#roughPaper)"/>
          <path d="M 600 100 L 600 700" stroke="#666" stroke-width="1" fill="none" opacity="0.2" filter="url(#roughPaper)"/>
        </svg>
      </div>
    </div>

    <!-- Export Progress -->
    <div v-if="isExporting" class="export-progress">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: exportProgress + '%' }"></div>
      </div>
      <div class="progress-text">{{ exportStatusText }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ExportDataBuilder } from '~/services/export/ExportDataBuilder'
import { MarkdownFormatter } from '~/services/export/ExportFormatter'
import { ExportType } from '~/types/export'

const resourcesStore = useResourcesStore()
const entitiesStore = useEntitiesStore()
const chatStore = useChatStore()

const canvasContainer = ref<HTMLElement>()
const canvas = ref<HTMLElement>()
const zoomLevel = ref(1)
const isExporting = ref(false)
const exportProgress = ref(0)
const exportStatusText = ref('')

// Business Model Canvas data computed from entities
const keyPartners = computed(() => {
  // In a real implementation, you'd have specific partner entities
  // For now, we'll use a placeholder or derive from existing data
  return []
})

const keyActivities = computed(() => {
  // Map features to key activities
  return resourcesStore.currentWorkspaceFeatures.map(feature => ({
    id: feature.id,
    title: feature.title,
    description: feature.description
  }))
})

const keyResources = computed(() => {
  // Map products to key resources
  return resourcesStore.currentWorkspaceProducts.map(product => ({
    id: product.id,
    title: product.title,
    description: product.description
  }))
})

const valuePropositions = computed(() => {
  // Map problems to value propositions (solutions)
  return resourcesStore.currentWorkspaceProblems.map(problem => ({
    id: problem.id,
    title: `Solves: ${problem.title}`,
    description: problem.description
  }))
})

const customerRelationships = computed(() => {
  // Derive from customer data
  return resourcesStore.currentWorkspaceCustomers.map(customer => ({
    id: customer.id,
    title: `${customer.role} Relationship`,
    description: `Relationship with ${customer.fullName} at ${customer.organization}`
  }))
})

const channels = computed(() => {
  // Placeholder for channels - in a real app, you'd have channel entities
  return [
    {
      id: 'web',
      title: 'Web Platform',
      description: 'Online web application'
    },
    {
      id: 'mobile',
      title: 'Mobile App',
      description: 'iOS and Android applications'
    }
  ]
})

const customerSegments = computed(() => {
  // Map customers to segments
  return resourcesStore.currentWorkspaceCustomers.map(customer => ({
    id: customer.id,
    title: customer.title || customer.fullName,
    description: `${customer.role} at ${customer.organization}`
  }))
})

const costStructure = computed(() => {
  // Placeholder for costs - in a real app, you'd have cost entities
  return [
    {
      id: 'development',
      title: 'Development Costs',
      description: 'Software development and maintenance'
    },
    {
      id: 'infrastructure',
      title: 'Infrastructure',
      description: 'Hosting, servers, and cloud services'
    }
  ]
})

const revenueStreams = computed(() => {
  // Placeholder for revenue - in a real app, you'd have revenue entities
  return [
    {
      id: 'subscription',
      title: 'Subscription Model',
      description: 'Monthly/yearly subscription fees'
    },
    {
      id: 'transaction',
      title: 'Transaction Fees',
      description: 'Commission on transactions'
    }
  ]
})

const zoomIn = () => {
  zoomLevel.value = Math.min(zoomLevel.value + 0.1, 2)
}

const zoomOut = () => {
  zoomLevel.value = Math.max(zoomLevel.value - 0.1, 0.5)
}

const resetZoom = () => {
  zoomLevel.value = 1
}

const exportCanvas = async () => {
  isExporting.value = true
  exportProgress.value = 0
  exportStatusText.value = 'Building Business Model Canvas...'
  
  try {
    exportProgress.value = 30
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const exportBuilder = new ExportDataBuilder()
    const exportData = await exportBuilder.buildExportData(ExportType.BUSINESS_MODEL_CANVAS)
    
    exportProgress.value = 60
    exportStatusText.value = 'Formatting document...'
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const markdownFormatter = new MarkdownFormatter()
    const formattedContent = await markdownFormatter.format(exportData)
    
    exportProgress.value = 90
    exportStatusText.value = 'Downloading file...'
    await new Promise(resolve => setTimeout(resolve, 200))
    
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
    
    exportProgress.value = 100
    exportStatusText.value = 'Export complete!'
    
    // Show success message in chat
    chatStore.addMessage({
      type: 'ai',
      content: `✅ Business Model Canvas exported successfully! The file contains your complete business model structure.`
    })
    
  } catch (error) {
    console.error('Export failed:', error)
    chatStore.addMessage({
      type: 'ai',
      content: `❌ Failed to export Business Model Canvas. Please try again.`
    })
  } finally {
    setTimeout(() => {
      isExporting.value = false
      exportProgress.value = 0
      exportStatusText.value = ''
    }, 1000)
  }
}
</script>

<style scoped>
.bmc-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--color-background);
  font-family: var(--font-body);
}

.bmc-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: white;
  border-bottom: 2px solid var(--color-primary);
}

.bmc-title {
  margin: 0;
  font-size: 1.8rem;
  color: var(--color-primary);
  font-family: var(--font-handwritten);
  font-weight: 700;
  text-shadow: 1px 1px 0px rgba(0,0,0,0.1);
  transform: rotate(-0.5deg);
}

.bmc-controls {
  display: flex;
  gap: 16px;
  align-items: center;
}

.zoom-controls {
  display: flex;
  gap: 8px;
}

.btn-sketch {
  background: white;
  border: 2px solid var(--color-primary);
  color: var(--color-primary);
  padding: 8px 12px;
  font-family: var(--font-handwritten);
  font-size: 14px;
  font-weight: 400;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  transform: rotate(-0.2deg);
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-sketch:hover {
  transform: rotate(0.2deg) scale(1.05);
  box-shadow: 4px 4px 0px var(--color-secondary);
}

.btn-sketch:active {
  transform: rotate(-0.1deg) scale(0.98);
  box-shadow: 2px 2px 0px var(--color-secondary);
}

.btn-small {
  padding: 6px 8px;
  font-size: 12px;
}

.export-btn {
  background: var(--color-primary);
  color: white;
  padding: 10px 16px;
  font-weight: 600;
}

.export-btn:hover {
  background: var(--color-accent);
}

.export-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: rotate(-0.2deg);
}

.bmc-canvas-container {
  flex: 1;
  overflow: auto;
  background: white;
  position: relative;
  padding: 20px;
}

.bmc-canvas {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  gap: 16px;
  min-width: 1200px;
  min-height: 800px;
  transform-origin: top left;
  transition: transform 0.3s ease;
  position: relative;
}

.bmc-connections {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.bmc-section {
  background: white;
  border: 3px solid var(--color-primary);
  border-radius: 8px;
  padding: 16px;
  position: relative;
  transform: rotate(-0.3deg);
  box-shadow: 4px 4px 0px rgba(0,0,0,0.1);
  z-index: 2;
  display: flex;
  flex-direction: column;
  min-height: 200px;
}

.bmc-section:nth-child(even) {
  transform: rotate(0.2deg);
}

.bmc-section.central {
  transform: rotate(0deg);
  border-width: 4px;
  box-shadow: 6px 6px 0px rgba(0,0,0,0.15);
  background: #f9f9f9;
}

.bmc-section.bottom-section {
  grid-column: span 2;
  min-height: 150px;
}

/* Grid positioning */
.key-partners {
  grid-column: 1;
  grid-row: 1 / 3;
}

.key-activities {
  grid-column: 2;
  grid-row: 1;
}

.key-resources {
  grid-column: 2;
  grid-row: 2;
}

.value-propositions {
  grid-column: 3;
  grid-row: 1 / 3;
}

.customer-relationships {
  grid-column: 4;
  grid-row: 1;
}

.channels {
  grid-column: 4;
  grid-row: 2;
}

.customer-segments {
  grid-column: 5;
  grid-row: 1 / 3;
}

.cost-structure {
  grid-column: 1 / 4;
  grid-row: 3;
}

.revenue-streams {
  grid-column: 4 / 6;
  grid-row: 3;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e0e0e0;
}

.section-title {
  margin: 0;
  font-size: 1rem;
  color: var(--color-primary);
  font-family: var(--font-handwritten);
  font-weight: 700;
  line-height: 1.2;
  flex: 1;
}

.section-number {
  width: 24px;
  height: 24px;
  background: var(--color-primary);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  font-family: var(--font-handwritten);
  flex-shrink: 0;
}

.section-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.empty-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--color-secondary);
  padding: 20px;
  flex: 1;
}

.empty-icon {
  font-size: 2rem;
  margin-bottom: 8px;
  opacity: 0.5;
}

.empty-section p {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.4;
  font-style: italic;
}

.bmc-item {
  background: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 8px;
  transform: rotate(0.1deg);
  transition: all 0.2s ease;
}

.bmc-item:nth-child(even) {
  transform: rotate(-0.1deg);
}

.bmc-item:hover {
  transform: rotate(0deg) scale(1.02);
  box-shadow: 2px 2px 0px rgba(0,0,0,0.1);
}

.central-item {
  background: #fff;
  border-color: var(--color-primary);
  border-width: 2px;
}

.item-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-title {
  font-weight: 600;
  color: var(--color-primary);
  font-size: 0.9rem;
  font-family: var(--font-handwritten);
}

.item-description {
  font-size: 0.8rem;
  color: var(--color-secondary);
  line-height: 1.3;
}

.export-progress {
  background: white;
  border-top: 2px solid var(--color-primary);
  padding: 16px 20px;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: #e0e0e0;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: var(--color-primary);
  transition: width 0.3s ease;
  border-radius: 3px;
}

.progress-text {
  text-align: center;
  font-size: 0.9rem;
  color: var(--color-secondary);
  font-family: var(--font-handwritten);
}

/* Responsive design */
@media (max-width: 1400px) {
  .bmc-canvas {
    min-width: 1000px;
    min-height: 700px;
  }
  
  .bmc-section {
    min-height: 180px;
  }
  
  .bottom-section {
    min-height: 120px;
  }
}

@media (max-width: 1200px) {
  .bmc-canvas {
    min-width: 900px;
    min-height: 600px;
  }
  
  .bmc-section {
    min-height: 160px;
    padding: 12px;
  }
  
  .section-title {
    font-size: 0.9rem;
  }
  
  .item-title {
    font-size: 0.8rem;
  }
  
  .item-description {
    font-size: 0.7rem;
  }
}

@media (max-width: 768px) {
  .bmc-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .bmc-controls {
    justify-content: space-between;
  }
  
  .bmc-canvas-container {
    padding: 10px;
  }
  
  .bmc-canvas {
    min-width: 800px;
    min-height: 500px;
  }
  
  .bmc-section {
    min-height: 140px;
    padding: 10px;
  }
  
  .section-title {
    font-size: 0.8rem;
  }
  
  .empty-section {
    padding: 15px;
  }
  
  .empty-icon {
    font-size: 1.5rem;
  }
  
  .empty-section p {
    font-size: 0.8rem;
  }
}

/* Custom scrollbar */
.bmc-canvas-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.bmc-canvas-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.bmc-canvas-container::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}

.bmc-canvas-container::-webkit-scrollbar-thumb:hover {
  background: #999;
}
</style>