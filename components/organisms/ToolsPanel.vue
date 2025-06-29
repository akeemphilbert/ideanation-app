<template>
  <div class="tools-panel">
    <!-- Expanded State - Full Content -->
    <div class="tools-content">
      <div class="tools-carousel-container">
        <div class="carousel-controls">
          <button 
            class="carousel-button prev-button" 
            @click="scrollLeft"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </button>
          
          <div class="tools-carousel" ref="carouselRef">
            <button 
              class="tool-button"
              @click="showBusinessModelCanvas"
              :disabled="!hasWorkspace"
              title="View your idea as a structured business model canvas"
            >
              <div class="tool-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
              </div>
              <div class="tool-content">
                <div class="tool-title">Business Model Canvas</div>
                <div class="tool-description">View structured business model</div>
              </div>
            </button>

            <button 
              class="tool-button"
              @click="exportBusinessModelCanvas"
              :disabled="!hasWorkspace || isExporting"
              title="Export your idea as a structured business model canvas"
            >
              <div class="tool-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
              </div>
              <div class="tool-content">
                <div class="tool-title">Export BMC</div>
                <div class="tool-description">Export business model</div>
              </div>
            </button>

            <button 
              class="tool-button"
              @click="generatePitchDeck"
              :disabled="!hasWorkspace || isExporting"
              title="Generate a professional pitch deck presentation"
            >
              <div class="tool-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                  <path d="M21 8V6c0-.55-.45-1-1-1s-1 .45-1 1v2h-2c-.55 0-1 .45-1 1s.45 1 1 1h2v2c0 .55.45 1 1 1s1-.45 1-1v-2h2c.55 0 1-.45 1-1s-.45-1-1-1h-2z"/>
                </svg>
              </div>
              <div class="tool-content">
                <div class="tool-title">Pitch Deck</div>
                <div class="tool-description">Generate presentation slides</div>
              </div>
            </button>

            <button 
              class="tool-button"
              @click="exportAllResources"
              :disabled="!hasWorkspace || isExporting"
              title="Export all resources and entities as structured data"
            >
              <div class="tool-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                </svg>
              </div>
              <div class="tool-content">
                <div class="tool-title">Export Resources</div>
                <div class="tool-description">Download all data</div>
              </div>
            </button>

            <button 
              class="tool-button"
              @click="generateBoltPrompt"
              :disabled="!hasWorkspace || isExporting"
              title="Generate a Bolt.new prompt to build your startup idea"
            >
              <div class="tool-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7,2V13H10V22L17,10H13L17,2H7Z"/>
                </svg>
              </div>
              <div class="tool-content">
                <div class="tool-title">Bolt Prompt</div>
                <div class="tool-description">Generate build prompt</div>
              </div>
            </button>
            
            <button 
              class="tool-button premium-tool"
              @click="showPremiumFeature('swot')"
              :disabled="!hasWorkspace"
              title="Generate a SWOT analysis for your idea (Premium feature)"
            >
              <div class="tool-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M9,18H7V16H9V18M9,15H7V9H9V15M13,18H11V13H13V18M13,12H11V9H13V12M17,18H15V11H17V18M17,10H15V9H17V10Z"/>
                </svg>
              </div>
              <div class="tool-content">
                <div class="tool-title">SWOT Analysis</div>
                <div class="tool-description">Premium feature</div>
              </div>
              <div class="premium-badge">PRO</div>
            </button>
            
            <button 
              class="tool-button premium-tool"
              @click="showPremiumFeature('competitor')"
              :disabled="!hasWorkspace"
              title="Analyze competitors for your idea (Premium feature)"
            >
              <div class="tool-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2,3H22V13H18V21H2V3M4,5V19H16V15H20V5H4M6,7H18V9H6V7M6,11H18V13H6V11M8,15H14V17H8V15Z"/>
                </svg>
              </div>
              <div class="tool-content">
                <div class="tool-title">Competitor Analysis</div>
                <div class="tool-description">Premium feature</div>
              </div>
              <div class="premium-badge">PRO</div>
            </button>
            
            <button 
              class="tool-button premium-tool"
              @click="showPremiumFeature('roadmap')"
              :disabled="!hasWorkspace"
              title="Create a product roadmap (Premium feature)"
            >
              <div class="tool-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2,2V4H7V8H2V10H7V14H2V16H7V20H2V22H22V20H17V16H22V14H17V10H22V8H17V4H22V2H2M9,4H15V8H9V4M9,10H15V14H9V10M9,16H15V20H9V16Z"/>
                </svg>
              </div>
              <div class="tool-content">
                <div class="tool-title">Product Roadmap</div>
                <div class="tool-description">Premium feature</div>
              </div>
              <div class="premium-badge">PRO</div>
            </button>
          </div>
          
          <button 
            class="carousel-button next-button" 
            @click="scrollRight"
            :disabled="scrollPosition >= maxScrollPosition"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L14.17 12l-5.58 5.59z"/>
            </svg>
          </button>
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
    
    <!-- Tools Manager Modal -->
    <div v-if="showToolsManagerModal" class="tools-manager-modal-overlay" @click="closeToolsManager">
      <div class="tools-manager-modal" @click.stop>
        <div class="tools-manager-header">
          <h3>Manage Tools</h3>
          <button class="close-button" @click="closeToolsManager">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
        
        <div class="tools-manager-content">
          <div class="tools-list">
            <div 
              v-for="tool in allTools" 
              :key="tool.id"
              class="tool-item"
              :class="{ 'premium-item': tool.premium && !hasPremium }"
            >
              <div class="tool-item-info">
                <div class="tool-item-icon">
                  <component :is="tool.icon" />
                </div>
                <div class="tool-item-details">
                  <div class="tool-item-title">{{ tool.title }}</div>
                  <div class="tool-item-description">{{ tool.description }}</div>
                </div>
              </div>
              
              <div class="tool-item-actions">
                <div v-if="tool.premium && !hasPremium" class="premium-tag">PRO</div>
                <label class="toggle-switch">
                  <input 
                    type="checkbox" 
                    :checked="tool.enabled"
                    @change="toggleTool(tool.id)"
                    :disabled="tool.premium && !hasPremium"
                  >
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
          
          <div class="premium-banner" v-if="!hasPremium">
            <div class="premium-banner-content">
              <div class="premium-banner-icon">⭐</div>
              <div class="premium-banner-text">
                <h4>Upgrade to Pro</h4>
                <p>Get access to all premium tools and features</p>
              </div>
              <button class="premium-button" @click="showUpgradeModal">
                Upgrade
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Premium Feature Modal -->
    <div v-if="showPremiumModal" class="premium-modal-overlay" @click="closePremiumModal">
      <div class="premium-modal" @click.stop>
        <div class="premium-modal-header">
          <h3>Premium Feature</h3>
          <button class="close-button" @click="closePremiumModal">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
        
        <div class="premium-modal-content">
          <div class="premium-feature-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
            </svg>
          </div>
          
          <h3 class="premium-feature-title">{{ premiumFeatureTitle }}</h3>
          
          <p class="premium-feature-description">
            {{ premiumFeatureDescription }}
          </p>
          
          <div class="premium-feature-benefits">
            <div class="benefit-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
              <span>Access to all premium tools</span>
            </div>
            <div class="benefit-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
              <span>Advanced analytics and insights</span>
            </div>
            <div class="benefit-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
              <span>Export in multiple formats</span>
            </div>
            <div class="benefit-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
              <span>Priority support</span>
            </div>
          </div>
          
          <div class="premium-actions">
            <button class="premium-action-button" @click="closePremiumModal">
              Maybe later
            </button>
            <button class="premium-action-button premium-action-button--primary" @click="upgradeAccount">
              Upgrade to Pro
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ExportDataBuilder } from '~/services/export/ExportDataBuilder'
import { MarkdownFormatter, JSONFormatter } from '~/services/export/ExportFormatter'
import { ExportType } from '~/types/export'
import { ref, computed, onMounted, watch } from 'vue'

interface Props {
  hasWorkspace?: boolean
}

interface Emits {
  (e: 'show-business-model-canvas'): void
}

const props = withDefaults(defineProps<Props>(), {
  hasWorkspace: false
})

const emit = defineEmits<Emits>()

const chatStore = useChatStore()
const resourcesStore = useResourcesStore()
const entitiesStore = useEntitiesStore()

const isExporting = ref(false)
const exportProgress = ref(0)
const exportStatusText = ref('')
const carouselRef = ref<HTMLElement | null>(null)
const scrollPosition = ref(0)
const maxScrollPosition = ref(0)
const visibleItems = ref(4) // Default number of visible items
const totalItems = ref(7) // Total number of tools
const currentPage = ref(0)
const showToolsManagerModal = ref(false)
const showPremiumModal = ref(false)
const premiumFeature = ref('')
const hasPremium = ref(false) // User subscription status

// Premium feature details
const premiumFeatureTitle = computed(() => {
  switch (premiumFeature.value) {
    case 'swot': return 'SWOT Analysis'
    case 'competitor': return 'Competitor Analysis'
    case 'roadmap': return 'Product Roadmap'
    default: return 'Premium Feature'
  }
})

const premiumFeatureDescription = computed(() => {
  switch (premiumFeature.value) {
    case 'swot': 
      return 'Generate a comprehensive SWOT analysis for your startup idea, identifying Strengths, Weaknesses, Opportunities, and Threats to help you strategize effectively.'
    case 'competitor': 
      return 'Analyze your competitors with our AI-powered tool that identifies market positioning, strengths, and gaps you can exploit.'
    case 'roadmap': 
      return 'Create a detailed product roadmap with milestones, timelines, and resource allocation to guide your development process.'
    default: 
      return 'This premium feature requires a Pro subscription to access.'
  }
})

// All available tools
const allTools = ref([
  {
    id: 'bmc',
    title: 'Business Model Canvas',
    description: 'View and export your business model canvas',
    icon: 'BusinessModelIcon',
    enabled: true,
    premium: false
  },
  {
    id: 'pitch',
    title: 'Pitch Deck Generator',
    description: 'Create presentation slides for investors',
    icon: 'PitchDeckIcon',
    enabled: true,
    premium: false
  },
  {
    id: 'export',
    title: 'Export Resources',
    description: 'Download all your data in various formats',
    icon: 'ExportIcon',
    enabled: true,
    premium: false
  },
  {
    id: 'bolt',
    title: 'Bolt Prompt Generator',
    description: 'Generate prompts for Bolt.new',
    icon: 'BoltIcon',
    enabled: true,
    premium: false
  },
  {
    id: 'swot',
    title: 'SWOT Analysis',
    description: 'Analyze strengths, weaknesses, opportunities, and threats',
    icon: 'SwotIcon',
    enabled: true,
    premium: true
  },
  {
    id: 'competitor',
    title: 'Competitor Analysis',
    description: 'Compare your idea with competitors',
    icon: 'CompetitorIcon',
    enabled: true,
    premium: true
  },
  {
    id: 'roadmap',
    title: 'Product Roadmap',
    description: 'Plan your product development timeline',
    icon: 'RoadmapIcon',
    enabled: true,
    premium: true
  }
])

// Icon components
const BusinessModelIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
    </svg>
  `
}

const PitchDeckIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
      <path d="M21 8V6c0-.55-.45-1-1-1s-1 .45-1 1v2h-2c-.55 0-1 .45-1 1s.45 1 1 1h2v2c0 .55.45 1 1 1s1-.45 1-1v-2h2c.55 0 1-.45 1-1s-.45-1-1-1h-2z"/>
    </svg>
  `
}

const ExportIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
    </svg>
  `
}

const BoltIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7,2V13H10V22L17,10H13L17,2H7Z"/>
    </svg>
  `
}

const SwotIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M9,18H7V16H9V18M9,15H7V9H9V15M13,18H11V13H13V18M13,12H11V9H13V12M17,18H15V11H17V18M17,10H15V9H17V10Z"/>
    </svg>
  `
}

const CompetitorIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M2,3H22V13H18V21H2V3M4,5V19H16V15H20V5H4M6,7H18V9H6V7M6,11H18V13H6V11M8,15H14V17H8V15Z"/>
    </svg>
  `
}

const RoadmapIcon = {
  template: `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M2,2V4H7V8H2V10H7V14H2V16H7V20H2V22H22V20H17V16H22V14H17V10H22V8H17V4H22V2H2M9,4H15V8H9V4M9,10H15V14H9V10M9,16H15V20H9V16Z"/>
    </svg>
  `
}

// Calculate visible items based on container width
const calculateVisibleItems = () => {
  if (!carouselRef.value) return
  
  const containerWidth = carouselRef.value.clientWidth
  const itemWidth = 200 // Approximate width of each tool button including gap
  
  visibleItems.value = Math.floor(containerWidth / itemWidth)
  maxScrollPosition.value = Math.max(0, (totalItems.value - visibleItems.value) * itemWidth)
}

// Scroll carousel left
const scrollLeft = () => {
  if (!carouselRef.value) return
  
  const itemWidth = 200 // Approximate width of each tool button including gap
  scrollPosition.value = Math.max(0, scrollPosition.value - itemWidth)
  carouselRef.value.scrollLeft = scrollPosition.value
  updateCurrentPage()
}

// Scroll carousel right
const scrollRight = () => {
  if (!carouselRef.value) return
  
  const itemWidth = 200 // Approximate width of each tool button including gap
  scrollPosition.value = Math.min(maxScrollPosition.value, scrollPosition.value + itemWidth)
  carouselRef.value.scrollLeft = scrollPosition.value
  updateCurrentPage()
}

// Go to specific page
const goToPage = (pageIndex: number) => {
  if (!carouselRef.value) return
  
  const itemWidth = 200 // Approximate width of each tool button including gap
  scrollPosition.value = Math.min(maxScrollPosition.value, pageIndex * visibleItems.value * itemWidth)
  carouselRef.value.scrollLeft = scrollPosition.value
  currentPage.value = pageIndex
}

// Update current page based on scroll position
const updateCurrentPage = () => {
  if (!carouselRef.value) return
  
  const itemWidth = 200 // Approximate width of each tool button including gap
  currentPage.value = Math.floor(scrollPosition.value / (visibleItems.value * itemWidth))
}

// Show tools manager modal
const showToolsManager = () => {
  showToolsManagerModal.value = true
}

// Close tools manager modal
const closeToolsManager = () => {
  showToolsManagerModal.value = false
}

// Toggle tool enabled state
const toggleTool = (toolId: string) => {
  const tool = allTools.value.find(t => t.id === toolId)
  if (tool) {
    if (tool.premium && !hasPremium.value) {
      // Show premium modal if trying to enable a premium tool
      premiumFeature.value = toolId
      showPremiumModal.value = true
      return
    }
    
    tool.enabled = !tool.enabled
  }
}

// Show premium feature modal
const showPremiumFeature = (feature: string) => {
  premiumFeature.value = feature
  showPremiumModal.value = true
}

// Close premium feature modal
const closePremiumModal = () => {
  showPremiumModal.value = false
}

// Show upgrade modal
const showUpgradeModal = () => {
  // Close tools manager modal
  showToolsManagerModal.value = false
  
  // Show premium feature modal with upgrade info
  premiumFeature.value = 'upgrade'
  showPremiumModal.value = true
}

// Upgrade account
const upgradeAccount = () => {
  // In a real app, this would redirect to a payment page
  chatStore.addMessage({
    type: 'ai',
    content: `🌟 To upgrade to Pro and unlock all premium features, please visit our pricing page. With Pro, you'll get access to SWOT Analysis, Competitor Analysis, Product Roadmap, and many more advanced tools!`
  })
  
  closePremiumModal()
}

const showBusinessModelCanvas = () => {
  emit('show-business-model-canvas')
}

const exportBusinessModelCanvas = async () => {
  if (!props.hasWorkspace) return
  
  isExporting.value = true
  exportProgress.value = 0
  exportStatusText.value = 'Building business model canvas...'
  
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
      content: `✅ Business Model Canvas exported successfully! The file contains your complete business model structure with ${entitiesStore.problems.length} problems, ${entitiesStore.customers.length} customers, and ${entitiesStore.features.length} features.`
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

const generatePitchDeck = async () => {
  if (!props.hasWorkspace) return
  
  isExporting.value = true
  exportProgress.value = 0
  exportStatusText.value = 'Generating pitch deck...'
  
  try {
    exportProgress.value = 30
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Build pitch deck content
    const workspace = resourcesStore.currentWorkspace
    const problems = resourcesStore.currentWorkspaceProblems
    const customers = resourcesStore.currentWorkspaceCustomers
    const products = resourcesStore.currentWorkspaceProducts
    const features = resourcesStore.currentWorkspaceFeatures
    
    exportProgress.value = 60
    exportStatusText.value = 'Creating presentation slides...'
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const pitchDeckContent = `# ${workspace?.title} - Pitch Deck

## Slide 1: Problem
${problems.map(p => `- ${p.title}: ${p.description}`).join('\n')}

## Slide 2: Solution
${products.map(p => `- ${p.title}: ${p.description}`).join('\n')}

## Slide 3: Target Market
${customers.map(c => `- ${c.title || c.fullName}: ${c.role} at ${c.organization}`).join('\n')}

## Slide 4: Key Features
${features.map(f => `- ${f.title}: ${f.description}`).join('\n')}

## Slide 5: Business Model
- Revenue Streams: To be defined
- Cost Structure: To be defined
- Key Partnerships: To be defined

## Slide 6: Market Size
- Total Addressable Market (TAM): To be researched
- Serviceable Addressable Market (SAM): To be researched
- Serviceable Obtainable Market (SOM): To be researched

## Slide 7: Competition
- Competitive Analysis: To be completed
- Competitive Advantages: To be defined

## Slide 8: Traction
- Current Progress: Early stage
- Key Metrics: To be tracked
- Milestones: To be defined

## Slide 9: Financial Projections
- Revenue Forecast: To be modeled
- Funding Requirements: To be determined
- Use of Funds: To be planned

## Slide 10: Team
- Founders: To be introduced
- Key Team Members: To be highlighted
- Advisors: To be recruited

## Slide 11: Ask
- Funding Amount: To be determined
- Use of Investment: To be specified
- Timeline: To be planned
`
    
    exportProgress.value = 90
    exportStatusText.value = 'Downloading presentation...'
    await new Promise(resolve => setTimeout(resolve, 200))
    
    // Create and download the file
    const blob = new Blob([pitchDeckContent], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${workspace?.title?.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_pitch_deck.md`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    exportProgress.value = 100
    exportStatusText.value = 'Pitch deck generated!'
    
    chatStore.addMessage({
      type: 'ai',
      content: `🎯 Pitch deck generated successfully! The presentation includes 11 slides covering problem, solution, market, and business model. You can customize it further for your specific needs.`
    })
    
  } catch (error) {
    console.error('Pitch deck generation failed:', error)
    chatStore.addMessage({
      type: 'ai',
      content: `❌ Failed to generate pitch deck. Please try again.`
    })
  } finally {
    setTimeout(() => {
      isExporting.value = false
      exportProgress.value = 0
      exportStatusText.value = ''
    }, 1000)
  }
}

const exportAllResources = async () => {
  if (!props.hasWorkspace) return
  
  isExporting.value = true
  exportProgress.value = 0
  exportStatusText.value = 'Collecting all resources...'
  
  try {
    exportProgress.value = 30
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const exportBuilder = new ExportDataBuilder()
    const exportData = await exportBuilder.buildExportData(ExportType.ALL_ENTITIES)
    
    exportProgress.value = 60
    exportStatusText.value = 'Formatting data...'
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const jsonFormatter = new JSONFormatter()
    const formattedContent = await jsonFormatter.format(exportData)
    
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
    
    const totalEntities = entitiesStore.ideas.length + entitiesStore.problems.length + 
                         entitiesStore.customers.length + entitiesStore.features.length + 
                         entitiesStore.products.length + entitiesStore.jobs.length + 
                         entitiesStore.pains.length + entitiesStore.gains.length
    
    chatStore.addMessage({
      type: 'ai',
      content: `📦 All resources exported successfully! The JSON file contains ${totalEntities} entities and ${entitiesStore.relationships.length} relationships. You can use this data for backup or integration with other tools.`
    })
    
  } catch (error) {
    console.error('Export failed:', error)
    chatStore.addMessage({
      type: 'ai',
      content: `❌ Failed to export resources. Please try again.`
    })
  } finally {
    setTimeout(() => {
      isExporting.value = false
      exportProgress.value = 0
      exportStatusText.value = ''
    }, 1000)
  }
}

const generateBoltPrompt = async () => {
  if (!props.hasWorkspace) return
  
  isExporting.value = true
  exportProgress.value = 0
  exportStatusText.value = 'Analyzing your idea...'
  
  try {
    exportProgress.value = 30
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const workspace = resourcesStore.currentWorkspace
    const problems = resourcesStore.currentWorkspaceProblems
    const customers = resourcesStore.currentWorkspaceCustomers
    const products = resourcesStore.currentWorkspaceProducts
    const features = resourcesStore.currentWorkspaceFeatures
    
    exportProgress.value = 60
    exportStatusText.value = 'Generating Bolt prompt...'
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const boltPrompt = `Build a ${workspace?.title} web application with the following requirements:

## Core Problem
${problems.map(p => `- ${p.title}: ${p.description}`).join('\n')}

## Target Users
${customers.map(c => `- ${c.title || c.fullName}: ${c.role} at ${c.organization}`).join('\n')}

## Key Features
${features.map(f => `- ${f.title}: ${f.description} (Status: ${f.status})`).join('\n')}

## Product Requirements
${products.map(p => `- ${p.title}: ${p.description}`).join('\n')}

## Technical Requirements
- Modern, responsive web application
- Clean, professional UI/UX design
- Mobile-friendly interface
- Fast loading and performance optimized
- Accessible design following WCAG guidelines

## Design Preferences
- Modern, clean aesthetic
- Intuitive navigation
- Professional color scheme
- Responsive layout for all devices
- Smooth animations and transitions

## Additional Features to Consider
- User authentication and profiles
- Dashboard with key metrics
- Search and filtering capabilities
- Data export functionality
- Real-time updates where applicable

Please create a fully functional web application that addresses these requirements with a focus on user experience and modern web development best practices.`
    
    exportProgress.value = 90
    exportStatusText.value = 'Copying to clipboard...'
    await new Promise(resolve => setTimeout(resolve, 200))
    
    // Copy to clipboard
    await navigator.clipboard.writeText(boltPrompt)
    
    exportProgress.value = 100
    exportStatusText.value = 'Prompt generated!'
    
    chatStore.addMessage({
      type: 'ai',
      content: `⚡ Bolt.new prompt generated and copied to clipboard! The prompt includes your problems, target users, key features, and technical requirements. You can now paste this into Bolt.new to build your startup idea as a web application.`
    })
    
  } catch (error) {
    console.error('Bolt prompt generation failed:', error)
    chatStore.addMessage({
      type: 'ai',
      content: `❌ Failed to generate Bolt prompt. Please try again.`
    })
  } finally {
    setTimeout(() => {
      isExporting.value = false
      exportProgress.value = 0
      exportStatusText.value = ''
    }, 1000)
  }
}

// Initialize carousel
onMounted(() => {
  calculateVisibleItems()
  window.addEventListener('resize', calculateVisibleItems)
  
  // Update total items count
  totalItems.value = allTools.value.filter(tool => tool.enabled).length
})

// Clean up event listeners
onUnmounted(() => {
  window.removeEventListener('resize', calculateVisibleItems)
})

// Watch for scroll events on the carousel
watch(() => carouselRef.value?.scrollLeft, (newScrollLeft) => {
  if (newScrollLeft !== undefined) {
    scrollPosition.value = newScrollLeft
    updateCurrentPage()
  }
})
</script>

<style scoped>
/* Professional black theme matching chat interface - FULL WIDTH */
.tools-panel {
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  width: 100%;
}

/* Expanded State - Full Content - FULL WIDTH */
.tools-content {
  padding: 20px;
  transition: all 0.3s ease;
  width: 100%;
}

/* Carousel Container */
.tools-carousel-container {
  width: 100%;
  position: relative;
}

.carousel-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.carousel-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: #2a2a2a;
  border: 1px solid #333;
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
  z-index: 10;
}

.carousel-button:hover:not(:disabled) {
  background: #4f46e5;
  border-color: #4f46e5;
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

.carousel-button:disabled {
  background: #1a1a1a;
  border-color: #222;
  color: #555;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.tools-carousel {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  scroll-behavior: smooth;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  flex: 1;
  padding: 4px;
}

.tools-carousel::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

/* Carousel Indicators */
.carousel-indicators {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #333;
  cursor: pointer;
  transition: all 0.2s ease;
}

.indicator.active {
  background: #4f46e5;
  transform: scale(1.2);
}

.indicator:hover {
  background: #4f46e5;
}

.tool-button {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #2a2a2a;
  border: 1px solid #333;
  border-radius: 8px;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  font-family: inherit;
  min-height: 80px;
  min-width: 180px;
  max-width: 220px;
  flex: 1;
  position: relative;
}

.tool-button:hover:not(:disabled) {
  background: #333;
  border-color: #4f46e5;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(79, 70, 229, 0.2);
}

.tool-button:disabled {
  background: #1a1a1a;
  border-color: #222;
  color: #555;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.tool-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #4f46e5;
  border-radius: 8px;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.tool-button:disabled .tool-icon {
  background: #333;
  color: #555;
}

.tool-content {
  flex: 1;
  min-width: 0;
}

.tool-title {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 4px;
  line-height: 1.2;
}

.tool-button:disabled .tool-title {
  color: #555;
}

.tool-description {
  font-size: 12px;
  color: #888;
  line-height: 1.3;
}

.tool-button:disabled .tool-description {
  color: #444;
}

/* Premium Tool Styling */
.premium-tool {
  border-color: #4f46e5;
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
}

.premium-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #4f46e5;
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 3px 6px;
  border-radius: 10px;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(79, 70, 229, 0.3);
}

.export-progress {
  background: #2a2a2a;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 16px;
  margin-top: 16px;
  width: 100%;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: #333;
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4f46e5, #7c3aed);
  transition: width 0.3s ease;
  border-radius: 3px;
}

.progress-text {
  font-size: 13px;
  color: #ccc;
  text-align: center;
  font-weight: 500;
}

/* Tools Manager Modal */
.tools-manager-modal-overlay {
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

.tools-manager-modal {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  animation: modalSlideIn 0.3s ease-out;
}

.tools-manager-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: #000;
  border-bottom: 1px solid #333;
  border-radius: 12px 12px 0 0;
}

.tools-manager-header h3 {
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

.tools-manager-content {
  padding: 24px;
}

.tools-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tool-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #2a2a2a;
  border: 1px solid #333;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.tool-item:hover {
  background: #333;
  border-color: #444;
}

.tool-item.premium-item {
  border-color: #4f46e5;
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
}

.tool-item-info {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.tool-item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #4f46e5;
  border-radius: 8px;
  flex-shrink: 0;
}

.tool-item-details {
  flex: 1;
  min-width: 0;
}

.tool-item-title {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 4px;
}

.tool-item-description {
  font-size: 13px;
  color: #888;
}

.tool-item-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.premium-tag {
  background: #4f46e5;
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 3px 6px;
  border-radius: 10px;
  letter-spacing: 0.5px;
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  transition: .4s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: #4f46e5;
}

input:disabled + .toggle-slider {
  background-color: #333;
  opacity: 0.5;
  cursor: not-allowed;
}

input:checked + .toggle-slider:before {
  transform: translateX(20px);
}

/* Premium Banner */
.premium-banner {
  margin-top: 24px;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  border-radius: 12px;
  padding: 20px;
  color: white;
}

.premium-banner-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.premium-banner-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.premium-banner-text {
  flex: 1;
}

.premium-banner-text h4 {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
}

.premium-banner-text p {
  margin: 0;
  font-size: 14px;
  opacity: 0.9;
}

.premium-button {
  background: white;
  color: #4f46e5;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.premium-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 255, 255, 0.3);
}

/* Premium Feature Modal */
.premium-modal-overlay {
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

.premium-modal {
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

.premium-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: #000;
  border-bottom: 1px solid #333;
  border-radius: 12px 12px 0 0;
}

.premium-modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  letter-spacing: 0.5px;
}

.premium-modal-content {
  padding: 32px 24px;
  text-align: center;
}

.premium-feature-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.premium-feature-icon svg {
  width: 64px;
  height: 64px;
  color: #4f46e5;
}

.premium-feature-title {
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 16px;
}

.premium-feature-description {
  font-size: 16px;
  color: #ccc;
  line-height: 1.6;
  margin-bottom: 24px;
}

.premium-feature-benefits {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 32px;
  text-align: left;
  background: #2a2a2a;
  border-radius: 8px;
  padding: 16px;
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #fff;
  font-size: 14px;
}

.benefit-item svg {
  color: #10b981;
  flex-shrink: 0;
}

.premium-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.premium-action-button {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  border: 1px solid #333;
  background: #2a2a2a;
  color: #ccc;
}

.premium-action-button:hover {
  background: #333;
  color: #fff;
  transform: translateY(-1px);
}

.premium-action-button--primary {
  background: #4f46e5;
  border-color: #4f46e5;
  color: white;
}

.premium-action-button--primary:hover {
  background: #4338ca;
  border-color: #4338ca;
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(79, 70, 229, 0.3);
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .tool-button {
    min-width: 160px;
    padding: 12px;
    min-height: 70px;
  }
  
  .tool-icon {
    width: 36px;
    height: 36px;
  }
  
  .tool-title {
    font-size: 13px;
  }
  
  .tool-description {
    font-size: 11px;
  }
}

@media (max-width: 768px) {
  .tools-content {
    padding: 16px;
  }
  
  .carousel-controls {
    gap: 8px;
  }
  
  .carousel-button {
    width: 28px;
    height: 28px;
  }
  
  .tool-button {
    min-width: 140px;
    padding: 10px;
    min-height: 60px;
  }
  
  .tool-icon {
    width: 32px;
    height: 32px;
  }
  
  .premium-banner-content {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
  
  .premium-actions {
    flex-direction: column;
    gap: 12px;
  }
  
  .premium-action-button {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .tools-content {
    padding: 12px;
  }
  
  .tool-button {
    min-width: 120px;
    flex-direction: column;
    text-align: center;
    gap: 8px;
    padding: 12px 8px;
  }
  
  .tool-content {
    text-align: center;
  }
  
  .tool-item-info {
    flex-direction: column;
    text-align: center;
    gap: 8px;
  }
  
  .tool-item-details {
    text-align: center;
  }
  
  .premium-modal-content {
    padding: 24px 16px;
  }
  
  .premium-feature-title {
    font-size: 20px;
  }
  
  .premium-feature-description {
    font-size: 14px;
  }
}
</style>