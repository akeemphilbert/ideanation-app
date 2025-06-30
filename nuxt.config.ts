// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  ssr: process.env.NUXT_NO_SSR !== 'true',
  
  // Enable pages directory
  pages: true,
  
  // CSS configuration
  css: [
    'ant-design-vue/dist/reset.css',
    '~/assets/css/main.css'
  ],
  
  // Modules
  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt'
  ],
  
  // Build configuration
  build: {
    transpile: ['ant-design-vue']
  },
  
  // Nitro configuration for server-side debugging
  nitro: {
    debug: process.env.NODE_ENV === 'production' && process.env.DEBUG === 'true',
    logLevel: process.env.NODE_ENV === 'production' && process.env.DEBUG === 'true' ? 'debug' : 'info',
    errorHandler: '~/server/error-handler.ts'
  },
  
  // Environment variables
  runtimeConfig: {
    // Server-only Supabase configuration
    supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    postgresConnectionString: process.env.POSTGRES_CONNECTION_STRING,
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    
    // Debug configuration
    debug: process.env.DEBUG === 'true',
    logLevel: process.env.LOG_LEVEL || 'info',
    
    // Fallback environment variables (optional)
    azureOpenAI: {
      apiKey: process.env.AZURE_OPENAI_API_KEY,
      basePath: process.env.AZURE_OPENAI_BASE_PATH,
      deployment: process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME,
      apiVersion: process.env.AZURE_OPENAI_API_VERSION
    },
    langsmith: {
      apiKey: process.env.LANGSMITH_API_KEY,
      projectName: process.env.LANGSMITH_PROJECT_NAME,
      endpoint: process.env.LANGSMITH_ENDPOINT
    },
    public: {
      // Client-side accessible Supabase configuration
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      apiUrl: process.env.API_URL,
      appBase: process.env.NUXT_PUBLIC_APP_BASE_URL,
      // Client-side debug configuration
      debug: process.env.DEBUG === 'true'
    }
  },
  
  // App head configuration
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL,
    head: {
      title: 'Ideanation - Structure Your Startup Ideas',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Transform your startup ideas into structured atomic components and visualize their relationships.' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Architects+Daughter:wght@400&family=Kalam:wght@300;400;700&display=swap' }
      ]
    }
  }
})