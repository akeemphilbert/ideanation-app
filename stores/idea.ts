import { defineStore } from 'pinia'
import { ApiService } from '~/services/api'

export interface AtomicComponent {
  id: string
  type: 'problem' | 'customer' | 'job' | 'gain' | 'pain' | 'feature' | 'solution'
  title: string
  description: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface ComponentRelationship {
  id: string
  source: string
  target: string
  relationship: string
  strength: number
}

export interface Idea {
  id: string
  title: string
  description: string
  components: AtomicComponent[]
  relationships: ComponentRelationship[]
  createdAt: Date
  updatedAt: Date
}

export const useIdeaStore = defineStore('idea', () => {
  const currentIdea = ref<Idea>({
    id: '',
    title: 'My Startup Idea',
    description: '',
    components: [],
    relationships: [],
    createdAt: new Date(),
    updatedAt: new Date()
  })

  const apiService = new ApiService()

  // Initialize with sample data for demo purposes
  const initializeSampleIdea = () => {
    currentIdea.value = {
      id: 'demo-idea-1',
      title: 'EcoCommute - Green Transportation App',
      description: 'An app that helps users find and share eco-friendly transportation options',
      components: [
        {
          id: 'comp-1',
          type: 'problem',
          title: 'Urban Traffic Congestion',
          description: 'Cities are overcrowded with cars, causing pollution and wasted time',
          tags: ['environment', 'urban', 'traffic'],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'comp-2',
          type: 'customer',
          title: 'Urban Commuters',
          description: 'People who commute daily in urban areas and care about the environment',
          tags: ['urban', 'commute', 'eco-conscious'],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'comp-3',
          type: 'solution',
          title: 'Carpooling & Transit App',
          description: 'Mobile app that combines carpooling, public transit, and bike sharing options',
          tags: ['app', 'transportation', 'sharing'],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'comp-4',
          type: 'gain',
          title: 'Reduced Carbon Footprint',
          description: 'Users can track and reduce their environmental impact',
          tags: ['environment', 'tracking', 'impact'],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'comp-5',
          type: 'feature',
          title: 'Real-time Route Optimization',
          description: 'AI-powered routing that considers traffic, weather, and carbon efficiency',
          tags: ['AI', 'routing', 'optimization'],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      relationships: [
        {
          id: 'rel-1',
          source: 'comp-1',
          target: 'comp-2',
          relationship: 'affects',
          strength: 0.8
        },
        {
          id: 'rel-2',
          source: 'comp-3',
          target: 'comp-1',
          relationship: 'solves',
          strength: 0.9
        },
        {
          id: 'rel-3',
          source: 'comp-3',
          target: 'comp-4',
          relationship: 'provides',
          strength: 0.7
        },
        {
          id: 'rel-4',
          source: 'comp-5',
          target: 'comp-3',
          relationship: 'enables',
          strength: 0.8
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  const addComponent = (component: Omit<AtomicComponent, 'createdAt' | 'updatedAt'>) => {
    const newComponent: AtomicComponent = {
      ...component,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    currentIdea.value.components.push(newComponent)
    currentIdea.value.updatedAt = new Date()
  }

  const updateComponent = (updatedComponent: AtomicComponent) => {
    const index = currentIdea.value.components.findIndex(c => c.id === updatedComponent.id)
    if (index !== -1) {
      currentIdea.value.components[index] = {
        ...updatedComponent,
        updatedAt: new Date()
      }
      currentIdea.value.updatedAt = new Date()
    }
  }

  const removeComponent = (componentId: string) => {
    currentIdea.value.components = currentIdea.value.components.filter(c => c.id !== componentId)
    currentIdea.value.relationships = currentIdea.value.relationships.filter(
      r => r.source !== componentId && r.target !== componentId
    )
    currentIdea.value.updatedAt = new Date()
  }

  const addRelationship = (relationship: Omit<ComponentRelationship, 'id'>) => {
    const newRelationship: ComponentRelationship = {
      ...relationship,
      id: `rel-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }
    
    currentIdea.value.relationships.push(newRelationship)
    currentIdea.value.updatedAt = new Date()
  }

  const removeRelationship = (relationshipId: string) => {
    currentIdea.value.relationships = currentIdea.value.relationships.filter(r => r.id !== relationshipId)
    currentIdea.value.updatedAt = new Date()
  }

  const processSuggestions = (suggestions: any[]) => {
    suggestions.forEach(suggestion => {
      if (suggestion.type === 'component') {
        addComponent(suggestion.data)
      } else if (suggestion.type === 'relationship') {
        addRelationship(suggestion.data)
      }
    })
  }

  const saveCurrentIdea = async () => {
    try {
      if (currentIdea.value.id) {
        await apiService.updateIdea(currentIdea.value.id, currentIdea.value)
      } else {
        const savedIdea = await apiService.createIdea(currentIdea.value)
        currentIdea.value.id = savedIdea.id
      }
    } catch (error) {
      console.error('Failed to save idea:', error)
      throw error
    }
  }

  const loadIdea = async (ideaId: string) => {
    try {
      const idea = await apiService.getIdea(ideaId)
      currentIdea.value = idea
    } catch (error) {
      console.error('Failed to load idea:', error)
      throw error
    }
  }

  return {
    currentIdea: readonly(currentIdea),
    initializeSampleIdea,
    addComponent,
    updateComponent,
    removeComponent,
    addRelationship,
    removeRelationship,
    processSuggestions,
    saveCurrentIdea,
    loadIdea
  }
})