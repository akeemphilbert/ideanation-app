# Debug Logging in Production (JSON Format for Grafana)

This guide shows you how to enable and use debug logging in your Nuxt.js application with JSON format output for Grafana integration.

## Environment Variables

To enable debug logging in production, set these environment variables:

```bash
# Enable debug mode
DEBUG=true

# Set log level (debug, info, warn, error)
LOG_LEVEL=debug

# For production deployment
NODE_ENV=production
```

## JSON Log Format

All logs are output in JSON format for easy parsing by Grafana and other log aggregation tools:

```json
{
  "timestamp": "2024-01-15T10:30:45.123Z",
  "level": "INFO",
  "message": "API Request: GET /api/data",
  "context": "API",
  "data": {
    "method": "GET",
    "url": "/api/data",
    "requestData": {}
  },
  "service": "ideanation-app",
  "environment": "production"
}
```

## Client-Side Usage

### In Components

```vue
<template>
  <div>
    <button @click="handleClick">Click me</button>
  </div>
</template>

<script setup>
const debug = useDebug()

// Log component lifecycle
onMounted(() => {
  debug.logComponentLifecycle('MyComponent', 'mounted')
})

// Log user interactions
const handleClick = () => {
  debug.info('Button clicked', { context: 'UserAction' })
  // Your logic here
}
</script>
```

### In Composables

```typescript
// composables/useApi.ts
export const useApi = () => {
  const debug = useDebug()
  
  const fetchData = async (url: string) => {
    debug.logApiRequest('GET', url)
    
    try {
      const response = await $fetch(url)
      debug.logApiResponse('GET', url, 200, response)
      return response
    } catch (error) {
      debug.error('API call failed', { context: 'API', data: { url, error } })
      throw error
    }
  }
  
  return { fetchData }
}
```

### In Stores (Pinia)

```typescript
// stores/counter.ts
export const useCounterStore = defineStore('counter', () => {
  const debug = useDebug()
  const count = ref(0)
  
  const increment = () => {
    count.value++
    debug.logStateChange('counter', 'increment', { newValue: count.value })
  }
  
  const decrement = () => {
    count.value--
    debug.logStateChange('counter', 'decrement', { newValue: count.value })
  }
  
  return { count, increment, decrement }
})
```

## Server-Side Usage

### In API Routes

```typescript
// server/api/example.ts
export default defineEventHandler(async (event) => {
  const debug = createServerDebug('API:Example')
  
  debug.info('API route called', {
    method: event.method,
    path: event.path
  })
  
  try {
    // Your API logic here
    const result = await someAsyncOperation()
    
    debug.info('API operation completed', { result })
    return result
  } catch (error) {
    debug.error('API operation failed', { error: error.message })
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
```

### In Server Middleware

```typescript
// server/middleware/auth.ts
export default defineEventHandler(async (event) => {
  const debug = createServerDebug('Middleware:Auth')
  
  debug.debug('Auth middleware processing', {
    path: event.path,
    method: event.method
  })
  
  // Your auth logic here
  
  debug.info('Auth middleware completed')
})
```

## Log Levels

The debug system supports different log levels:

- **debug**: Detailed debugging information
- **info**: General information about application flow
- **warn**: Warning messages for potential issues
- **error**: Error messages for actual problems

## Automatic Logging

The debug system automatically logs:

- **API Requests/Responses**: All fetch calls are intercepted and logged
- **Navigation Events**: Route changes are logged
- **Error Events**: Global errors and unhandled promise rejections
- **Performance Metrics**: Page load times and performance data
- **Server Requests**: All incoming HTTP requests to the server

## Grafana Integration

### Log Query Examples

With the JSON format, you can easily query logs in Grafana:

```sql
-- All API requests
{service="ideanation-app"} |= "API Request"

-- All errors in production
{service="ideanation-app", environment="production"} |= "ERROR"

-- API responses with status 500
{service="ideanation-app"} |= "API Response" | json | status = 500

-- Component lifecycle events
{service="ideanation-app"} |= "Component" | json | context = "Component"

-- Performance metrics
{service="ideanation-app"} |= "Page load performance"
```

### Grafana Dashboard Fields

The JSON logs provide these fields for dashboard creation:

- `timestamp`: ISO timestamp for time series
- `level`: Log level (DEBUG, INFO, WARN, ERROR)
- `message`: Human-readable log message
- `context`: Context category (API, Component, State, etc.)
- `data`: Structured data object
- `service`: Service name (ideanation-app)
- `environment`: Environment (development, production, etc.)

### Example Grafana Queries

```sql
-- Error rate over time
rate({service="ideanation-app", level="ERROR"}[5m])

-- API response times
{service="ideanation-app"} |= "API Response" | json | unwrap data.responseData.duration

-- Most active components
{service="ideanation-app"} |= "Component" | json | context = "Component" | group_by data.componentName

-- User interactions
{service="ideanation-app"} |= "UserAction" | json
```

## Production Deployment

When deploying to production with debug enabled:

1. Set the environment variables in your deployment platform
2. Ensure your logging infrastructure can handle the increased log volume
3. Configure log aggregation to parse JSON format
4. Set up Grafana dashboards for monitoring
5. Monitor log storage costs

## Example JSON Output

With debug enabled, you'll see logs like:

```json
{"timestamp":"2024-01-15T10:30:45.123Z","level":"INFO","message":"Nitro server plugin initialized","context":"Server","service":"ideanation-app","environment":"production"}
{"timestamp":"2024-01-15T10:30:45.456Z","level":"DEBUG","message":"Incoming request: GET /api/data","context":"Server","data":{"headers":{}},"service":"ideanation-app","environment":"production"}
{"timestamp":"2024-01-15T10:30:45.789Z","level":"INFO","message":"API Request: GET /api/data","context":"API","data":{"method":"GET","url":"/api/data","requestData":{}},"service":"ideanation-app","environment":"production"}
{"timestamp":"2024-01-15T10:30:46.012Z","level":"INFO","message":"API Response: GET /api/data - 200","context":"API","data":{"method":"GET","url":"/api/data","status":200,"responseData":{}},"service":"ideanation-app","environment":"production"}
{"timestamp":"2024-01-15T10:30:47.678Z","level":"DEBUG","message":"Navigation: / → /dashboard","context":"Router","data":{"to":{"path":"/dashboard"},"from":{"path":"/"}},"service":"ideanation-app","environment":"production"}
```

## Disabling Debug Logs

To disable debug logs, simply set:

```bash
DEBUG=false
```

Or remove the DEBUG environment variable entirely. 