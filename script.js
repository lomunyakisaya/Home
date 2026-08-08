const canvas = document.getElementById("canvas");

const ctx = canvas.getContext("2d");

const scoreElement = document.getElementById("score");


let score = 0;

let gameRunning = true;

let animationId;


/*
    =========================
        BALLOON
    =========================
*/

const balloon = {

    x: 120,

    y: 200,

    width: 36,

    height: 36,

    speed: 5

};


/*
    =========================
        INPUT
    =========================
*/

const keys = {};


document.addEventListener("keydown", event => {

    keys[event.key.toLowerCase()] = true;

});


document.addEventListener("keyup", event => {

    keys[event.key.toLowerCase()] = false;

});


/*
    =========================
        CANVAS
    =========================
*/

function resizeCanvas() {

    canvas.width = canvas.clientWidth;

    canvas.height = canvas.clientHeight;

}


window.addEventListener(
    "resize",
    resizeCanvas
);


resizeCanvas();


/*
    =========================
        CONTRIBUTIONS
    =========================
*/

const contributions = [];


function createContribution() {

    contributions.push({

        x: canvas.width + 20,

        y:
            Math.random() *
            (canvas.height - 60) +
            30,

        size: 18,

        speed: 3

    });

}


setInterval(() => {

    if (gameRunning) {

        createContribution();

    }

}, 800);


/*
    =========================
        BALLOON MOVEMENT
    =========================
*/

function moveBalloon() {

    if (
        keys["arrowup"] ||
        keys["w"]
    ) {

        balloon.y -= balloon.speed;

    }


    if (
        keys["arrowdown"] ||
        keys["s"]
    ) {

        balloon.y += balloon.speed;

    }


    if (
        keys["arrowleft"] ||
        keys["a"]
    ) {

        balloon.x -= balloon.speed;

    }


    if (
        keys["arrowright"] ||
        keys["d"]
    ) {

        balloon.x += balloon.speed;

    }


    /*
        Keep balloon inside
        the game area.
    */

    balloon.x = Math.max(

        20,

        Math.min(
            canvas.width - 20,
            balloon.x
        )

    );


    balloon.y = Math.max(

        20,

        Math.min(
            canvas.height - 20,
            balloon.y
        )

    );

}


/*
    =========================
        COLLISION
    =========================
*/

function collision(a, b) {

    return (

        Math.abs(a.x - b.x)
            < 25

        &&

        Math.abs(a.y - b.y)
            < 25

    );

}


/*
    =========================
        UPDATE
    =========================
*/

function update() {

    if (!gameRunning) return;


    moveBalloon();


    for (
        let i = contributions.length - 1;
        i >= 0;
        i--
    ) {

        const contribution =
            contributions[i];


        contribution.x -=
            contribution.speed;


        /*
            Collect contribution
        */

        if (
            collision(
                balloon,
                contribution
            )
        ) {

            score++;

            scoreElement.textContent =
                score;

            contributions.splice(i, 1);

            continue;

        }


        /*
            Remove objects
            that left screen
        */

        if (
            contribution.x <
            -30
        ) {

            contributions.splice(i, 1);

        }

    }

}


/*
    =========================
        DRAW
    =========================
*/

function draw() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /*
        Contribution grid
    */

    for (
        let x = 20;
        x < canvas.width;
        x += 28
    ) {

        for (
            let y = 20;
            y < canvas.height;
            y += 28
        ) {

            ctx.fillStyle =
                "#0d2114";

            ctx.fillRect(
                x,
                y,
                14,
                14
            );

        }

    }


    /*
        Green contributions
    */

    contributions.forEach(
        contribution => {

            ctx.fillStyle =
                "#39d353";

            ctx.fillRect(

                contribution.x,

                contribution.y,

                contribution.size,

                contribution.size

            );

        }
    );


    /*
        Balloon
    */

    ctx.font = "36px Arial";

    ctx.textAlign = "center";

    ctx.textBaseline = "middle";

    ctx.fillText(

        "🎈",

        balloon.x,

        balloon.y

    );

}


/*
    =========================
        GAME LOOP
    =========================
*/

function gameLoop() {

    update();

    draw();

    animationId =
        requestAnimationFrame(
            gameLoop
        );

}


gameLoop();


/*
    =========================
        TOUCH CONTROLS
    =========================
*/

document
    .querySelectorAll("[data-key]")
    .forEach(button => {

        const key =
            button.dataset.key.toLowerCase();


        button.addEventListener(
            "pointerdown",
            event => {

                event.preventDefault();

                keys[key] = true;

            }
        );


        button.addEventListener(
            "pointerup",
            event => {

                event.preventDefault();

                keys[key] = false;

            }
        );


        button.addEventListener(
            "pointerleave",
            () => {

                keys[key] = false;

            }
        );


        button.addEventListener(
            "pointercancel",
            () => {

                keys[key] = false;

            }
        );

    });


/*
    =========================
        RESTART
    =========================
*/

function restart() {

    score = 0;

    scoreElement.textContent = "0";

    balloon.x = 120;

    balloon.y =
        canvas.height / 2;

    contributions.length = 0;

    gameRunning = true;

}