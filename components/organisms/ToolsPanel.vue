<template>
  <div class="tools-panel">
    <div class="tools-header" @click="toggleCollapsed">
      <div class="header-content">
        <h3 v-if="!isCollapsed">Tools</h3>
        <div class="tools-status" v-if="!isCollapsed">
          <span class="status-dot status-dot--ready"></span>
          Ready
        </div>
      </div>
      <div class="collapse-toggle">
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="currentColor"
          :class="{ 'rotated': !isCollapsed }"
        >
          <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
        </svg>
      </div>
    </div>
    
    <!-- Collapsed State - Icons Only -->
    <div class="tools-icons" v-if="isCollapsed">
      <button 
        class="tool-icon-button"
        @click.stop="exportBusinessModelCanvas"
        :disabled="!hasWorkspace || isExporting"
        title="Export Business Model Canvas"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
        </svg>
      </button>

      <button 
        class="tool-icon-button"
        @click.stop="generatePitchDeck"
        :disabled="!hasWorkspace || isExporting"
        title="Generate Pitch Deck"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
          <path d="M21 8V6c0-.55-.45-1-1-1s-1 .45-1 1v2h-2c-.55 0-1 .45-1 1s.45 1 1 1h2v2c0 .55.45 1 1 1s1-.45 1-1v-2h2c.55 0 1-.45 1-1s-.45-1-1-1h-2z"/>
        </svg>
      </button>

      <button 
        class="tool-icon-button"
        @click.stop="exportAllResources"
        :disabled="!hasWorkspace || isExporting"
        title="Export All Resources"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
        </svg>
      </button>

      <button 
        class="tool-icon-button"
        @click.stop="generateBoltPrompt"
        :disabled="!hasWorkspace || isExporting"
        title="Generate Bolt Prompt"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7,2V13H10V22L17,10H13L17,2H7Z"/>
        </svg>
      </button>
    </div>
    
    <!-- Expanded State - Full Content -->
    <div class="tools-content" v-if="!isCollapsed">
      <div class="tools-grid">
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
            <div class="tool-title">Business Model Canvas</div>
            <div class="tool-description">Export structured business model</div>
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
      </div>

      <!-- Export Progress -->
      <div v-if="isExporting" class="export-progress">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: exportProgress + '%' }"></div>
        </div>
        <div class="progress-text">{{ exportStatusText }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ExportDataBuilder } from '~/services/export/ExportDataBuilder'
import { MarkdownFormatter, JSONFormatter } from '~/services/export/ExportFormatter'
import { ExportType } from '~/types/export'

interface Props {
  hasWorkspace?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  hasWorkspace: false
})

const chatStore = useChatStore()
const resourcesStore = useResourcesStore()
const entitiesStore = useEntitiesStore()

const isCollapsed = ref(true) // Start collapsed by default
const isExporting = ref(false)
const exportProgress = ref(0)
const exportStatusText = ref('')

const toggleCollapsed = () => {
  isCollapsed.value = !isCollapsed.value
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
</script>

<style scoped>
/* Professional black theme matching chat interface */
.tools-panel {
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  min-width: 200px;
}

.tools-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #000;
  border-bottom: 1px solid #333;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.tools-header:hover {
  background: #111;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
}

.tools-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  letter-spacing: 0.5px;
}

.tools-status {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #888;
  font-weight: 500;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #666;
  transition: background-color 0.2s ease;
}

.status-dot--ready {
  background: #10b981;
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.3);
}

.collapse-toggle {
  margin-left: 12px;
  color: #888;
  transition: all 0.2s ease;
}

.collapse-toggle svg {
  transition: transform 0.2s ease;
}

.collapse-toggle svg.rotated {
  transform: rotate(180deg);
}

.tools-header:hover .collapse-toggle {
  color: #fff;
}

/* Collapsed State - Icons Only */
.tools-icons {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  background: #111;
  border-top: 1px solid #333;
}

.tool-icon-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: #2a2a2a;
  border: 1px solid #333;
  border-radius: 8px;
  color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.tool-icon-button:hover:not(:disabled) {
  background: #4f46e5;
  border-color: #4f46e5;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(79, 70, 229, 0.3);
}

.tool-icon-button:disabled {
  background: #1a1a1a;
  border-color: #222;
  color: #555;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* Expanded State - Full Content */
.tools-content {
  padding: 20px;
  transition: all 0.3s ease;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
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

.export-progress {
  background: #2a2a2a;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 16px;
  margin-top: 16px;
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

/* Responsive adjustments */
@media (max-width: 1024px) {
  .tools-panel {
    min-width: 180px;
  }
  
  .tools-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  
  .tool-button {
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
  .tools-panel {
    min-width: 160px;
  }
  
  .tools-icons {
    flex-wrap: wrap;
    gap: 6px;
    padding: 10px 12px;
  }
  
  .tool-icon-button {
    width: 36px;
    height: 36px;
  }
  
  .tools-content {
    padding: 16px;
  }
  
  .tools-header {
    padding: 12px 16px;
  }
  
  .tools-header h3 {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .tools-grid {
    grid-template-columns: 1fr;
  }
  
  .tool-button {
    flex-direction: column;
    text-align: center;
    gap: 8px;
    padding: 16px 12px;
  }
  
  .tool-content {
    text-align: center;
  }
  
  .tools-icons {
    justify-content: center;
  }
}
</style>