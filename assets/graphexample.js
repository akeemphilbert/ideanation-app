<script setup lang="ts">
import * as d3 from "d3";
import {useResizeObserver} from "ant-design-vue/es/_util/hooks/_vueuse/useResizeObserver";
import {select} from "d3";
import {NodeExpandOutlined, UnorderedListOutlined} from "@ant-design/icons-vue";
const svgRef = ref<SVGSVGElement | null>(null);
const route = useRoute();
const searchQuery = ref('')

onMounted(() => {
  //setup d3 graph for force directed graph
  const width = 400;
  const height = 400;
  const svg = select(svgRef.value);
  svg
    .attr("width", width)
    .attr("height", height);
  const links = [
    { source: "A", target: "B" },
    { source: "B", target: "C" },
    { source: "C", target: "A" },
  ];
  const nodes = Array.from(new Set(links.flatMap(link => [link.source, link.target])), id => ({ id }));
  const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => (d as any).id))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));

  // Reheat the simulation when drag starts, and fix the subject position.
  function dragstarted(event) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  // Update the subject (dragged node) position during drag.
  function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  // Restore the target alpha so the simulation cools after dragging ends.
  // Unfix the subject position now that it’s no longer being dragged.
  function dragended(event) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }
  const link = svg.append("g")
      .attr("stroke", "#000000")
      .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(links)
    .join("line")
      .attr("stroke-width", d => Math.sqrt(1));
  const node = svg.append("g")
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("r", 5)
    .attr("fill", "black")
    .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

  // Set the position attributes of links and nodes each time the simulation ticks.
  simulation.on("tick", () => {
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
  });

});

const onShowResourceList = () => {
  navigateTo("/resource/" + route.params.resource);
};

const onSearch = (value: string) => {
  searchQuery.value = value
}
</script>

<template>
  <div class="content">
    <a-card :title="route.params.resource">
      <template #extra>
        <a-tooltip :title="`View ${route.params.resource} list` ">
          <a-button shape="circle" :icon="h(UnorderedListOutlined)" @click="onShowResourceList" />
        </a-tooltip>
      </template>
      <a-row :gutter="[16,16]">
        <a-col :span="24">
          <a-input-search
              v-model:value="searchQuery"
              placeholder="enter query in natural language .e.g 'which products are missing a price'"
              size="large"
              enter-button
              @search="onSearch"
          />
        </a-col>
        <a-col :span="24">
          <div ref="resizeRef">
            <svg ref="svgRef">
              <g class="x-axis" />
              <g class="y-axis" />
            </svg>
          </div>
        </a-col>
      </a-row>

    </a-card>

  </div>

</template>

<style scoped>
svg {
  /* important for responsiveness */
  display: block;
  fill: none;
  stroke: none;
  width: 100%;
  height: 100%;
  overflow: visible;
  background: #fffffff;
}

.content{
  padding: 24px;
}
</style>