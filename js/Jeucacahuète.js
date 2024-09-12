
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Charger l'image du joueur et des cacahuètes
const playerImage = new Image();
playerImage.src = 'img/drole-de-mignon-cacahuete-bande-dessin-anime-autocollant.jpg';
const peanutImage = new Image();
peanutImage.src = 'img/les-bienfaits-sante-du-beurre-de-cacahuete.jpeg';

// Propriétés du joueur
const player = {
    x: 50,
    y: 540,
    width: 50,
    height: 50,
    speed: 5,
    velocityY: 0,
    jumping: false,
    jumpPower: 15,
    gravity: 1,
};

// Plateformes
const platforms = [
    { x: 100, y: 550, width: 200, height: 20 },
    { x: 400, y: 450, width: 200, height: 20 },
    { x: 150, y: 350, width: 200, height: 20 },
];

// Cacahuètes à ramasser
const peanuts = [
    { x: 150, y: 510, width: 30, height: 30 },
    { x: 450, y: 410, width: 30, height: 30 },
    { x: 200, y: 310, width: 30, height: 30 },
];

let score = 0;
let gameOver = false;

function drawPlayer() {
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
}

function drawPlatforms() {
    ctx.fillStyle = 'brown';
    platforms.forEach(platform => {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });
}

function drawPeanuts() {
    peanuts.forEach(peanut => {
        ctx.drawImage(peanutImage, peanut.x, peanut.y, peanut.width, peanut.height);
    });
}

function updatePlayer() {
    // Gravité
    player.velocityY += player.gravity;
    player.y += player.velocityY;

    // Collision avec le sol
    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        player.jumping = false;
        player.velocityY = 0;
    }

    // Collision avec les plateformes
    platforms.forEach(platform => {
        if (player.x < platform.x + platform.width &&
            player.x + player.width > platform.x &&
            player.y < platform.y + platform.height &&
            player.y + player.height > platform.y) {
            player.y = platform.y - player.height;
            player.jumping = false;
            player.velocityY = 0;
        }
    });

    // Collecter les cacahuètes
    peanuts.forEach((peanut, index) => {
        if (player.x < peanut.x + peanut.width &&
            player.x + player.width > peanut.x &&
            player.y < peanut.y + peanut.height &&
            player.y + player.height > peanut.y) {
            // Enlever la cacahuète et augmenter le score
            peanuts.splice(index, 1);
            score += 10;
        }
    });

    // Vérifier si toutes les cacahuètes ont été ramassées
    if (peanuts.length === 0) {
        gameOver = true;
    }
}

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 30);
}

function drawGameOver() {
    ctx.fillStyle = 'red';
    ctx.font = '50px Arial';
    ctx.fillText('Game Over', canvas.width / 2 - 150, canvas.height / 2);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawPlatforms();
    drawPeanuts();
    drawScore();

    if (!gameOver) {
        updatePlayer();
        requestAnimationFrame(gameLoop);
    } else {
        drawGameOver();
    }
}

window.addEventListener('keydown', function(e) {
    switch (e.key) {
        case 'ArrowRight':
            player.x += player.speed;
            break;
        case 'ArrowLeft':
            player.x -= player.speed;
            break;
        case ' ':
            if (!player.jumping) {
                player.jumping = true;
                player.velocityY = -player.jumpPower;
            }
            break;
    }
});

// Lancer le jeu une fois les images chargées
playerImage.onload = function() {
    peanutImage.onload = function() {
        gameLoop();
    };
};
