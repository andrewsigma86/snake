const backgroundMusic = new Audio("background.mp3");
backgroundMusic.loop = true;
backgroundMusic.volume = 0.2;

// Función para iniciar la música (debe ser llamada por una acción del usuario)
function startGame() {
    backgroundMusic.play();
    document.removeEventListener("click", startGame);
    document.removeEventListener("keydown", startGame);
}

// Esperar a que el usuario interactúe para iniciar la música
document.addEventListener("click", startGame);
document.addEventListener("keydown", startGame);



const playboard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");

let gameOver = false;
let foodX, foodY;
let snakeX = 15, snakeY = 15;
let snakeBody = [];
let velocityX = 0, velocityY = 0;
let setIntervalId;
let score = 0;

// Cargar sonidos
const eatSound = new Audio("eat.mp3");
const gameOverSound = new Audio("game-over.mp3");
const moveSound = new Audio("move.mp3");

// Configurar volumen (opcional)
eatSound.volume = 0.3;
gameOverSound.volume = 0.5;
moveSound.volume = 0.1;

// Obtener high score del almacenamiento local
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerHTML = `High Score: ${highScore}`;

// Cambiar posición de la comida
const changeFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
    
    // Verificar que la comida no aparezca en la serpiente
    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeBody[i][0] === foodX && snakeBody[i][1] === foodY) {
            changeFoodPosition();
            break;
        }
    }
}

// Manejar fin del juego
const handleGameOver = () => {
    clearInterval(setIntervalId);
    gameOverSound.play(); // Reproducir sonido de game over
    setTimeout(() => {
        alert(`Game Over! Your score: ${score}`);
        location.reload();
    }, 500);
}

// Cambiar dirección de la serpiente
const changeDirection = (e) => {
    if (gameOver) return;
    
    moveSound.currentTime = 0; // Reiniciar sonido para permitir reproducción rápida
    moveSound.play(); // Reproducir sonido de movimiento
    
    if (e.key === "ArrowUp" && velocityY !== 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key === "ArrowDown" && velocityY !== -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key === "ArrowLeft" && velocityX !== 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key === "ArrowRight" && velocityX !== -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

// Inicializar juego
const initGame = () => {
    if (gameOver) return handleGameOver();
    
    let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;
    
    if (snakeX === foodX && snakeY === foodY) {
        changeFoodPosition();
        snakeBody.push([foodX, foodY]);
        score++;
        eatSound.play(); // Reproducir sonido de comer
        
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("high-score", highScore);
            highScoreElement.innerHTML = `High Score: ${highScore}`;
        }
        
        scoreElement.innerHTML = `Score: ${score}`;
    }
    
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    
    snakeBody[0] = [snakeX, snakeY];
    snakeX += velocityX;
    snakeY += velocityY;
    
    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameOver = true;
    }
    
    for (let i = 0; i < snakeBody.length; i++) {
        let bodyClass = i === 0 ? "head" : "body";
        htmlMarkup += `<div class="${bodyClass}" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        
        if (i !== 0 && snakeBody[0][0] === snakeBody[i][0] && snakeBody[0][1] === snakeBody[i][1]) {
            gameOver = true;
        }
    }
    
    playboard.innerHTML = htmlMarkup;
}

changeFoodPosition();
setIntervalId = setInterval(initGame, 125);
document.addEventListener("keydown", changeDirection);