<template>
  <div class="graph-visualization" ref="container">
    <svg ref="svgRef" class="graph-svg">
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
  source: string | Node
  target: string | Node
  relationship: string
}

interface Props {
  nodes: Node[]
  edges: Array<{ source: string, target: string, relationship: string }>
}

const props = defineProps<Props>()
const emit = defineEmits(['node-click', 'node-hover'])

const container = ref<HTMLElement>()
const svgRef = ref<SVGElement>()

let simulation: d3.Simulation<Node, Link> | null = null
let svg: d3.Selection<SVGElement, unknown, null, undefined> | null = null
let zoomBehavior: d3.ZoomBehavior<SVGElement, unknown> | null = null

onMounted(() => {
  initializeGraph()
})

watch(() => [props.nodes, props.edges], () => {
  updateGraph()
}, { deep: true })

const initializeGraph = () => {
  if (!svgRef.value || !container.value) return

  const containerRect = container.value.getBoundingClientRect()
  const width = containerRect.width || 800
  const height = containerRect.height || 600

  svg = d3.select(svgRef.value)
    .attr('width', width)
    .attr('height', height)

  // Setup zoom behavior
  zoomBehavior = d3.zoom<SVGElement, unknown>()
    .scaleExtent([0.1, 4])
    .on('zoom', (event) => {
      svg?.selectAll('.graph-content').attr('transform', event.transform)
    })

  svg.call(zoomBehavior)

  // Create main group for graph content
  svg.append('g').attr('class', 'graph-content')

  updateGraph()
}

const updateGraph = () => {
  if (!svg || !svgRef.value || !container.value) return

  const containerRect = container.value.getBoundingClientRect()
  const width = containerRect.width || 800
  const height = containerRect.height || 600

  // Clear existing content
  svg.select('.graph-content').selectAll('*').remove()

  // Prepare data
  const nodes = [...props.nodes]
  const links: Link[] = props.edges.map(edge => ({
    source: edge.source,
    target: edge.target,
    relationship: edge.relationship
  }))

  if (nodes.length === 0) return

  // Create simulation
  simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links)
      .id((d: any) => d.id)
      .distance(100)
      .strength(0.1)
    )
    .force('charge', d3.forceManyBody().strength(-300))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide().radius(40))

  const graphContent = svg.select('.graph-content')

  // Create links
  const linkGroup = graphContent.append('g').attr('class', 'links')
  const link = linkGroup
    .selectAll('line')
    .data(links)
    .join('line')
    .attr('stroke', '#666')
    .attr('stroke-width', 2)
    .attr('stroke-dasharray', '5,5')
    .attr('class', 'graph-link')

  // Create nodes
  const nodeGroup = graphContent.append('g').attr('class', 'nodes')
  const node = nodeGroup
    .selectAll('.node-group')
    .data(nodes)
    .join('g')
    .attr('class', 'node-group graph-node')
    .style('cursor', 'pointer')
    .call(d3.drag<SVGGElement, Node>()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended)
    )
    .on('click', (event, d) => {
      emit('node-click', d)
    })
    .on('mouseenter', (event, d) => {
      emit('node-hover', d)
    })

  // Add circles to nodes
  node.append('circle')
    .attr('r', (d) => getNodeRadius(d))
    .attr('fill', (d) => getNodeColor(d))
    .attr('stroke', '#1a1a1a')
    .attr('stroke-width', 2)
    .attr('class', 'node-circle')

  // Add icons to nodes
  node.append('text')
    .attr('text-anchor', 'middle')
    .attr('dy', '0.35em')
    .attr('class', 'node-icon')
    .attr('font-size', '16')
    .attr('fill', '#1a1a1a')
    .text((d) => getNodeIcon(d.type))

  // Add labels to nodes
  node.append('text')
    .attr('text-anchor', 'middle')
    .attr('dy', (d) => getNodeRadius(d) + 20)
    .attr('class', 'node-label handwritten')
    .attr('font-size', '12')
    .attr('fill', '#1a1a1a')
    .text((d) => d.title.length > 15 ? d.title.substring(0, 15) + '...' : d.title)

  // Drag functions
  function dragstarted(event: any, d: Node) {
    if (!event.active && simulation) simulation.alphaTarget(0.3).restart()
    d.fx = d.x
    d.fy = d.y
  }

  function dragged(event: any, d: Node) {
    d.fx = event.x
    d.fy = event.y
  }

  function dragended(event: any, d: Node) {
    if (!event.active && simulation) simulation.alphaTarget(0)
    d.fx = null
    d.fy = null
  }

  // Update positions on simulation tick
  simulation.on('tick', () => {
    link
      .attr('x1', (d: any) => d.source.x)
      .attr('y1', (d: any) => d.source.y)
      .attr('x2', (d: any) => d.target.x)
      .attr('y2', (d: any) => d.target.y)

    node
      .attr('transform', (d) => `translate(${d.x},${d.y})`)
  })
}

const getNodeRadius = (node: Node): number => {
  const baseRadius = 25
  const typeMultipliers: Record<string, number> = {
    idea: 1.5,      // Make idea nodes larger as they're central
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
    idea: '#fff3e0',      // Light orange for central idea
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
    idea: '💡',
    problem: '⚠️',
    customer: '👤',
    job: '⚡',
    gain: '📈',
    pain: '😤',
    feature: '⚙️',
    solution: '🏗️'
  }
  return icons[type] || '📝'
}

const zoomIn = () => {
  if (zoomBehavior && svg) {
    svg.transition().call(zoomBehavior.scaleBy, 1.5)
  }
}

const zoomOut = () => {
  if (zoomBehavior && svg) {
    svg.transition().call(zoomBehavior.scaleBy, 0.67)
  }
}

const resetZoom = () => {
  if (zoomBehavior && svg) {
    svg.transition().call(zoomBehavior.transform, d3.zoomIdentity)
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
  display: block;
  fill: none;
  stroke: none;
  overflow: visible;
}

.graph-svg:active {
  cursor: grabbing;
}

:deep(.graph-node) {
  transition: all 0.2s ease;
}

:deep(.graph-node:hover .node-circle) {
  stroke-width: 3;
  filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));
}

:deep(.node-circle) {
  transition: all 0.2s ease;
}

:deep(.node-label) {
  font-family: var(--font-handwritten);
  pointer-events: none;
}

:deep(.node-icon) {
  pointer-events: none;
}

:deep(.graph-link) {
  transition: all 0.2s ease;
}

:deep(.graph-link:hover) {
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