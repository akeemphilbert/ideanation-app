import { defineEventHandler } from "h3";
import { supabase } from "~/server/utils/supabase";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // Validate required fields
    const requiredFields = [
      'azure_openai_api_key',
      'azure_openai_base_path', 
      'azure_openai_deployment',
      'azure_openai_api_version'
    ]
    
    for (const field of requiredFields) {
      if (!body[field]) {
        throw createError({
          statusCode: 400,
          statusMessage: `Missing required field: ${field}`
        })
      }
    }

    // First, deactivate any existing active configurations
    await supabase
      .from('app_config')
      .update({ active: false })
      .eq('active', true)

    // Insert new configuration
    const { data, error } = await supabase
      .from('app_config')
      .insert({
        azure_openai_api_key: body.azure_openai_api_key,
        azure_openai_base_path: body.azure_openai_base_path,
        azure_openai_deployment: body.azure_openai_deployment,
        azure_openai_api_version: body.azure_openai_api_version,
        langsmith_api_key: body.langsmith_api_key || null,
        langsmith_project_name: body.langsmith_project_name || null,
        langsmith_endpoint: body.langsmith_endpoint || null,
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to save configuration: ${error.message}`
      })
    }

    // Clear the cache so new config is loaded immediately
    const { clearConfigCache } = await import('~/server/utils/supabase')
    clearConfigCache()

    return {
      success: true,
      message: 'Configuration saved successfully',
      data: {
        id: data.id,
        active: data.active,
        created_at: data.created_at
      }
    }

  } catch (error) {
    console.error('Config setup error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})