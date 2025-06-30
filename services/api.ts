export class ApiService {
  private baseUrl: string

  constructor() {
    // In a real app, these would come from environment variables
    this.baseUrl = process.env.API_BASE_URL || 'https://api.ideanation.com'
  }

  private async makeRequest<T>(
    endpoint: string, 
    token: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers: defaultHeaders
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('API Request failed:', error)
      // For demo purposes, return mock data instead of throwing
      return this.getMockResponse<T>(endpoint, options.method || 'GET')
    }
  }

  private getMockResponse<T>(endpoint: string, method: string): T {
    // Mock responses for demo purposes
    if (endpoint.includes('/ideas') && method === 'GET') {
      return {
        id: 'mock-idea-1',
        title: 'Mock Idea',
        description: 'This is a mock response',
        components: [],
        relationships: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as T
    }

    if (endpoint.includes('/ideas') && method === 'POST') {
      return {
        id: `mock-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as T
    }

    return {} as T
  }

  // Idea management
  async getIdea(ideaId: string, token: string) {
    return this.makeRequest(`/ideas/${ideaId}`, token)
  }

  async createIdea(idea: any, token: string) {
    return this.makeRequest('/ideas', token, {
      method: 'POST',
      body: JSON.stringify(idea)
    })
  }

  async updateIdea(ideaId: string, idea: any, token: string) {
    return this.makeRequest(`/ideas/${ideaId}`, token, {
      method: 'PUT',
      body: JSON.stringify(idea)
    })
  }

  async deleteIdea(ideaId: string, token: string) {
    return this.makeRequest(`/ideas/${ideaId}`, token, {
      method: 'DELETE'
    })
  }

  // Component management
  async createComponent(component: any, token: string) {
    return this.makeRequest('/components', token, {
      method: 'POST',
      body: JSON.stringify(component)
    })
  }

  async updateComponent(componentId: string, component: any, token: string) {
    return this.makeRequest(`/components/${componentId}`, token, {
      method: 'PUT',
      body: JSON.stringify(component)
    })
  }

  async deleteComponent(componentId: string, token: string) {
    return this.makeRequest(`/components/${componentId}`, token, {
      method: 'DELETE'
    })
  }

  // Relationship management
  async createRelationship(relationship: any, token: string) {
    return this.makeRequest('/relationships', token, {
      method: 'POST',
      body: JSON.stringify(relationship)
    })
  }

  async updateRelationship(relationshipId: string, relationship: any, token: string) {
    return this.makeRequest(`/relationships/${relationshipId}`, token, {
      method: 'PUT',
      body: JSON.stringify(relationship)
    })
  }

  async deleteRelationship(relationshipId: string, token: string) {
    return this.makeRequest(`/relationships/${relationshipId}`, token, {
      method: 'DELETE'
    })
  }

  // AI Chat
  async sendChatMessage(message: string, token: string, context?: any) {
    return this.makeRequest('/chat', token, {
      method: 'POST',
      body: JSON.stringify({ message, context })
    })
  }

  // LangGraph streaming chat
  async sendMessageStream(message: string, token: string): Promise<AsyncIterable<any>> {
    const url = '/api/message/stream'
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ message })
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    if (!response.body) {
      throw new Error('No response body')
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    return {
      [Symbol.asyncIterator]: async function* () {
        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value)
            const lines = chunk.split('\n')

            for (const line of lines) {
              if (line.startsWith('update: ')) {
                try {
                  const update = JSON.parse(line.slice(8))
                  yield update
                } catch (e) {
                  console.warn('Failed to parse update:', line)
                }
              }
            }
          }
        } finally {
          reader.releaseLock()
        }
      }
    }
  }

  // Fetch current workspace state
  async getWorkspaceState(workspaceId: string, token: string) {
    const url = `/workspace/${workspaceId}/state`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  }

  // Fetch list of workspaces
  async getWorkspaceList(token: string) {
    const url = '/workspace/list'
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  }

  // Analytics and insights
  async getIdeaAnalytics(ideaId: string, token: string) {
    return this.makeRequest(`/ideas/${ideaId}/analytics`, token)
  }

  async getSimilarIdeas(ideaId: string, token: string) {
    return this.makeRequest(`/ideas/${ideaId}/similar`, token)
  }
}