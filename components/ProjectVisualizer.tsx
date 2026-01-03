import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { ProjectStructure, DirectoryNode, FileNode } from '../types';

interface ProjectVisualizerProps {
  data: ProjectStructure;
}

const ProjectVisualizer: React.FC<ProjectVisualizerProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!data || !svgRef.current || !wrapperRef.current) return;

    // Clear previous
    d3.select(svgRef.current).selectAll("*").remove();

    const width = wrapperRef.current.clientWidth;
    const height = 600;

    const root = d3.hierarchy<DirectoryNode | FileNode>(data);
    
    // Tree layout
    const treeLayout = d3.tree<DirectoryNode | FileNode>().size([height - 40, width - 160]);
    treeLayout(root);

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(40,20)");

    // Links
    svg.selectAll(".link")
      .data(root.links())
      .enter().append("path")
      .attr("class", "link")
      .attr("fill", "none")
      .attr("stroke", "#22d3ee") // Cyan 400
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5)
      .attr("d", d3.linkHorizontal<d3.HierarchyPointLink<DirectoryNode | FileNode>, d3.HierarchyPointNode<DirectoryNode | FileNode>>()
        .x(d => d.y)
        .y(d => d.x) as any
      );

    // Nodes
    const nodes = svg.selectAll(".node")
      .data(root.descendants())
      .enter().append("g")
      .attr("class", d => "node" + (d.children ? " node--internal" : " node--leaf"))
      .attr("transform", d => `translate(${d.y},${d.x})`);

    // Node Circles
    nodes.append("circle")
      .attr("r", 4)
      .attr("fill", d => d.data.type === 'directory' ? "#8b5cf6" : "#22d3ee") // Purple vs Cyan
      .attr("stroke", "#0f172a")
      .attr("stroke-width", 2);

    // Text Labels
    nodes.append("text")
      .attr("dy", 3)
      .attr("x", d => d.children ? -8 : 8)
      .style("text-anchor", d => d.children ? "end" : "start")
      .text(d => d.data.name.length > 20 ? d.data.name.substring(0, 17) + "..." : d.data.name)
      .style("font-family", "JetBrains Mono")
      .style("font-size", "10px")
      .style("fill", "#e2e8f0")
      .style("text-shadow", "0 0 5px #000");

  }, [data]);

  return (
    <div ref={wrapperRef} className="w-full h-[600px] bg-slate-900/50 rounded-xl border border-symbion-500/20 backdrop-blur-sm overflow-hidden shadow-[0_0_15px_rgba(6,182,212,0.1)]">
      <svg ref={svgRef} className="w-full h-full"></svg>
    </div>
  );
};

export default ProjectVisualizer;
