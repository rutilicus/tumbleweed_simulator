interface Ball {
  angle: number;
  x: number;
  speed: number;
};

interface ClickState {
  isClicked: boolean;
  x: number;
  y: number;
};

const FPS = 60;
const IMAGE_NUM = 2;
const WIDTH = 960;
const HEIGHT = 540;
const BALL_SIZE = 96;

// クリックによる加速度a [px/sec^2]
const ACCELERATION = 10;

// 空気抵抗係数k [px/sec^2]
// 960(幅)px/sec時にクリックによる加速度と等しくするため、(960^2)k = aとなるようにする
const RESISTANCE = ACCELERATION / WIDTH / WIDTH;

// 1度あたりの移動距離
const ANGLE_MOVE = BALL_SIZE * Math.PI / 360;

let canvas = document.getElementById("simulatorMain") as HTMLCanvasElement;
let context = canvas.getContext("2d") as CanvasRenderingContext2D;
let loadCount = 0;

let bgImage = new Image();
let ballImage = new Image();

let ball: Ball = {
  angle: 0,
  x: WIDTH / 2,
  speed: 0
};

let clickState: ClickState = {
  isClicked: false,
  x: 0,
  y: 0
};

function clickStart(e: MouseEvent) {
  let rect = canvas.getBoundingClientRect();
  clickState.isClicked = true;
  clickState.x = e.clientX - rect.left;
  clickState.y = e.clientY - rect.top;
}

function touchStart(e: TouchEvent) {
  let rect = canvas.getBoundingClientRect();
  clickState.isClicked = true;
  clickState.x = e.touches[0].clientX - rect.left;
  clickState.y = e.touches[0].clientY - rect.top;
}

function clickEnd() {
  clickState.isClicked = false;
}

function init() {
  bgImage.src = "./img/bg.gif";
  bgImage.onload = () => {
    loadCount++;
  }
  ballImage.src = "./img/ball.gif";
  ballImage.onload = () => {
    loadCount++;
  }

  canvas.addEventListener("mousedown", clickStart);
  canvas.addEventListener("touchstart", touchStart);
  canvas.addEventListener("mouseup", clickEnd);
  canvas.addEventListener("touchend", clickEnd);
}

function draw() {
  if (loadCount === IMAGE_NUM) {
    context.clearRect(0, 0, WIDTH, HEIGHT);

    // 背景描画
    // オフセットは中央への水平移動分
    let drawOffset = Math.floor(ball.x - WIDTH / 2);
    context.drawImage(bgImage, -drawOffset, 0);
    context.drawImage(bgImage, -drawOffset + (drawOffset > 0 ? WIDTH : -WIDTH), 0);

    // ころがるくさ描画
    context.save();
    context.translate(WIDTH / 2, HEIGHT - BALL_SIZE / 2);
    context.rotate(ball.angle * Math.PI / 180.0);
    context.drawImage(ballImage, -BALL_SIZE / 2, -BALL_SIZE / 2);
    context.restore();
  }
}

function frameProc() {
  // ころがるくさを動かす
  ball.x += ball.speed;
  if (ball.x < 0) {
    ball.x += WIDTH;
  }
  while (ball.x > WIDTH) {
    ball.x -= WIDTH;
  }
  // ころがるくさを回転させる
  ball.angle += ball.speed / ANGLE_MOVE;
  if (ball.angle < 0) {
    ball.angle += 360;
  }
  while (ball.angle > 360) {
    ball.angle -= 360;
  }

  // ころがるくさに力を与える
  if (clickState.isClicked) {
    if (clickState.x > WIDTH / 2) {
      ball.speed += ACCELERATION / FPS;
    } else {
      ball.speed -= ACCELERATION / FPS;
    }
  }
  // 空気抵抗処理
  ball.speed -= ball.speed * ball.speed * RESISTANCE / FPS * (ball.speed > 0 ? 1 : -1);

  draw();
}

function main() {
  init();
  setInterval(frameProc, 1000 / FPS);
}

main();
