const canvas = document.getElementById('snake');
const ctx = canvas.getContext('2d');

canvas.width = 608;
canvas.height = 608;

const cw = canvas.width;
const ch = canvas.height;

const box = 32;

let appleImg = new Image();
let bombsImg = new Image();
let heartImg = new Image();
appleImg.src = 'img/goofy-page/apple.png';
bombsImg.src = 'img/goofy-page/bomb.png';
heartImg.src = 'img/goofy-page/heart.png';

let snake = [];

snake[0] = {
    x: 9 * box,
    y: 10 * box
}

let food = {
    x: Math.floor(Math.random() * 19) * box,
    y: Math.floor(Math.random() * 19) * box
}

let heart = {
    x: Math.floor(Math.random() * 19) * box,
    y: Math.floor(Math.random() * 19) * box
}

let bombs = {
    x: Math.floor(Math.random() * 19) * box,
    y: Math.floor(Math.random() * 19) * box
}

let heartIterator = 0;

let direction;
const scoreSpan = document.getElementById('scoreSpan');
const livesSpan = document.getElementById('livesSpan');
let score = 0;
let lives = 3;

let gamePaused = false;
let gameInProgress = false;

let gameInterval = window.setInterval(function () {});

function draw() {
    drawGround();

    ctx.drawImage(appleImg, food.x, food.y, box, box);

    if (heart.x >= 0 &&
        heart.y >= 0 &&
        heart.x !== null &&
        heart.y !== null) {
        console.log(heart, heartIterator);
        ctx.drawImage(heartImg, heart.x, heart.y, box, box);
    }

    ctx.drawImage(bombsImg, bombs.x, bombs.y, box, box);

    drawSnake();
    moveSnake();
}

function moveSnake() {
    //old Head Snake position
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    heartIterator += 200;

    //direction head snake during key movie
    if (direction == "left") snakeX -= box;
    if (direction == "up") snakeY -= box;
    if (direction == "right") snakeX += box;
    if (direction == "down") snakeY += box;

    //direction head snake during eat apple

    if (snakeX == food.x && snakeY == food.y) {
        score++;
        scoreSpan.textContent = score;

        food = {
            x: Math.floor(Math.random() * 19) * box,
            y: Math.floor(Math.random() * 19) * box
        }
    } else if (snakeX == heart.x && snakeY == heart.y) {
        heartIterator = 0;
        snake.pop();
        lives++;
        livesSpan.textContent = lives;

        heart = {
            x: -1,
            y: -1
        }
    } else if (snakeX == bombs.x && snakeY == bombs.y) {
        snake.pop();
        lives--;
        livesSpan.textContent = lives;

        bombs = {
            x: Math.floor(Math.random() * 19) * box,
            y: Math.floor(Math.random() * 19) * box
        }
    } else {
        snake.pop();
    }

    let newHead = {
        x: snakeX,
        y: snakeY
    }
    if (snakeX < 0 ||
        snakeX > 19 * box ||
        snakeY < 0 ||
        snakeY > 19 * box ||
        (collision(newHead, snake) && lives > 0)
    ) {
        lives--;
        livesSpan.textContent = lives;
        resetGame();
        return;
    } else if (snakeX < 0 ||
        snakeX > 19 * box ||
        snakeY < 0 ||
        snakeY > 19 * box ||
        (collision(newHead, snake) || lives === 0)
    ) {
        endGame();
    }

    if (heart.x === -1 &&
        heart.y === -1 &&
        heartIterator >= 20000) {
        heart = {
            x: Math.floor(Math.random() * 19) * box,
            y: Math.floor(Math.random() * 19) * box
        };
        heartIterator = 0;
    }

    snake.unshift(newHead);
}

function resetGame() {
    //reset snake
    resetSnake();
    direction = '';
    moveSnake();
}

function drawGround() {
    ctx.beginPath();

    ctx.fillStyle = '#eeeff1';
    ctx.fillRect(0, 0, cw, ch);
    for (let x = 0; x <= cw; x += box) {
        ctx.moveTo(0.5 + x, 0);
        ctx.lineTo(0.5 + x, cw);
    }
    for (let x = 0; x <= cw; x += box) {
        ctx.moveTo(0, 0.5 + x);
        ctx.lineTo(cw, 0.5 + x);
    }
    ctx.strokeStyle = '#FFFFFE';
    ctx.stroke();
    ctx.closePath();

    ctx.lineWidth = 2;
    ctx.strokeStyle = "#84b71c";
    ctx.strokeRect(0, 0, cw, ch);
}

function drawSnake() {
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle =
            i == 0 ?
                "#84b71c" :
                "rgb(" +
                Math.floor(Math.random() * 256) +
                "," +
                Math.floor(Math.random() * 256) +
                "," +
                Math.floor(Math.random() * 256) +
                ")";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) {
            return true;
        }
    }
    return false;
}

function showGameOverBtn() {
    let gameOverMenu = document.getElementById("gameOverMenu");
    let againBtn = document.getElementById("againBtn");

    gameOverMenu.className = "active";
    againBtn.addEventListener("click", welcomeGame);
}

function setTitle(text) {
    let title = document.getElementById('title');
    title.innerHTML = text;
}

function resetScore() {
    score = 0;
    scoreSpan.textContent = score;
    lives = 3;
    livesSpan.textContent = lives;
}

function togglePause() {
    if (gamePaused) {
        resumeGame();
    } else {
        ctx.fillStyle = '#5b627e';
        ctx.fillRect(0, 0, cw, ch);
        ctx.fillStyle = "#84b71c";
        ctx.font = "30px Courier, serif";
        ctx.fillText("Pritisnite P za vrnitev v igro", cw / 2 - 250, ch / 2);
        pauseGame();
    }
}

function resumeGame() {
    if (gamePaused) {
        gamePaused = false;
        gameInProgress = false;
        initGame();
    }
}

function pauseGame() {
    if (!gamePaused) {
        gamePaused = true;
        clearInterval(gameInterval);
    }
}

function initGame() {
    if (!gameInProgress) {
        gamePaused = false;
        gameInProgress = true;
        gameInterval = window.setInterval(function () {
            draw();
        }, 200);
    } else {
        return;
    }
}

function welcomeGame() {
    drawGround();
    setTitle('Kačica');

    ctx.fillStyle = "#84b71c";
    ctx.font = "40px Courier, serif";
    ctx.fillText("Enter ------ Začetek igre", cw / 2 - 200, ch / 10);
    ctx.fillStyle = "#84b71c";

    ctx.font = "20px Courier, serif";
    ctx.fillText("P ----- Pavza/Nadaljuj", cw / 2 - 140, ch / 4.9);
    ctx.fillStyle = "#84b71c";
    ctx.font = "20px Courier, serif";
    ctx.fillText("Up ----- Gor", cw / 2 - 140, ch / 3.3);
    ctx.fillStyle = "#84b71c";
    ctx.font = "20px Courier, serifa";
    ctx.fillText("Down ----- Dol", cw / 2 - 140, ch / 2.4);
    ctx.fillStyle = "#84b71c";
    ctx.font = "20px Courier, serif";
    ctx.fillText("Right ----- Desno", cw / 2 - 140, ch / 1.95);
    ctx.fillStyle = "#84b71c";
    ctx.font = "20px Courier, serif";
    ctx.fillText("Left ----- Levo", cw / 2 - 140, ch / 1.6);
    ctx.fillStyle = "#84b71c";

    ctx.font = "20px Courier, serif";
    ctx.fillText("Pojej jabolko ----- + Točke", cw / 2 - 140, ch / 1.3);
    ctx.fillStyle = "#84b71c";
    ctx.font = "20px Courier, serif";
    ctx.fillText("Pojej srce ----- + Življenje", cw / 2 - 140, ch / 1.2);
    ctx.fillStyle = "#84b71c";
    ctx.font = "20px Courier, serifa";
    ctx.fillText("Pojej bombo ----- - Življenje", cw / 2 - 140, ch / 1.12);
    //gameOverMenu = document.getElementById('gameOverMenu');
    againBtn = document.getElementById('againBtn');
    gameOverMenu.className = 'game-over';

    resetSnake();
}

function resetSnake() {
    snake[0] = {
        x: 9 * box,
        y: 10 * box
    };
    snake.length = 1;
}

function setItem(arr) {
    const tableBody = document.querySelector('#attemptTable tbody');
    const newRow = document.createElement('tr');

    // Create time cell
    const timeCell = document.createElement('td');
    const currentTime = new Date().toLocaleTimeString();
    timeCell.textContent = currentTime;

    // Create attempt cell
    const attemptCell = document.createElement('td');
    const attemptNumber = arr.length + 1; // Next attempt number
    attemptCell.textContent = attemptNumber;

    // Append new data to the passed array
    arr.push({ time: currentTime, attempt: attemptNumber });

    // Append cells to the row
    newRow.appendChild(timeCell);
    newRow.appendChild(attemptCell);

    // Append the row to the table
    tableBody.appendChild(newRow);
}


function endGame() {
    let item = sessionStorage.getItem("val");
    let arr = [];

    if (item !== null) {
        arr = JSON.parse(item); // Convert string to array
    }

    arr.push({ score: score }); // Add new item

    setItem(arr)

    sessionStorage.setItem("val", JSON.stringify(arr)); // Save back as string

    gameInProgress = false;
    setTitle('Konec Igre');
    resetScore();
    drawGround();
    ctx.fillStyle = ctx.fillStyle = "rgba(91, 98, 126, 0.9)";
    ctx.fillRect(0, 0, cw, ch);
    ctx.fillStyle = "#84b71c";
    ctx.font = "40px Courier, serif";
    ctx.fillText("Konec Igre", cw / 2 - 80, ch / 2 - 20);
    showGameOverBtn();
    againBtn.textContent = 'Poskusi znova';
    clearInterval(gameInterval);
}

document.addEventListener('keydown', function (e) {
    switch (e.keyCode) {
        case 13:
            initGame();
            //console.log('click enter');
            break;
        case 37:
            if (direction != "right")
                direction = "left"
            //console.log('left');
            break;
        case 38:
            if (direction != "down")
                direction = "up"
            //console.log('up');
            break;
        case 39:
            if (direction != "left")
                direction = "right"
            //console.log('right');
            break;
        case 40:
            if (direction != "up")
                direction = "down"
            //console.log('down');
            break;
        case 80:
            if (gameInProgress)
                togglePause();
            break;
    }
});

let item = sessionStorage.getItem("val");
let arr = [];

if (item !== null) {
    arr = JSON.parse(item); // Convert string to array
}

arr.push({ score: score }); // Add new item

setItem(arr)

welcomeGame();
