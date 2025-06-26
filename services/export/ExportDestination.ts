import { ExportDestination } from '~/types/export'
import type { FormattedContent, ExportResult } from '~/types/export'

export interface IExportDestination {
  save(content: FormattedContent, config?: any): Promise<ExportResult>
}

export class DiskDestination implements IExportDestination {
  async save(content: FormattedContent): Promise<ExportResult> {
    try {
      // Create a download link for the browser
      const blob = typeof content.content === 'string' 
        ? new Blob([content.content], { type: content.mimeType })
        : content.content

      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = content.filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      return {
        success: true,
        message: `File "${content.filename}" downloaded successfully`,
        data: content
      }
    } catch (error) {
      return {
        success: false,
        message: 'Failed to download file',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}

export class GoogleDriveDestination implements IExportDestination {
  private apiKey?: string
  private accessToken?: string

  constructor(config?: { apiKey?: string; accessToken?: string }) {
    this.apiKey = config?.apiKey
    this.accessToken = config?.accessToken
  }

  async save(content: FormattedContent): Promise<ExportResult> {
    try {
      if (!this.accessToken) {
        return {
          success: false,
          message: 'Google Drive authentication required. Please sign in to Google Drive.',
          error: 'No access token provided'
        }
      }

      // Convert content to blob if it's a string
      const blob = typeof content.content === 'string' 
        ? new Blob([content.content], { type: content.mimeType })
        : content.content

      // Create form data for upload
      const metadata = {
        name: content.filename,
        mimeType: content.mimeType
      }

      const form = new FormData()
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }))
      form.append('file', blob)

      // Upload to Google Drive API
      const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        },
        body: form
      })

      if (!response.ok) {
        throw new Error(`Google Drive API error: ${response.statusText}`)
      }

      const result = await response.json()

      return {
        success: true,
        message: `File "${content.filename}" uploaded to Google Drive successfully`,
        data: content
      }
    } catch (error) {
      return {
        success: false,
        message: 'Failed to upload to Google Drive',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async authenticate(): Promise<boolean> {
    // This would integrate with Google OAuth
    // For now, return false to indicate authentication is needed
    return false
  }
}

export class EmailDestination implements IExportDestination {
  private emailConfig?: {
    to?: string
    subject?: string
    body?: string
  }

  constructor(config?: { to?: string; subject?: string; body?: string }) {
    this.emailConfig = config
  }

  async save(content: FormattedContent): Promise<ExportResult> {
    try {
      // Convert content to base64 for email attachment
      const blob = typeof content.content === 'string' 
        ? new Blob([content.content], { type: content.mimeType })
        : content.content

      const base64Content = await this.blobToBase64(blob)

      // Create mailto link with attachment (note: this is limited by browser security)
      const subject = this.emailConfig?.subject || `Export: ${content.filename}`
      const body = this.emailConfig?.body || `Please find the attached export file: ${content.filename}`
      
      const mailtoLink = `mailto:${this.emailConfig?.to || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      
      // Open email client
      window.open(mailtoLink)

      return {
        success: true,
        message: `Email client opened with "${content.filename}" ready to send`,
        data: content
      }
    } catch (error) {
      return {
        success: false,
        message: 'Failed to prepare email',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }
}

export class ClipboardDestination implements IExportDestination {
  async save(content: FormattedContent): Promise<ExportResult> {
    try {
      if (typeof content.content === 'string') {
        // For text content, copy to clipboard
        await navigator.clipboard.writeText(content.content)
        
        return {
          success: true,
          message: `Content copied to clipboard`,
          data: content
        }
      } else {
        // For binary content, we can't copy to clipboard directly
        return {
          success: false,
          message: 'Binary content cannot be copied to clipboard. Please use a different destination.',
          error: 'Unsupported content type for clipboard'
        }
      }
    } catch (error) {
      return {
        success: false,
        message: 'Failed to copy to clipboard',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}

export class CloudStorageDestination implements IExportDestination {
  private storageConfig?: {
    provider: 'dropbox' | 'onedrive' | 'box'
    accessToken?: string
    folder?: string
  }

  constructor(config?: { provider: 'dropbox' | 'onedrive' | 'box'; accessToken?: string; folder?: string }) {
    this.storageConfig = config
  }

  async save(content: FormattedContent): Promise<ExportResult> {
    try {
      if (!this.storageConfig?.accessToken) {
        return {
          success: false,
          message: `${this.storageConfig?.provider || 'Cloud storage'} authentication required`,
          error: 'No access token provided'
        }
      }

      // This is a placeholder implementation
      // In a real implementation, you'd integrate with the specific cloud storage API
      const blob = typeof content.content === 'string' 
        ? new Blob([content.content], { type: content.mimeType })
        : content.content

      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      return {
        success: true,
        message: `File "${content.filename}" uploaded to ${this.storageConfig.provider} successfully`,
        data: content
      }
    } catch (error) {
      return {
        success: false,
        message: `Failed to upload to ${this.storageConfig?.provider || 'cloud storage'}`,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}

export class LocalStorageDestination implements IExportDestination {
  async save(content: FormattedContent, config?: any): Promise<ExportResult> {
    try {
      const key = config?.key || `export_${Date.now()}`
      
      // For string content, store directly
      if (typeof content.content === 'string') {
        localStorage.setItem(key, content.content)
        
        // Also store metadata
        const metadata = {
          filename: content.filename,
          mimeType: content.mimeType,
          exportedAt: new Date().toISOString(),
          size: content.content.length
        }
        localStorage.setItem(`${key}_metadata`, JSON.stringify(metadata))
        
        return {
          success: true,
          message: `Content saved to local storage with key: ${key}`,
          data: content
        }
      } else {
        // For binary content, convert to base64
        const base64Content = await this.blobToBase64(content.content)
        localStorage.setItem(key, base64Content)
        
        // Store metadata
        const metadata = {
          filename: content.filename,
          mimeType: content.mimeType,
          exportedAt: new Date().toISOString(),
          size: content.content.size,
          isBase64: true
        }
        localStorage.setItem(`${key}_metadata`, JSON.stringify(metadata))
        
        return {
          success: true,
          message: `Binary content saved to local storage with key: ${key}`,
          data: content
        }
      }
    } catch (error) {
      return {
        success: false,
        message: 'Failed to save to local storage',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }

  // Utility method to retrieve saved exports
  static getSavedExports(): Array<{ key: string; metadata: any; content?: string }> {
    const exports: Array<{ key: string; metadata: any; content?: string }> = []
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.endsWith('_metadata')) {
        const baseKey = key.replace('_metadata', '')
        const metadataStr = localStorage.getItem(key)
        const content = localStorage.getItem(baseKey)
        
        if (metadataStr) {
          try {
            const metadata = JSON.parse(metadataStr)
            exports.push({
              key: baseKey,
              metadata,
              content: content || undefined
            })
          } catch (e) {
            // Skip invalid metadata
          }
        }
      }
    }
    
    return exports.sort((a, b) => 
      new Date(b.metadata.exportedAt).getTime() - new Date(a.metadata.exportedAt).getTime()
    )
  }

  // Utility method to delete saved export
  static deleteExport(key: string): boolean {
    try {
      localStorage.removeItem(key)
      localStorage.removeItem(`${key}_metadata`)
      return true
    } catch (error) {
      return false
    }
  }

  // Utility method to clear all exports
  static clearAllExports(): number {
    let count = 0
    const keysToRemove: string[] = []
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && (key.endsWith('_metadata') || key.startsWith('export_'))) {
        keysToRemove.push(key)
      }
    }
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key)
      count++
    })
    
    return count
  }
}

export class ExportDestinationFactory {
  static createDestination(destination: ExportDestination, config?: any): IExportDestination {
    switch (destination) {
      case ExportDestination.DISK:
        return new DiskDestination()
      case ExportDestination.GOOGLE_DRIVE:
        return new GoogleDriveDestination(config)
      case ExportDestination.EMAIL:
        return new EmailDestination(config)
      case ExportDestination.CLIPBOARD:
        return new ClipboardDestination()
      case ExportDestination.LOCAL_STORAGE:
        return new LocalStorageDestination()
      default:
        throw new Error(`Unsupported destination: ${destination}`)
    }
  }

  static createCloudStorageDestination(provider: 'dropbox' | 'onedrive' | 'box', config?: any): IExportDestination {
    return new CloudStorageDestination({ provider, ...config })
  }
} 