import { createClient } from '@supabase/supabase-js'

const config = useRuntimeConfig()

// Create Supabase client with service role key for server-side operations
export const supabase = createClient(
  config.supabase.url,
  config.supabase.serviceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Cache for configuration to avoid repeated database calls
let configCache: any = null
let cacheTimestamp = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export interface AzureConfig {
  apiKey: string
  basePath: string
  deployment: string
  apiVersion: string
}

export interface LangsmithConfig {
  apiKey: string
  projectName: string
  endpoint: string
}

export interface AppConfig {
  azure: AzureConfig
  langsmith: LangsmithConfig
}

/**
 * Load configuration from Supabase
 * Falls back to environment variables if Supabase is not available
 */
export async function loadConfig(): Promise<AppConfig> {
  const now = Date.now()
  
  // Return cached config if still valid
  if (configCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return configCache
  }

  try {
    // Try to load from Supabase first
    const { data, error } = await supabase
      .from('app_config')
      .select('*')
      .eq('active', true)
      .single()

    if (error) {
      console.warn('Failed to load config from Supabase:', error.message)
      throw error
    }

    if (data) {
      configCache = {
        azure: {
          apiKey: data.azure_openai_api_key,
          basePath: data.azure_openai_base_path,
          deployment: data.azure_openai_deployment,
          apiVersion: data.azure_openai_api_version
        },
        langsmith: {
          apiKey: data.langsmith_api_key,
          projectName: data.langsmith_project_name,
          endpoint: data.langsmith_endpoint
        }
      }
      cacheTimestamp = now
      
      console.log('✅ Configuration loaded from Supabase')
      return configCache
    }
  } catch (error) {
    console.warn('⚠️ Supabase config load failed, falling back to environment variables')
  }

  // Fallback to environment variables
  const runtimeConfig = useRuntimeConfig()
  configCache = {
    azure: {
      apiKey: runtimeConfig.azureOpenAI.apiKey,
      basePath: runtimeConfig.azureOpenAI.basePath,
      deployment: runtimeConfig.azureOpenAI.deployment,
      apiVersion: runtimeConfig.azureOpenAI.apiVersion
    },
    langsmith: {
      apiKey: runtimeConfig.langsmith.apiKey,
      projectName: runtimeConfig.langsmith.projectName,
      endpoint: runtimeConfig.langsmith.endpoint
    }
  }
  cacheTimestamp = now

  console.log('📝 Configuration loaded from environment variables')
  return configCache
}

/**
 * Validate that all required configuration is present
 */
export function validateConfig(config: AppConfig): boolean {
  const required = [
    config.azure.apiKey,
    config.azure.basePath,
    config.azure.deployment,
    config.azure.apiVersion
  ]

  const missing = required.filter(value => !value)
  
  if (missing.length > 0) {
    console.error('❌ Missing required configuration values')
    return false
  }

  return true
}

/**
 * Clear the configuration cache (useful for testing or manual refresh)
 */
export function clearConfigCache(): void {
  configCache = null
  cacheTimestamp = 0
}