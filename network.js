let nodes = [
  { id: 0, label: 'Node 1', group: 1 },
  { id: 1, label: 'Node 2', group: 1 },
  { id: 2, label: 'Node 3', group: 1 },
  { id: 3, label: 'Node 4', group: 1 },
  { id: 4, label: 'Node 5', group: 1 },
  { id: 5, label: 'Node 6', group: 1 }
];

let links = [
  { source: 0, target: 1, weight: 10 },
  { source: 0, target: 2, weight: 11 },
  { source: 0, target: 3, weight: 12 },
  { source: 0, target: 4, weight: 13 },
  { source: 0, target: 5, weight: 14 },
  { source: 1, target: 2, weight: 15 },
  { source: 1, target: 3, weight: 16 },
  { source: 1, target: 4, weight: 17 },
  { source: 1, target: 5, weight: 18 },
  { source: 2, target: 3, weight: 19 },
  { source: 2, target: 4, weight: 20 },
  { source: 2, target: 5, weight: 21 },
  { source: 3, target: 4, weight: 22 },
  { source: 3, target: 5, weight: 23 },
  { source: 4, target: 5, weight: 24 }
];

const svg = d3.select("#mynetwork")
  .append("svg")
  .attr("width", "100%")
  .attr("height", 600);

const width = +svg.style("width").replace("px", "");
const height = +svg.style("height").replace("px", "");

const color = d3.scaleOrdinal(d3.schemeCategory10);

const simulation = d3.forceSimulation(nodes)
  .force("link", d3.forceLink(links).id(d => d.id).distance(150))
  .force("charge", d3.forceManyBody().strength(-300))
  .force("center", d3.forceCenter(width / 2, height / 2));

let link = svg.append("g")
  .attr("class", "links")
  .selectAll("line");

let linkText = svg.append("g")
  .attr("class", "link-labels")
  .selectAll("text");

let node = svg.append("g")
  .attr("class", "nodes")
  .selectAll("circle");

let label = svg.append("g")
  .attr("class", "labels")
  .selectAll("text");

function restart() {
  link = link.data(links, d => d.source.id + "-" + d.target.id);
  link.exit().remove();
  link = link.enter().append("line")
      .attr("stroke-width", 2)
      .attr("stroke", "#999")
      .merge(link);

  linkText = linkText.data(links, d => d.source.id + "-" + d.target.id);
  linkText.exit().remove();
  linkText = linkText.enter().append("text")
      .attr("dx", 5)
      .attr("dy", -5)
      .text(d => d.weight)
      .merge(linkText);

  node = node.data(nodes, d => d.id);
  node.exit().remove();
  node = node.enter().append("circle")
      .attr("r", 10)
      .attr("fill", d => color(d.group))
      .call(d3.drag()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended))
      .merge(node);

  label = label.data(nodes, d => d.id);
  label.exit().remove();
  label = label.enter().append("text")
      .attr("dx", 12)
      .attr("dy", ".35em")
      .text(d => d.label)
      .merge(label);

  simulation.nodes(nodes).on("tick", ticked);
  simulation.force("link").links(links);
  simulation.alpha(1).restart();
}

function ticked() {
  link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

  linkText
      .attr("x", d => (d.source.x + d.target.x) / 2)
      .attr("y", d => (d.source.y + d.target.y) / 2);

  node
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);

  label
      .attr("x", d => d.x)
      .attr("y", d => d.y);
}

function dragstarted(event, d) {
  if (!event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(event, d) {
  d.fx = event.x;
  d.fy = event.y;
}

function dragended(event, d) {
  if (!event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}

function addNode() {
    const newNode = { id: nodes.length, label: 'Node ' + (nodes.length + 1), group: 1 };
    nodes.push(newNode);
    restart();
}

function deleteNode() {
    const id = parseInt(prompt("Node ID:"));
    if (isNaN(id) || !nodes.some(n => n.id === id)) {
        alert("Invalid Node ID");
        return;
    }
    nodes = nodes.filter(n => n.id !== id);
    links = links.filter(e => e.source.id !== id && e.target.id !== id);

    // Reindex nodes
    nodes.forEach((node, index) => {
        node.id = index;
        node.label = 'Node ' + (index + 1);
    });

    // Update links to reflect new node IDs
    links.forEach(link => {
        link.source = nodes.find(n => n.id === link.source.id);
        link.target = nodes.find(n => n.id === link.target.id);
    });
    restart();
}

function addEdge() {
    const source = parseInt(prompt("Source Node ID:"));
    const target = parseInt(prompt("Target Node ID:"));
    const weight = parseInt(prompt("Weight:"));
    if (isNaN(source) || isNaN(target) || isNaN(weight) || source === target || !nodes.some(n => n.id === source) || !nodes.some(n => n.id === target)) {
        alert("Invalid input");
        return;
    }
    links.push({ source: nodes[source], target: nodes[target], weight });
    restart();
}

function deleteEdge() {
    const source = parseInt(prompt("Source Node ID:"));
    const target = parseInt(prompt("Target Node ID:"));
    if (isNaN(source) || isNaN(target) || source === target || !nodes.some(n => n.id === source) || !nodes.some(n => n.id === target)) {
        alert("Invalid input");
        return;
    }
    links = links.filter(e => !(e.source.id === source && e.target.id === target));
    restart();
}

function highlightPath(path) {
    const pathSet = new Set(path.map((_, i) => path[i] !== undefined && path[i + 1] !== undefined ? [path[i], path[i + 1]].sort().toString() : null).filter(e => e !== null));

    link.attr("stroke", d => {
        const edgeSet = [d.source.id, d.target.id].sort().toString();
        return pathSet.has(edgeSet) ? "red" : "#999";
    });
}

restart();
