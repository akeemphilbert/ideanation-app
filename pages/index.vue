<template>
  <div class="landing-page">
    <!-- Navigation -->
    <nav class="main-nav">
      <div class="nav-container">
        <div class="nav-brand">
          <div class="brand-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="8" cy="8" r="3" fill="#6366f1" stroke="#4f46e5" stroke-width="1.5"/>
              <circle cx="24" cy="8" r="3" fill="#06b6d4" stroke="#0891b2" stroke-width="1.5"/>
              <circle cx="16" cy="24" r="3" fill="#10b981" stroke="#059669" stroke-width="1.5"/>
              <line x1="11" y1="8" x2="21" y2="8" stroke="#6b7280" stroke-width="1.5"/>
              <line x1="10" y1="11" x2="14" y2="21" stroke="#6b7280" stroke-width="1.5"/>
              <line x1="22" y1="11" x2="18" y2="21" stroke="#6b7280" stroke-width="1.5"/>
            </svg>
          </div>
          <span class="brand-text">Ideanation</span>
        </div>
        
        <div class="nav-links">
          <a href="#features" class="nav-link">Features</a>
          <a href="#how-it-works" class="nav-link">How it works</a>
          <a href="#pricing" class="nav-link">Pricing</a>
          <a href="https://github.com" class="nav-link">GitHub</a>
        </div>
        
        <div class="nav-actions">
          <a href="/login" class="nav-link">Sign in</a>
          <button class="btn-primary" @click="startNewIdea">Get started</button>
        </div>
        
        <!-- Mobile menu button -->
        <button class="mobile-menu-btn" @click="mobileMenuOpen = !mobileMenuOpen">
          <div class="hamburger" :class="{ 'active': mobileMenuOpen }">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>
      
      <!-- Mobile menu -->
      <div class="mobile-menu" :class="{ 'active': mobileMenuOpen }">
        <div class="mobile-menu-content">
          <a href="#features" class="mobile-nav-link" @click="mobileMenuOpen = false">Features</a>
          <a href="#how-it-works" class="mobile-nav-link" @click="mobileMenuOpen = false">How it works</a>
          <a href="#pricing" class="mobile-nav-link" @click="mobileMenuOpen = false">Pricing</a>
          <a href="https://github.com" class="mobile-nav-link" @click="mobileMenuOpen = false">GitHub</a>
          <div class="mobile-menu-actions">
            <a href="/login" class="mobile-nav-link">Sign in</a>
            <button class="btn-primary" @click="startNewIdea">Get started</button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-container">
        <div class="hero-content">
          <div class="hero-badge">
            <span class="badge-icon">✨</span>
            <span>AI-powered idea structuring</span>
          </div>
          
          <h1 class="hero-title">
            Transform scattered thoughts into 
            <span class="gradient-text">structured startup ideas</span>
          </h1>
          
          <p class="hero-description">
            Stop losing brilliant ideas in scattered notes. Ideanation uses AI to help you capture, 
            structure, and develop your startup concepts into comprehensive business frameworks—all 
            through natural conversation.
          </p>
          
          <div class="hero-actions">
            <button class="btn-primary btn-large" @click="startNewIdea">
              <span class="btn-icon">🚀</span>
              Start building your idea
            </button>
            <button class="btn-secondary btn-large" @click="watchDemo">
              <span class="btn-icon">▶️</span>
              Watch demo
            </button>
          </div>
          
          <div class="hero-stats">
            <div class="stat">
              <div class="stat-number">2.5k+</div>
              <div class="stat-label">Ideas structured</div>
            </div>
            <div class="stat">
              <div class="stat-number">89%</div>
              <div class="stat-label">Faster ideation</div>
            </div>
            <div class="stat">
              <div class="stat-number">4.8/5</div>
              <div class="stat-label">User rating</div>
            </div>
          </div>
        </div>
        
        <div class="hero-visual">
          <div class="visual-container">
            <!-- Interactive Knowledge Graph -->
            <div class="knowledge-graph">
              <svg width="500" height="400" viewBox="0 0 500 400" class="graph-svg">
                <!-- Background grid -->
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" stroke-width="0.5"/>
                  </pattern>
                  <linearGradient id="nodeGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#6366f1;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:1" />
                  </linearGradient>
                  <linearGradient id="nodeGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#06b6d4;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#0891b2;stop-opacity:1" />
                  </linearGradient>
                  <linearGradient id="nodeGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#10b981;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#059669;stop-opacity:1" />
                  </linearGradient>
                </defs>
                
                <rect width="100%" height="100%" fill="url(#grid)" opacity="0.3"/>
                
                <!-- Connections -->
                <g class="connections">
                  <line x1="150" y1="120" x2="250" y2="120" stroke="#e2e8f0" stroke-width="2" class="connection-line"/>
                  <line x1="150" y1="120" x2="350" y2="120" stroke="#e2e8f0" stroke-width="2" class="connection-line"/>
                  <line x1="150" y1="120" x2="200" y2="220" stroke="#e2e8f0" stroke-width="2" class="connection-line"/>
                  <line x1="250" y1="120" x2="300" y2="220" stroke="#e2e8f0" stroke-width="2" class="connection-line"/>
                  <line x1="350" y1="120" x2="300" y2="220" stroke="#e2e8f0" stroke-width="2" class="connection-line"/>
                  <line x1="200" y1="220" x2="300" y2="220" stroke="#e2e8f0" stroke-width="2" class="connection-line"/>
                </g>
                
                <!-- Nodes -->
                <g class="nodes">
                  <!-- Central Idea Node -->
                  <circle cx="250" cy="120" r="25" fill="url(#nodeGradient1)" class="node central-node"/>
                  <text x="250" y="125" text-anchor="middle" fill="white" font-size="12" font-weight="600">Idea</text>
                  
                  <!-- Problem Node -->
                  <circle cx="150" cy="120" r="20" fill="url(#nodeGradient2)" class="node"/>
                  <text x="150" y="125" text-anchor="middle" fill="white" font-size="10" font-weight="500">Problem</text>
                  
                  <!-- Customer Node -->
                  <circle cx="350" cy="120" r="20" fill="url(#nodeGradient3)" class="node"/>
                  <text x="350" y="125" text-anchor="middle" fill="white" font-size="10" font-weight="500">Customer</text>
                  
                  <!-- Solution Node -->
                  <circle cx="200" cy="220" r="18" fill="#f59e0b" class="node"/>
                  <text x="200" y="225" text-anchor="middle" fill="white" font-size="9" font-weight="500">Solution</text>
                  
                  <!-- Feature Node -->
                  <circle cx="300" cy="220" r="18" fill="#ef4444" class="node"/>
                  <text x="300" y="225" text-anchor="middle" fill="white" font-size="9" font-weight="500">Feature</text>
                </g>
                
                <!-- Floating particles -->
                <g class="particles">
                  <circle cx="100" cy="80" r="2" fill="#6366f1" opacity="0.6" class="particle"/>
                  <circle cx="400" cy="60" r="1.5" fill="#06b6d4" opacity="0.4" class="particle"/>
                  <circle cx="80" cy="300" r="2.5" fill="#10b981" opacity="0.5" class="particle"/>
                  <circle cx="420" cy="320" r="1" fill="#f59e0b" opacity="0.7" class="particle"/>
                </g>
              </svg>
              
              <!-- Floating UI Elements -->
              <div class="floating-ui chat-bubble">
                <div class="chat-header">
                  <div class="chat-avatar">🤖</div>
                  <span>AI Assistant</span>
                </div>
                <div class="chat-message">
                  "What problem does your idea solve?"
                </div>
              </div>
              
              <div class="floating-ui insight-card">
                <div class="insight-icon">💡</div>
                <div class="insight-content">
                  <div class="insight-title">Market Insight</div>
                  <div class="insight-text">87% of startups fail due to lack of market need</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="features-section">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">Everything you need to structure your startup idea</h2>
          <p class="section-description">
            From scattered thoughts to comprehensive business framework—all powered by AI
          </p>
        </div>
        
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#6366f1" stroke-width="2" stroke-linejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="#6366f1" stroke-width="2" stroke-linejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="#6366f1" stroke-width="2" stroke-linejoin="round"/>
              </svg>
            </div>
            <h3 class="feature-title">AI-Powered Structuring</h3>
            <p class="feature-description">
              Transform free-flowing thoughts into structured business components through natural conversation with AI.
            </p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="3" stroke="#06b6d4" stroke-width="2"/>
                <path d="M12 1V3" stroke="#06b6d4" stroke-width="2"/>
                <path d="M12 21V23" stroke="#06b6d4" stroke-width="2"/>
                <path d="M4.22 4.22L5.64 5.64" stroke="#06b6d4" stroke-width="2"/>
                <path d="M18.36 18.36L19.78 19.78" stroke="#06b6d4" stroke-width="2"/>
                <path d="M1 12H3" stroke="#06b6d4" stroke-width="2"/>
                <path d="M21 12H23" stroke="#06b6d4" stroke-width="2"/>
                <path d="M4.22 19.78L5.64 18.36" stroke="#06b6d4" stroke-width="2"/>
                <path d="M18.36 5.64L19.78 4.22" stroke="#06b6d4" stroke-width="2"/>
              </svg>
            </div>
            <h3 class="feature-title">Visual Knowledge Graph</h3>
            <p class="feature-description">
              See how your ideas connect with an interactive graph that reveals relationships between concepts.
            </p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="#10b981" stroke-width="2"/>
                <circle cx="9" cy="9" r="2" stroke="#10b981" stroke-width="2"/>
                <path d="M21 15L16 10L5 21" stroke="#10b981" stroke-width="2"/>
              </svg>
            </div>
            <h3 class="feature-title">Instant Artifacts</h3>
            <p class="feature-description">
              Generate pitch decks, business plans, and other essential documents directly from your structured ideas.
            </p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M17 21V13H7V21" stroke="#f59e0b" stroke-width="2"/>
                <path d="M7 13L12 8L17 13" stroke="#f59e0b" stroke-width="2"/>
                <path d="M12 8V21" stroke="#f59e0b" stroke-width="2"/>
              </svg>
            </div>
            <h3 class="feature-title">Persistent Memory</h3>
            <p class="feature-description">
              Never lose an insight again. All conversations and iterations are saved and searchable.
            </p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M16 4H18A2 2 0 0 1 20 6V18A2 2 0 0 1 18 20H6A2 2 0 0 1 4 18V6A2 2 0 0 1 6 4H8" stroke="#ef4444" stroke-width="2"/>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1" stroke="#ef4444" stroke-width="2"/>
                <path d="M9 12L11 14L15 10" stroke="#ef4444" stroke-width="2"/>
              </svg>
            </div>
            <h3 class="feature-title">Framework Integration</h3>
            <p class="feature-description">
              Built-in support for Lean Canvas, Design Sprint, and other proven startup methodologies.
            </p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M17 3A2.828 2.828 0 1 1 19.828 5.828A2.828 2.828 0 0 1 17 3ZM21 12A9 9 0 1 1 12 3" stroke="#8b5cf6" stroke-width="2"/>
                <path d="M16 12A4 4 0 1 1 12 8" stroke="#8b5cf6" stroke-width="2"/>
              </svg>
            </div>
            <h3 class="feature-title">Smart Validation</h3>
            <p class="feature-description">
              Get AI-powered insights on market fit, competitive landscape, and validation strategies.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section id="how-it-works" class="how-it-works-section">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">From idea to structured plan in minutes</h2>
          <p class="section-description">
            Our AI guides you through proven frameworks to build comprehensive startup concepts
          </p>
        </div>
        
        <div class="steps-container">
          <div class="step">
            <div class="step-visual">
              <div class="step-illustration chat-illustration">
                <div class="chat-window">
                  <div class="chat-header-bar">
                    <div class="chat-controls">
                      <div class="control red"></div>
                      <div class="control yellow"></div>
                      <div class="control green"></div>
                    </div>
                    <span>AI Assistant</span>
                  </div>
                  <div class="chat-messages">
                    <div class="message ai-message">
                      <div class="message-avatar">🤖</div>
                      <div class="message-content">What problem are you trying to solve?</div>
                    </div>
                    <div class="message user-message">
                      <div class="message-content">Remote teams struggle with async communication...</div>
                      <div class="message-avatar">👤</div>
                    </div>
                  </div>
                  <div class="typing-indicator">
                    <div class="typing-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="step-content">
              <div class="step-number">01</div>
              <h3 class="step-title">Start with conversation</h3>
              <p class="step-description">
                Simply describe your idea in natural language. Our AI asks the right questions to understand your vision and extract key components.
              </p>
            </div>
          </div>
          
          <div class="step">
            <div class="step-visual">
              <div class="step-illustration graph-illustration">
                <svg width="300" height="200" viewBox="0 0 300 200" class="step-graph">
                  <defs>
                    <linearGradient id="stepGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style="stop-color:#6366f1;stop-opacity:0.8" />
                      <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:0.8" />
                    </linearGradient>
                  </defs>
                  
                  <!-- Animated connections -->
                  <g class="step-connections">
                    <line x1="80" y1="60" x2="150" y2="60" stroke="#e2e8f0" stroke-width="2" class="step-line"/>
                    <line x1="80" y1="60" x2="220" y2="60" stroke="#e2e8f0" stroke-width="2" class="step-line"/>
                    <line x1="80" y1="60" x2="120" y2="140" stroke="#e2e8f0" stroke-width="2" class="step-line"/>
                    <line x1="150" y1="60" x2="180" y2="140" stroke="#e2e8f0" stroke-width="2" class="step-line"/>
                  </g>
                  
                  <!-- Nodes with animation -->
                  <g class="step-nodes">
                    <circle cx="80" cy="60" r="15" fill="url(#stepGradient1)" class="step-node"/>
                    <text x="80" y="65" text-anchor="middle" fill="white" font-size="8">Problem</text>
                    
                    <circle cx="150" cy="60" r="15" fill="#06b6d4" class="step-node"/>
                    <text x="150" y="65" text-anchor="middle" fill="white" font-size="8">Customer</text>
                    
                    <circle cx="220" cy="60" r="15" fill="#10b981" class="step-node"/>
                    <text x="220" y="65" text-anchor="middle" fill="white" font-size="8">Solution</text>
                    
                    <circle cx="120" cy="140" r="12" fill="#f59e0b" class="step-node"/>
                    <text x="120" y="145" text-anchor="middle" fill="white" font-size="7">Feature</text>
                    
                    <circle cx="180" cy="140" r="12" fill="#ef4444" class="step-node"/>
                    <text x="180" y="145" text-anchor="middle" fill="white" font-size="7">Market</text>
                  </g>
                </svg>
              </div>
            </div>
            <div class="step-content">
              <div class="step-number">02</div>
              <h3 class="step-title">Watch it structure</h3>
              <p class="step-description">
                See your idea transform into atomic components—problems, customers, solutions, features—connected in an intelligent knowledge graph.
              </p>
            </div>
          </div>
          
          <div class="step">
            <div class="step-visual">
              <div class="step-illustration artifacts-illustration">
                <div class="artifacts-grid">
                  <div class="artifact-card pitch-deck">
                    <div class="artifact-header">
                      <div class="artifact-icon">📊</div>
                      <span>Pitch Deck</span>
                    </div>
                    <div class="artifact-preview">
                      <div class="slide-preview">
                        <div class="slide-title">Problem</div>
                        <div class="slide-content"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="artifact-card business-plan">
                    <div class="artifact-header">
                      <div class="artifact-icon">📋</div>
                      <span>Business Plan</span>
                    </div>
                    <div class="artifact-preview">
                      <div class="plan-lines">
                        <div class="plan-line"></div>
                        <div class="plan-line"></div>
                        <div class="plan-line short"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="artifact-card canvas">
                    <div class="artifact-header">
                      <div class="artifact-icon">🎯</div>
                      <span>Lean Canvas</span>
                    </div>
                    <div class="artifact-preview">
                      <div class="canvas-grid">
                        <div class="canvas-cell"></div>
                        <div class="canvas-cell"></div>
                        <div class="canvas-cell"></div>
                        <div class="canvas-cell"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="step-content">
              <div class="step-number">03</div>
              <h3 class="step-title">Generate artifacts</h3>
              <p class="step-description">
                Instantly create pitch decks, business plans, lean canvases, and other essential documents from your structured idea components.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Social Proof Section -->
    <section class="social-proof-section">
      <div class="section-container">
        <div class="social-proof-content">
          <div class="proof-stats">
            <div class="proof-stat">
              <div class="proof-number">2,500+</div>
              <div class="proof-label">Ideas structured</div>
            </div>
            <div class="proof-stat">
              <div class="proof-number">89%</div>
              <div class="proof-label">Faster ideation process</div>
            </div>
            <div class="proof-stat">
              <div class="proof-number">4.8/5</div>
              <div class="proof-label">Average user rating</div>
            </div>
          </div>
          
          <div class="testimonials">
            <div class="testimonial">
              <div class="testimonial-content">
                "Ideanation helped me turn a vague concept into a comprehensive business plan in just 30 minutes. The AI guidance was incredible."
              </div>
              <div class="testimonial-author">
                <div class="author-avatar">👨‍💼</div>
                <div class="author-info">
                  <div class="author-name">Alex Chen</div>
                  <div class="author-title">Founder, TechStart</div>
                </div>
              </div>
            </div>
            
            <div class="testimonial">
              <div class="testimonial-content">
                "Finally, a tool that understands how entrepreneurs actually think. No more scattered notes across different apps."
              </div>
              <div class="testimonial-author">
                <div class="author-avatar">👩‍💻</div>
                <div class="author-info">
                  <div class="author-name">Sarah Johnson</div>
                  <div class="author-title">Product Manager, InnovateCo</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="section-container">
        <div class="cta-content">
          <h2 class="cta-title">Ready to structure your next big idea?</h2>
          <p class="cta-description">
            Join thousands of entrepreneurs who've transformed their scattered thoughts into structured startup plans.
          </p>
          <div class="cta-actions">
            <button class="btn-primary btn-large" @click="startNewIdea">
              <span class="btn-icon">🚀</span>
              Start for free
            </button>
            <div class="cta-note">No credit card required • 5-minute setup</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Recent Workspaces -->
    <section v-if="recentWorkspaces.length > 0" class="recent-workspaces-section">
      <div class="section-container">
        <h3 class="section-subtitle">Continue where you left off</h3>
        <div class="workspaces-grid">
          <div 
            v-for="workspace in recentWorkspaces" 
            :key="workspace.id"
            class="workspace-card"
            @click="openWorkspace(workspace)"
          >
            <div class="workspace-header">
              <div class="workspace-icon">💡</div>
              <div class="workspace-meta">
                <h4 class="workspace-title">{{ workspace.title }}</h4>
                <p class="workspace-description">{{ workspace.description }}</p>
              </div>
            </div>
            <div class="workspace-footer">
              <span class="workspace-date">{{ formatDate(workspace.updated) }}</span>
              <div class="workspace-arrow">→</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const resourcesStore = useResourcesStore()
const mobileMenuOpen = ref(false)

const recentWorkspaces = computed(() => {
  return resourcesStore.workspaces
    .slice()
    .sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime())
    .slice(0, 3)
})

const startNewIdea = () => {
  const workspace = resourcesStore.createWorkspace({
    title: 'New Workspace',
    description: 'A new workspace for your startup idea'
  })
  
  resourcesStore.setCurrentWorkspace(workspace.toJSON())
  router.push('/canvas')
}

const openWorkspace = (workspace: any) => {
  resourcesStore.setCurrentWorkspace(workspace)
  router.push('/canvas')
}

const watchDemo = () => {
  console.log('Watch demo clicked')
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
  title: 'Ideanation - Transform Ideas into Structured Startup Plans',
  meta: [
    { name: 'description', content: 'AI-powered platform that transforms scattered thoughts into structured startup ideas. Generate pitch decks, business plans, and frameworks through natural conversation.' }
  ]
})
</script>

<style scoped>
/* Base Styles */
.landing-page {
  min-height: 100vh;
  background: #ffffff;
  color: #0f172a;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

/* Navigation */
.main-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid #e2e8f0;
  height: 64px;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;
  font-size: 18px;
  color: #0f172a;
  text-decoration: none;
}

.brand-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-text {
  font-weight: 600;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav-link {
  color: #64748b;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: #0f172a;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
}

.hamburger {
  width: 24px;
  height: 18px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.hamburger span {
  width: 100%;
  height: 2px;
  background: #0f172a;
  transition: all 0.3s ease;
}

.hamburger.active span:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

.hamburger.active span:nth-child(2) {
  opacity: 0;
}

.hamburger.active span:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

.mobile-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  transform: translateY(-100%);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.mobile-menu.active {
  transform: translateY(0);
  opacity: 1;
  visibility: visible;
}

.mobile-menu-content {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.mobile-nav-link {
  color: #64748b;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 0;
}

.mobile-menu-actions {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Buttons */
.btn-primary {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3);
}

.btn-secondary {
  background: white;
  color: #64748b;
  border: 1px solid #e2e8f0;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}

.btn-secondary:hover {
  border-color: #6366f1;
  color: #6366f1;
  transform: translateY(-1px);
}

.btn-large {
  padding: 16px 32px;
  font-size: 16px;
}

.btn-icon {
  font-size: 16px;
}

/* Hero Section */
.hero-section {
  padding: 120px 0 80px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}

.hero-content {
  max-width: 500px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(99, 102, 241, 0.1);
  color: #6366f1;
  padding: 8px 16px;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 24px;
}

.badge-icon {
  font-size: 16px;
}

.hero-title {
  font-size: 48px;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 24px;
  color: #0f172a;
}

.gradient-text {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-description {
  font-size: 18px;
  line-height: 1.6;
  color: #64748b;
  margin-bottom: 32px;
}

.hero-actions {
  display: flex;
  gap: 16px;
  margin-bottom: 48px;
}

.hero-stats {
  display: flex;
  gap: 32px;
}

.stat {
  text-align: center;
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #64748b;
}

/* Hero Visual */
.hero-visual {
  display: flex;
  justify-content: center;
  align-items: center;
}

.visual-container {
  position: relative;
  width: 100%;
  max-width: 500px;
}

.knowledge-graph {
  position: relative;
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.graph-svg {
  width: 100%;
  height: auto;
}

.connection-line {
  animation: pulse-line 2s ease-in-out infinite;
}

.node {
  cursor: pointer;
  transition: all 0.3s ease;
  animation: float 3s ease-in-out infinite;
}

.node:hover {
  transform: scale(1.1);
}

.central-node {
  animation: pulse-node 2s ease-in-out infinite;
}

.particle {
  animation: float-particle 4s ease-in-out infinite;
}

.floating-ui {
  position: absolute;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  animation: float-ui 3s ease-in-out infinite;
}

.chat-bubble {
  top: 20px;
  left: -40px;
  padding: 16px;
  max-width: 200px;
}

.chat-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
}

.chat-avatar {
  font-size: 16px;
}

.chat-message {
  font-size: 14px;
  color: #0f172a;
  line-height: 1.4;
}

.insight-card {
  bottom: 40px;
  right: -60px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 220px;
}

.insight-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.insight-title {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 4px;
}

.insight-text {
  font-size: 14px;
  color: #0f172a;
  line-height: 1.3;
}

/* Sections */
.section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.section-header {
  text-align: center;
  margin-bottom: 64px;
}

.section-title {
  font-size: 36px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 16px;
  line-height: 1.2;
}

.section-subtitle {
  font-size: 24px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 32px;
}

.section-description {
  font-size: 18px;
  color: #64748b;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto;
}

/* Features Section */
.features-section {
  padding: 80px 0;
  background: white;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 32px;
}

.feature-card {
  padding: 32px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  background: white;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  border-color: #6366f1;
}

.feature-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(99, 102, 241, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.feature-title {
  font-size: 20px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 12px;
}

.feature-description {
  color: #64748b;
  line-height: 1.6;
}

/* How It Works Section */
.how-it-works-section {
  padding: 80px 0;
  background: #f8fafc;
}

.steps-container {
  display: flex;
  flex-direction: column;
  gap: 80px;
}

.step {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: center;
}

.step:nth-child(even) {
  direction: rtl;
}

.step:nth-child(even) .step-content {
  direction: ltr;
}

.step-visual {
  display: flex;
  justify-content: center;
  align-items: center;
}

.step-illustration {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.step-number {
  font-size: 14px;
  font-weight: 700;
  color: #6366f1;
  background: rgba(99, 102, 241, 0.1);
  padding: 8px 12px;
  border-radius: 8px;
  display: inline-block;
  margin-bottom: 16px;
}

.step-title {
  font-size: 28px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 16px;
}

.step-description {
  font-size: 16px;
  color: #64748b;
  line-height: 1.6;
}

/* Chat Illustration */
.chat-illustration {
  width: 300px;
}

.chat-window {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.chat-header-bar {
  background: #f8fafc;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid #e2e8f0;
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
}

.chat-controls {
  display: flex;
  gap: 6px;
}

.control {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.control.red { background: #ef4444; }
.control.yellow { background: #f59e0b; }
.control.green { background: #10b981; }

.chat-messages {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.user-message {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  flex-shrink: 0;
}

.message-content {
  background: #f1f5f9;
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 12px;
  line-height: 1.4;
  max-width: 180px;
}

.ai-message .message-content {
  background: rgba(99, 102, 241, 0.1);
  color: #6366f1;
}

.typing-indicator {
  padding: 0 16px 16px;
}

.typing-dots {
  display: flex;
  gap: 4px;
  padding: 8px 12px;
  background: #f1f5f9;
  border-radius: 12px;
  width: fit-content;
}

.typing-dots span {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #94a3b8;
  animation: typing-bounce 1.4s infinite ease-in-out;
}

.typing-dots span:nth-child(1) { animation-delay: -0.32s; }
.typing-dots span:nth-child(2) { animation-delay: -0.16s; }
.typing-dots span:nth-child(3) { animation-delay: 0; }

/* Graph Illustration */
.graph-illustration {
  width: 300px;
}

.step-graph {
  width: 100%;
  height: auto;
}

.step-line {
  animation: draw-line 2s ease-in-out infinite;
}

.step-node {
  animation: pulse-step-node 2s ease-in-out infinite;
}

/* Artifacts Illustration */
.artifacts-illustration {
  width: 300px;
}

.artifacts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.artifact-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px;
  transition: all 0.3s ease;
}

.artifact-card:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.artifact-card.pitch-deck { grid-column: 1 / -1; }

.artifact-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
}

.artifact-icon {
  font-size: 14px;
}

.artifact-preview {
  background: white;
  border-radius: 4px;
  padding: 8px;
  min-height: 40px;
}

.slide-preview {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.slide-title {
  font-size: 10px;
  font-weight: 600;
  color: #6366f1;
}

.slide-content {
  height: 20px;
  background: linear-gradient(90deg, #e2e8f0 0%, #f1f5f9 100%);
  border-radius: 2px;
}

.plan-lines {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.plan-line {
  height: 3px;
  background: #e2e8f0;
  border-radius: 2px;
}

.plan-line.short {
  width: 60%;
}

.canvas-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
}

.canvas-cell {
  height: 16px;
  background: #e2e8f0;
  border-radius: 2px;
}

/* Social Proof Section */
.social-proof-section {
  padding: 80px 0;
  background: white;
}

.social-proof-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 64px;
  align-items: center;
}

.proof-stats {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.proof-stat {
  text-align: left;
}

.proof-number {
  font-size: 32px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 8px;
}

.proof-label {
  font-size: 16px;
  color: #64748b;
}

.testimonials {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.testimonial {
  background: #f8fafc;
  border-radius: 16px;
  padding: 32px;
  border: 1px solid #e2e8f0;
}

.testimonial-content {
  font-size: 16px;
  line-height: 1.6;
  color: #0f172a;
  margin-bottom: 24px;
  font-style: italic;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 16px;
}

.author-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.author-name {
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 4px;
}

.author-title {
  font-size: 14px;
  color: #64748b;
}

/* CTA Section */
.cta-section {
  padding: 80px 0;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  text-align: center;
}

.cta-title {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 16px;
}

.cta-description {
  font-size: 18px;
  opacity: 0.9;
  margin-bottom: 32px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.cta-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.cta-note {
  font-size: 14px;
  opacity: 0.8;
}

/* Recent Workspaces Section */
.recent-workspaces-section {
  padding: 80px 0;
  background: #f8fafc;
}

.workspaces-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.workspace-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.workspace-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
  border-color: #6366f1;
}

.workspace-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
}

.workspace-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.workspace-title {
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 8px;
}

.workspace-description {
  font-size: 14px;
  color: #64748b;
  line-height: 1.4;
}

.workspace-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.workspace-date {
  font-size: 12px;
  color: #94a3b8;
}

.workspace-arrow {
  color: #6366f1;
  font-weight: 600;
}

/* Animations */
@keyframes pulse-line {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

@keyframes pulse-node {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes pulse-step-node {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
}

@keyframes float-particle {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(180deg); }
}

@keyframes float-ui {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}

@keyframes typing-bounce {
  0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
  40% { transform: scale(1); opacity: 1; }
}

@keyframes draw-line {
  0% { stroke-dasharray: 0, 100; }
  50% { stroke-dasharray: 50, 100; }
  100% { stroke-dasharray: 100, 100; }
}

/* Responsive Design */
@media (max-width: 1024px) {
  .hero-container {
    grid-template-columns: 1fr;
    gap: 48px;
    text-align: center;
  }
  
  .hero-title {
    font-size: 40px;
  }
  
  .social-proof-content {
    grid-template-columns: 1fr;
    gap: 48px;
    text-align: center;
  }
  
  .proof-stats {
    flex-direction: row;
    justify-content: center;
  }
  
  .step {
    grid-template-columns: 1fr;
    gap: 32px;
    text-align: center;
  }
  
  .step:nth-child(even) {
    direction: ltr;
  }
}

@media (max-width: 768px) {
  .nav-links,
  .nav-actions {
    display: none;
  }
  
  .mobile-menu-btn {
    display: block;
  }
  
  .hero-title {
    font-size: 32px;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .hero-stats {
    flex-direction: column;
    gap: 16px;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .section-title {
    font-size: 28px;
  }
  
  .step-title {
    font-size: 24px;
  }
  
  .proof-stats {
    flex-direction: column;
    gap: 24px;
  }
  
  .cta-title {
    font-size: 28px;
  }
}

@media (max-width: 480px) {
  .nav-container,
  .section-container {
    padding: 0 16px;
  }
  
  .hero-section {
    padding: 100px 0 60px;
  }
  
  .hero-title {
    font-size: 28px;
  }
  
  .hero-description {
    font-size: 16px;
  }
  
  .floating-ui {
    display: none;
  }
  
  .features-grid {
    gap: 24px;
  }
  
  .feature-card {
    padding: 24px;
  }
  
  .steps-container {
    gap: 48px;
  }
  
  .step-illustration {
    padding: 24px;
  }
}
</style>