export const useIdea = () => {
  const ideaStore = useIdeaStore()

  const currentIdea = computed(() => ideaStore.currentIdea)

  const addComponent = async (component: any) => {
    try {
      ideaStore.addComponent(component)
      // Optionally sync with backend
      await ideaStore.saveCurrentIdea()
    } catch (error) {
      console.error('Failed to add component:', error)
      throw error
    }
  }

  const updateComponent = async (component: any) => {
    try {
      ideaStore.updateComponent(component)
      await ideaStore.saveCurrentIdea()
    } catch (error) {
      console.error('Failed to update component:', error)
      throw error
    }
  }

  const removeComponent = async (componentId: string) => {
    try {
      ideaStore.removeComponent(componentId)
      await ideaStore.saveCurrentIdea()
    } catch (error) {
      console.error('Failed to remove component:', error)
      throw error
    }
  }

  const addRelationship = async (relationship: any) => {
    try {
      ideaStore.addRelationship(relationship)
      await ideaStore.saveCurrentIdea()
    } catch (error) {
      console.error('Failed to add relationship:', error)
      throw error
    }
  }

  const getComponentsByType = (type: string) => {
    return computed(() => 
      currentIdea.value.components.filter(c => c.type === type)
    )
  }

  const getRelatedComponents = (componentId: string) => {
    return computed(() => {
      const relationships = currentIdea.value.relationships.filter(
        r => r.source === componentId || r.target === componentId
      )
      
      return relationships.map(rel => {
        const relatedId = rel.source === componentId ? rel.target : rel.source
        return {
          component: currentIdea.value.components.find(c => c.id === relatedId),
          relationship: rel.relationship,
          strength: rel.strength
        }
      }).filter(item => item.component)
    })
  }

  const getIdeaStats = computed(() => {
    const components = currentIdea.value.components
    const relationships = currentIdea.value.relationships

    return {
      totalComponents: components.length,
      totalRelationships: relationships.length,
      componentsByType: components.reduce((acc, comp) => {
        acc[comp.type] = (acc[comp.type] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      avgConnectionsPerComponent: components.length > 0 
        ? (relationships.length * 2) / components.length 
        : 0
    }
  })

  return {
    currentIdea,
    addComponent,
    updateComponent,
    removeComponent,
    addRelationship,
    getComponentsByType,
    getRelatedComponents,
    getIdeaStats
  }
}