<template>
  <div class="landing-page">
    <!-- Navigation -->
    <nav class="main-nav">
      <div class="nav-container">
        <div class="nav-brand">
          <div class="brand-logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="8" cy="8" r="2" fill="currentColor"/>
              <circle cx="24" cy="8" r="2" fill="currentColor"/>
              <circle cx="16" cy="20" r="2" fill="currentColor"/>
              <circle cx="8" cy="24" r="2" fill="currentColor"/>
              <circle cx="24" cy="24" r="2" fill="currentColor"/>
              <path d="M8 8L24 8M8 8L16 20M24 8L16 20M16 20L8 24M16 20L24 24" stroke="currentColor" stroke-width="1.5" opacity="0.6"/>
            </svg>
          </div>
          <span class="brand-name">Ideanation</span>
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
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      
      <!-- Mobile menu -->
      <div class="mobile-menu" :class="{ 'mobile-menu--open': mobileMenuOpen }">
        <div class="mobile-menu-content">
          <a href="#features" class="mobile-nav-link" @click="mobileMenuOpen = false">Features</a>
          <a href="#how-it-works" class="mobile-nav-link" @click="mobileMenuOpen = false">How it works</a>
          <a href="#pricing" class="mobile-nav-link" @click="mobileMenuOpen = false">Pricing</a>
          <a href="https://github.com" class="mobile-nav-link" @click="mobileMenuOpen = false">GitHub</a>
          <div class="mobile-menu-divider"></div>
          <a href="/login" class="mobile-nav-link" @click="mobileMenuOpen = false">Sign in</a>
          <button class="btn-primary mobile-cta" @click="startNewIdea">Get started</button>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-container">
        <div class="hero-content">
          <div class="hero-badge">
            <span class="badge-text">Since 1851</span>
            <span class="badge-separator">•</span>
            <span class="badge-text">Trusted by entrepreneurs</span>
          </div>
          
          <h1 class="hero-title">
            Transform scattered thoughts<br>
            into <em>structured startup ideas</em>
          </h1>
          
          <p class="hero-description">
            Ideanation helps entrepreneurs organize, validate, and develop their startup concepts 
            using AI-powered frameworks and visual knowledge graphs. From initial spark to 
            investor-ready pitch.
          </p>
          
          <div class="hero-actions">
            <button class="btn-primary btn-large" @click="startNewIdea">
              Start your idea journey
            </button>
            <button class="btn-secondary btn-large" @click="learnMore">
              Watch demo
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 4L10 8L6 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
          
          <div class="hero-stats">
            <div class="stat-item">
              <div class="stat-number">2,847</div>
              <div class="stat-label">Ideas structured</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <div class="stat-number">156</div>
              <div class="stat-label">Startups launched</div>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <div class="stat-number">$12M</div>
              <div class="stat-label">Funding raised</div>
            </div>
          </div>
        </div>
        
        <div class="hero-visual">
          <div class="visual-container">
            <div class="knowledge-graph">
              <svg width="400" height="300" viewBox="0 0 400 300" class="graph-svg">
                <!-- Background grid -->
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f5f5f5" stroke-width="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" opacity="0.3"/>
                
                <!-- Connections -->
                <g class="connections">
                  <line x1="100" y1="80" x2="200" y2="80" stroke="#e0e0e0" stroke-width="2"/>
                  <line x1="100" y1="80" x2="150" y2="150" stroke="#e0e0e0" stroke-width="2"/>
                  <line x1="200" y1="80" x2="250" y2="150" stroke="#e0e0e0" stroke-width="2"/>
                  <line x1="150" y1="150" x2="250" y2="150" stroke="#e0e0e0" stroke-width="2"/>
                  <line x1="200" y1="80" x2="300" y2="120" stroke="#e0e0e0" stroke-width="2"/>
                </g>
                
                <!-- Nodes -->
                <g class="nodes">
                  <circle cx="100" cy="80" r="24" fill="#ffffff" stroke="#333333" stroke-width="2"/>
                  <text x="100" y="85" text-anchor="middle" class="node-text">💡</text>
                  
                  <circle cx="200" cy="80" r="20" fill="#ffffff" stroke="#666666" stroke-width="1.5"/>
                  <text x="200" y="85" text-anchor="middle" class="node-text">👤</text>
                  
                  <circle cx="150" cy="150" r="18" fill="#ffffff" stroke="#666666" stroke-width="1.5"/>
                  <text x="150" y="155" text-anchor="middle" class="node-text">⚠️</text>
                  
                  <circle cx="250" cy="150" r="18" fill="#ffffff" stroke="#666666" stroke-width="1.5"/>
                  <text x="250" y="155" text-anchor="middle" class="node-text">⚙️</text>
                  
                  <circle cx="300" cy="120" r="16" fill="#ffffff" stroke="#666666" stroke-width="1.5"/>
                  <text x="300" y="125" text-anchor="middle" class="node-text">📈</text>
                </g>
                
                <!-- Labels -->
                <g class="labels">
                  <text x="100" y="115" text-anchor="middle" class="label-text">Idea</text>
                  <text x="200" y="105" text-anchor="middle" class="label-text">Customer</text>
                  <text x="150" y="175" text-anchor="middle" class="label-text">Problem</text>
                  <text x="250" y="175" text-anchor="middle" class="label-text">Feature</text>
                  <text x="300" y="145" text-anchor="middle" class="label-text">Gain</text>
                </g>
              </svg>
            </div>
            
            <div class="visual-overlay">
              <div class="overlay-card">
                <div class="card-header">
                  <div class="card-icon">🎯</div>
                  <div class="card-title">AI Insight</div>
                </div>
                <div class="card-content">
                  Your customer segment shows strong problem-solution fit. Consider expanding to adjacent markets.
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
            From initial concept to investor pitch, Ideanation provides the tools and frameworks 
            used by successful entrepreneurs worldwide.
          </p>
        </div>
        
        <div class="features-grid">
          <div class="feature-card" v-for="feature in features" :key="feature.title">
            <div class="feature-icon">
              <component :is="feature.icon" />
            </div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
            <div class="feature-benefits">
              <div v-for="benefit in feature.benefits" :key="benefit" class="benefit-item">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                {{ benefit }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How it Works Section -->
    <section id="how-it-works" class="how-it-works-section">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">How Ideanation works</h2>
          <p class="section-description">
            A proven methodology refined over decades of entrepreneurial experience, 
            now powered by AI for faster insights.
          </p>
        </div>
        
        <div class="process-steps">
          <div class="step-item" v-for="(step, index) in processSteps" :key="step.title">
            <div class="step-number">{{ String(index + 1).padStart(2, '0') }}</div>
            <div class="step-content">
              <h3 class="step-title">{{ step.title }}</h3>
              <p class="step-description">{{ step.description }}</p>
            </div>
            <div class="step-visual">
              <div class="step-icon">{{ step.icon }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Social Proof Section -->
    <section class="social-proof-section">
      <div class="section-container">
        <div class="testimonial-grid">
          <div class="testimonial-card" v-for="testimonial in testimonials" :key="testimonial.name">
            <div class="testimonial-content">
              <p class="testimonial-text">"{{ testimonial.text }}"</p>
            </div>
            <div class="testimonial-author">
              <div class="author-avatar">
                <img :src="testimonial.avatar" :alt="testimonial.name" />
              </div>
              <div class="author-info">
                <div class="author-name">{{ testimonial.name }}</div>
                <div class="author-title">{{ testimonial.title }}</div>
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
            Join thousands of entrepreneurs who trust Ideanation to organize, 
            validate, and develop their startup concepts.
          </p>
          <div class="cta-actions">
            <button class="btn-primary btn-large" @click="startNewIdea">
              Start for free
            </button>
            <div class="cta-note">
              No credit card required • 14-day free trial
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Recent Workspaces -->
    <section v-if="recentWorkspaces.length > 0" class="recent-workspaces-section">
      <div class="section-container">
        <h3 class="section-subtitle">Continue where you left off</h3>
        <div class="workspace-grid">
          <div 
            v-for="workspace in recentWorkspaces" 
            :key="workspace.id"
            class="workspace-card"
            @click="openWorkspace(workspace)"
          >
            <div class="workspace-header">
              <h4 class="workspace-title">{{ workspace.title }}</h4>
              <div class="workspace-date">{{ formatDate(workspace.updated) }}</div>
            </div>
            <p class="workspace-description">{{ workspace.description }}</p>
            <div class="workspace-meta">
              <div class="meta-item">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="2" fill="currentColor"/>
                  <circle cx="3" cy="8" r="1" fill="currentColor"/>
                  <circle cx="13" cy="8" r="1" fill="currentColor"/>
                </svg>
                5 components
              </div>
              <div class="meta-item">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 8L6 12L14 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Ready to pitch
              </div>
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

const features = [
  {
    title: 'AI-Powered Structuring',
    description: 'Transform scattered thoughts into organized startup frameworks using proven methodologies.',
    icon: 'BrainIcon',
    benefits: [
      'Automatic idea categorization',
      'Framework suggestions',
      'Missing component detection'
    ]
  },
  {
    title: 'Visual Knowledge Graph',
    description: 'See how different aspects of your idea connect and influence each other.',
    icon: 'GraphIcon',
    benefits: [
      'Interactive relationship mapping',
      'Dependency visualization',
      'Impact analysis'
    ]
  },
  {
    title: 'Export & Pitch Tools',
    description: 'Generate professional pitch decks, business plans, and investor materials instantly.',
    icon: 'ExportIcon',
    benefits: [
      'Customizable templates',
      'Multiple export formats',
      'Investor-ready outputs'
    ]
  }
]

const processSteps = [
  {
    title: 'Capture your idea',
    description: 'Start with a simple conversation. Our AI helps you articulate and expand on your initial concept.',
    icon: '💭'
  },
  {
    title: 'Structure with frameworks',
    description: 'Automatically organize your thoughts using proven business frameworks like Lean Canvas and Design Sprint.',
    icon: '🏗️'
  },
  {
    title: 'Visualize relationships',
    description: 'See how customers, problems, solutions, and features connect in an interactive knowledge graph.',
    icon: '🔗'
  },
  {
    title: 'Generate artifacts',
    description: 'Export professional pitch decks, business plans, and specifications ready for investors or developers.',
    icon: '📊'
  }
]

const testimonials = [
  {
    name: 'Sarah Chen',
    title: 'Founder, TechFlow',
    text: 'Ideanation helped me organize my scattered thoughts into a coherent business plan. The AI insights were invaluable.',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2'
  },
  {
    name: 'Marcus Rodriguez',
    title: 'Serial Entrepreneur',
    text: 'The visual knowledge graph revealed connections I never saw before. It completely changed my go-to-market strategy.',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2'
  },
  {
    name: 'Emily Watson',
    title: 'Product Manager, StartupCo',
    text: 'Finally, a tool that understands how entrepreneurs actually think. The pitch deck export saved me weeks of work.',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=64&h=64&dpr=2'
  }
]

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
  
  resourcesStore.setCurrentWorkspace(workspace)
  router.push('/canvas')
}

const openWorkspace = (workspace: any) => {
  resourcesStore.setCurrentWorkspace(workspace)
  router.push('/canvas')
}

const learnMore = () => {
  // Scroll to features or show demo
  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
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
    { name: 'description', content: 'Transform scattered thoughts into structured startup ideas with AI-powered frameworks and visual knowledge graphs. From concept to investor pitch.' }
  ]
})
</script>

<style scoped>
/* Kiehl's-inspired aesthetic */
:root {
  --color-primary: #1a1a1a;
  --color-secondary: #666666;
  --color-tertiary: #999999;
  --color-background: #fefefe;
  --color-surface: #ffffff;
  --color-border: #e5e5e5;
  --color-accent: #2c5aa0;
  --font-primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --font-serif: 'Times New Roman', Times, serif;
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;
  --spacing-3xl: 64px;
  --border-radius: 2px;
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
}

* {
  box-sizing: border-box;
}

.landing-page {
  font-family: var(--font-primary);
  background-color: var(--color-background);
  color: var(--color-primary);
  line-height: 1.6;
  letter-spacing: -0.01em;
}

/* Navigation */
.main-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(254, 254, 254, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--color-border);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  text-decoration: none;
  color: var(--color-primary);
}

.brand-logo {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
}

.brand-name {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: var(--spacing-xl);
}

.nav-link {
  color: var(--color-secondary);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: var(--color-primary);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.btn-primary {
  background: var(--color-primary);
  color: white;
  border: none;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.btn-primary:hover {
  background: #333333;
  transform: translateY(-1px);
}

.btn-secondary {
  background: transparent;
  color: var(--color-primary);
  border: 1px solid var(--color-border);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.btn-secondary:hover {
  border-color: var(--color-primary);
  background: var(--color-surface);
}

.btn-large {
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: 16px;
}

.mobile-menu-btn {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--spacing-xs);
}

.mobile-menu-btn span {
  width: 20px;
  height: 2px;
  background: var(--color-primary);
  transition: all 0.2s ease;
}

.mobile-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  transform: translateY(-100%);
  opacity: 0;
  transition: all 0.3s ease;
}

.mobile-menu--open {
  transform: translateY(0);
  opacity: 1;
}

.mobile-menu-content {
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.mobile-nav-link {
  color: var(--color-primary);
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  padding: var(--spacing-sm) 0;
}

.mobile-menu-divider {
  height: 1px;
  background: var(--color-border);
  margin: var(--spacing-sm) 0;
}

.mobile-cta {
  margin-top: var(--spacing-md);
}

/* Hero Section */
.hero-section {
  padding: calc(64px + var(--spacing-3xl)) var(--spacing-lg) var(--spacing-3xl);
  background: linear-gradient(180deg, #fafafa 0%, #ffffff 100%);
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-3xl);
  align-items: center;
}

.hero-content {
  max-width: 540px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  padding: var(--spacing-xs) var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  font-size: 12px;
  font-weight: 500;
  color: var(--color-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge-separator {
  color: var(--color-border);
}

.hero-title {
  font-size: 48px;
  font-weight: 600;
  line-height: 1.1;
  margin-bottom: var(--spacing-lg);
  color: var(--color-primary);
  letter-spacing: -0.02em;
}

.hero-title em {
  font-style: italic;
  font-family: var(--font-serif);
  color: var(--color-accent);
}

.hero-description {
  font-size: 18px;
  line-height: 1.6;
  color: var(--color-secondary);
  margin-bottom: var(--spacing-xl);
  max-width: 480px;
}

.hero-actions {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-2xl);
}

.hero-stats {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-border);
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-primary);
  line-height: 1;
}

.stat-label {
  font-size: 12px;
  color: var(--color-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: var(--spacing-xs);
}

.stat-divider {
  width: 1px;
  height: 32px;
  background: var(--color-border);
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
  max-width: 400px;
}

.knowledge-graph {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-lg);
}

.graph-svg {
  width: 100%;
  height: auto;
}

.node-text {
  font-size: 14px;
  fill: var(--color-primary);
}

.label-text {
  font-size: 11px;
  fill: var(--color-secondary);
  font-weight: 500;
}

.visual-overlay {
  position: absolute;
  top: -20px;
  right: -20px;
  z-index: 10;
}

.overlay-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  padding: var(--spacing-md);
  box-shadow: var(--shadow-md);
  max-width: 200px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-xs);
}

.card-icon {
  font-size: 16px;
}

.card-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.card-content {
  font-size: 12px;
  line-height: 1.4;
  color: var(--color-secondary);
}

/* Sections */
.section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-lg);
}

.section-header {
  text-align: center;
  margin-bottom: var(--spacing-3xl);
  max-width: 640px;
  margin-left: auto;
  margin-right: auto;
}

.section-title {
  font-size: 36px;
  font-weight: 600;
  line-height: 1.2;
  margin-bottom: var(--spacing-md);
  color: var(--color-primary);
  letter-spacing: -0.02em;
}

.section-subtitle {
  font-size: 24px;
  font-weight: 600;
  line-height: 1.3;
  margin-bottom: var(--spacing-lg);
  color: var(--color-primary);
  letter-spacing: -0.01em;
}

.section-description {
  font-size: 18px;
  line-height: 1.6;
  color: var(--color-secondary);
}

/* Features Section */
.features-section {
  padding: var(--spacing-3xl) var(--spacing-lg);
  background: var(--color-surface);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--spacing-xl);
}

.feature-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  padding: var(--spacing-xl);
  transition: all 0.2s ease;
}

.feature-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.feature-icon {
  width: 48px;
  height: 48px;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-md);
  color: var(--color-primary);
}

.feature-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
  color: var(--color-primary);
}

.feature-description {
  font-size: 16px;
  line-height: 1.5;
  color: var(--color-secondary);
  margin-bottom: var(--spacing-md);
}

.feature-benefits {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.benefit-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: 14px;
  color: var(--color-secondary);
}

.benefit-item svg {
  color: var(--color-accent);
  flex-shrink: 0;
}

/* How it Works Section */
.how-it-works-section {
  padding: var(--spacing-3xl) var(--spacing-lg);
  background: var(--color-background);
}

.process-steps {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xl);
  max-width: 800px;
  margin: 0 auto;
}

.step-item {
  display: grid;
  grid-template-columns: 60px 1fr 80px;
  gap: var(--spacing-lg);
  align-items: center;
}

.step-number {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-tertiary);
  text-align: center;
  font-family: 'Courier New', monospace;
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
  color: var(--color-primary);
}

.step-description {
  font-size: 16px;
  line-height: 1.5;
  color: var(--color-secondary);
}

.step-visual {
  display: flex;
  justify-content: center;
}

.step-icon {
  font-size: 32px;
  opacity: 0.8;
}

/* Social Proof Section */
.social-proof-section {
  padding: var(--spacing-3xl) var(--spacing-lg);
  background: var(--color-surface);
}

.testimonial-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-xl);
}

.testimonial-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  padding: var(--spacing-xl);
}

.testimonial-content {
  margin-bottom: var(--spacing-md);
}

.testimonial-text {
  font-size: 16px;
  line-height: 1.6;
  color: var(--color-primary);
  font-style: italic;
  margin: 0;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.author-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid var(--color-border);
}

.author-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.author-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-primary);
}

.author-title {
  font-size: 12px;
  color: var(--color-secondary);
}

/* CTA Section */
.cta-section {
  padding: var(--spacing-3xl) var(--spacing-lg);
  background: var(--color-background);
  text-align: center;
}

.cta-content {
  max-width: 640px;
  margin: 0 auto;
}

.cta-title {
  font-size: 36px;
  font-weight: 600;
  line-height: 1.2;
  margin-bottom: var(--spacing-md);
  color: var(--color-primary);
}

.cta-description {
  font-size: 18px;
  line-height: 1.6;
  color: var(--color-secondary);
  margin-bottom: var(--spacing-xl);
}

.cta-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
}

.cta-note {
  font-size: 14px;
  color: var(--color-tertiary);
}

/* Recent Workspaces Section */
.recent-workspaces-section {
  padding: var(--spacing-2xl) var(--spacing-lg);
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
}

.workspace-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

.workspace-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  cursor: pointer;
  transition: all 0.2s ease;
}

.workspace-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.workspace-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-sm);
}

.workspace-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-primary);
  margin: 0;
}

.workspace-date {
  font-size: 12px;
  color: var(--color-tertiary);
}

.workspace-description {
  font-size: 14px;
  line-height: 1.4;
  color: var(--color-secondary);
  margin-bottom: var(--spacing-md);
}

.workspace-meta {
  display: flex;
  gap: var(--spacing-md);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: 12px;
  color: var(--color-tertiary);
}

.meta-item svg {
  flex-shrink: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .nav-links,
  .nav-actions {
    display: none;
  }
  
  .mobile-menu-btn {
    display: flex;
  }
  
  .mobile-menu {
    display: block;
  }
  
  .hero-container {
    grid-template-columns: 1fr;
    gap: var(--spacing-2xl);
    text-align: center;
  }
  
  .hero-title {
    font-size: 36px;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .hero-stats {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .section-title {
    font-size: 28px;
  }
  
  .step-item {
    grid-template-columns: 1fr;
    text-align: center;
    gap: var(--spacing-md);
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .testimonial-grid {
    grid-template-columns: 1fr;
  }
  
  .workspace-grid {
    grid-template-columns: 1fr;
  }
  
  .cta-title {
    font-size: 28px;
  }
}

@media (max-width: 480px) {
  .nav-container {
    padding: 0 var(--spacing-md);
  }
  
  .hero-section {
    padding: calc(64px + var(--spacing-2xl)) var(--spacing-md) var(--spacing-2xl);
  }
  
  .section-container {
    padding: 0 var(--spacing-md);
  }
  
  .hero-title {
    font-size: 28px;
  }
  
  .section-title {
    font-size: 24px;
  }
}
</style>