<template>
  <div class="landing-page">
    <!-- Main Navigation -->
    <nav class="main-nav">
      <div class="nav-content">
        <div class="nav-brand">
          <NuxtLink to="/" class="brand-link">
            <div class="brand-icon">
              <svg width="32" height="32" viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="12" fill="none" stroke="currentColor" stroke-width="2"/>
                <circle cx="12" cy="12" r="2" fill="currentColor"/>
                <circle cx="20" cy="12" r="2" fill="currentColor"/>
                <circle cx="16" cy="20" r="2" fill="currentColor"/>
                <path d="M14,14 L18,14 M14,18 L18,18" stroke="currentColor" stroke-width="1"/>
              </svg>
            </div>
            <span class="brand-text">Ideanation</span>
          </NuxtLink>
        </div>
        
        <div class="nav-links">
          <NuxtLink to="#features" class="nav-link" @click="scrollToSection('features')">Features</NuxtLink>
          <NuxtLink to="#how-it-works" class="nav-link" @click="scrollToSection('demo')">How it works</NuxtLink>
          <NuxtLink to="#pricing" class="nav-link" @click="scrollToSection('pricing')">Pricing</NuxtLink>
          <a href="https://github.com/ideanation" class="nav-link" target="_blank" rel="noopener">GitHub</a>
        </div>
        
        <div class="nav-actions">
          <NuxtLink to="/login" class="nav-link">Sign in</NuxtLink>
          <button class="btn-nav-primary" @click="startNewIdea">
            Get started
          </button>
        </div>
        
        <!-- Mobile menu button -->
        <button class="mobile-menu-btn" @click="toggleMobileMenu" :class="{ active: mobileMenuOpen }">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      
      <!-- Mobile menu -->
      <div class="mobile-menu" :class="{ open: mobileMenuOpen }">
        <div class="mobile-menu-content">
          <div class="mobile-nav-links">
            <a href="#features" class="mobile-nav-link" @click="scrollToSection('features')">Features</a>
            <a href="#how-it-works" class="mobile-nav-link" @click="scrollToSection('demo')">How it works</a>
            <a href="#pricing" class="mobile-nav-link" @click="scrollToSection('pricing')">Pricing</a>
            <a href="https://github.com/ideanation" class="mobile-nav-link" target="_blank" rel="noopener">GitHub</a>
          </div>
          <div class="mobile-nav-actions">
            <NuxtLink to="/login" class="mobile-nav-link">Sign in</NuxtLink>
            <button class="btn-nav-primary" @click="startNewIdea">
              Get started
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero-section" id="hero">
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
          <div class="sketch-container">
            <svg width="500" height="400" class="hero-sketch" viewBox="0 0 500 400">
              <!-- Background sketch lines -->
              <defs>
                <filter id="roughPaper" x="0%" y="0%" width="100%" height="100%">
                  <feTurbulence baseFrequency="0.04" numOctaves="5" result="noise" seed="1"/>
                  <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.5"/>
                </filter>
                <filter id="pencilTexture">
                  <feTurbulence baseFrequency="0.9" numOctaves="4" result="noise" seed="5"/>
                  <feColorMatrix values="0 0 0 0 0, 0 0 0 0 0, 0 0 0 0 0, 0 0 0 -1.5 1.5"/>
                  <feComposite in="SourceGraphic" in2="noise" operator="multiply"/>
                </filter>
              </defs>
              
              <!-- Sketch background -->
              <rect width="500" height="400" fill="#fefefe" stroke="none"/>
              
              <!-- Hand-drawn grid -->
              <g stroke="#f0f0f0" stroke-width="1" opacity="0.3">
                <path d="M50,50 L450,52 M50,100 L450,98 M50,150 L450,152 M50,200 L450,198 M50,250 L450,252 M50,300 L450,298 M50,350 L450,348"/>
                <path d="M100,50 L98,350 M150,50 L152,350 M200,50 L198,350 M250,50 L252,350 M300,50 L298,350 M350,50 L352,350 M400,50 L398,350"/>
              </g>
              
              <!-- Central idea node (hand-drawn circle) -->
              <circle cx="250" cy="200" r="35" fill="none" stroke="#1a1a1a" stroke-width="3" 
                      filter="url(#roughPaper)" class="sketch-node central-node"/>
              <text x="250" y="205" text-anchor="middle" font-size="14" font-weight="600" fill="#1a1a1a">IDEA</text>
              
              <!-- Connected nodes (hand-drawn) -->
              <g class="sketch-nodes">
                <!-- Problem node -->
                <circle cx="150" cy="120" r="25" fill="none" stroke="#1a1a1a" stroke-width="2" 
                        filter="url(#roughPaper)" class="sketch-node"/>
                <text x="150" y="125" text-anchor="middle" font-size="11" fill="#1a1a1a">Problem</text>
                
                <!-- Customer node -->
                <circle cx="350" cy="120" r="25" fill="none" stroke="#1a1a1a" stroke-width="2" 
                        filter="url(#roughPaper)" class="sketch-node"/>
                <text x="350" y="125" text-anchor="middle" font-size="11" fill="#1a1a1a">Customer</text>
                
                <!-- Solution node -->
                <circle cx="150" cy="280" r="25" fill="none" stroke="#1a1a1a" stroke-width="2" 
                        filter="url(#roughPaper)" class="sketch-node"/>
                <text x="150" y="285" text-anchor="middle" font-size="11" fill="#1a1a1a">Solution</text>
                
                <!-- Feature node -->
                <circle cx="350" cy="280" r="25" fill="none" stroke="#1a1a1a" stroke-width="2" 
                        filter="url(#roughPaper)" class="sketch-node"/>
                <text x="350" y="285" text-anchor="middle" font-size="11" fill="#1a1a1a">Feature</text>
                
                <!-- Market node -->
                <circle cx="250" cy="320" r="20" fill="none" stroke="#1a1a1a" stroke-width="2" 
                        filter="url(#roughPaper)" class="sketch-node"/>
                <text x="250" y="325" text-anchor="middle" font-size="10" fill="#1a1a1a">Market</text>
              </g>
              
              <!-- Hand-drawn connecting lines -->
              <g stroke="#666" stroke-width="2" fill="none" filter="url(#pencilTexture)" class="sketch-connections">
                <path d="M215,175 Q180,140 175,120" stroke-dasharray="3,2"/>
                <path d="M285,175 Q320,140 325,120" stroke-dasharray="3,2"/>
                <path d="M215,225 Q180,260 175,280" stroke-dasharray="3,2"/>
                <path d="M285,225 Q320,260 325,280" stroke-dasharray="3,2"/>
                <path d="M250,235 Q250,270 250,300" stroke-dasharray="3,2"/>
              </g>
              
              <!-- Floating sketch elements -->
              <g class="floating-sketches" opacity="0.6">
                <path d="M80,80 Q85,75 90,80 Q95,85 90,90 Q85,95 80,90 Q75,85 80,80" 
                      fill="none" stroke="#ccc" stroke-width="1" filter="url(#roughPaper)"/>
                <path d="M420,320 L430,315 L425,325 L420,320" 
                      fill="none" stroke="#ccc" stroke-width="1" filter="url(#roughPaper)"/>
                <text x="60" y="370" font-size="8" fill="#ccc" transform="rotate(-5 60 370)">insights</text>
                <text x="420" y="60" font-size="8" fill="#ccc" transform="rotate(8 420 60)">connections</text>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>

    <!-- Problem Section -->
    <section class="problem-section" id="problems">
      <div class="section-content">
        <h2 class="section-title">The entrepreneur's dilemma</h2>
        <div class="problems-grid">
          <div class="problem-card">
            <div class="problem-sketch">
              <svg width="60" height="60" viewBox="0 0 60 60">
                <rect x="10" y="15" width="40" height="30" fill="none" stroke="#666" stroke-width="2" 
                      filter="url(#roughPaper)" rx="2"/>
                <path d="M15,25 L35,25 M15,30 L45,30 M15,35 L30,35" stroke="#666" stroke-width="1"/>
                <circle cx="45" cy="15" r="3" fill="#666"/>
                <circle cx="35" cy="10" r="2" fill="#999"/>
              </svg>
            </div>
            <h3>Scattered everywhere</h3>
            <p>Ideas live in Notion, Google Docs, Slack DMs, and ChatGPT threads. Nothing connects.</p>
          </div>
          
          <div class="problem-card">
            <div class="problem-sketch">
              <svg width="60" height="60" viewBox="0 0 60 60">
                <circle cx="30" cy="30" r="20" fill="none" stroke="#666" stroke-width="2" 
                        filter="url(#roughPaper)"/>
                <path d="M20,25 Q25,20 30,25 Q35,20 40,25" fill="none" stroke="#666" stroke-width="1"/>
                <circle cx="25" cy="30" r="2" fill="#666"/>
                <circle cx="35" cy="30" r="2" fill="#666"/>
                <path d="M25,35 Q30,40 35,35" fill="none" stroke="#666" stroke-width="1"/>
                <path d="M15,15 L20,10 M45,15 L50,10" stroke="#999" stroke-width="1"/>
              </svg>
            </div>
            <h3>Lost insights</h3>
            <p>Brilliant thoughts from AI conversations disappear. Past research gets forgotten and repeated.</p>
          </div>
          
          <div class="problem-card">
            <div class="problem-sketch">
              <svg width="60" height="60" viewBox="0 0 60 60">
                <rect x="10" y="20" width="15" height="20" fill="none" stroke="#666" stroke-width="2" 
                      filter="url(#roughPaper)"/>
                <rect x="30" y="15" width="15" height="25" fill="none" stroke="#666" stroke-width="2" 
                      filter="url(#roughPaper)"/>
                <rect x="50" y="25" width="8" height="15" fill="none" stroke="#666" stroke-width="2" 
                      filter="url(#roughPaper)"/>
                <path d="M5,45 L55,45" stroke="#666" stroke-width="1"/>
              </svg>
            </div>
            <h3>Framework overload</h3>
            <p>Business Model Canvas, Lean Canvas, Design Sprints—too many templates, not enough guidance.</p>
          </div>
          
          <div class="problem-card">
            <div class="problem-sketch">
              <svg width="60" height="60" viewBox="0 0 60 60">
                <circle cx="20" cy="20" r="8" fill="none" stroke="#666" stroke-width="2" 
                        filter="url(#roughPaper)"/>
                <circle cx="40" cy="30" r="6" fill="none" stroke="#666" stroke-width="2" 
                        filter="url(#roughPaper)"/>
                <circle cx="30" cy="45" r="7" fill="none" stroke="#666" stroke-width="2" 
                        stroke-dasharray="3,2" filter="url(#roughPaper)"/>
                <path d="M25,25 Q35,20 35,25" fill="none" stroke="#999" stroke-width="1" stroke-dasharray="2,2"/>
                <text x="30" y="48" text-anchor="middle" font-size="8" fill="#999">?</text>
              </svg>
            </div>
            <h3>Missing pieces</h3>
            <p>You know something's incomplete but can't identify what. No clear path from idea to fundable business.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Solution Section -->
    <section class="solution-section" id="demo" ref="demoSection">
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
              <div class="step-visual chat-sketch">
                <svg width="200" height="80" viewBox="0 0 200 80">
                  <path d="M20,20 Q20,10 30,10 L170,10 Q180,10 180,20 L180,50 Q180,60 170,60 L40,60 L20,70 L20,20" 
                        fill="none" stroke="#666" stroke-width="2" filter="url(#roughPaper)"/>
                  <circle cx="40" cy="35" r="2" fill="#666"/>
                  <circle cx="50" cy="35" r="2" fill="#666"/>
                  <circle cx="60" cy="35" r="2" fill="#666"/>
                  <text x="80" y="40" font-size="10" fill="#999">AI is structuring...</text>
                </svg>
              </div>
            </div>
          </div>
          
          <div class="demo-step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3>Watch it structure</h3>
              <p>AI extracts problems, customers, solutions, and relationships automatically</p>
              <div class="step-visual structure-sketch">
                <svg width="200" height="80" viewBox="0 0 200 80">
                  <circle cx="50" cy="25" r="12" fill="none" stroke="#666" stroke-width="2" filter="url(#roughPaper)"/>
                  <circle cx="100" cy="40" r="15" fill="#1a1a1a" stroke="#1a1a1a" stroke-width="2"/>
                  <circle cx="150" cy="25" r="12" fill="none" stroke="#666" stroke-width="2" filter="url(#roughPaper)"/>
                  <circle cx="100" cy="65" r="10" fill="none" stroke="#666" stroke-width="2" filter="url(#roughPaper)"/>
                  
                  <path d="M62,30 L88,35" stroke="#999" stroke-width="1" stroke-dasharray="2,2"/>
                  <path d="M138,30 L112,35" stroke="#999" stroke-width="1" stroke-dasharray="2,2"/>
                  <path d="M100,55 L100,50" stroke="#999" stroke-width="1" stroke-dasharray="2,2"/>
                  
                  <text x="100" y="45" text-anchor="middle" font-size="8" fill="white">IDEA</text>
                </svg>
              </div>
            </div>
          </div>
          
          <div class="demo-step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3>Generate artifacts</h3>
              <p>Export pitch decks, business plans, and specifications instantly</p>
              <div class="step-visual artifacts-sketch">
                <svg width="200" height="80" viewBox="0 0 200 80">
                  <rect x="20" y="20" width="40" height="30" fill="none" stroke="#666" stroke-width="2" 
                        filter="url(#roughPaper)" rx="2"/>
                  <rect x="80" y="15" width="40" height="35" fill="none" stroke="#666" stroke-width="2" 
                        filter="url(#roughPaper)" rx="2"/>
                  <rect x="140" y="25" width="40" height="25" fill="none" stroke="#666" stroke-width="2" 
                        filter="url(#roughPaper)" rx="2"/>
                  
                  <path d="M25,30 L55,30 M25,35 L50,35 M25,40 L45,40" stroke="#ccc" stroke-width="1"/>
                  <path d="M85,25 L115,25 M85,30 L110,30 M85,35 L105,35" stroke="#ccc" stroke-width="1"/>
                  <path d="M145,35 L175,35 M145,40 L170,40" stroke="#ccc" stroke-width="1"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section" id="features">
      <div class="section-content">
        <h2 class="section-title">Everything you need to go from idea to fundable business</h2>
        
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-sketch">
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="25" fill="none" stroke="#666" stroke-width="2" filter="url(#roughPaper)"/>
                <path d="M30,35 Q35,30 40,35 Q45,30 50,35" fill="none" stroke="#666" stroke-width="1"/>
                <circle cx="35" cy="40" r="2" fill="#666"/>
                <circle cx="45" cy="40" r="2" fill="#666"/>
                <path d="M35,45 Q40,50 45,45" fill="none" stroke="#666" stroke-width="1"/>
                <path d="M20,20 L25,15 M60,20 L65,15 M20,60 L15,65 M60,60 L65,65" stroke="#999" stroke-width="1"/>
              </svg>
            </div>
            <h3>AI-Powered Structuring</h3>
            <p>Automatically organize thoughts into problems, customers, solutions, and market opportunities using proven business frameworks.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-sketch">
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle cx="25" cy="25" r="8" fill="none" stroke="#666" stroke-width="2" filter="url(#roughPaper)"/>
                <circle cx="55" cy="25" r="8" fill="none" stroke="#666" stroke-width="2" filter="url(#roughPaper)"/>
                <circle cx="40" cy="55" r="8" fill="none" stroke="#666" stroke-width="2" filter="url(#roughPaper)"/>
                <circle cx="25" cy="55" r="6" fill="none" stroke="#666" stroke-width="2" filter="url(#roughPaper)"/>
                <circle cx="55" cy="55" r="6" fill="none" stroke="#666" stroke-width="2" filter="url(#roughPaper)"/>
                
                <path d="M33,25 L47,25" stroke="#999" stroke-width="1" stroke-dasharray="2,2"/>
                <path d="M30,32 L35,48" stroke="#999" stroke-width="1" stroke-dasharray="2,2"/>
                <path d="M50,32 L45,48" stroke="#999" stroke-width="1" stroke-dasharray="2,2"/>
                <path d="M32,55 L48,55" stroke="#999" stroke-width="1" stroke-dasharray="2,2"/>
              </svg>
            </div>
            <h3>Visual Knowledge Graph</h3>
            <p>See how every piece of your idea connects. Identify gaps and strengthen relationships between components.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-sketch">
              <svg width="80" height="80" viewBox="0 0 80 80">
                <rect x="15" y="20" width="25" height="35" fill="none" stroke="#666" stroke-width="2" 
                      filter="url(#roughPaper)" rx="2"/>
                <rect x="45" y="15" width="25" height="40" fill="none" stroke="#666" stroke-width="2" 
                      filter="url(#roughPaper)" rx="2"/>
                
                <path d="M20,30 L35,30 M20,35 L30,35 M20,40 L35,40" stroke="#ccc" stroke-width="1"/>
                <path d="M50,25 L65,25 M50,30 L60,30 M50,35 L65,35" stroke="#ccc" stroke-width="1"/>
                
                <path d="M25,60 Q30,65 35,60 Q40,55 45,60" fill="none" stroke="#999" stroke-width="1" stroke-dasharray="2,2"/>
              </svg>
            </div>
            <h3>Instant Artifacts</h3>
            <p>Generate pitch decks, business plans, elevator pitches, and technical specifications from your structured idea.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-sketch">
              <svg width="80" height="80" viewBox="0 0 80 80">
                <rect x="20" y="20" width="40" height="30" fill="none" stroke="#666" stroke-width="2" 
                      filter="url(#roughPaper)" rx="3"/>
                <circle cx="30" cy="30" r="3" fill="#666"/>
                <circle cx="40" cy="35" r="3" fill="#999"/>
                <circle cx="50" cy="30" r="3" fill="#666"/>
                <circle cx="35" cy="42" r="2" fill="#ccc"/>
                <circle cx="45" cy="40" r="2" fill="#ccc"/>
                
                <path d="M25,55 Q30,60 35,55 Q40,50 45,55 Q50,60 55,55" fill="none" stroke="#999" stroke-width="1"/>
                <text x="40" y="65" text-anchor="middle" font-size="8" fill="#999">memory</text>
              </svg>
            </div>
            <h3>Persistent Memory</h3>
            <p>Never lose an insight again. All conversations and iterations are saved and searchable.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-sketch">
              <svg width="80" height="80" viewBox="0 0 80 80">
                <path d="M20,40 L30,30 L40,40 L50,25 L60,35" fill="none" stroke="#666" stroke-width="2" 
                      filter="url(#roughPaper)"/>
                <circle cx="20" cy="40" r="3" fill="#666"/>
                <circle cx="30" cy="30" r="3" fill="#666"/>
                <circle cx="40" cy="40" r="3" fill="#666"/>
                <circle cx="50" cy="25" r="3" fill="#666"/>
                <circle cx="60" cy="35" r="3" fill="#666"/>
                
                <path d="M15,50 L65,50" stroke="#ccc" stroke-width="1"/>
                <path d="M15,20 L15,55" stroke="#ccc" stroke-width="1"/>
                <text x="40" y="65" text-anchor="middle" font-size="8" fill="#999">guided path</text>
              </svg>
            </div>
            <h3>Guided Development</h3>
            <p>AI guides you through proven frameworks like Design Sprints and Business Model Canvas.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-sketch">
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="20" fill="none" stroke="#666" stroke-width="2" filter="url(#roughPaper)"/>
                <circle cx="40" cy="40" r="12" fill="none" stroke="#1a1a1a" stroke-width="3"/>
                <circle cx="40" cy="40" r="6" fill="#1a1a1a"/>
                
                <path d="M25,25 L30,20 M55,25 L60,20 M25,55 L20,60 M55,55 L60,60" stroke="#999" stroke-width="1"/>
                <text x="40" y="65" text-anchor="middle" font-size="8" fill="#999">MVP focus</text>
              </svg>
            </div>
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
            <div class="persona-sketch">
              <svg width="60" height="60" viewBox="0 0 60 60">
                <circle cx="30" cy="25" r="12" fill="none" stroke="#666" stroke-width="2" filter="url(#roughPaper)"/>
                <path d="M18,45 Q30,35 42,45" fill="none" stroke="#666" stroke-width="2" filter="url(#roughPaper)"/>
                <circle cx="25" cy="22" r="2" fill="#666"/>
                <circle cx="35" cy="22" r="2" fill="#666"/>
                <path d="M27,28 Q30,31 33,28" fill="none" stroke="#666" stroke-width="1"/>
                <path d="M20,50 L25,45 M40,50 L35,45" stroke="#999" stroke-width="1"/>
              </svg>
            </div>
            <h3>First-time Entrepreneurs</h3>
            <p>"Finally, a tool that helps me think through my idea systematically without overwhelming me with frameworks."</p>
            <div class="persona-benefits">
              <span class="benefit">✓ Guided structure</span>
              <span class="benefit">✓ Reduces overwhelm</span>
              <span class="benefit">✓ Builds confidence</span>
            </div>
          </div>
          
          <div class="persona-card">
            <div class="persona-sketch">
              <svg width="60" height="60" viewBox="0 0 60 60">
                <circle cx="30" cy="25" r="12" fill="none" stroke="#666" stroke-width="2" filter="url(#roughPaper)"/>
                <path d="M18,45 Q30,35 42,45" fill="none" stroke="#666" stroke-width="2" filter="url(#roughPaper)"/>
                <circle cx="25" cy="22" r="2" fill="#666"/>
                <circle cx="35" cy="22" r="2" fill="#666"/>
                <path d="M27,28 Q30,31 33,28" fill="none" stroke="#666" stroke-width="1"/>
                
                <circle cx="15" cy="15" r="4" fill="none" stroke="#999" stroke-width="1"/>
                <circle cx="45" cy="15" r="4" fill="none" stroke="#999" stroke-width="1"/>
                <circle cx="15" cy="45" r="4" fill="none" stroke="#999" stroke-width="1"/>
                <path d="M19,15 L26,20 M41,15 L34,20 M19,45 L26,40" stroke="#999" stroke-width="1" stroke-dasharray="1,1"/>
              </svg>
            </div>
            <h3>Serial Entrepreneurs</h3>
            <p>"I can capture and develop multiple ideas simultaneously. The knowledge graph shows connections I'd never see otherwise."</p>
            <div class="persona-benefits">
              <span class="benefit">✓ Multiple ideas</span>
              <span class="benefit">✓ Pattern recognition</span>
              <span class="benefit">✓ Faster iteration</span>
            </div>
          </div>
          
          <div class="persona-card">
            <div class="persona-sketch">
              <svg width="60" height="60" viewBox="0 0 60 60">
                <circle cx="30" cy="25" r="12" fill="none" stroke="#666" stroke-width="2" filter="url(#roughPaper)"/>
                <path d="M18,45 Q30,35 42,45" fill="none" stroke="#666" stroke-width="2" filter="url(#roughPaper)"/>
                <circle cx="25" cy="22" r="2" fill="#666"/>
                <circle cx="35" cy="22" r="2" fill="#666"/>
                <path d="M27,28 Q30,31 33,28" fill="none" stroke="#666" stroke-width="1"/>
                
                <rect x="20" y="50" width="20" height="8" fill="none" stroke="#999" stroke-width="1" rx="1"/>
                <path d="M25,52 L35,52 M25,54 L32,54 M25,56 L30,56" stroke="#999" stroke-width="0.5"/>
              </svg>
            </div>
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

    <!-- Pricing Section -->
    <section class="pricing-section" id="pricing">
      <div class="section-content">
        <h2 class="section-title">Simple, transparent pricing</h2>
        <p class="section-subtitle">Start free, upgrade when you're ready to build</p>
        
        <div class="pricing-grid">
          <div class="pricing-card">
            <div class="pricing-header">
              <h3>Free</h3>
              <div class="price">
                <span class="price-amount">$0</span>
                <span class="price-period">/month</span>
              </div>
              <p class="price-description">Perfect for exploring ideas</p>
            </div>
            <div class="pricing-features">
              <div class="feature">✓ 1 idea workspace</div>
              <div class="feature">✓ AI-powered structuring</div>
              <div class="feature">✓ Basic knowledge graph</div>
              <div class="feature">✓ Pitch deck export</div>
            </div>
            <button class="btn-pricing" @click="startNewIdea">Get started</button>
          </div>
          
          <div class="pricing-card featured">
            <div class="pricing-badge">Most popular</div>
            <div class="pricing-header">
              <h3>Pro</h3>
              <div class="price">
                <span class="price-amount">$10</span>
                <span class="price-period">/month</span>
              </div>
              <p class="price-description">For serious entrepreneurs</p>
            </div>
            <div class="pricing-features">
              <div class="feature">✓ Unlimited ideas</div>
              <div class="feature">✓ Advanced AI insights</div>
              <div class="feature">✓ All export formats</div>
              <div class="feature">✓ Competitor analysis</div>
              <div class="feature">✓ Priority support</div>
            </div>
            <button class="btn-pricing primary" @click="startNewIdea">Start free trial</button>
          </div>
          
          <div class="pricing-card">
            <div class="pricing-header">
              <h3>Team</h3>
              <div class="price">
                <span class="price-amount">$25</span>
                <span class="price-period">/month</span>
              </div>
              <p class="price-description">For collaborative teams</p>
            </div>
            <div class="pricing-features">
              <div class="feature">✓ Everything in Pro</div>
              <div class="feature">✓ Team collaboration</div>
              <div class="feature">✓ Shared workspaces</div>
              <div class="feature">✓ Admin controls</div>
              <div class="feature">✓ Custom integrations</div>
            </div>
            <button class="btn-pricing" @click="startNewIdea">Contact sales</button>
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
const mobileMenuOpen = ref(false)

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

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
  mobileMenuOpen.value = false
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

// Close mobile menu when clicking outside
onMounted(() => {
  const handleClickOutside = (event: Event) => {
    const target = event.target as Element
    if (!target.closest('.main-nav') && mobileMenuOpen.value) {
      mobileMenuOpen.value = false
    }
  }
  
  document.addEventListener('click', handleClickOutside)
  
  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
  })
})

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
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
}

/* Navigation Styles */
.main-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(254, 254, 254, 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  z-index: 1000;
  transition: all 0.3s ease;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 64px;
}

.nav-brand {
  display: flex;
  align-items: center;
}

.brand-link {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: #1a1a1a;
  font-weight: 600;
  font-size: 1.125rem;
  transition: opacity 0.2s ease;
}

.brand-link:hover {
  opacity: 0.8;
}

.brand-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: #1a1a1a;
}

.brand-text {
  font-weight: 700;
  letter-spacing: -0.01em;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  color: #666;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  transition: color 0.2s ease;
  cursor: pointer;
}

.nav-link:hover {
  color: #1a1a1a;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.btn-nav-primary {
  background: #1a1a1a;
  color: white;
  border: none;
  padding: 8px 16px;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.btn-nav-primary:hover {
  background: #333;
  transform: translateY(-1px);
}

/* Mobile Menu */
.mobile-menu-btn {
  display: none;
  flex-direction: column;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.mobile-menu-btn span {
  display: block;
  height: 2px;
  width: 100%;
  background: #1a1a1a;
  margin: 3px 0;
  transition: all 0.3s ease;
  transform-origin: center;
}

.mobile-menu-btn.active span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.mobile-menu-btn.active span:nth-child(2) {
  opacity: 0;
}

.mobile-menu-btn.active span:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -6px);
}

.mobile-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  transform: translateY(-100%);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
}

.mobile-menu.open {
  transform: translateY(0);
  opacity: 1;
  visibility: visible;
}

.mobile-menu-content {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.mobile-nav-links {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.mobile-nav-link {
  color: #666;
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  transition: color 0.2s ease;
  cursor: pointer;
}

.mobile-nav-link:hover {
  color: #1a1a1a;
}

.mobile-nav-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid #f0f0f0;
}

/* Hero Section */
.hero-section {
  padding: 160px 20px 160px;
  background: linear-gradient(135deg, #fefefe 0%, #f9f9f9 100%);
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 80%, rgba(0,0,0,0.02) 1px, transparent 1px),
    radial-gradient(circle at 80% 20%, rgba(0,0,0,0.02) 1px, transparent 1px);
  background-size: 50px 50px, 30px 30px;
  pointer-events: none;
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
  position: relative;
  z-index: 1;
}

.hero-text {
  max-width: 520px;
}

.hero-title {
  font-size: 3.75rem;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  color: #1a1a1a;
  letter-spacing: -0.02em;
}

.highlight {
  color: #1a1a1a;
  position: relative;
}

.highlight::after {
  content: '';
  position: absolute;
  bottom: 4px;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #1a1a1a 0%, #666 100%);
  opacity: 0.15;
  border-radius: 2px;
}

.hero-subtitle {
  font-size: 1.25rem;
  line-height: 1.6;
  color: #666;
  margin-bottom: 2.5rem;
  font-weight: 400;
}

.hero-stats {
  display: flex;
  gap: 2.5rem;
  margin-bottom: 3rem;
  padding: 2rem 0;
  border-top: 1px solid #e8e8e8;
  border-bottom: 1px solid #e8e8e8;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.stat-number {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.25rem;
  letter-spacing: -0.01em;
}

.stat-label {
  font-size: 0.875rem;
  color: #666;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
}

.btn-primary {
  background: #1a1a1a;
  color: white;
  border: none;
  padding: 16px 32px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-block;
  font-family: inherit;
}

.btn-primary:hover {
  background: #333;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.btn-primary.large {
  padding: 20px 40px;
  font-size: 1.125rem;
}

.btn-secondary {
  background: transparent;
  color: #1a1a1a;
  border: 1px solid #d0d0d0;
  padding: 16px 32px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.btn-secondary:hover {
  background: #f8f8f8;
  border-color: #1a1a1a;
  transform: translateY(-1px);
}

.social-proof {
  margin-top: 1.5rem;
}

.proof-text {
  font-size: 0.875rem;
  color: #888;
  margin: 0;
  font-weight: 500;
}

/* Hero Visual */
.hero-visual {
  display: flex;
  justify-content: center;
  align-items: center;
}

.sketch-container {
  position: relative;
}

.hero-sketch {
  max-width: 100%;
  height: auto;
  filter: drop-shadow(0 8px 32px rgba(0,0,0,0.08));
}

.sketch-nodes .sketch-node {
  animation: float 6s ease-in-out infinite;
}

.sketch-nodes .sketch-node:nth-child(2) { animation-delay: -1s; }
.sketch-nodes .sketch-node:nth-child(4) { animation-delay: -2s; }
.sketch-nodes .sketch-node:nth-child(6) { animation-delay: -3s; }
.sketch-nodes .sketch-node:nth-child(8) { animation-delay: -4s; }

.central-node {
  animation: pulse 3s ease-in-out infinite;
}

.sketch-connections path {
  animation: dash 3s linear infinite;
}

.floating-sketches {
  animation: float 8s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-3px); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

@keyframes dash {
  to { stroke-dashoffset: -10; }
}

/* Section Styles */
.section-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-title {
  font-size: 2.75rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1.5rem;
  color: #1a1a1a;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.section-subtitle {
  font-size: 1.25rem;
  text-align: center;
  color: #666;
  margin-bottom: 4rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  font-weight: 400;
}

/* Problem Section */
.problem-section {
  padding: 120px 20px;
  background: white;
}

.problems-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2.5rem;
  margin-top: 4rem;
}

.problem-card {
  text-align: center;
  padding: 2.5rem 2rem;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  transition: all 0.3s ease;
  background: #fefefe;
}

.problem-card:hover {
  border-color: #e0e0e0;
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0,0,0,0.08);
}

.problem-sketch {
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
}

.problem-card h3 {
  font-size: 1.375rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1a1a1a;
  letter-spacing: -0.01em;
}

.problem-card p {
  color: #666;
  line-height: 1.6;
  margin: 0;
  font-weight: 400;
}

/* Solution Section */
.solution-section {
  padding: 120px 20px;
  background: #f9f9f9;
}

.demo-flow {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 4rem;
  margin-top: 4rem;
}

.demo-step {
  text-align: center;
}

.step-number {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #1a1a1a;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.375rem;
  font-weight: 700;
  margin: 0 auto 2rem;
  position: relative;
}

.step-number::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid #1a1a1a;
  opacity: 0.2;
  animation: pulse-ring 2s ease-in-out infinite;
}

.step-content h3 {
  font-size: 1.375rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #1a1a1a;
  letter-spacing: -0.01em;
}

.step-content p {
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.6;
  font-weight: 400;
  font-style: italic;
}

.step-visual {
  background: white;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  padding: 2rem;
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

@keyframes pulse-ring {
  0% { transform: scale(1); opacity: 0.2; }
  50% { transform: scale(1.1); opacity: 0.1; }
  100% { transform: scale(1.2); opacity: 0; }
}

/* Features Section */
.features-section {
  padding: 120px 20px;
  background: white;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 3rem;
  margin-top: 4rem;
}

.feature-card {
  padding: 3rem 2.5rem;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  transition: all 0.3s ease;
  background: #fefefe;
}

.feature-card:hover {
  border-color: #e0e0e0;
  transform: translateY(-4px);
  box-shadow: 0 12px 48px rgba(0,0,0,0.08);
}

.feature-sketch {
  margin-bottom: 2rem;
  display: flex;
  justify-content: flex-start;
}

.feature-card h3 {
  font-size: 1.375rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1a1a1a;
  letter-spacing: -0.01em;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
  margin: 0;
  font-weight: 400;
}

/* Social Proof Section */
.social-proof-section {
  padding: 120px 20px;
  background: #f9f9f9;
}

.personas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2.5rem;
  margin-top: 4rem;
}

.persona-card {
  background: white;
  padding: 3rem 2.5rem;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
  transition: all 0.3s ease;
}

.persona-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 48px rgba(0,0,0,0.08);
  border-color: #e0e0e0;
}

.persona-sketch {
  margin-bottom: 2rem;
  display: flex;
  justify-content: flex-start;
}

.persona-card h3 {
  font-size: 1.375rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1a1a1a;
  letter-spacing: -0.01em;
}

.persona-card p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 2rem;
  font-style: italic;
  font-weight: 400;
}

.persona-benefits {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.benefit {
  background: #f5f5f5;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  color: #666;
  font-weight: 500;
}

/* Pricing Section */
.pricing-section {
  padding: 120px 20px;
  background: white;
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  margin-top: 4rem;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
}

.pricing-card {
  background: #fefefe;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  padding: 2.5rem;
  position: relative;
  transition: all 0.3s ease;
}

.pricing-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 48px rgba(0,0,0,0.08);
  border-color: #e0e0e0;
}

.pricing-card.featured {
  border-color: #1a1a1a;
  transform: scale(1.05);
}

.pricing-card.featured:hover {
  transform: scale(1.05) translateY(-4px);
}

.pricing-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: #1a1a1a;
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.pricing-header {
  text-align: center;
  margin-bottom: 2rem;
}

.pricing-header h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #1a1a1a;
}

.price {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
}

.price-amount {
  font-size: 3rem;
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: -0.02em;
}

.price-period {
  font-size: 1rem;
  color: #666;
  font-weight: 500;
}

.price-description {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}

.pricing-features {
  margin-bottom: 2rem;
}

.pricing-features .feature {
  padding: 0.75rem 0;
  color: #666;
  font-size: 0.9rem;
  border-bottom: 1px solid #f5f5f5;
}

.pricing-features .feature:last-child {
  border-bottom: none;
}

.btn-pricing {
  width: 100%;
  background: transparent;
  color: #1a1a1a;
  border: 1px solid #d0d0d0;
  padding: 12px 24px;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.btn-pricing:hover {
  background: #f8f8f8;
  border-color: #1a1a1a;
}

.btn-pricing.primary {
  background: #1a1a1a;
  color: white;
  border-color: #1a1a1a;
}

.btn-pricing.primary:hover {
  background: #333;
}

/* CTA Section */
.cta-section {
  padding: 120px 20px;
  background: #1a1a1a;
  color: white;
  text-align: center;
}

.cta-title {
  font-size: 2.75rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: white;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.cta-subtitle {
  font-size: 1.25rem;
  color: #ccc;
  margin-bottom: 3rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  font-weight: 400;
}

.cta-actions {
  margin-bottom: 3rem;
}

.cta-note {
  font-size: 0.875rem;
  color: #999;
  margin-top: 1.5rem;
  font-weight: 500;
}

.cta-features {
  display: flex;
  justify-content: center;
  gap: 3rem;
  flex-wrap: wrap;
  margin-top: 3rem;
}

.cta-feature {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  color: #ccc;
  font-weight: 500;
}

.feature-check {
  color: #4caf50;
  font-weight: 700;
  font-size: 1rem;
}

/* Recent Workspaces */
.recent-workspaces-section {
  padding: 80px 20px;
  background: white;
}

.workspace-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  margin-top: 2.5rem;
}

.workspace-card {
  background: #f9f9f9;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  padding: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.workspace-card:hover {
  border-color: #e0e0e0;
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0,0,0,0.06);
}

.workspace-info h4 {
  margin: 0 0 0.75rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a1a1a;
  letter-spacing: -0.01em;
}

.workspace-info p {
  margin: 0 0 1.5rem 0;
  color: #666;
  font-size: 0.875rem;
  line-height: 1.4;
  font-weight: 400;
}

.workspace-date {
  font-size: 0.75rem;
  color: #999;
  font-weight: 500;
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
  
  .hero-content {
    grid-template-columns: 1fr;
    gap: 4rem;
    text-align: center;
  }
  
  .hero-title {
    font-size: 2.75rem;
  }
  
  .hero-stats {
    justify-content: center;
    gap: 2rem;
  }
  
  .hero-actions {
    justify-content: center;
  }
  
  .section-title {
    font-size: 2.25rem;
  }
  
  .cta-title {
    font-size: 2.25rem;
  }
  
  .cta-features {
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }
  
  .demo-flow {
    gap: 3rem;
  }
  
  .features-grid {
    gap: 2rem;
  }
  
  .personas-grid {
    gap: 2rem;
  }
  
  .pricing-grid {
    gap: 1.5rem;
  }
  
  .pricing-card.featured {
    transform: none;
  }
  
  .pricing-card.featured:hover {
    transform: translateY(-4px);
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 120px 20px 120px;
  }
  
  .hero-title {
    font-size: 2.25rem;
  }
  
  .hero-actions {
    flex-direction: column;
    gap: 1rem;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
    text-align: center;
  }
  
  .hero-stats {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }
  
  .stat {
    align-items: center;
  }
  
  .section-title {
    font-size: 2rem;
  }
  
  .cta-title {
    font-size: 2rem;
  }
  
  .problems-grid,
  .features-grid,
  .personas-grid,
  .pricing-grid {
    grid-template-columns: 1fr;
  }
  
  .nav-content {
    padding: 0 16px;
  }
}
</style>