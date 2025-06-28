<template>
  <div class="landing-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">
            Turn scattered thoughts into 
            <span class="highlight">structured startup ideas</span>
          </h1>
          <p class="hero-subtitle">
            Stop losing brilliant insights in endless docs and chat threads. Ideanation uses AI to help entrepreneurs capture, organize, and develop ideas into fundable businesses.
          </p>
          
          <div class="hero-stats">
            <div class="stat">
              <span class="stat-number">10+</span>
              <span class="stat-label">Business frameworks</span>
            </div>
            <div class="stat">
              <span class="stat-number">5min</span>
              <span class="stat-label">To structured idea</span>
            </div>
            <div class="stat">
              <span class="stat-number">AI-powered</span>
              <span class="stat-label">Insights & guidance</span>
            </div>
          </div>

          <div class="hero-actions">
            <button class="btn-primary" @click="startNewIdea">
              Start Building Your Idea
            </button>
            <button class="btn-secondary" @click="scrollToDemo">
              See How It Works
            </button>
          </div>

          <div class="social-proof">
            <p class="proof-text">Trusted by entrepreneurs, product managers, and business students</p>
          </div>
        </div>
        
        <div class="hero-visual">
          <div class="idea-graph-preview">
            <div class="graph-container">
              <svg width="400" height="300" class="preview-graph">
                <!-- Central Idea Node -->
                <circle cx="200" cy="150" r="25" fill="#1a1a1a" stroke="#333" stroke-width="2" class="central-node"/>
                <text x="200" y="155" text-anchor="middle" fill="white" font-size="12" font-weight="600">Idea</text>
                
                <!-- Problem Nodes -->
                <circle cx="120" cy="80" r="18" fill="white" stroke="#1a1a1a" stroke-width="2" class="node"/>
                <text x="120" y="85" text-anchor="middle" fill="#1a1a1a" font-size="10">Problem</text>
                
                <!-- Customer Node -->
                <circle cx="280" cy="80" r="18" fill="white" stroke="#1a1a1a" stroke-width="2" class="node"/>
                <text x="280" y="85" text-anchor="middle" fill="#1a1a1a" font-size="10">Customer</text>
                
                <!-- Solution Node -->
                <circle cx="120" cy="220" r="18" fill="white" stroke="#1a1a1a" stroke-width="2" class="node"/>
                <text x="120" y="225" text-anchor="middle" fill="#1a1a1a" font-size="10">Solution</text>
                
                <!-- Feature Node -->
                <circle cx="280" cy="220" r="18" fill="white" stroke="#1a1a1a" stroke-width="2" class="node"/>
                <text x="280" y="225" text-anchor="middle" fill="#1a1a1a" font-size="10">Feature</text>
                
                <!-- Connecting Lines -->
                <line x1="175" y1="130" x2="138" y2="98" stroke="#666" stroke-width="2" class="connection"/>
                <line x1="225" y1="130" x2="262" y2="98" stroke="#666" stroke-width="2" class="connection"/>
                <line x1="175" y1="170" x2="138" y2="202" stroke="#666" stroke-width="2" class="connection"/>
                <line x1="225" y1="170" x2="262" y2="202" stroke="#666" stroke-width="2" class="connection"/>
                
                <!-- Animated pulse -->
                <circle cx="200" cy="150" r="25" fill="none" stroke="#1a1a1a" stroke-width="1" opacity="0.3" class="pulse-ring"/>
              </svg>
            </div>
            <div class="graph-caption">
              <p>Your ideas become interconnected knowledge graphs</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Problem Section -->
    <section class="problem-section">
      <div class="section-content">
        <h2 class="section-title">The entrepreneur's dilemma</h2>
        <div class="problems-grid">
          <div class="problem-card">
            <div class="problem-icon">📝</div>
            <h3>Scattered everywhere</h3>
            <p>Ideas live in Notion, Google Docs, Slack DMs, and ChatGPT threads. Nothing connects.</p>
          </div>
          <div class="problem-card">
            <div class="problem-icon">🧠</div>
            <h3>Lost insights</h3>
            <p>Brilliant thoughts from AI conversations disappear. Past research gets forgotten and repeated.</p>
          </div>
          <div class="problem-card">
            <div class="problem-icon">⚡</div>
            <h3>Framework overload</h3>
            <p>Business Model Canvas, Lean Canvas, Design Sprints—too many templates, not enough guidance.</p>
          </div>
          <div class="problem-card">
            <div class="problem-icon">🎯</div>
            <h3>Missing pieces</h3>
            <p>You know something's incomplete but can't identify what. No clear path from idea to fundable business.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Solution Section -->
    <section class="solution-section" ref="demoSection">
      <div class="section-content">
        <h2 class="section-title">One conversation. Complete business structure.</h2>
        <p class="section-subtitle">
          Chat with AI to capture your idea. Watch it automatically organize into the atomic pieces 
          that investors and customers need to see.
        </p>
        
        <div class="demo-flow">
          <div class="demo-step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3>Chat naturally</h3>
              <p>"I want to build a tool that helps remote teams stay connected"</p>
              <div class="step-visual chat-bubble">
                <span class="typing-indicator">AI is structuring your idea...</span>
              </div>
            </div>
          </div>
          
          <div class="demo-step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3>Watch it structure</h3>
              <p>AI extracts problems, customers, solutions, and relationships automatically</p>
              <div class="step-visual mini-graph">
                <div class="mini-node">Problem</div>
                <div class="mini-node">Customer</div>
                <div class="mini-node">Solution</div>
              </div>
            </div>
          </div>
          
          <div class="demo-step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3>Generate artifacts</h3>
              <p>Export pitch decks, business plans, and specifications instantly</p>
              <div class="step-visual artifacts">
                <div class="artifact">📊 Pitch Deck</div>
                <div class="artifact">📋 Business Plan</div>
                <div class="artifact">🎯 GTM Strategy</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <div class="section-content">
        <h2 class="section-title">Everything you need to go from idea to fundable business</h2>
        
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🧠</div>
            <h3>AI-Powered Structuring</h3>
            <p>Automatically organize thoughts into problems, customers, solutions, and market opportunities using proven business frameworks.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">🕸️</div>
            <h3>Visual Knowledge Graph</h3>
            <p>See how every piece of your idea connects. Identify gaps and strengthen relationships between components.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">📄</div>
            <h3>Instant Artifacts</h3>
            <p>Generate pitch decks, business plans, elevator pitches, and technical specifications from your structured idea.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">💾</div>
            <h3>Persistent Memory</h3>
            <p>Never lose an insight again. All conversations and iterations are saved and searchable.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">🎯</div>
            <h3>Guided Development</h3>
            <p>AI guides you through proven frameworks like Design Sprints and Business Model Canvas.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">🚀</div>
            <h3>MVP Focus</h3>
            <p>Stay focused on what matters. Distinguish between planned features and what you need to build first.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Social Proof Section -->
    <section class="social-proof-section">
      <div class="section-content">
        <h2 class="section-title">Built for the modern entrepreneur</h2>
        
        <div class="personas-grid">
          <div class="persona-card">
            <h3>First-time Entrepreneurs</h3>
            <p>"Finally, a tool that helps me think through my idea systematically without overwhelming me with frameworks."</p>
            <div class="persona-benefits">
              <span class="benefit">✓ Guided structure</span>
              <span class="benefit">✓ Reduces overwhelm</span>
              <span class="benefit">✓ Builds confidence</span>
            </div>
          </div>
          
          <div class="persona-card">
            <h3>Serial Entrepreneurs</h3>
            <p>"I can capture and develop multiple ideas simultaneously. The knowledge graph shows connections I'd never see otherwise."</p>
            <div class="persona-benefits">
              <span class="benefit">✓ Multiple ideas</span>
              <span class="benefit">✓ Pattern recognition</span>
              <span class="benefit">✓ Faster iteration</span>
            </div>
          </div>
          
          <div class="persona-card">
            <h3>Product Managers</h3>
            <p>"Perfect for feature ideation and stakeholder communication. The auto-generated specs save hours of documentation."</p>
            <div class="persona-benefits">
              <span class="benefit">✓ Feature planning</span>
              <span class="benefit">✓ Stakeholder alignment</span>
              <span class="benefit">✓ Documentation automation</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="section-content">
        <div class="cta-content">
          <h2 class="cta-title">Ready to structure your next big idea?</h2>
          <p class="cta-subtitle">
            Join entrepreneurs who've stopped losing brilliant insights to scattered tools and forgotten conversations.
          </p>
          
          <div class="cta-actions">
            <button class="btn-primary large" @click="startNewIdea">
              Start Building Your Idea
            </button>
            <p class="cta-note">Free to start • No credit card required</p>
          </div>
          
          <div class="cta-features">
            <div class="cta-feature">
              <span class="feature-check">✓</span>
              <span>AI-powered idea structuring</span>
            </div>
            <div class="cta-feature">
              <span class="feature-check">✓</span>
              <span>Visual knowledge graphs</span>
            </div>
            <div class="cta-feature">
              <span class="feature-check">✓</span>
              <span>Instant pitch deck generation</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Recent Workspaces (if any) -->
    <section v-if="recentWorkspaces.length > 0" class="recent-workspaces-section">
      <div class="section-content">
        <h3 class="section-subtitle">Continue where you left off</h3>
        <div class="workspace-grid">
          <div 
            v-for="workspace in recentWorkspaces" 
            :key="workspace.id"
            class="workspace-card"
            @click="openWorkspace(workspace)"
          >
            <div class="workspace-info">
              <h4>{{ workspace.title }}</h4>
              <p>{{ workspace.description }}</p>
              <div class="workspace-meta">
                <span class="workspace-date">{{ formatDate(workspace.updated) }}</span>
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
const demoSection = ref<HTMLElement>()

const recentWorkspaces = computed(() => {
  return resourcesStore.workspaces
    .slice()
    .sort((a, b) => new Date(b.updated).getTime() - new Date(a.updated).getTime())
    .slice(0, 3)
})

const startNewIdea = () => {
  // Create a new workspace
  const workspace = resourcesStore.createWorkspace({
    title: 'New Startup Idea',
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

const scrollToDemo = () => {
  demoSection.value?.scrollIntoView({ behavior: 'smooth' })
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
  title: 'Ideanation - Turn Ideas Into Fundable Businesses',
  meta: [
    { name: 'description', content: 'Stop losing brilliant insights in scattered tools. Ideanation uses AI to help entrepreneurs structure ideas into fundable businesses with visual knowledge graphs and instant artifacts.' },
    { name: 'keywords', content: 'startup ideas, business planning, AI, knowledge graph, pitch deck, business model canvas, entrepreneur tools' },
    { property: 'og:title', content: 'Ideanation - Turn Ideas Into Fundable Businesses' },
    { property: 'og:description', content: 'AI-powered tool that helps entrepreneurs structure scattered thoughts into complete business plans with visual knowledge graphs.' },
    { property: 'og:type', content: 'website' }
  ]
})
</script>

<style scoped>
.landing-page {
  min-height: 100vh;
  background: #fefefe;
  color: #1a1a1a;
}

/* Hero Section */
.hero-section {
  padding: 80px 20px 120px;
  background: linear-gradient(135deg, #fefefe 0%, #f8f8f8 100%);
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}

.hero-text {
  max-width: 500px;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  color: #1a1a1a;
}

.highlight {
  color: #333;
  position: relative;
}

.highlight::after {
  content: '';
  position: absolute;
  bottom: 4px;
  left: 0;
  right: 0;
  height: 3px;
  background: #1a1a1a;
  opacity: 0.2;
}

.hero-subtitle {
  font-size: 1.25rem;
  line-height: 1.6;
  color: #666;
  margin-bottom: 2rem;
}

.hero-stats {
  display: flex;
  gap: 2rem;
  margin-bottom: 2.5rem;
  padding: 1.5rem 0;
  border-top: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.btn-primary {
  background: #1a1a1a;
  color: white;
  border: 2px solid #1a1a1a;
  padding: 16px 32px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-block;
}

.btn-primary:hover {
  background: #333;
  border-color: #333;
  transform: translateY(-1px);
}

.btn-primary.large {
  padding: 20px 40px;
  font-size: 1.125rem;
}

.btn-secondary {
  background: white;
  color: #1a1a1a;
  border: 2px solid #1a1a1a;
  padding: 16px 32px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  background: #f8f8f8;
  transform: translateY(-1px);
}

.social-proof {
  margin-top: 1rem;
}

.proof-text {
  font-size: 0.875rem;
  color: #888;
  margin: 0;
}

/* Hero Visual */
.hero-visual {
  display: flex;
  justify-content: center;
  align-items: center;
}

.idea-graph-preview {
  text-align: center;
}

.graph-container {
  background: white;
  border: 2px solid #1a1a1a;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  margin-bottom: 1rem;
}

.preview-graph .node {
  transition: all 0.3s ease;
}

.preview-graph .connection {
  stroke-dasharray: 5,5;
  animation: dash 2s linear infinite;
}

.central-node {
  animation: pulse 2s ease-in-out infinite;
}

.pulse-ring {
  animation: pulse-ring 2s ease-in-out infinite;
}

.graph-caption p {
  font-size: 0.875rem;
  color: #666;
  margin: 0;
}

@keyframes dash {
  to { stroke-dashoffset: -10; }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes pulse-ring {
  0% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.2); opacity: 0.1; }
  100% { transform: scale(1.4); opacity: 0; }
}

/* Section Styles */
.section-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1rem;
  color: #1a1a1a;
}

.section-subtitle {
  font-size: 1.25rem;
  text-align: center;
  color: #666;
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

/* Problem Section */
.problem-section {
  padding: 80px 20px;
  background: white;
}

.problems-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.problem-card {
  text-align: center;
  padding: 2rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.problem-card:hover {
  border-color: #1a1a1a;
  transform: translateY(-2px);
}

.problem-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.problem-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1a1a1a;
}

.problem-card p {
  color: #666;
  line-height: 1.6;
  margin: 0;
}

/* Solution Section */
.solution-section {
  padding: 80px 20px;
  background: #f8f8f8;
}

.demo-flow {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
  margin-top: 3rem;
}

.demo-step {
  text-align: center;
}

.step-number {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #1a1a1a;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 auto 1.5rem;
}

.step-content h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1a1a1a;
}

.step-content p {
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.step-visual {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chat-bubble {
  font-style: italic;
  color: #666;
}

.typing-indicator {
  position: relative;
}

.typing-indicator::after {
  content: '...';
  animation: typing 1.5s infinite;
}

.mini-graph {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.mini-node {
  background: #1a1a1a;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.artifacts {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.artifact {
  background: #f8f8f8;
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
}

@keyframes typing {
  0%, 60% { opacity: 1; }
  30% { opacity: 0.5; }
}

/* Features Section */
.features-section {
  padding: 80px 20px;
  background: white;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2.5rem;
  margin-top: 3rem;
}

.feature-card {
  padding: 2rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.feature-card:hover {
  border-color: #1a1a1a;
  transform: translateY(-2px);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1a1a1a;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
  margin: 0;
}

/* Social Proof Section */
.social-proof-section {
  padding: 80px 20px;
  background: #f8f8f8;
}

.personas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.persona-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  transition: all 0.2s ease;
}

.persona-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}

.persona-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1a1a1a;
}

.persona-card p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-style: italic;
}

.persona-benefits {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.benefit {
  background: #f0f0f0;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  color: #666;
}

/* CTA Section */
.cta-section {
  padding: 80px 20px;
  background: #1a1a1a;
  color: white;
  text-align: center;
}

.cta-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: white;
}

.cta-subtitle {
  font-size: 1.25rem;
  color: #ccc;
  margin-bottom: 2.5rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.cta-actions {
  margin-bottom: 2rem;
}

.cta-note {
  font-size: 0.875rem;
  color: #999;
  margin-top: 1rem;
}

.cta-features {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
  margin-top: 2rem;
}

.cta-feature {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #ccc;
}

.feature-check {
  color: #4caf50;
  font-weight: 700;
}

/* Recent Workspaces */
.recent-workspaces-section {
  padding: 60px 20px;
  background: white;
}

.workspace-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.workspace-card {
  background: #f8f8f8;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.workspace-card:hover {
  border-color: #1a1a1a;
  transform: translateY(-1px);
}

.workspace-info h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a1a1a;
}

.workspace-info p {
  margin: 0 0 1rem 0;
  color: #666;
  font-size: 0.875rem;
  line-height: 1.4;
}

.workspace-date {
  font-size: 0.75rem;
  color: #999;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: 3rem;
    text-align: center;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-stats {
    justify-content: center;
  }
  
  .hero-actions {
    justify-content: center;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .cta-title {
    font-size: 2rem;
  }
  
  .cta-features {
    flex-direction: column;
    align-items: center;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-actions {
    flex-direction: column;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
    text-align: center;
  }
  
  .hero-stats {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>