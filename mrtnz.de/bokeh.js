const canvas = document.getElementById('bokehCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Refined color palette to match your reference image (cyan, magenta, blue, green, yellow, red)
const colors = ['#127bff', '#63c847', '#FF4500', '#FFD700', '#00FF00', '#1E90FF'];

let circles = [];

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function createCircles(count) {
    for (let i = 0; i < count; i++) {
        circles.push({
            x: random(0, canvas.width),
            y: random(0, canvas.height),
            radius: random(30, 120),  // Increase radius for more glow
            color: colors[Math.floor(Math.random() * colors.length)],
            opacity: random(0.7, 1),  // Maintain higher opacity for bright effect
            speedX: random(-0.2, 0.2),
            speedY: random(-0.2, 0.2),
            blur: random(20, 40) // Increase blur for softer effect
        });
    }
}

function drawCircles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < circles.length; i++) {
        const circle = circles[i];
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2, false);

        // Add heavier blur effect
        ctx.shadowColor = circle.color;
        ctx.shadowBlur = circle.blur;

        // Fill with refined color and opacity
        ctx.fillStyle = `rgba(${hexToRgb(circle.color)}, ${circle.opacity})`;
        ctx.fill();
        ctx.closePath();
        
        // Move the circles slightly
        circle.x += circle.speedX;
        circle.y += circle.speedY;
        
        // Reposition if out of bounds
        if (circle.x - circle.radius > canvas.width) circle.x = -circle.radius;
        if (circle.x + circle.radius < 0) circle.x = canvas.width + circle.radius;
        if (circle.y - circle.radius > canvas.height) circle.y = -circle.radius;
        if (circle.y + circle.radius < 0) circle.y = canvas.height + circle.radius;
    }
}

function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r}, ${g}, ${b}`;
}

function animate() {
    drawCircles();
    requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    circles = [];
    createCircles(50);
});

createCircles(50);
animate();
