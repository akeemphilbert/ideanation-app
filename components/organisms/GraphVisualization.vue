<template>
  <div class="graph-visualization" ref="container">
    <svg 
      ref="svgElement" 
      :width="dimensions.width" 
      :height="dimensions.height"
      class="graph-svg"
    >
      <!-- Links/Edges -->
      <g class="links">
        <line
          v-for="link in links"
          :key="`${link.source.id}-${link.target.id}`"
          :x1="link.source.x"
          :y1="link.source.y"
          :x2="link.target.x"
          :y2="link.target.y"
          stroke="#666"
          stroke-width="2"
          stroke-dasharray="5,5"
          class="graph-link"
        />
      </g>
      
      <!-- Nodes -->
      <g class="nodes">
        <g
          v-for="node in nodes"
          :key="node.id"
          :transform="`translate(${node.x}, ${node.y})`"
          class="graph-node"
          @click="handleNodeClick(node)"
          @mouseenter="handleNodeHover(node)"
        >
          <circle
            :r="getNodeRadius(node)"
            :fill="getNodeColor(node)"
            stroke="#1a1a1a"
            stroke-width="2"
            class="node-circle"
          />
          
          <text
            :dy="getNodeRadius(node) + 20"
            text-anchor="middle"
            class="node-label handwritten"
            font-size="12"
            fill="#1a1a1a"
          >
            {{ node.title }}
          </text>
          
          <text
            text-anchor="middle"
            dy="4"
            class="node-icon"
            font-size="16"
          >
            {{ getNodeIcon(node.type) }}
          </text>
        </g>
      </g>
    </svg>
    
    <!-- Zoom controls -->
    <div class="zoom-controls">
      <button class="btn-sketch btn-small" @click="zoomIn">+</button>
      <button class="btn-sketch btn-small" @click="zoomOut">-</button>
      <button class="btn-sketch btn-small" @click="resetZoom">Reset</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as d3 from 'd3'

interface Node {
  id: string
  title: string
  type: string
  description: string
  x?: number
  y?: number
  fx?: number
  fy?: number
}

interface Link {
  source: Node
  target: Node
  relationship: string
}

interface Props {
  nodes: Node[]
  edges: Array<{ source: string, target: string, relationship: string }>
}

const props = defineProps<Props>()
const emit = defineEmits(['node-click', 'node-hover'])

const container = ref<HTMLElement>()
const svgElement = ref<SVGElement>()
const dimensions = reactive({
  width: 800,
  height: 600
})

const nodes = ref<Node[]>([])
const links = ref<Link[]>([])
let simulation: d3.Simulation<Node, Link> | null = null
let zoomBehavior: d3.ZoomBehavior<SVGElement, unknown> | null = null

onMounted(() => {
  initializeGraph()
  setupResize()
})

watch(() => props.nodes, () => {
  updateGraph()
}, { deep: true })

watch(() => props.edges, () => {
  updateGraph()
}, { deep: true })

const initializeGraph = () => {
  updateDimensions()
  setupZoom()
  updateGraph()
}

const updateDimensions = () => {
  if (container.value) {
    const rect = container.value.getBoundingClientRect()
    dimensions.width = rect.width
    dimensions.height = rect.height
  }
}

const setupZoom = () => {
  if (!svgElement.value) return
  
  zoomBehavior = d3.zoom<SVGElement, unknown>()
    .scaleExtent([0.1, 4])
    .on('zoom', (event) => {
      const svg = d3.select(svgElement.value)
      svg.selectAll('.nodes, .links').attr('transform', event.transform)
    })
  
  d3.select(svgElement.value).call(zoomBehavior)
}

const setupResize = () => {
  const resizeObserver = new ResizeObserver(() => {
    updateDimensions()
    if (simulation) {
      simulation.force('center', d3.forceCenter(dimensions.width / 2, dimensions.height / 2))
      simulation.alpha(0.3).restart()
    }
  })
  
  if (container.value) {
    resizeObserver.observe(container.value)
  }
  
  onUnmounted(() => {
    resizeObserver.disconnect()
  })
}

const updateGraph = () => {
  // Prepare nodes
  nodes.value = props.nodes.map(node => ({
    ...node,
    x: node.x || Math.random() * dimensions.width,
    y: node.y || Math.random() * dimensions.height
  }))
  
  // Prepare links
  const nodeMap = new Map(nodes.value.map(n => [n.id, n]))
  links.value = props.edges
    .filter(edge => nodeMap.has(edge.source) && nodeMap.has(edge.target))
    .map(edge => ({
      source: nodeMap.get(edge.source)!,
      target: nodeMap.get(edge.target)!,
      relationship: edge.relationship
    }))
  
  // Setup simulation
  if (simulation) {
    simulation.stop()
  }
  
  simulation = d3.forceSimulation(nodes.value)
    .force('link', d3.forceLink(links.value)
      .id((d: any) => d.id)
      .distance(80)
      .strength(0.1)
    )
    .force('charge', d3.forceManyBody().strength(-200))
    .force('center', d3.forceCenter(dimensions.width / 2, dimensions.height / 2))
    .force('collision', d3.forceCollide().radius(35))
    .on('tick', () => {
      // Force update of reactive arrays
      nodes.value = [...nodes.value]
      links.value = [...links.value]
    })
}

const getNodeRadius = (node: Node): number => {
  const baseRadius = 25
  const typeMultipliers: Record<string, number> = {
    problem: 1.2,
    solution: 1.2,
    customer: 1.0,
    feature: 0.9,
    job: 0.8,
    gain: 0.8,
    pain: 0.8
  }
  return baseRadius * (typeMultipliers[node.type] || 1.0)
}

const getNodeColor = (node: Node): string => {
  const colors: Record<string, string> = {
    problem: '#ffebee',
    customer: '#e3f2fd',
    job: '#fff3e0',
    gain: '#e8f5e8',
    pain: '#ffebee',
    feature: '#f3e5f5',
    solution: '#e0f2f1'
  }
  return colors[node.type] || '#f5f5f5'
}

const getNodeIcon = (type: string): string => {
  const icons: Record<string, string> = {
    problem: '⚠️',
    customer: '👤',
    job: '⚡',
    gain: '📈',
    pain: '😤',
    feature: '⚙️',
    solution: '💡'
  }
  return icons[type] || '📝'
}

const handleNodeClick = (node: Node) => {
  emit('node-click', node)
}

const handleNodeHover = (node: Node) => {
  emit('node-hover', node)
}

const zoomIn = () => {
  if (zoomBehavior && svgElement.value) {
    d3.select(svgElement.value).transition().call(
      zoomBehavior.scaleBy, 1.5
    )
  }
}

const zoomOut = () => {
  if (zoomBehavior && svgElement.value) {
    d3.select(svgElement.value).transition().call(
      zoomBehavior.scaleBy, 0.67
    )
  }
}

const resetZoom = () => {
  if (zoomBehavior && svgElement.value) {
    d3.select(svgElement.value).transition().call(
      zoomBehavior.transform,
      d3.zoomIdentity
    )
  }
}

onUnmounted(() => {
  if (simulation) {
    simulation.stop()
  }
})
</script>

<style scoped>
.graph-visualization {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.graph-svg {
  width: 100%;
  height: 100%;
  background: white;
  cursor: grab;
}

.graph-svg:active {
  cursor: grabbing;
}

.graph-node {
  cursor: pointer;
  transition: all 0.2s ease;
}

.graph-node:hover .node-circle {
  stroke-width: 3;
  filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));
}

.node-circle {
  transition: all 0.2s ease;
}

.node-label {
  font-family: var(--font-handwritten);
  pointer-events: none;
}

.node-icon {
  pointer-events: none;
}

.graph-link {
  transition: all 0.2s ease;
}

.graph-link:hover {
  stroke-width: 3;
  stroke: #333;
}

.zoom-controls {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.zoom-controls .btn-small {
  width: 30px;
  height: 30px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
}
</style>