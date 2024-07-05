function updateResult(method, cost, time) {
    document.getElementById(`${method}-cost`).innerText = cost;
    document.getElementById(`${method}-time`).innerText = time;
}
