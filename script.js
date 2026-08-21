// ======================================================
// RESGATE DOS BICHINHOS
// ======================================================


// ======================================================
// TELAS
// ======================================================

const screens = {
    home: document.getElementById("homeScreen"),
    game: document.getElementById("gameScreen"),
    shop: document.getElementById("shopScreen"),
    donation: document.getElementById("donationScreen"),
    howTo: document.getElementById("howToScreen"),
    records: document.getElementById("recordsScreen")
};


function showScreen(name) {

    Object.values(screens).forEach(screen => {
        screen.classList.remove("active");
    });

    screens[name].classList.add("active");

    if (name === "shop") {
        updateShop();
    }

    if (name === "records") {
        updateRecords();
    }
}


// ======================================================
// ELEMENTOS
// ======================================================

const gameArea =
    document.getElementById("gameArea");

const livesElement =
    document.getElementById("lives");

const coinsElement =
    document.getElementById("coins");

const scoreElement =
    document.getElementById("score");

const levelElement =
    document.getElementById("level");

const gameMessage =
    document.getElementById("gameMessage");

const comboElement =
    document.getElementById("combo");

const toast =
    document.getElementById("toast");


// ======================================================
// ESTADO
// ======================================================

let lives = 3;
let coins = 0;
let score = 0;
let level = 1;
let combo = 0;

let gameRunning = false;
let paused = false;

let animalSpeed = 1;
let coinMultiplier = 1;
let scoreMultiplier = 1;

let rescuedThisGame = 0;


// ======================================================
// PREÇOS
// ======================================================

let speedPrice = 30;
let lifePrice = 50;
let coinPrice = 75;
let scorePrice = 100;


// ======================================================
// ESTATÍSTICAS PERMANENTES
// ======================================================

let highScore =
    Number(localStorage.getItem("animalHighScore")) || 0;

let totalRescued =
    Number(localStorage.getItem("totalRescued")) || 0;

let totalCoins =
    Number(localStorage.getItem("totalCoins")) || 0;


// ======================================================
// INTERVALOS
// ======================================================

let animalInterval = null;
let obstacleInterval = null;
let difficultyInterval = null;


// ======================================================
// ANIMAIS
// ======================================================

const animals = [
    "🐶",
    "🐱",
    "🐰",
    "🐹",
    "🦊",
    "🐼",
    "🐨",
    "🐯",
    "🐵",
    "🐸",
    "🐥",
    "🐷"
];


// ======================================================
// PERIGOS
// ======================================================

const obstacles = [
    "🪨",
    "💣",
    "🗑️",
    "🌵",
    "⚡",
    "🔥"
];


// ======================================================
// BOTÃO COMEÇAR
// ======================================================

document
    .getElementById("startButton")
    .addEventListener("click", () => {

        startNewGame();

    });


// ======================================================
// LOJA A PARTIR DA TELA INICIAL
// ======================================================

document
    .getElementById("homeShopButton")
    .addEventListener("click", () => {

        showScreen("shop");

    });


// ======================================================
// DOAÇÃO A PARTIR DA TELA INICIAL
// ======================================================

document
    .getElementById("homeDonationButton")
    .addEventListener("click", () => {

        showScreen("donation");

    });


// ======================================================
// COMO JOGAR
// ======================================================

document
    .getElementById("howToButton")
    .addEventListener("click", () => {

        showScreen("howTo");

    });


// ======================================================
// RECORDES
// ======================================================

document
    .getElementById("recordsButton")
    .addEventListener("click", () => {

        showScreen("records");

    });


// ======================================================
// BOTÕES VOLTAR
// ======================================================

document
    .querySelectorAll("[data-home]")
    .forEach(button => {

        button.addEventListener("click", () => {

            stopGame();

            showScreen("home");

        });

    });


// ======================================================
// BOTÃO HOME DURANTE O JOGO
// ======================================================

document
    .getElementById("gameHomeButton")
    .addEventListener("click", () => {

        stopGame();

        showScreen("home");

    });


// ======================================================
// LOJA DURANTE O JOGO
// ======================================================

document
    .getElementById("gameShopButton")
    .addEventListener("click", () => {

        pauseGame();

        showScreen("shop");

    });


// ======================================================
// DOAÇÃO DURANTE O JOGO
// ======================================================

document
    .getElementById("gameDonationButton")
    .addEventListener("click", () => {

        pauseGame();

        showScreen("donation");

    });


// ======================================================
// PAUSA
// ======================================================

document
    .getElementById("pauseButton")
    .addEventListener("click", () => {

        if (!gameRunning) return;

        if (paused) {
            resumeGame();
        } else {
            pauseGame();
        }

    });


function pauseGame() {

    paused = true;

    document
        .getElementById("pauseOverlay")
        .classList.remove("hidden");

    document
        .getElementById("pauseButton")
        .textContent = "▶️";

}


function resumeGame() {

    paused = false;

    document
        .getElementById("pauseOverlay")
        .classList.add("hidden");

    document
        .getElementById("pauseButton")
        .textContent = "⏸️";

}


// ======================================================
// CONTINUAR
// ======================================================

document
    .getElementById("resumeButton")
    .addEventListener("click", () => {

        resumeGame();

    });


// ======================================================
// TELA PRINCIPAL A PARTIR DA PAUSA
// ======================================================

document
    .getElementById("pauseHomeButton")
    .addEventListener("click", () => {

        stopGame();

        document
            .getElementById("pauseOverlay")
            .classList.add("hidden");

        showScreen("home");

    });


// ======================================================
// DOAÇÃO REAL
// ======================================================

document
    .getElementById("realDonationButton")
    .addEventListener("click", () => {

        window.open(
            "https://www.worldanimalprotection.org/",
            "_blank"
        );

    });


// ======================================================
// INICIAR NOVO JOGO
// ======================================================

function startNewGame() {

    stopGame();

    lives = 3;
    coins = 0;
    score = 0;
    level = 1;
    combo = 0;

    rescuedThisGame = 0;

    animalSpeed = 1;
    coinMultiplier = 1;
    scoreMultiplier = 1;

    speedPrice = 30;
    lifePrice = 50;
    coinPrice = 75;
    scorePrice = 100;

    gameRunning = true;
    paused = false;

    clearObjects();

    showScreen("game");

    document
        .getElementById("gameOverOverlay")
        .classList.add("hidden");

    document
        .getElementById("pauseOverlay")
        .classList.add("hidden");

    gameMessage.textContent =
        "Salve os bichinhos! 🐾";

    updateUI();

    startGameLoops();

}


// ======================================================
// LOOP DO JOGO
// ======================================================

function startGameLoops() {

    animalInterval = setInterval(
        createAnimal,
        1200
    );

    obstacleInterval = setInterval(
        createObstacle,
        1500
    );

    difficultyInterval = setInterval(
        increaseDifficulty,
        3000
    );

}


function stopGame() {

    gameRunning = false;

    paused = false;

    clearInterval(animalInterval);
    clearInterval(obstacleInterval);
    clearInterval(difficultyInterval);

    animalInterval = null;
    obstacleInterval = null;
    difficultyInterval = null;

}


// ======================================================
// AUMENTAR DIFICULDADE
// ======================================================

function increaseDifficulty() {

    if (!gameRunning) return;

    level++;

    levelElement.textContent = level;

    gameMessage.textContent =
        `🌟 Fase ${level}!`;

    showToast(
        `🌟 Você chegou à fase ${level}!`
    );

}


// ======================================================
// CRIAR ANIMAL
// ======================================================

function createAnimal() {

    if (!gameRunning || paused) return;

    const animal =
        document.createElement("div");

    animal.className = "animal";

    animal.textContent =
        animals[
            Math.floor(
                Math.random() * animals.length
            )
        ];

    const maxX =
        gameArea.clientWidth - 90;

    const maxY =
        gameArea.clientHeight - 160;

    const x =
        Math.max(
            10,
            Math.random() * maxX
        );

    const y =
        Math.max(
            90,
            Math.random() * maxY
        );

    animal.style.left =
        `${x}px`;

    animal.style.top =
        `${y}px`;

    gameArea.appendChild(animal);

    animal.addEventListener(
        "click",
        () => {

            if (!gameRunning || paused)
                return;

            rescueAnimal(animal);

        }
    );


    const lifetime =
        Math.max(
            1500,
            4000 - level * 120
        );

    setTimeout(() => {

        if (animal.parentNode) {

            animal.remove();

            combo = 0;

            updateCombo();

        }

    }, lifetime / animalSpeed);

}


// ======================================================
// SALVAR ANIMAL
// ======================================================

function rescueAnimal(animal) {

    if (!animal.parentNode)
        return;

    const x =
        animal.offsetLeft;

    const y =
        animal.offsetTop;

    createRescueEffect(x, y);

    animal.remove();

    combo++;

    rescuedThisGame++;

    totalRescued++;

    localStorage.setItem(
        "totalRescued",
        totalRescued
    );


    const earnedCoins =
        Math.max(
            1,
            Math.floor(
                5 * coinMultiplier
            )
        );


    const earnedScore =
        Math.max(
            1,
            Math.floor(
                (10 + combo * 2) *
                scoreMultiplier
            )
        );


    coins += earnedCoins;

    score += earnedScore;

    totalCoins += earnedCoins;

    localStorage.setItem(
        "totalCoins",
        totalCoins
    );


    gameMessage.textContent =
        "💖 Bichinho salvo!";


    if (combo >= 3) {

        gameMessage.textContent =
            `🔥 Combo x${combo}!`;

    }


    createCoinPopup(
        x,
        y,
        `+${earnedCoins} 🪙`
    );


    updateCombo();

    updateUI();

    checkHighScore();

}


// ======================================================
// COMBO
// ======================================================

function updateCombo() {

    if (combo >= 2) {

        comboElement.textContent =
            `🔥 COMBO x${combo}!`;

    } else {

        comboElement.textContent = "";

    }

}


// ======================================================
// CRIAR PERIGO
// ======================================================

function createObstacle() {

    if (!gameRunning || paused)
        return;

    const obstacle =
        document.createElement("div");

    obstacle.className =
        "obstacle";

    obstacle.textContent =
        obstacles[
            Math.floor(
                Math.random() * obstacles.length
            )
        ];


    const y =
        Math.random() *
        (gameArea.clientHeight - 170) + 90;

    obstacle.style.left = "-80px";

    obstacle.style.top =
        `${y}px`;

    gameArea.appendChild(obstacle);


    let position = -80;

    const speed =
        2 +
        level * .18 +
        Math.random() * 1.3;


    function moveObstacle() {

        if (!gameRunning) {

            obstacle.remove();

            return;

        }


        if (paused) {

            requestAnimationFrame(
                moveObstacle
            );

            return;

        }


        position += speed;

        obstacle.style.left =
            `${position}px`;


        const animals =
            document.querySelectorAll(
                ".animal"
            );


        animals.forEach(animal => {

            if (
                checkCollision(
                    obstacle,
                    animal
                )
            ) {

                const animalX =
                    animal.offsetLeft;

                const animalY =
                    animal.offsetTop;

                animal.remove();

                createRescueEffect(
                    animalX,
                    animalY
                );

                loseLife();

                obstacle.remove();

            }

        });


        if (
            position >
            gameArea.clientWidth + 100
        ) {

            obstacle.remove();

            return;

        }


        requestAnimationFrame(
            moveObstacle
        );

    }


    moveObstacle();

}


// ======================================================
// COLISÃO
// ======================================================

function checkCollision(a, b) {

    const rectA =
        a.getBoundingClientRect();

    const rectB =
        b.getBoundingClientRect();


    return !(
        rectA.right < rectB.left ||
        rectA.left > rectB.right ||
        rectA.bottom < rectB.top ||
        rectA.top > rectB.bottom
    );

}


// ======================================================
// PERDER VIDA
// ======================================================

function loseLife() {

    lives--;

    combo = 0;

    updateCombo();

    updateUI();


    if (lives <= 0) {

        endGame();

    } else {

        gameMessage.textContent =
            "😢 Cuidado!";

    }

}


// ======================================================
// FIM DE JOGO
// ======================================================

function endGame() {

    gameRunning = false;

    clearInterval(animalInterval);
    clearInterval(obstacleInterval);
    clearInterval(difficultyInterval);


    checkHighScore();


    document
        .getElementById("finalScore")
        .textContent = score;


    document
        .getElementById("gameOverOverlay")
        .classList.remove("hidden");

}


// ======================================================
// GAME OVER - NOVO JOGO
// ======================================================

document
    .getElementById("restartButton")
    .addEventListener("click", () => {

        startNewGame();

    });


// ======================================================
// GAME OVER - HOME
// ======================================================

document
    .getElementById("gameOverHomeButton")
    .addEventListener("click", () => {

        document
            .getElementById("gameOverOverlay")
            .classList.add("hidden");

        stopGame();

        showScreen("home");

    });


// ======================================================
// LOJA
// ======================================================

function updateShop() {

    document
        .getElementById("shopCoins")
        .textContent = coins;

    document
        .getElementById("speedPrice")
        .textContent = speedPrice;

    document
        .getElementById("lifePrice")
        .textContent = lifePrice;

    document
        .getElementById("coinPrice")
        .textContent = coinPrice;

    document
        .getElementById("scorePrice")
        .textContent = scorePrice;

}


function buyItem(price, callback) {

    if (coins < price) {

        showToast(
            "🪙 Você ainda precisa de mais moedas!"
        );

        return false;

    }

    coins -= price;

    callback();

    updateUI();

    updateShop();

    return true;

}


// ======================================================
// UPGRADE VELOCIDADE
// ======================================================

document
    .getElementById("speedUpgrade")
    .addEventListener("click", () => {

        buyItem(
            speedPrice,
            () => {

                animalSpeed += .2;

                speedPrice =
                    Math.floor(
                        speedPrice * 1.7
                    );

                showToast(
                    "⚡ Patinhas melhoradas!"
                );

            }
        );

    });


// ======================================================
// VIDA EXTRA
// ======================================================

document
    .getElementById("lifeUpgrade")
    .addEventListener("click", () => {

        buyItem(
            lifePrice,
            () => {

                lives++;

                lifePrice =
                    Math.floor(
                        lifePrice * 1.8
                    );

                showToast(
                    "❤️ Você ganhou uma vida!"
                );

            }
        );

    });


// ======================================================
// ÍMÃ
// ======================================================

document
    .getElementById("coinUpgrade")
    .addEventListener("click", () => {

        buyItem(
            coinPrice,
            () => {

                coinMultiplier += .5;

                coinPrice =
                    Math.floor(
                        coinPrice * 1.9
                    );

                showToast(
                    "🧲 Agora você ganha mais moedas!"
                );

            }
        );

    });


// ======================================================
// PONTOS
// ======================================================

document
    .getElementById("scoreUpgrade")
    .addEventListener("click", () => {

        buyItem(
            scorePrice,
            () => {

                scoreMultiplier += .4;

                scorePrice =
                    Math.floor(
                        scorePrice * 2
                    );

                showToast(
                    "🌟 Super resgate ativado!"
                );

            }
        );

    });


// ======================================================
// ATUALIZAR INTERFACE
// ======================================================

function updateUI() {

    livesElement.textContent =
        lives;

    coinsElement.textContent =
        coins;

    scoreElement.textContent =
        score;

    levelElement.textContent =
        level;

    updateShop();

}


// ======================================================
// RECORDES
// ======================================================

function checkHighScore() {

    if (score > highScore) {

        highScore = score;

        localStorage.setItem(
            "animalHighScore",
            highScore
        );

    }

}


function updateRecords() {

    document
        .getElementById("highScore")
        .textContent = highScore;

    document
        .getElementById("totalRescued")
        .textContent = totalRescued;

    document
        .getElementById("totalCoins")
        .textContent = totalCoins;

}


// ======================================================
// EFEITO DE MOEDA
// ======================================================

function createCoinPopup(x, y, text) {

    const popup =
        document.createElement("div");

    popup.className =
        "coin-popup";

    popup.textContent =
        text;

    popup.style.left =
        `${x}px`;

    popup.style.top =
        `${y}px`;

    gameArea.appendChild(popup);


    setTimeout(() => {

        popup.remove();

    }, 800);

}


// ======================================================
// EFEITO DE RESGATE
// ======================================================

function createRescueEffect(x, y) {

    const effect =
        document.createElement("div");

    effect.className =
        "rescue-effect";

    effect.textContent =
        "💖✨";

    effect.style.left =
        `${x}px`;

    effect.style.top =
        `${y}px`;

    gameArea.appendChild(effect);


    setTimeout(() => {

        effect.remove();

    }, 600);

}


// ======================================================
// LIMPAR OBJETOS
// ======================================================

function clearObjects() {

    document
        .querySelectorAll(
            ".animal, .obstacle, .coin-popup, .rescue-effect"
        )
        .forEach(element => {

            element.remove();

        });

}


// ======================================================
// TOAST
// ======================================================

let toastTimer;

function showToast(message) {

    toast.textContent =
        message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer =
        setTimeout(() => {

            toast.classList.remove("show");

        }, 2200);

}


// ======================================================
// TECLADO
// ======================================================

document.addEventListener(
    "keydown",
    event => {

        if (
            event.code === "Space" &&
            screens.game.classList.contains("active")
        ) {

            event.preventDefault();

            if (paused) {

                resumeGame();

            } else {

                pauseGame();

            }

        }


        if (
            event.code === "Escape" &&
            screens.game.classList.contains("active")
        ) {

            pauseGame();

        }

    }
);


// ======================================================
// INICIALIZAÇÃO
// ======================================================

updateUI();
updateRecords();
showScreen("home");
