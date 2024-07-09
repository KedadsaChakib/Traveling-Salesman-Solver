// network.js:
let nodes = [];
let links = [];

const svgWidth = 400;
const svgHeight = 600;

const svg = d3.select("#mynetwork")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    //.style("border", "1px solid black");

const width = +svg.attr("width");
const height = +svg.attr("height");

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

function generateMatrixInput() {
    const dim = parseInt(document.getElementById('matrix-dim').value);
    if (isNaN(dim) || dim <= 0) {
        alert("Invalid number of nodes");
        return;
    }

    let matrixContainer = document.getElementById('matrix-container');
    matrixContainer.innerHTML = '';

    let table = document.createElement('table');
    for (let i = 0; i < dim; i++) {
        let row = document.createElement('tr');
        for (let j = 0; j < dim; j++) {
            let cell = document.createElement('td');
            if (i !== j) {
                let input = document.createElement('input');
                input.type = 'number';
                input.min = '1';
                input.id = `cell-${i}-${j}`;
                input.oninput = () => synchronizeCells(i, j, input.value);
                cell.appendChild(input);
            } else {
                cell.innerText = 'X';
            }
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    matrixContainer.appendChild(table);
}

function synchronizeCells(i, j, value) {
    let mirrorCell = document.getElementById(`cell-${j}-${i}`);
    if (mirrorCell) {
        mirrorCell.value = value;
    }
}

function loadMatrix() {
    nodes = [];
    links = [];

    const dim = parseInt(document.getElementById('matrix-dim').value);
    for (let i = 0; i < dim; i++) {
        nodes.push({ id: i, label: 'Node ' + (i + 1), group: 1 });
    }

    for (let i = 0; i < dim; i++) {
        for (let j = 0; j < dim; j++) {
            if (i !== j) {
                const weight = parseInt(document.getElementById(`cell-${i}-${j}`).value);
                if (!isNaN(weight)) {
                    links.push({ source: i, target: j, weight: weight });
                }
            }
        }
    }
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
