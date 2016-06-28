var canvas;
var game;
var context;
var board;
var ball;
var mapLevel;
var bricks;
var colors;

function init() {
    canvas = document.getElementById("arkanoid");
    game = new DrawBrick("#99CCFF", 0, 0, 1024, 640);//Draw game field
    board = new DrawBrick("#112221", game.width / 2 - 60, game.height - 20, 120, 20); // Player board
    ball = new DrawBall(100, 100, 15);//Draw ball
    ball.vX = 0; // Horizontal speed
    ball.vY = 0; // vertical speed
    canvas.width = game.width;
    canvas.height = game.height;
    context = canvas.getContext('2d');
    canvas.onmousemove = move;
    mapLevel = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    newLevel();
    bricks = [];
    setInterval(play, 10);
    draw();
    colors = ["#FF0000", "#FFFF00", "#40FF00", "#2E2EFE", "#FF00F3", "#FF005A"];
}
function draw() {

    game.draw(); // Draw the game field
    board.draw(); // Draw board
    ball.draw();// Draw ball

    renderLevel(bricks);

}
function play() {
    // Render game
    update();
    draw();

}
function renderLevel(bricks) {
    for (var j = 0; j < bricks.length; j++) {
        for (var i = 0; i < bricks[j].length; i++) {
            if ((bricks[j][i]).visible == 1) {
                (bricks[j][i]).draw();
            }
        }
    }
}
function newLevel() {
    var color;
    var number = 0;
    for (var j = 0; j < 12; j++) {
        color = colors[number];
        bricks[j] = [];
        for (var i = 0; i < 10; i++) {
            bricks[j][i] = new DrawBrick(color, 24 + (i * 80), 10 + j * 40, 80, 40, mapLevel[j][i]);
        }
        if (number == colors.length - 1) {
            number = 0;
        } else {
            number++;
        }
    }

}
//Draw ball for game
function DrawBall(aX, aY, r) {
    this.x = aX;
    this.y = aY;
    this.r = r;
    this.draw = function () {
        context.fillStyle = "#006600";
        context.beginPath();
        context.arc(this.x, this.y, this.r, 0, Math.PI * 2, true);
        context.fill();
    };

}
// Draw some rectangle, game field or brick
function DrawBrick(color, aX, aY, width, height, visible) {
    this.color = color;
    this.x = aX;
    this.y = aY;
    this.width = width;
    this.height = height;
    this.visible = visible;
    this.draw = function () {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
    };

}
function move(e) {
    var aX = e.pageX;
    if (board.width / 2 + 10 < aX && aX < game.width - board.width / 2 - 10) {
        board.x = aX - board.width / 2;
    }

}
function update() {
    // Ball contact with top
    if (ball.y - ball.r < 0) {
        ball.vY = -ball.vY;
    }
    // Ball contact with left and right side
    if (ball.x - ball.r < 0 || ball.x + ball.r > game.width) {

        ball.vX = -ball.vX;

    }
    // Ball contact with bottom
    if (ball.y > game.height) {
        alert("Game Over");
        document.location.reload();
    }

    // Ball contact with board
    if (collision(board, ball)) {
        if (ball.x + ball.r < board.x + 40 && ball.vX > 0) {
            ball.vX = -ball.vX;
        }
        if (ball.x - ball.r > board.x + 80 && ball.vX < 0) {
            ball.vX = -ball.vX;
        }
        ball.vY = -ball.vY;
    }
    // Ball contact with some brick


    ball.x += ball.vX;
    ball.y += ball.vY;


}
function collision(object, ball) {
    return !!(object.x + object.width > ball.x - ball.r &&
    object.x < ball.x + ball.r &&
    object.y + object.height > ball.y + ball.r &&
    object.y < ball.y + ball.r);
}
init();