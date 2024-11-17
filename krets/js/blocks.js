/*
ToDo:
 - Background Generator
 - optional ghostblock
 - better colors for triangle and graph board.
 */
const board_rows = 20;
const board_cols = 10;
let level = 1;
let lines = 0;
let score = 0;
let paused = false;
let game_over = false;
let tick_speed = 100;
const lines_per_level = 10;
const overlay = document.getElementById('overlay');
const boardCellsByCoord = {};
const previewCellsByCoord = {};
const leaderBoardKey = "leader_board";

let nextShape = null;
let currentShape = null;
let currentX = 0;
let currentY = 0;
let isFirstShape = true;
let lockDelay = 500; // 500 milliseconds (0.5 seconds) delay
let lockTimer = null;

// points per line clear
const linePoints = [ 40, 100, 300, 1200 ]


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
function getCellByCoord(cellsObject, x, y) {
    if (cellsObject[x] && cellsObject[x][y]) {
        return cellsObject[x][y];
    }
    return null;
}
function getBoardCellByCoord(x, y){
    return getCellByCoord(boardCellsByCoord, x, y)
}

function forEachCell(cellsObject, callback) {
    for (let x in cellsObject) {
        for (let y in cellsObject[x]) {
            callback(cellsObject[x][y], parseInt(x), parseInt(y));
        }
    }
}

// Function to create a deep copy of a shape
function copyShape(shape) {
    return shapes[shape].map(coord => [...coord]);
}

// Function to rotate a shape
function rotateShape(shapeCoords, rotation) {
    // Calculate the center of the shape before rotation
    const center = calculateCenter(shapeCoords);

    // Perform rotation
    const rotatedCoords = shapeCoords.map(([x, y]) => {
        // Translate to origin
        const tx = x - center[0];
        const ty = y - center[1];

        let rx, ry;
        switch (rotation % 4) {
            case 0: // 0 degrees
                [rx, ry] = [tx, ty];
                break;
            case 1: // 90 degrees clockwise
                [rx, ry] = [ty, -tx];
                break;
            case 2: // 180 degrees
                [rx, ry] = [-tx, -ty];
                break;
            case 3: // 270 degrees clockwise
                [rx, ry] = [-ty, tx];
                break;
        }

        // Translate back and round
        return [Math.round(rx + center[0]), Math.round(ry + center[1])];
    });

    // Calculate the new center after rotation
    const newCenter = calculateCenter(rotatedCoords);

    // Adjust coordinates to maintain the original center
    const adjustment = [
        Math.round(center[0] - newCenter[0]),
        Math.round(center[1] - newCenter[1])
    ];

    return rotatedCoords.map(([x, y]) => [x + adjustment[0], y + adjustment[1]]);
}

function calculateCenter(coords) {
    const sum = coords.reduce((acc, [x, y]) => [acc[0] + x, acc[1] + y], [0, 0]);
    return [
        Math.round(sum[0] / coords.length),
        Math.round(sum[1] / coords.length)
    ];
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
        const cell = getBoardCellByCoord( currentX + dx, currentY + dy);
        if (cell) {
            cell.classList.add('shape-' + currentShape.type);
        }
    });
    renderGhostShape();
}

function drawPreview() {
    resetCells(previewCellsByCoord);

    const centerX = 1;
    const centerY = 0;

    nextShape.coords.forEach(([dx, dy]) => {
        const cell = getCellByCoord(previewCellsByCoord, centerX + dx, centerY + dy);
        if (cell) {
            cell.classList.add('shape-' + nextShape.type);
        }
    });
}

// Function to clear a shape from the board
function clearShape() {
    currentShape.coords.forEach(([dx, dy]) => {
        const cell = getBoardCellByCoord(currentX + dx, currentY + dy);
        if (cell) {
            cell.classList.remove('shape-' + currentShape.type);
        }
    });
}

document.addEventListener("DOMContentLoaded", function() {
    const board = document.getElementById("board");
    const preview = document.getElementById("preview");

    createBoard(board, board_rows, board_cols, boardCellsByCoord);
    createBoard(preview, 2, 4, previewCellsByCoord);

    initializeGame();
    updateLeaderBoard();
    setTimeout(gameLoop, 1000);
});

function updateInfo() {
    document.getElementById("game-container").className = `level-${level}`;
    document.getElementById("score-value").textContent = score;
    document.getElementById("lines-value").textContent = lines;
    document.getElementById("level-value").textContent = level;
}

function createBoard(container, rows, cols, cellsObject) {
    for(let y = 0; y < rows; y++) {
        for(let x = 0; x < cols; x++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            cell.dataset.x = x;
            cell.dataset.y = y;
            container.appendChild(cell);

            if (!cellsObject[x]) {
                cellsObject[x] = {};
            }
            cellsObject[x][y] = cell;
        }
    }
}

function resetCells(cellsObject) {
    forEachCell(cellsObject, (cell) => {
        cell.className = 'cell';
    });
}

function initializeGame() {
    // Clear the board
    for(let y = 0; y < board_rows; y++) {
        for(let x = 0; x < board_cols; x++) {
            const cell = getBoardCellByCoord(x, y);
            if (cell) {
                cell.className = 'cell';
            }
        }
    }
    lines = 0;
    points = 0;
    level = 1;
    isFirstShape = true;
    game_over = false;
    updateInfo()
    spawnNewShape();
}

function moveLeft() {
    if (canMoveTo(currentX - 1, currentY)) {
        clearShape();
        currentX--;
        drawShape();
        resetLockTimer();
    }
}

function moveRight() {
    if (canMoveTo(currentX + 1, currentY)) {
        clearShape();
        currentX++;
        drawShape();
        resetLockTimer();
    }
}

function resetLockTimer() {
    if (lockTimer) {
        clearTimeout(lockTimer);
        lockTimer = null;
    }
    if (!canMoveTo(currentX, currentY + 1)) {
        lockTimer = setTimeout(() => {
            lockShape();
            spawnNewShape();
            lockTimer = null;
        }, lockDelay);
    }
}
function moveDown() {
    if (canMoveTo(currentX, currentY + 1)) {
        clearShape();
        currentY++;
        drawShape();
        if (lockTimer) {
            clearTimeout(lockTimer);
            lockTimer = null;
        }
    } else {
        if (!lockTimer) {
            lockTimer = setTimeout(() => {
                lockShape();
                spawnNewShape();
                lockTimer = null;
            }, lockDelay);
        }
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
    resetLockTimer();
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
    const cell = getBoardCellByCoord(x, y);
    return cell && cell.classList.contains('locked');
}

function lockShape() {
    currentShape.coords.forEach(([dx, dy]) => {
        const x = currentX + dx;
        const y = currentY + dy;
        const cell = getBoardCellByCoord(x, y);
        if (cell) {
            cell.classList.add('locked');
        }
    });
    clearFullRows();
}

function spawnNewShape() {
    if (game_over){
        return;
    }
    if (nextShape === null){
        nextShape = createShape(getRandomShape());
    }
    currentShape = nextShape;
    nextShape = createShape(getRandomShape());
    drawPreview();
    currentX = Math.floor(board_cols / 2) - 1;
    currentY = 0;
    if (!canMoveTo(currentX, currentY) && !isFirstShape) {
        // Game over
        endGame();
    } else {
        drawShape();
        isFirstShape = false;
    }
}

function endGame(){
    pause("Game Over!");
    game_over = true;
    updateLeaderBoard();
}

function updateLeaderBoard(){
    const scores = JSON.parse(localStorage.getItem(leaderBoardKey)) || [];
    if (score > 0){
        scores.push(score);
    }
    scores.sort((a, b) => b - a); // Sort scores in descending order
    localStorage.setItem(leaderBoardKey, JSON.stringify(scores));
    const leaderBoardDiv = document.getElementById('leader_board');
    leaderBoardDiv.innerHTML = '';

    const list = document.createElement('ol');
    leaderBoardDiv.appendChild(list);
    scores.slice(0, 10).forEach(score => {
        const listItem = document.createElement('li');
        listItem.textContent = score;
        list.appendChild(listItem);
    });
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
    pause();
});

function pause(message=null){
    if(message === null){
        message = "Paused"
    }
    overlay.style.display = 'flex';
    overlay.textContent = message;
    paused = true;
}

function unpause(){
    paused = false;
    overlay.style.display = 'none';
    if(game_over === true){
        initializeGame();
    }
}

function togglePause() {
    if (paused) {
        unpause();
    } else {
        pause();
    }
}

document.getElementById('overlay').addEventListener('mousedown', (event) => {
    unpause();
});

document.addEventListener('mousedown', (event) => {
    event.preventDefault();
});
// Keyboard controls
document.addEventListener('keydown', (event) => {
    if (['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', 'a', 'd', 's', 'w', ' '].includes(event.key)) {
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
        case 'Escape':
            togglePause();
            break;
        case ' ':
            moveToBottom();
            break;
    }
});

// Implement the moveToBottom function
function moveToBottom() {
    while (canMoveTo(currentX, currentY + 1)) {
        clearShape();
        currentY++;
        drawShape();
    }
    lockShape();
    spawnNewShape();
}


function calculateBottomPosition() {
    let ghostY = currentY;
    while (canMoveTo(currentX, ghostY + 1)) {
        ghostY++;
    }
    return ghostY;
}

function renderGhostShape() {
    // First, clear any existing ghost shape
    clearGhostShape();

    // Calculate the bottom position
    const ghostY = calculateBottomPosition();

    // Add the .ghost class to the cells at the bottom position
    currentShape.coords.forEach(([dx, dy]) => {
        const x = currentX + dx;
        const y = ghostY + dy;
        const cell = getBoardCellByCoord(x, y);
        if (cell) {
            cell.classList.add('ghost');
        }
    });
}

function clearGhostShape() {
    forEachCell(boardCellsByCoord, (cell) => {
        cell.classList.remove('ghost');
    });
}

function getTimeout() {
    // Calculate timeout decreasing linearly from max_timeout to min_timeout
    // don't exceed fastest_level.
    const max_timeout = 1000;
    const min_timeout = 50;
    const fastest_level = 10;
    if (level >= fastest_level) {
        return min_timeout;
    }
    return max_timeout - ((level - 1) * ((max_timeout-min_timeout) / (fastest_level - 1)));
}

function gameLoop() {
    if (paused === false) {
        moveDown();
    }
    // Assume `currentLevel` is defined and updates as needed
    setTimeout(gameLoop, getTimeout());
}

function clearFullRows() {
    let linesCleared = 0;
    let highestY = 0;
    for (let y = 0; y < board_rows; y++) {
        let isFull = true;
        for (let x = 0; x < board_cols; x++) {
            const cell = getBoardCellByCoord(x, y);
            if (!cell || !cell.classList.contains('locked')) {
                isFull = false;
                break;
            }
        }
        if (isFull) {
            linesCleared++;
            highestY = y;
            // Clear the full row
            for (let x = 0; x < board_cols; x++) {
                const cell = getBoardCellByCoord(x, y);
                if (cell) {
                    cell.className = 'cell'; // Reset the cell
                }
            }
            // Move all rows above down by one
            for (let row = y; row > 0; row--) {
                for (let x = 0; x < board_cols; x++) {
                    const cellAbove = getBoardCellByCoord(x, row - 1);
                    const cellCurrent = getBoardCellByCoord(x, row);
                    if (cellAbove && cellCurrent) {
                        cellCurrent.className = cellAbove.className;
                    }
                }
            }
            // Clear the top row
            for (let x = 0; x < board_cols; x++) {
                const cell = getBoardCellByCoord(x, 0);
                if (cell) {
                    cell.className = 'cell';
                }
            }
            // Check the same row again as it now contains the row above
            y--;
        }
    }
    if (linesCleared > 0) {
        lines += linesCleared;
        let newPoints = linePoints[linesCleared - 1] * level;
        score += newPoints;
        level = Math.floor(lines / lines_per_level) + 1;
        updateInfo();
        animatePoints(newPoints);
    }
}
function animatePoints(value) {
  const container = document.getElementById('score-value');
  const pointElement = document.createElement('div');
  pointElement.className = 'point';
  pointElement.textContent = value;

  container.appendChild(pointElement);
  pointElement.addEventListener('animationend', () => {
    container.removeChild(pointElement);
  });
}