import { createServerDebug } from '../../utils/debug'

export default defineEventHandler(async (event) => {
  const debug = createServerDebug('Server')
  
  // Log incoming request
  debug.debug(`Incoming request: ${event.method} ${event.path}`, {
    headers: event.headers
  })
  
  // Continue with the request
  return
}) 