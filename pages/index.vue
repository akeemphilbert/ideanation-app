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
          <span class="brand-name">Ideanation</span>
        </div>

        <div class="nav-links">
          <a href="#features" class="nav-link">Features</a>
          <a href="#how-it-works" class="nav-link">How it works</a>
          <a href="#pricing" class="nav-link">Pricing</a>
        </div>

        <div class="nav-actions">
          <template v-if="user">
            <div class="user-menu" ref="userMenuRef">
              <button class="user-button" @click="toggleUserMenu">
                <div class="user-avatar">
                  <img 
                    v-if="profile?.avatar_url" 
                    :src="profile.avatar_url" 
                    :alt="profile.full_name || user.email"
                    class="avatar-image"
                  />
                  <div v-else class="avatar-initials">
                    {{ getUserInitials() }}
                  </div>
                </div>
                <span class="user-name">{{ profile?.full_name || user.email }}</span>
                <svg class="chevron" :class="{ 'chevron-open': showUserMenu }" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M4.427 9.573L8 6l3.573 3.573a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708z"/>
                </svg>
              </button>
              
              <div v-if="showUserMenu" class="user-dropdown">
                <div class="dropdown-header">
                  <div class="user-info">
                    <div class="user-name-full">{{ profile?.full_name || 'User' }}</div>
                    <div class="user-email">{{ user.email }}</div>
                  </div>
                </div>
                <div class="dropdown-divider"></div>
                <div class="dropdown-items">
                  <button class="dropdown-item" @click="goToCanvas">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0z"/>
                      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                    </svg>
                    Go to Canvas
                  </button>
                  <button class="dropdown-item" @click="handleSignOut">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                      <path d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                    </svg>
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <NuxtLink to="/login" class="btn-secondary">Sign in</NuxtLink>
            <NuxtLink to="/login" class="btn-primary">Get started</NuxtLink>
          </template>
        </div>

        <!-- Mobile menu button -->
        <button class="mobile-menu-button" @click="toggleMobileMenu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- Mobile menu -->
      <div v-if="showMobileMenu" class="mobile-menu">
        <div class="mobile-nav-links">
          <a href="#features" class="mobile-nav-link" @click="closeMobileMenu">Features</a>
          <a href="#how-it-works" class="mobile-nav-link" @click="closeMobileMenu">How it works</a>
          <a href="#pricing" class="mobile-nav-link" @click="closeMobileMenu">Pricing</a>
        </div>
        <div class="mobile-nav-actions">
          <template v-if="user">
            <button class="mobile-nav-button" @click="goToCanvas">Go to Canvas</button>
            <button class="mobile-nav-button secondary" @click="handleSignOut">Sign out</button>
          </template>
          <template v-else>
            <NuxtLink to="/login" class="mobile-nav-button secondary" @click="closeMobileMenu">Sign in</NuxtLink>
            <NuxtLink to="/login" class="mobile-nav-button" @click="closeMobileMenu">Get started</NuxtLink>
          </template>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-container">
        <div class="hero-content">
          <div class="hero-badge">
            <span class="badge-text">Make your dreams a reality</span>
          </div>
          
          <h1 class="hero-title">
            Everyone has great ideas
            <span class="gradient-text">build yours</span>
          </h1>
          
          <p class="hero-description">
            Ideanation helps entrepreneurs organize their ideas using proven frameworks, 
            AI-powered insights, and visual knowledge graphs. By structuring your idea 
            you can share with others or build with Bolt. Build your idea with confidence.
          </p>
          
          <div class="hero-actions">
            <NuxtLink to="/login" class="btn-primary btn-large">
              Start building for free
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
            </NuxtLink>
            <button class="btn-secondary btn-large" @click="scrollToDemo">
              See how it works
            </button>
          </div>

          <div class="hero-stats">
            <div class="stat">
              <div class="stat-number">10x</div>
              <div class="stat-label">Faster idea structuring</div>
            </div>
            <div class="stat">
              <div class="stat-number">5+</div>
              <div class="stat-label">Business frameworks</div>
            </div>
            <div class="stat">
              <div class="stat-number">AI</div>
              <div class="stat-label">Powered insights</div>
            </div>
          </div>
        </div>
        
        <div class="hero-visual">
          <div class="visual-container">
            <div class="graph-preview">
              <svg width="400" height="300" viewBox="0 0 400 300" class="preview-svg">
                <!-- Background grid -->
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" stroke-width="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                
                <!-- Nodes -->
                <g class="nodes">
                  <circle cx="100" cy="80" r="25" fill="#fef3c7" stroke="#f59e0b" stroke-width="2" class="node problem-node"/>
                  <circle cx="300" cy="80" r="25" fill="#dbeafe" stroke="#3b82f6" stroke-width="2" class="node customer-node"/>
                  <circle cx="200" cy="180" r="25" fill="#dcfce7" stroke="#10b981" stroke-width="2" class="node solution-node"/>
                  <circle cx="120" cy="220" r="20" fill="#fce7f3" stroke="#ec4899" stroke-width="2" class="node pain-node"/>
                  <circle cx="280" cy="220" r="20" fill="#e0e7ff" stroke="#6366f1" stroke-width="2" class="node gain-node"/>
                </g>
                
                <!-- Connections -->
                <g class="connections">
                  <line x1="125" y1="80" x2="275" y2="80" stroke="#6b7280" stroke-width="2" stroke-dasharray="5,5" class="connection"/>
                  <line x1="110" y1="100" x2="190" y2="160" stroke="#6b7280" stroke-width="2" stroke-dasharray="5,5" class="connection"/>
                  <line x1="290" y1="100" x2="210" y2="160" stroke="#6b7280" stroke-width="2" stroke-dasharray="5,5" class="connection"/>
                  <line x1="130" y1="200" x2="180" y2="180" stroke="#6b7280" stroke-width="2" stroke-dasharray="5,5" class="connection"/>
                  <line x1="270" y1="200" x2="220" y2="180" stroke="#6b7280" stroke-width="2" stroke-dasharray="5,5" class="connection"/>
                </g>
                
                <!-- Labels -->
                <g class="labels">
                  <text x="100" y="85" text-anchor="middle" class="node-label" font-size="10" fill="#374151">Problem</text>
                  <text x="300" y="85" text-anchor="middle" class="node-label" font-size="10" fill="#374151">Customer</text>
                  <text x="200" y="185" text-anchor="middle" class="node-label" font-size="10" fill="#374151">Solution</text>
                  <text x="120" y="225" text-anchor="middle" class="node-label" font-size="8" fill="#374151">Pain</text>
                  <text x="280" y="225" text-anchor="middle" class="node-label" font-size="8" fill="#374151">Gain</text>
                </g>
              </svg>
            </div>
            
            <div class="floating-cards">
              <div class="floating-card card-1">
                <div class="card-icon">💡</div>
                <div class="card-text">AI suggests connections</div>
              </div>
              <div class="floating-card card-2">
                <div class="card-icon">📊</div>
                <div class="card-text">Export to frameworks</div>
              </div>
              <div class="floating-card card-3">
                <div class="card-icon">🎯</div>
                <div class="card-text">Focus on MVP</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Built with Bolt Badge - Floating in top right -->
      <div class="bolt-badge-floating">
        <a href="https://bolt.new" target="_blank" rel="noopener noreferrer">
          <img src="/black_circle_360x360.png" alt="Built with Bolt" class="bolt-logo"/>
        </a>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="features-section">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">Everything you need to structure your startup idea</h2>
          <p class="section-description">
            From scattered thoughts to structured insights, Ideanation provides the tools 
            and frameworks used by successful entrepreneurs.
          </p>
        </div>

        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <h3 class="feature-title">Atomic Components</h3>
            <p class="feature-description">
              Break down complex ideas into manageable atomic pieces: problems, customers, 
              jobs-to-be-done, pains, gains, and solutions.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 1v6m0 6v6"/>
                <path d="M1 12h6m6 0h6"/>
              </svg>
            </div>
            <h3 class="feature-title">Visual Knowledge Graph</h3>
            <p class="feature-description">
              See how different components of your idea connect and influence each other 
              through an interactive force-directed graph.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 12l2 2 4-4"/>
                <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"/>
                <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"/>
                <path d="M3 12h6m6 0h6"/>
              </svg>
            </div>
            <h3 class="feature-title">AI-Powered Insights</h3>
            <p class="feature-description">
              Get intelligent suggestions for missing components, potential connections, 
              and framework-based recommendations.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10,9 9,9 8,9"/>
              </svg>
            </div>
            <h3 class="feature-title">Leverage Tools</h3>
            <p class="feature-description">
              Generate business model canvases, pitch decks, prompts you can use in Bolt and other artifacts directly from your structured idea.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                <path d="M8 9h8"/>
                <path d="M8 13h6"/>
              </svg>
            </div>
            <h3 class="feature-title">Conversational Interface</h3>
            <p class="feature-description">
              Build your idea naturally through conversation. Just type "users can't find..." 
              and watch your graph grow.
            </p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <h3 class="feature-title">Collaboration Ready</h3>
            <p class="feature-description">
              Share your structured ideas with co-founders, mentors, and investors. 
              Export to formats they understand and love.
            </p>
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
            From scattered thoughts to structured startup ideas in three simple steps.
          </p>
        </div>

        <div class="steps-container">
          <div class="step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3 class="step-title">Capture your thoughts</h3>
              <p class="step-description">
                Start by chatting with our AI. Type naturally about your idea: 
                "people struggle to find reliable pet sitters"
              </p>
              <div class="step-visual">
                <div class="chat-example">
                  <div class="chat-bubble user">
                    people struggle to find reliable pet sitters
                  </div>
                  <div class="chat-bubble ai">
                    Great! I've added that problem to your idea. Who would benefit most from solving this?
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3 class="step-title">Watch your idea take shape</h3>
              <p class="step-description">
                As you add components, see them automatically organized in a visual knowledge graph 
                with intelligent connections.
              </p>
              <div class="step-visual">
                <div class="mini-graph">
                  <div class="mini-node problem">Problem</div>
                  <div class="mini-node customer">Customer</div>
                  <div class="mini-node solution">Solution</div>
                  <div class="connection-line line-1"></div>
                  <div class="connection-line line-2"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3 class="step-title">Export and share</h3>
              <p class="step-description">
                Generate AI prompts for Bolt and professional artifacts: business model canvases, pitch decks, 
                and SWOT analyses so you can be ready for investors and stakeholders.
              </p>
              <div class="step-visual">
                <div class="export-options">
                  <div class="export-item">📊 Business Model Canvas</div>
                  <div class="export-item">📈 Pitch Deck</div>
                  <div class="export-item">🎯 SWOT Analysis</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section id="pricing" class="pricing-section">
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">Simple, transparent pricing</h2>
          <p class="section-description">
            Start free and upgrade as your ideas grow into successful startups.
          </p>
        </div>

        <div class="pricing-grid">
          <div class="pricing-card">
            <div class="pricing-header">
              <h3 class="pricing-title">Playground</h3>
              <div class="pricing-price">
                <span class="price-amount">$0</span>
                <span class="price-period">/month</span>
              </div>
              <p class="pricing-description">Perfect for exploring and validating your first idea</p>
            </div>
            <div class="pricing-features">
              <div class="feature-item">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                </svg>
                1 idea workspace
              </div>
              <div class="feature-item">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                </svg>
                AI chat assistance
              </div>
              <div class="feature-item">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                </svg>
                Visual knowledge graph
              </div>
              <div class="feature-item">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                </svg>
                Basic export (Markdown)
              </div>
            </div>
            <NuxtLink to="/login" class="btn-secondary pricing-button">Get started</NuxtLink>
          </div>

          <div class="pricing-card featured">
            <div class="pricing-badge">Most popular</div>
            <div class="pricing-header">
              <h3 class="pricing-title">Workshop</h3>
              <div class="pricing-price">
                <span class="price-amount">$15</span>
                <span class="price-period">/month</span>
              </div>
              <p class="pricing-description">For refining ideas and collaborating to validate them</p>
            </div>
            <div class="pricing-features">
              <div class="feature-item">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                </svg>
                Unlimited ideas
              </div>
              <div class="feature-item">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                </svg>
                Advanced AI insights
              </div>
              <div class="feature-item">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                </svg>
                Prompts to build with Bolt
              </div>
              <div class="feature-item">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                </svg>
                Access to all tools
              </div>
              <div class="feature-item">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                </svg>
                Share workspace (soon)
              </div>
            </div>
            <NuxtLink to="/login" class="btn-primary pricing-button">Start free trial</NuxtLink>
          </div>

          <div class="pricing-card">
            <div class="pricing-header">
              <h3 class="pricing-title">Launchpad</h3>
              <div class="pricing-price">
                <span class="price-amount">$199</span>
                <span class="price-period">/month</span>
              </div>
              <p class="pricing-description">For serious founders ready to take off with expert support</p>
            </div>
            <div class="pricing-features">
              <div class="feature-item">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                </svg>
                Everything in Workshop
              </div>
              <div class="feature-item">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                </svg>
                3 hours technical support
              </div>
              <div class="feature-item">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                </svg>
                Premium support access
              </div>
              <div class="feature-item">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                </svg>
                Early access to new features
              </div>
            </div>
            <NuxtLink to="/login" class="btn-secondary pricing-button">Get Started</NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="section-container">
        <div class="cta-content">
          <h2 class="cta-title">Ready to structure your next big idea?</h2>
          <!-- <p class="cta-description">
            Join thousands of entrepreneurs who've transformed scattered thoughts into structured startup success.
          </p> -->
          <div class="cta-actions">
            <NuxtLink to="/login" class="btn-primary btn-large">
              Start building for free
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"/>
              </svg>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-content">
          <div class="footer-brand">
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
            <span class="brand-name">Ideanation</span>
          </div>
          
          <div class="footer-links">
            <div class="footer-section">
              <h4 class="footer-title">Product</h4>
              <a href="#features" class="footer-link">Features</a>
              <a href="#pricing" class="footer-link">Pricing</a>
              <!-- <a href="#" class="footer-link">Changelog</a> -->
            </div>
            
            <div class="footer-section">
              <h4 class="footer-title">Company</h4>
              <a href="#" class="footer-link">About</a>
              <!-- <a href="#" class="footer-link">Blog</a>
              <a href="#" class="footer-link">Careers</a> -->
            </div>
            
            <!-- <div class="footer-section">
              <h4 class="footer-title">Support</h4>
              <a href="#" class="footer-link">Help Center</a>
              <a href="#" class="footer-link">Contact</a>
              <a href="#" class="footer-link">Status</a>
            </div> -->
          </div>
        </div>
        
        <div class="footer-bottom">
          <p class="footer-copyright">
            © 2025 Wepala. All rights reserved.
          </p>
          <div class="footer-legal">
            <a href="#" class="footer-link">Privacy</a>
            <a href="#" class="footer-link">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'

const router = useRouter()
const { user, profile, signOut } = useAuth()

// User menu state
const showUserMenu = ref(false)
const userMenuRef = ref<HTMLElement>()

// Mobile menu state
const showMobileMenu = ref(false)

// Close user menu when clicking outside
onClickOutside(userMenuRef, () => {
  showUserMenu.value = false
})

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
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

const goToCanvas = () => {
  showUserMenu.value = false
  router.push('/canvas')
}

const handleSignOut = async () => {
  showUserMenu.value = false
  await signOut()
  router.push('/')
}

const scrollToDemo = () => {
  document.getElementById('how-it-works')?.scrollIntoView({ 
    behavior: 'smooth' 
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
/* Base styles with professional typography */
.landing-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* Navigation Styles */
.main-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e2e8f0;
  z-index: 1000;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 64px;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: inherit;
}

.brand-icon {
  display: flex;
  align-items: center;
}

.brand-name {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
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

/* Floating Bolt Badge Styles */
.bolt-badge-floating {
  position: absolute;
  top: 100px;
  right: 20px;
  z-index: 100;
}

.bolt-badge-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  background: rgba(0, 0, 0, 0.9);
  border-radius: 50px;
  text-decoration: none;
  color: white;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.bolt-badge-link:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  background: rgba(0, 0, 0, 0.95);
}

.bolt-logo {
  width: 100px;
  height: 100px;
}

.bolt-text {
  white-space: nowrap;
  letter-spacing: 0.5px;
}

/* Button Styles - Professional colored buttons */
.btn-primary {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3);
}

.btn-secondary {
  background: white;
  color: #374151;
  border: 1px solid #e2e8f0;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.btn-secondary:hover {
  border-color: #6366f1;
  color: #6366f1;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-large {
  padding: 16px 32px;
  font-size: 16px;
}

.user-menu {
  position: relative;
}

.user-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.user-button:hover {
  border-color: #6366f1;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #6366f1;
  color: white;
  font-weight: 600;
  font-size: 14px;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-name {
  font-weight: 500;
  color: #374151;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chevron {
  transition: transform 0.2s ease;
  color: #6b7280;
}

.chevron-open {
  transform: rotate(180deg);
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  min-width: 200px;
  z-index: 1000;
}

.dropdown-header {
  padding: 16px;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-name-full {
  font-weight: 600;
  color: #0f172a;
}

.user-email {
  font-size: 14px;
  color: #64748b;
}

.dropdown-divider {
  height: 1px;
  background: #e2e8f0;
}

.dropdown-items {
  padding: 8px;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 12px;
  border: none;
  background: none;
  color: #374151;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease;
  text-align: left;
}

.dropdown-item:hover {
  background: #f8fafc;
}

.mobile-menu-button {
  display: none;
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 8px;
}

.mobile-menu {
  display: none;
  background: white;
  border-top: 1px solid #e2e8f0;
  padding: 16px 24px;
}

.mobile-nav-links {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.mobile-nav-link {
  color: #64748b;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 0;
}

.mobile-nav-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mobile-nav-button {
  padding: 12px 16px;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  text-align: center;
  cursor: pointer;
  border: none;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  transition: all 0.2s ease;
}

.mobile-nav-button.secondary {
  background: white;
  color: #64748b;
  border: 1px solid #e2e8f0;
}

/* Hero Section */
.hero-section {
  padding: 120px 24px 80px;
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
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
  padding: 6px 12px;
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 20px;
  margin-bottom: 24px;
}

.badge-text {
  font-size: 14px;
  font-weight: 500;
  color: #6366f1;
}

.hero-title {
  font-size: 48px;
  font-weight: 700;
  line-height: 1.1;
  color: #0f172a;
  margin-bottom: 24px;
}

.gradient-text {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
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
  width: 400px;
  height: 300px;
}

.graph-preview {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.preview-svg {
  width: 100%;
  height: 100%;
}

.node {
  cursor: pointer;
  transition: all 0.3s ease;
}

.node:hover {
  transform: scale(1.1);
}

.connection {
  animation: dash 2s linear infinite;
}

.floating-cards {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.floating-card {
  position: absolute;
  background: white;
  border-radius: 8px;
  padding: 8px 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 500;
  color: #374151;
  animation: float 3s ease-in-out infinite;
}

.card-1 {
  top: 20px;
  right: -20px;
  animation-delay: 0s;
}

.card-2 {
  bottom: 60px;
  left: -30px;
  animation-delay: 1s;
}

.card-3 {
  top: 50%;
  right: -40px;
  animation-delay: 2s;
}

.card-icon {
  font-size: 14px;
}

/* Section Styles */
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
}

.section-description {
  font-size: 18px;
  line-height: 1.6;
  color: #64748b;
  max-width: 600px;
  margin: 0 auto;
}

/* Features Section */
.features-section {
  padding: 80px 24px;
  background: white;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
}

.feature-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 32px;
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
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 20px;
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

/* How it Works Section */
.how-it-works-section {
  padding: 80px 24px;
  background: #f8fafc;
}

.steps-container {
  display: flex;
  flex-direction: column;
  gap: 64px;
}

.step {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 32px;
  align-items: center;
}

.step-number {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  font-weight: 700;
  flex-shrink: 0;
}

.step-content {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 32px;
  align-items: center;
}

.step-title {
  font-size: 24px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 12px;
}

.step-description {
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 24px;
}

.step-visual {
  width: 300px;
  flex-shrink: 0;
}

.chat-example {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.chat-bubble {
  padding: 8px 12px;
  border-radius: 8px;
  margin-bottom: 8px;
  font-size: 14px;
}

.chat-bubble.user {
  background: #6366f1;
  color: white;
  margin-left: 20px;
}

.chat-bubble.ai {
  background: #f1f5f9;
  color: #374151;
  margin-right: 20px;
}

.mini-graph {
  position: relative;
  height: 120px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.mini-node {
  position: absolute;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  border: 2px solid;
}

.mini-node.problem {
  top: 10px;
  left: 10px;
  background: #fef3c7;
  border-color: #f59e0b;
  color: #92400e;
}

.mini-node.customer {
  top: 10px;
  right: 10px;
  background: #dbeafe;
  border-color: #3b82f6;
  color: #1e40af;
}

.mini-node.solution {
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  background: #dcfce7;
  border-color: #10b981;
  color: #065f46;
}

.connection-line {
  position: absolute;
  height: 2px;
  background: #6b7280;
}

.line-1 {
  top: 30px;
  left: 80px;
  width: 80px;
}

.line-2 {
  top: 50px;
  left: 50%;
  width: 2px;
  height: 40px;
  transform: translateX(-50%);
}

.export-options {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.export-item {
  padding: 8px 12px;
  border-radius: 6px;
  background: #f8fafc;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

/* Pricing Section */
.pricing-section {
  padding: 80px 24px;
  background: white;
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 32px;
  max-width: 1000px;
  margin: 0 auto;
}

.pricing-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 32px;
  position: relative;
  transition: all 0.3s ease;
}

.pricing-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  border-color: #6366f1;
}

.pricing-card.featured {
  border-color: #6366f1;
  box-shadow: 0 20px 60px rgba(99, 102, 241, 0.1);
}

.pricing-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
}

.pricing-header {
  text-align: center;
  margin-bottom: 32px;
}

.pricing-title {
  font-size: 24px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 8px;
}

.pricing-price {
  margin-bottom: 16px;
}

.price-amount {
  font-size: 48px;
  font-weight: 700;
  color: #0f172a;
}

.price-period {
  font-size: 16px;
  color: #64748b;
}

.pricing-description {
  color: #64748b;
  line-height: 1.5;
}

.pricing-features {
  margin-bottom: 32px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  color: #374151;
}

.feature-item svg {
  color: #10b981;
  flex-shrink: 0;
}

.pricing-button {
  width: 100%;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  text-align: center;
  display: block;
  transition: all 0.2s ease;
}

/* CTA Section */
.cta-section {
  padding: 80px 24px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
}

.cta-content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.cta-title {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 16px;
}

.cta-description {
  font-size: 18px;
  line-height: 1.6;
  margin-bottom: 32px;
  opacity: 0.9;
}

.cta-actions {
  display: flex;
  justify-content: center;
}

.cta-actions .btn-primary {
  background: white;
  color: #6366f1;
}

.cta-actions .btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 255, 255, 0.3);
}

/* Footer */
.footer {
  background: #0f172a;
  color: white;
  padding: 64px 24px 24px;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
}

.footer-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 64px;
  margin-bottom: 48px;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.footer-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.footer-link {
  color: #94a3b8;
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: white;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 24px;
  border-top: 1px solid #334155;
}

.footer-copyright {
  color: #94a3b8;
  margin: 0;
}

.footer-legal {
  display: flex;
  gap: 24px;
}

/* Animations */
@keyframes dash {
  to {
    stroke-dashoffset: -10;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* Responsive Design */
@media (max-width: 1024px) {
  .nav-links {
    display: none;
  }
  
  .mobile-menu-button {
    display: block;
  }
  
  .mobile-menu {
    display: block;
  }
  
  .hero-container {
    grid-template-columns: 1fr;
    gap: 48px;
    text-align: center;
  }
  
  .hero-title {
    font-size: 36px;
  }
  
  .step-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  
  .footer-bottom {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  /* Bolt badge responsive */
  .bolt-badge-floating {
    top: 80px;
    right: 16px;
  }

  .bolt-badge-link {
    padding: 10px 16px;
    font-size: 13px;
  }

  .bolt-logo {
    width: 80px;
    height: 80px;
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 100px 24px 60px;
  }
  
  .hero-title {
    font-size: 28px;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .hero-stats {
    justify-content: center;
  }
  
  .section-title {
    font-size: 28px;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .step {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .step-visual {
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
  }
  
  .pricing-grid {
    grid-template-columns: 1fr;
  }
  
  .footer-links {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  /* Bolt badge mobile */
  .bolt-badge-floating {
    top: 70px;
    right: 12px;
  }

  .bolt-badge-link {
    padding: 8px 12px;
    font-size: 12px;
    gap: 8px;
  }

  .bolt-logo {
    width: 90px;
    height: 90px;
  }
}

@media (max-width: 480px) {
  .nav-container {
    padding: 0 16px;
  }
  
  .hero-section {
    padding: 80px 16px 40px;
  }
  
  .section-container {
    padding: 0 16px;
  }
  
  .hero-title {
    font-size: 24px;
  }
  
  .section-title {
    font-size: 24px;
  }
  
  .cta-title {
    font-size: 28px;
  }

  /* Bolt badge very small screens */
  .bolt-badge-floating {
    top: 80px;
    right: -70px;
  }

  .bolt-badge-link {
    padding: 6px 10px;
    font-size: 11px;
    gap: 6px;
  }

  .bolt-logo {
    width: 60px;
    height: 60px;
  }
}
</style>