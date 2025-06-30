export default defineEventHandler(async (event) => {
  // Handle CORS preflight requests
  if (event.method === 'OPTIONS') {
    setResponseHeaders(event, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept, Origin',
      'Access-Control-Max-Age': '86400',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Expose-Headers': 'Content-Length, Content-Range'
    })
    
    return { status: 'ok' }
  }
  
  // Add CORS headers to all responses
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept, Origin',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Expose-Headers': 'Content-Length, Content-Range'
  }
  
  // For streaming responses, we need to be more careful with headers
  const contentType = getHeader(event, 'content-type')
  const isStreaming = contentType?.includes('text/event-stream')
  
  if (isStreaming) {
    // For streaming responses, add CORS headers individually to avoid type conflicts
    Object.entries(corsHeaders).forEach(([key, value]) => {
      setResponseHeader(event, key, value)
    })
  } else {
    // For regular responses, set all headers at once
    setResponseHeaders(event, corsHeaders)
  }
}) 