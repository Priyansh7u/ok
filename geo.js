const canvas = document.getElementById('graphCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 600;
canvas.height = 400;

let scale = 10;
let offsetX = canvas.width / 2;
let offsetY = canvas.height / 2;
let colors = ['#007bff', '#28a745', '#ffc107', '#dc3545'];

function plotFunction(equations) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Plot X-axis and Y-axis
    ctx.strokeStyle = '#000';
    ctx.beginPath();
    ctx.moveTo(0, offsetY);
    ctx.lineTo(canvas.width, offsetY);
    ctx.moveTo(offsetX, 0);
    ctx.lineTo(offsetX, canvas.height);
    ctx.stroke();

    // Plot each function
    equations.forEach((equation, index) => {
        try {
            const func = new Function('x', `return ${equation.trim()};`);
            ctx.strokeStyle = colors[index % colors.length];
            ctx.beginPath();
            for (let x = -canvas.width / scale; x < canvas.width / scale; x += 0.01) {
                const px = x * scale + offsetX;
                const py = -func(x / scale) * scale + offsetY;
                if (x === -canvas.width / scale) {
                    ctx.moveTo(px, py);
                } else {
                    ctx.lineTo(px, py);
                }
            }
            ctx.stroke();
        } catch (e) {
            console.error(`Invalid function: ${equation}`);
        }
    });

    // Display Legend
    displayLegend(equations);
}

function displayLegend(equations) {
    ctx.font = '14px Arial';
    ctx.fillStyle = '#000';
    equations.forEach((equation, index) => {
        ctx.fillStyle = colors[index % colors.length];
        ctx.fillText(equation, 10, 20 * (index + 1));
    });
}

document.getElementById('plotButton').addEventListener('click', () => {
    const input = document.getElementById('functionInput').value;
    const equations = input.split(',').map(e => e.trim());
    plotFunction(equations);
});

document.getElementById('zoomInButton').addEventListener('click', () => {
    scale *= 1.5;
    plotFunction(document.getElementById('functionInput').value.split(',').map(e => e.trim()));
});

document.getElementById('zoomOutButton').addEventListener('click', () => {
    scale /= 1.5;
    plotFunction(document.getElementById('functionInput').value.split(',').map(e => e.trim()));
});

document.getElementById('resetButton').addEventListener('click', () => {
    scale = 10;
    offsetX = canvas.width / 2;
    offsetY = canvas.height / 2;
    plotFunction(document.getElementById('functionInput').value.split(',').map(e => e.trim()));
});

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) - offsetX;
    const mouseY = (e.clientY - rect.top) - offsetY;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    plotFunction(document.getElementById('functionInput').value.split(',').map(e => e.trim()));
    ctx.strokeStyle = '#ff0000';
    ctx.beginPath();
    ctx.moveTo(mouseX, 0);
    ctx.lineTo(mouseX, canvas.height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, mouseY);
    ctx.lineTo(canvas.width, mouseY);
    ctx.stroke();
    ctx.font = '14px Arial';
    ctx.fillStyle = '#ff0000';
    ctx.fillText(`(${mouseX / scale}, ${-mouseY / scale})`, mouseX, mouseY);
});

document.getElementById('toggleGridButton').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    plotFunction(document.getElementById('functionInput').value.split(',').map(e => e.trim()));
    if (ctx.grid) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    } else {
        ctx.grid = true;
        drawGrid();
    }
});

function drawGrid() {
    ctx.strokeStyle = '#e0e0e0';
    for (let x = 0; x <= canvas.width; x += scale) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += scale) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}
