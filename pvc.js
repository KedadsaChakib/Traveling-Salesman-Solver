function permute(permutation) {
    var length = permutation.length,
        result = [permutation.slice()],
        c = new Array(length).fill(0),
        i = 1, k, p;

    while (i < length) {
        if (c[i] < i) {
            k = i % 2 && c[i];
            p = permutation[i];
            permutation[i] = permutation[k];
            permutation[k] = p;
            ++c[i];
            i = 1;
            result.push(permutation.slice());
        } else {
            c[i] = 0;
            ++i;
        }
    }
    return result;
}

function exhaustiveTSP() {
    let start = performance.now();
    let minPath = [];
    let minCost = Infinity;
    let perms = permute(nodes.map(d => d.id));

    perms.forEach(function (perm) {
        let currentCost = 0;
        for (let i = 0; i < perm.length - 1; i++) {
            let link = links.find(d => (d.source.id === perm[i] && d.target.id === perm[i + 1]) || (d.source.id === perm[i + 1] && d.target.id === perm[i]));
            currentCost += link ? link.weight : Infinity;
        }
        if (currentCost < minCost) {
            minCost = currentCost;
            minPath = perm;
        }
    });

    let end = performance.now();
    updateResult('exhaustive', minCost, (end - start).toFixed(2));
    highlightPath(minPath);
}

function tsp1() {
    exhaustiveTSP();
}

function backtrack(path, visited, currentCost, level, start) {
    if (level === nodes.length) {
        let link = links.find(d => (d.source.id === path[0] && d.target.id === path[level - 1]) || (d.source.id === path[level - 1] && d.target.id === path[0]));
        currentCost += link ? link.weight : Infinity;
        if (currentCost < minCost) {
            minCost = currentCost;
            minPath = path.slice();
        }
        return;
    }

    for (let i = 0; i < nodes.length; i++) {
        if (!visited[i]) {
            let link = links.find(d => (d.source.id === path[level - 1] && d.target.id === nodes[i].id) || (d.source.id === nodes[i].id && d.target.id === path[level - 1]));
            let weight = link ? link.weight : Infinity;
            if (currentCost + weight < minCost) {
                visited[i] = true;
                path[level] = nodes[i].id;
                backtrack(path, visited, currentCost + weight, level + 1, start);
                visited[i] = false;
            }
        }
    }
}

function backtrackingTSP() {
    let start = performance.now();
    minCost = Infinity;
    minPath = [];
    let path = new Array(nodes.length);
    let visited = new Array(nodes.length).fill(false);

    path[0] = nodes[0].id;
    visited[0] = true;
    backtrack(path, visited, 0, 1, 0);

    let end = performance.now();
    updateResult('backtracking', minCost, (end - start).toFixed(2));
    highlightPath(minPath);
}

function tsp2() {
    backtrackingTSP();
}

function greedyTSP() {
    let start = performance.now();
    let visited = new Set();
    let path = [];
    let current = nodes[0].id;
    let totalCost = 0;

    visited.add(current);
    path.push(current);

    while (path.length < nodes.length) {
        let nextNode = null;
        let minWeight = Infinity;

        links.forEach(link => {
            if (link.source.id === current && !visited.has(link.target.id) && link.weight < minWeight) {
                nextNode = link.target.id;
                minWeight = link.weight;
            }
            if (link.target.id === current && !visited.has(link.source.id) && link.weight < minWeight) {
                nextNode = link.source.id;
                minWeight = link.weight;
            }
        });

        if (nextNode !== null) {
            visited.add(nextNode);
            path.push(nextNode);
            totalCost += minWeight;
            current = nextNode;
        }
    }

    let end = performance.now();
    updateResult('greedy', totalCost, (end - start).toFixed(2));
    highlightPath(path);
}

function tsp3() {
    greedyTSP();
}
