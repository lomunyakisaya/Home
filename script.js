const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const scoreText = document.getElementById("score");

let score = 0;
let gameOver = false;

const balloon = {
    x: 100,
    y: 220,
    speed: 5,
    size: 32
};

const boxes = [];
const keys = {};

function resize() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}

window.addEventListener("resize", resize);
resize();

document.addEventListener("keydown", e => {
    keys[e.key.toLowerCase()] = true;
});

document.addEventListener("keyup", e => {
    keys[e.key.toLowerCase()] = false;
});

function createBox() {
    boxes.push({
        x: canvas.width + 20,
        y: Math.random() * (canvas.height - 80) + 40,
        size: 18,
        speed: 3 + score * 0.02
    });
}

setInterval(() => {
    if (!gameOver) createBox();
}, 900);

function moveBalloon() {
    if (keys["arrowup"] || keys["w"])
        balloon.y -= balloon.speed;

    if (keys["arrowdown"] || keys["s"])
        balloon.y += balloon.speed;

    if (keys["arrowleft"] || keys["a"])
        balloon.x -= balloon.speed;

    if (keys["arrowright"] || keys["d"])
        balloon.x += balloon.speed;

    balloon.x = Math.max(20, Math.min(canvas.width - 20, balloon.x));
    balloon.y = Math.max(25, Math.min(canvas.height - 25, balloon.y));
}

function collision(a, b) {
    return (
        Math.abs(a.x - b.x) < 28 &&
        Math.abs(a.y - b.y) < 28
    );
}

function update() {
    if (gameOver) return;

    moveBalloon();

    for (let i = boxes.length - 1; i >= 0; i--) {
        const box = boxes[i];

        box.x -= box.speed;

        if (collision(balloon, box)) {
            score++;
            scoreText.textContent = score;
            boxes.splice(i, 1);
        }

        if (box.x < -30) {
            boxes.splice(i, 1);
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Contribution grid
    for (let x = 20; x < canvas.width; x += 28) {
        for (let y = 20; y < canvas.height; y += 28) {
            ctx.fillStyle = "#0d2114";
            ctx.fillRect(x, y, 14, 14);
        }
    }

    // Green contribution boxes
    boxes.forEach(box => {
        ctx.fillStyle = "#39d353";
        ctx.fillRect(
            box.x,
            box.y,
            box.size,
            box.size
        );
    });

    // Balloon
    ctx.font = "36px Arial";
    ctx.fillText("🎈", balloon.x - 18, balloon.y + 12);

    if (gameOver) {
        ctx.fillStyle = "white";
        ctx.font = "28px Arial";
        ctx.textAlign = "center";
        ctx.fillText(
            "Game Over",
            canvas.width / 2,
            canvas.height / 2
        );
        ctx.font = "16px Arial";
        ctx.fillText(
            `Score: ${score}`,
            canvas.width / 2,
            canvas.height / 2 + 30
        );
        ctx.textAlign = "left";
    }
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function restart() {
    score = 0;
    scoreText.textContent = score;
    gameOver = false;
    balloon.x = 100;
    balloon.y = canvas.height / 2;
    boxes.length = 0;
}

gameLoop();