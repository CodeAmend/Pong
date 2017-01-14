
var canvas;
var canvasContext;
var mouse = {};
var waitingForServe = true;
const WIDTH = 800;
const HEIGHT = 600;

var player1Score = 0;
var player2Score = 0;

// ball vars
var ballX = 10;
var ballY = 0;
var ballSpeedX = 18;
var ballSpeedY = 15;

// paddle vars
const PADDLE_HEIGHT = 100;
var player1PaddleY = HEIGHT / 2;
var player2PaddleY = HEIGHT / 2;




document.addEventListener('DOMContentLoaded', domLoaded, false);

function domLoaded() {
    canvas = document.getElementById('gameCanvas');
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    canvasContext = canvas.getContext('2d');
    // sets mouse in center for initial paddle position.
    mouse.y = canvas.height / 2 ;

    canvas.addEventListener('mousemove',  function(event) {
        var root = document.documentElement;
        var rect = canvas.getBoundingClientRect();
        mouse = {
            x: event.clientX - rect.left - root.scrollLeft,
            y: event.clientY - rect.top - root.scrollTop
        }
    });
    canvas.addEventListener('click',  function(event) {
        waitingForServe = false;
    });

    var framesPerSecond = 30;
    setInterval(drawEverything, 1000 / framesPerSecond);
}

function drawEverything() {
    // Fill entire background board
    canvasContext.fillStyle = 'black';
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);

    if (waitingForServe) {
        canvasContext.fillStyle = '#79b';
        canvasContext.fillText("Click to Serve.", canvas.width / 2 - 60, canvas.height - 100);
    }

    // Just the player scores on left and right side.
    drawScore();

    // draw player ball and detect colision
    ballAnimation();

    // draw player 1 paddle using mouse.x position
    player1PaddleY = mouse.y - PADDLE_HEIGHT / 2;
    drawRect(0, player1PaddleY, 10, PADDLE_HEIGHT, 'white');

    // draw player 2 paddle
    paddle2AI();

}

function drawScore() {
    canvasContext.fillStyle = 'red';
    canvasContext.font = "bold 20px Ariel";
    canvasContext.fillText("SCORE: " + player1Score, 60, 30);
    canvasContext.fillStyle = 'red';
    canvasContext.fillText("SCORE: " + player2Score, canvas.width - 160, 30);
}

function paddle2AI() {
    if (ballY > player2PaddleY + PADDLE_HEIGHT / 2 + 20) {
        player2PaddleY += 15;
    } else  if (ballY < player2PaddleY + PADDLE_HEIGHT / 2 - 20) {
        player2PaddleY -= 15;
    }
    drawRect(canvas.width - 10, player2PaddleY, 10, PADDLE_HEIGHT, 'white');

}

function drawRect(left, top, width, height, color ) {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(left, top, width, height)
}

function resetBall(homePoint) {
    if (homePoint) {
        ballX = 15;
        ballY = player1PaddleY + PADDLE_HEIGHT / 2;

    } else {
        ballX = canvas.width - 15;
        ballY = player2PaddleY + PADDLE_HEIGHT / 2;
    }
    ballSpeedX = Math.random() * 15 + 10 | 1;
    ballSpeedY = Math.random() * 15 + 10 | 1;

}



function ballAnimation() {

    if (!waitingForServe) {
        ballX += ballSpeedX;
        ballY += ballSpeedY;
    } else {
        ballY = player1PaddleY + PADDLE_HEIGHT / 2;
    }

    if (ballX < 5) {
        if (ballY < player1PaddleY || ballY > player1PaddleY + PADDLE_HEIGHT) {
            player2Score++;
            resetBall(false);
        } else {
            ballSpeedX = -ballSpeedX;
            var deltaY = ballY - (player1PaddleY + PADDLE_HEIGHT / 2);
            ballSpeedY = deltaY * 0.50;
        }
    }
    if (ballX > canvas.width) {
        if (ballY < player2PaddleY || ballY > player2PaddleY + PADDLE_HEIGHT) {
            player1Score++;
            waitingForServe = true;
            resetBall(true);
        } else {
            ballSpeedX = -ballSpeedX;
            var deltaY = ballY - (player2PaddleY + PADDLE_HEIGHT / 2);
            ballSpeedY = deltaY * 0.50;
        }
    }
    if (ballY < 0) {
        ballSpeedY = -ballSpeedY;
    }
    if (ballY > canvas.height - 10) {
        ballSpeedY = -ballSpeedY;
    }

    canvasContext.beginPath()
    canvasContext.fillStyle = 'white';
    canvasContext.arc(ballX, ballY, 10, 0, 2 * Math.PI, false)
    canvasContext.fill()
}
