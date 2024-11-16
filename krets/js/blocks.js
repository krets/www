const board_rows = 20;
const board_cols = 10;
let level = 1;
let lines = 0;
let score = 0;
let paused = false;
let tick_speed = 100;
const overlay = document.getElementById('overlay');
const cellsByCoord = {};

let nextShape = null;
let currentShape = null;
let currentX = 0;
let currentY = 0;
let isFirstShape = true;

const shapes = {
    I: [[-1, 0], [0, 0], [1, 0], [2, 0]],
    O: [[0, 0], [1, 0], [0, 1], [1, 1]],
    T: [[-1, 0], [0, 0], [1, 0], [0, 1]],
    S: [[0, 0], [1, 0], [-1, 1], [0, 1]],
    Z: [[-1, 0], [0, 0], [0, 1], [1, 1]],
    J: [[-1, 0], [0, 0], [1, 0], [-1, 1]],
    L: [[-1, 0], [0, 0], [1, 0], [1, 1]]
};
let selections = {}

// Function to get a cell by its coordinates
function getCellByCoord(x, y) {
    if (cellsByCoord[x] && cellsByCoord[x][y]) {
        return cellsByCoord[x][y];
    }
    return null;
}

// Function to create a deep copy of a shape
function copyShape(shape) {
    return shapes[shape].map(coord => [...coord]);
}

// Function to rotate a shape
function rotateShape(shapeCoords, rotation) {
    return shapeCoords.map(([x, y]) => {
        switch (rotation % 4) {
            case 0: // 0 degrees
                return [x, y];
            case 1: // 90 degrees clockwise
                return [y, -x];
            case 2: // 180 degrees
                return [-x, -y];
            case 3: // 270 degrees clockwise
                return [-y, x];
        }
    });
}



// Function to create a new shape instance
function createShape(shape) {
    return {
        type: shape,
        coords: copyShape(shape),
        rotation: 0,
        x: 0,
        y: 0
    };
}

// Function to rotate a shape instance
function rotateShapeInstance(shapeInstance) {
    shapeInstance.rotation = (shapeInstance.rotation + 1) % 4;
    shapeInstance.coords = rotateShape(shapeInstance.coords, 1);
}

function drawShape() {
    currentShape.coords.forEach(([dx, dy]) => {
        const cell = getCellByCoord(currentX + dx, currentY + dy);
        if (cell) {
            cell.classList.add('shape-' + currentShape.type);
        }
    });
}

// Function to clear a shape from the board
function clearShape() {
    currentShape.coords.forEach(([dx, dy]) => {
        const cell = getCellByCoord(currentX + dx, currentY + dy);
        if (cell) {
            cell.classList.remove('shape-' + currentShape.type);
        }
    });
}

document.addEventListener("DOMContentLoaded", function() {
    const board = document.getElementById("board");

    for(let y = 0; y < board_rows; y++) {
        for(let x = 0; x < board_cols; x++) {
            // Create a new cell
            const cell = document.createElement("div");
            cell.className = "cell";

            // Set a data attribute for coordinates (optional, but can be useful)
            cell.dataset.x = x;
            cell.dataset.y = y;

            // Add the cell to the board
            board.appendChild(cell);

            // Store a reference to the cell in our object
            if (!cellsByCoord[x]) {
                cellsByCoord[x] = {};
            }
            cellsByCoord[x][y] = cell;
        }
    }
    initializeGame();
    start();
});



function initializeGame() {
    // Clear the board
    for(let y = 0; y < board_rows; y++) {
        for(let x = 0; x < board_cols; x++) {
            const cell = getCellByCoord(x, y);
            if (cell) {
                cell.className = 'cell';
            }
        }
    }
    isFirstShape = true;
    spawnNewShape();
}

function moveLeft() {
    if (canMoveTo(currentX - 1, currentY)) {
        clearShape();
        currentX--;
        drawShape();
    }
}

function moveRight() {
    if (canMoveTo(currentX + 1, currentY)) {
        clearShape();
        currentX++;
        drawShape();
    }
}

function moveDown() {
    if (canMoveTo(currentX, currentY + 1)) {
        clearShape();
        currentY++;
        drawShape();
    } else {
        // Shape has landed
        lockShape();
        spawnNewShape();
    }
}

function rotate() {
    clearShape();

    const originalRotation = currentShape.rotation;
    const originalCoords = [...currentShape.coords];
    const originalX = currentX;

    rotateShapeInstance(currentShape);
    adjustPosition();

    if (!canMoveTo(currentX, currentY)) {
        // If still not valid after adjustment, revert everything
        currentShape.rotation = originalRotation;
        currentShape.coords = originalCoords;
        currentX = originalX;
    }

    drawShape();
}

function adjustPosition() {
    let minX = Infinity;
    let maxX = -Infinity;

    // Find the leftmost and rightmost x coordinates of the shape
    currentShape.coords.forEach(([dx, dy]) => {
        minX = Math.min(minX, currentX + dx);
        maxX = Math.max(maxX, currentX + dx);
    });

    // Adjust if off the left side
    if (minX < 0) {
        currentX -= minX;
    }

    // Adjust if off the right side
    if (maxX >= board_cols) {
        currentX -= (maxX - board_cols + 1);
    }
}


function canMoveTo(newX, newY) {
    return currentShape.coords.every(([dx, dy]) => {
        const x = newX + dx;
        const y = newY + dy;
        return x >= 0 && x < board_cols && y < board_rows && !isOccupied(x, y);
    });
}

function isOccupied(x, y) {
    const cell = getCellByCoord(x, y);
    return cell && cell.classList.contains('locked');
}

function lockShape() {
    currentShape.coords.forEach(([dx, dy]) => {
        const x = currentX + dx;
        const y = currentY + dy;
        const cell = getCellByCoord(x, y);
        if (cell) {
            cell.classList.add('locked');
        }
    });
    clearFullRows();
}

function spawnNewShape() {
    if (nextShape === null){
        nextShape = createShape(getRandomShape());
    }
    currentShape = nextShape;
    nextShape = createShape(getRandomShape());
    currentX = Math.floor(board_cols / 2) - 1;
    currentY = 0;
    if (!canMoveTo(currentX, currentY) && !isFirstShape) {
        // Game over
        alert('Game Over!');
        initializeGame();
    } else {
        drawShape();
        isFirstShape = false;
    }
}

function OLDgetRandomShape() {
    const shapeTypes = Object.keys(shapes);
    let shapeName = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
    selections[shapeName] ??= 0;
    selections[shapeName]++;
    return shapeName
}
function getRandomShape() {
    const shapeTypes = Object.keys(shapes);
    const weights = shapeTypes.map(shape => 1 / (selections[shape] || 1));
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;

    for (let i = 0; i < shapeTypes.length; i++) {
        random -= weights[i];
        if (random <= 0) {
            selections[shapeTypes[i]] = (selections[shapeTypes[i]] || 0) + 1;
            return shapeTypes[i];
        }
    }
}

window.addEventListener('blur', function () {
    overlay.style.display = 'flex'; // Show overlay
    overlay.textContent = "Paused";
    paused = true;
});

document.addEventListener('mousedown', (event) => {
    paused = false;
    overlay.style.display = 'none';
    event.preventDefault();
});
// Keyboard controls
document.addEventListener('keydown', (event) => {
    // Prevent default behavior for arrow keys and WASD
    if (['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', 'a', 'd', 's', 'w'].includes(event.key)) {
        event.preventDefault();
    }

    switch (event.key) {
        case 'ArrowLeft':
        case 'a':
            moveLeft();
            break;
        case 'ArrowRight':
        case 'd':
            moveRight();
            break;
        case 'ArrowDown':
        case 's':
            moveDown();
            break;
        case 'ArrowUp':
        case 'w':
            rotate();
            break;
    }
});

// Optional: Add a game loop for continuous downward movement
function gameLoop() {
    if(paused === false) {
        moveDown();
    }
    setTimeout(gameLoop, 1000);
}



function start() {
    setTimeout(gameLoop, 1000);
}

function clearFullRows() {
    for (let y = 0; y < board_rows; y++) {
        let isFull = true;
        for (let x = 0; x < board_cols; x++) {
            const cell = getCellByCoord(x, y);
            if (!cell || !cell.classList.contains('locked')) {
                isFull = false;
                break;
            }
        }
        if (isFull) {
            // Clear the full row
            for (let x = 0; x < board_cols; x++) {
                const cell = getCellByCoord(x, y);
                if (cell) {
                    cell.className = 'cell'; // Reset the cell
                }
            }
            // Move all rows above down by one
            for (let row = y; row > 0; row--) {
                for (let x = 0; x < board_cols; x++) {
                    const cellAbove = getCellByCoord(x, row - 1);
                    const cellCurrent = getCellByCoord(x, row);
                    if (cellAbove && cellCurrent) {
                        cellCurrent.className = cellAbove.className;
                    }
                }
            }
            // Clear the top row
            for (let x = 0; x < board_cols; x++) {
                const cell = getCellByCoord(x, 0);
                if (cell) {
                    cell.className = 'cell';
                }
            }
            // Check the same row again as it now contains the row above
            y--;
        }
    }
}