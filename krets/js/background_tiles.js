document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('grid-container');
    const TILE_SIZE = 16;
    let rotations = JSON.parse(localStorage.getItem('tileRotations')) || {};

    function initGrid() {
        gridContainer.innerHTML = '';
        const cols = Math.ceil(window.innerWidth / TILE_SIZE);
        const rows = Math.ceil(window.innerHeight / TILE_SIZE);

        gridContainer.style.gridTemplateColumns = `repeat(${cols}, ${TILE_SIZE}px)`;
        gridContainer.style.gridTemplateRows = `repeat(${rows}, ${TILE_SIZE}px)`;

        const fragment = document.createDocumentFragment();

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const key = `${r}_${c}`;
                const tile = document.createElement('div');
                tile.className = 'tile';
                tile.dataset.key = key;

                const img = document.createElement('img');
                img.src = 'images/tile_16x16.png';
                tile.appendChild(img);

                // Set initial rotation from storage
                const currentRotation = rotations[key] || 0;
                tile.style.transform = `rotate(${currentRotation}deg)`;

                fragment.appendChild(tile);
            }
        }

        gridContainer.appendChild(fragment);
    }

    gridContainer.addEventListener('mouseover', (e) => {
        const tile = e.target.closest('.tile');
        if (tile) {
            const key = tile.dataset.key;
            const newRotation = (rotations[key] || 0) + 90;
            rotations[key] = newRotation;
            tile.style.transform = `rotate(${newRotation}deg)`;
            saveRotations();
        }
    });

    let saveTimeout;
    function saveRotations() {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            localStorage.setItem('tileRotations', JSON.stringify(rotations));
        }, 500);
    }

    initGrid();

    // Re-initialize on window resize to fill the screen
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(initGrid, 250);
    });
});
