document.addEventListener('DOMContentLoaded', () => {
    updateSliderValue();
    generateMatrixInput();
});

function updateSliderValue() {
    const slider = document.getElementById('matrix-dim');
    const output = document.getElementById('slider-value');
    output.textContent = slider.value;
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
