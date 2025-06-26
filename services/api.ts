export class ApiService {
  private baseUrl: string
  private apiKey: string

  constructor() {
    // In a real app, these would come from environment variables
    this.baseUrl = process.env.API_BASE_URL || 'https://api.ideanation.com'
    this.apiKey = process.env.API_KEY || 'demo-api-key'
  }

  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
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
  async getIdea(ideaId: string) {
    return this.makeRequest(`/ideas/${ideaId}`)
  }

  async createIdea(idea: any) {
    return this.makeRequest('/ideas', {
      method: 'POST',
      body: JSON.stringify(idea)
    })
  }

  async updateIdea(ideaId: string, idea: any) {
    return this.makeRequest(`/ideas/${ideaId}`, {
      method: 'PUT',
      body: JSON.stringify(idea)
    })
  }

  async deleteIdea(ideaId: string) {
    return this.makeRequest(`/ideas/${ideaId}`, {
      method: 'DELETE'
    })
  }

  // Component management
  async createComponent(component: any) {
    return this.makeRequest('/components', {
      method: 'POST',
      body: JSON.stringify(component)
    })
  }

  async updateComponent(componentId: string, component: any) {
    return this.makeRequest(`/components/${componentId}`, {
      method: 'PUT',
      body: JSON.stringify(component)
    })
  }

  async deleteComponent(componentId: string) {
    return this.makeRequest(`/components/${componentId}`, {
      method: 'DELETE'
    })
  }

  // Relationship management
  async createRelationship(relationship: any) {
    return this.makeRequest('/relationships', {
      method: 'POST',
      body: JSON.stringify(relationship)
    })
  }

  async updateRelationship(relationshipId: string, relationship: any) {
    return this.makeRequest(`/relationships/${relationshipId}`, {
      method: 'PUT',
      body: JSON.stringify(relationship)
    })
  }

  async deleteRelationship(relationshipId: string) {
    return this.makeRequest(`/relationships/${relationshipId}`, {
      method: 'DELETE'
    })
  }

  // AI Chat
  async sendChatMessage(message: string, context?: any) {
    return this.makeRequest('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, context })
    })
  }

  // Analytics and insights
  async getIdeaAnalytics(ideaId: string) {
    return this.makeRequest(`/ideas/${ideaId}/analytics`)
  }

  async getSimilarIdeas(ideaId: string) {
    return this.makeRequest(`/ideas/${ideaId}/similar`)
  }
}