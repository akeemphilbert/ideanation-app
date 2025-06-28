import { defineEventHandler } from "h3";
import { loadConfig } from "~/server/utils/supabase";

export default defineEventHandler(async (event) => {
  try {
    const config = await loadConfig()
    
    // Return config without sensitive data
    return {
      success: true,
      data: {
        azure: {
          basePath: config.azure.basePath,
          deployment: config.azure.deployment,
          apiVersion: config.azure.apiVersion,
          hasApiKey: !!config.azure.apiKey
        },
        langsmith: {
          projectName: config.langsmith.projectName,
          endpoint: config.langsmith.endpoint,
          hasApiKey: !!config.langsmith.apiKey
        }
      }
    }
  } catch (error) {
    console.error('Config get error:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to load configuration'
    })
  }
})