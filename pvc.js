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
    let perms = permute(nodes.map(d => d.id));
    let minCost = Infinity;
    let minPath = [];
    perms.forEach(perm => {
        let cost = 0;
        for (let i = 0; i < perm.length - 1; i++) {
            let source = perm[i];
            let target = perm[i + 1];
            let link = links.find(d => (d.source.id === source && d.target.id === target) || (d.source.id === target && d.target.id === source));
            if (link) {
                cost += link.weight;
            } else {
                cost = Infinity;
                break;
            }
        }
        // Add cost to return to the starting node
        let link = links.find(d => (d.source.id === perm[perm.length - 1] && d.target.id === perm[0]) || (d.source.id === perm[0] && d.target.id === perm[perm.length - 1]));
        if (link) {
            cost += link.weight;
        } else {
            cost = Infinity;
        }
        if (cost < minCost) {
            minCost = cost;
            minPath = perm;
        }
    });
    let end = performance.now();
    document.getElementById('exhaustive-cost').innerText = minCost;
    document.getElementById('exhaustive-time').innerText = (end - start).toFixed(2);
    highlightPath(minPath);
}


function backtrackingTSP() {
    let start = performance.now();
    let n = nodes.length;
    let minPath = [];
    let minCost = Infinity;
    let visited = Array(n).fill(false);
    let path = [];

    function backtrack(curr, cost) {
        if (path.length === n) {
            let link = links.find(d => (d.source.id === curr && d.target.id === path[0]) || (d.source.id === path[0] && d.target.id === curr));
            if (link) {
                cost += link.weight;
                if (cost < minCost) {
                    minCost = cost;
                    minPath = path.slice();
                }
            }
            return;
        }

        for (let i = 0; i < n; i++) {
            if (!visited[i]) {
                let link = links.find(d => (d.source.id === curr && d.target.id === i) || (d.source.id === i && d.target.id === curr));
                if (link) {
                    visited[i] = true;
                    path.push(i);
                    backtrack(i, cost + link.weight);
                    path.pop();
                    visited[i] = false;
                }
            }
        }
    }

    for (let i = 0; i < n; i++) {
        visited[i] = true;
        path.push(i);
        backtrack(i, 0);
        path.pop();
        visited[i] = false;
    }

    let end = performance.now();
    document.getElementById('backtracking-cost').innerText = minCost;
    document.getElementById('backtracking-time').innerText = (end - start).toFixed(2);
    highlightPath(minPath);
}


function greedyTSP() {
    let start = performance.now();
    let n = nodes.length;
    let minPath = [0];
    let minCost = 0;
    let visited = Array(n).fill(false);
    visited[0] = true;

    for (let i = 0; i < n - 1; i++) {
        let last = minPath[minPath.length - 1];
        let nextNode = null;
        let minWeight = Infinity;
        for (let j = 0; j < n; j++) {
            if (!visited[j]) {
                let link = links.find(d => (d.source.id === last && d.target.id === j) || (d.source.id === j && d.target.id === last));
                if (link && link.weight < minWeight) {
                    minWeight = link.weight;
                    nextNode = j;
                }
            }
        }
        if (nextNode !== null) {
            visited[nextNode] = true;
            minPath.push(nextNode);
            minCost += minWeight;
        }
    }

    // Add cost to return to the starting node
    let last = minPath[minPath.length - 1];
    let link = links.find(d => (d.source.id === last && d.target.id === minPath[0]) || (d.source.id === minPath[0] && d.target.id === last));
    if (link) {
        minCost += link.weight;
    }

    let end = performance.now();
    document.getElementById('greedy-cost').innerText = minCost;
    document.getElementById('greedy-time').innerText = (end - start).toFixed(2);
    highlightPath(minPath);
}


function tsp1() {
    exhaustiveTSP();
}

function tsp2() {
    backtrackingTSP();
}

function tsp3() {
    greedyTSP();
}
