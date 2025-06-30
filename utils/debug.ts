export interface LogEntry {
  timestamp: string
  level: string
  message: string
  context?: string
  data?: any
  service: string
  environment: string
}

// Server-side debug utility
export function createServerDebug(context?: string) {
  const isDebugEnabled = process.env.DEBUG === 'true'
  const logLevel = process.env.LOG_LEVEL || 'info'

  const shouldLog = (level: string) => {
    if (!isDebugEnabled) return false
    const levels = ['debug', 'info', 'warn', 'error']
    const currentLevelIndex = levels.indexOf(logLevel)
    const messageLevelIndex = levels.indexOf(level)
    return messageLevelIndex >= currentLevelIndex
  }

  const createLogEntry = (level: string, message: string, data?: any): LogEntry => {
    return {
      timestamp: new Date().toISOString(),
      level: level.toUpperCase(),
      message,
      context,
      data,
      service: 'ideanation-app',
      environment: process.env.NODE_ENV || 'development'
    }
  }

  const logToConsole = (entry: LogEntry) => {
    // Output as JSON for Grafana compatibility
    console.log(JSON.stringify(entry))
  }

  return {
    debug: (message: string, data?: any) => {
      if (shouldLog('debug')) {
        const entry = createLogEntry('debug', message, data)
        logToConsole(entry)
      }
    },
    info: (message: string, data?: any) => {
      if (shouldLog('info')) {
        const entry = createLogEntry('info', message, data)
        logToConsole(entry)
      }
    },
    warn: (message: string, data?: any) => {
      if (shouldLog('warn')) {
        const entry = createLogEntry('warn', message, data)
        logToConsole(entry)
      }
    },
    error: (message: string, data?: any) => {
      if (shouldLog('error')) {
        const entry = createLogEntry('error', message, data)
        logToConsole(entry)
      }
    }
  }
} 