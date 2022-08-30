let paddle_1 = document.querySelector('.paddle_1');
let paddle_2 = document.querySelector('.paddle_2');
let board = document.querySelector('.board');
let ball = document.querySelector('.ball');
let score = document.querySelector('.score');
let paddle_common = document.querySelector('.paddle').getBoundingClientRect();
let board_coord = board.getBoundingClientRect();
let paddle_1_coord = paddle_1.getBoundingClientRect();
let paddle_2_coord = paddle_2.getBoundingClientRect();
let ball_coord = ball.getBoundingClientRect();
let target = board_coord.top + board_coord.height / 2;
let move_vel = 8;
let player_1_dir = 0;
let score_1 = 0;
let score_2 = 0;
let gameState = 'start';
let clacked = false;

let dx = 3;
let dy = 3;
let dxd = -1;
let dyd = -1;

function init() {
  paddle_1 = document.querySelector('.paddle_1');
  paddle_2 = document.querySelector('.paddle_2');
  board = document.querySelector('.board');
  ball = document.querySelector('.ball');
  score = document.querySelector('.score');
  paddle_common = document.querySelector('.paddle').getBoundingClientRect();
  paddle_1.classList.remove('fade1');
  paddle_2.classList.remove('fade1');
  score.classList.remove('fade1');
  ball.classList.remove('fade2');
  reset();
}

function reset() {
  board_coord = board.getBoundingClientRect();

  ball.style.top = board_coord.height * .5 + board_coord.top - 10 + 'px';
  ball.style.left = board_coord.width * .5 + board_coord.left - 10 + 'px';
  ball_coord = ball.getBoundingClientRect();

  paddle_1.style.top = board_coord.height * .5 + board_coord.top - 75 + 'px';
  paddle_1.style.left = board_coord.width * .075 + board_coord.left - 10 + 'px';
  paddle_1_coord = paddle_1.getBoundingClientRect();

  paddle_2.style.top = board_coord.height * .5 + board_coord.top - 75 + 'px';
  paddle_2.style.right = board_coord.width * .075 + board_coord.left + 10 + 'px';
  paddle_2_coord = paddle_2.getBoundingClientRect();

  target = board_coord.top + board_coord.height / 2;
  move_vel = 8;
  player_1_dir = 0;
  score_1 = 0;
  score_2 = 0;
  gameState = 'start';
  score.innerHTML = 'Press Space or Enter!';
  clacked = false;
}

document.addEventListener('keydown', (e) => {
  if (e.key == 'Enter' || e.key == ' ') {
    if (gameState == 'start') {
      paddle_1.classList.add('fade1');
      paddle_2.classList.add('fade1');
      ball.classList.add('fade2');
    } else if (gameState == 'serve') {
      gameState = 'playing';
      serve();
      requestAnimationFrame(() => {
        move();
      });
    } else if (gameState == 'playing') {
      serve();
    }
  }
  if (gameState == 'playing') {
    if (e.key == 'w' || e.key == 'ArrowUp') {
      player_1_dir = -1;
    } else if (e.key == 's' || e.key == 'ArrowDown') {
      player_1_dir = 1;
    }
  }
});

document.addEventListener('keyup', (e) => {
  if (gameState == 'playing') {
    if (e.key == 'w' || e.key == 'ArrowUp') {
      player_1_dir = 0;
    } else if (e.key == 's' || e.key == 'ArrowDown') {
      player_1_dir = 0;
    }
  }
});

ball.addEventListener("animationend", () => {start();}, {}, false);

window.addEventListener('resize', () => {
  board_coord = board.getBoundingClientRect();
  paddle_1_coord = paddle_1.getBoundingClientRect();
  paddle_2_coord = paddle_2.getBoundingClientRect();
  if (gameState != 'playing') {
    ball.style.top = board_coord.height * .5 + board_coord.top - 10 + 'px';
    ball.style.left = (paddle_1_coord.right + paddle_2_coord.left) / 2 - 10 + 'px';
  }
  ball_coord = ball.getBoundingClientRect();
  calcTarget();
});

function start() {
  gameState = 'playing';
  score.innerHTML = score_1 + ' - ' + score_2;
  serve();
  requestAnimationFrame(() => {
    move();
  });
}

function serve() {
  ball.style.top = board_coord.height * .5 + board_coord.top - 10 + 'px';
  ball.style.left = (paddle_1_coord.right + paddle_2_coord.left) / 2 - 10 + 'px';
  ball_coord = ball.getBoundingClientRect();
  player_1_dir = 0;
  randomize(true);
  calcTarget();
}

function move() {
  if (player_1_dir != 0) {
    paddle_1.style.top = Math.min(board_coord.bottom - paddle_common.height, Math.max(board_coord.top, paddle_1_coord.top + move_vel * player_1_dir)) + 'px';
    paddle_1_coord = paddle_1.getBoundingClientRect();
  }
  let diff = paddle_2_coord.top + paddle_common.height / 2 - target;
  if (diff != 0) {
    if (-move_vel <= diff && diff <= move_vel) {
      paddle_2.style.top = target - paddle_common.height / 2 + 'px';
    } else if (diff > 0) {
      paddle_2.style.top = Math.max(board_coord.top, paddle_2_coord.top - move_vel) + 'px';
    } else if (diff < 0) {
      paddle_2.style.top = Math.min(board_coord.bottom - paddle_common.height, paddle_2_coord.top + move_vel) + 'px';
    }
    paddle_2_coord = paddle_2.getBoundingClientRect();
  }
  moveBall();
}
  
function moveBall() {
  let bounce = false;
  if (ball_coord.top <= board_coord.top) {
    dyd = 1;
    bounce = true;
  } else if (ball_coord.bottom >= board_coord.bottom) {
    dyd = -1;
    bounce = true;
  }
  if (ball_coord.left <= paddle_1_coord.right && ball_coord.left >= paddle_1_coord.left && ball_coord.top >= paddle_1_coord.top && ball_coord.bottom <= paddle_1_coord.bottom) {
    dxd = 1;
    randomize(false);
    bounce = true;
  } else if (ball_coord.right >= paddle_2_coord.left && ball_coord.right <= paddle_2_coord.right && ball_coord.top >= paddle_2_coord.top && ball_coord.bottom <= paddle_2_coord.bottom) {
    dxd = -1;
    randomize(false);
    bounce = true;
  }
  if (bounce) {
    calcTarget();
    if (!clacked) {
      clack();
      clacked = true;
    } else {
      clacked = false;
    }
  } else {
    clacked = false;
  }
  if (ball_coord.left <= board_coord.left || ball_coord.right >= board_coord.right) {
    if (ball_coord.left <= board_coord.left) {
      score_2 += 1;
    } else {
      score_1 += 1;
    }
    score.innerHTML = score_1 + ' - ' + score_2;
    gameState = 'serve';
    return;
  }
  ball.style.top = (ball_coord.top + dy * dyd) + 'px';
  ball.style.left = (ball_coord.left + dx * dxd) + 'px';
  ball_coord = ball.getBoundingClientRect();
  requestAnimationFrame(() => {
    move();
  });
}

function calcTarget() {
  if (dxd == -1) {
    target = board_coord.top + board_coord.height / 2;
  } else {
    let height = ((dyd * dy) / (dxd * dx)) * (paddle_2_coord.left - ball_coord.right) + ball_coord.top + (ball_coord.height / 2);
    height -= board_coord.top;
    height = Math.abs(height) % (2 * board_coord.height);
    if (height > board_coord.height) {
      target = 2 * board_coord.height - height + board_coord.top;
    } else {
      target = height + board_coord.top;
    }
  }
}

function randomize(direction) {
  dx = Math.floor(Math.random() * 6) + 6;
  dy = Math.floor(Math.random() * 6) + 6;
  if (direction) {
    dxd = 2 * Math.floor(Math.random() * 2) - 1;
    dyd = 2 * Math.floor(Math.random() * 2) - 1;
  }
}

function clack() {
  (new Audio('assets/clack.wav')).play();
}