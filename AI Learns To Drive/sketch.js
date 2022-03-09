const spacing = 150;
const variability = 75;
let TOTAL;
let w;
let carts;
let walls = [];
const friction = 0;

function setup() {
  createCanvas(windowWidth - 400, windowHeight);
  noCursor();
  w = width * 10;
  TOTAL = w / spacing;

  carts = new Population(25);

  for (let i = 0; i < TOTAL; i++) {
    if (i > 0) {
      walls.push(new Wall(i * spacing - w/2, walls[i - 1].b.y, (i + 1) * spacing - w/2, min(walls[i-1].b.y + random(-variability, variability), height)));
    } else {
      walls.push(new Wall(i * spacing - w/2, height-200, (i + 1) * spacing - w/2, (height-200) + random(-variability, variability)));
    }
  }

  walls.push(new Wall(-w/2, height, -w/2, -9999999));
  walls.push(new Wall(w/2, height, w/2, -9999999));

  frameRate(60);
 }
//
function draw() {
  background(36);
  push();
  if (carts.getBest()) {
    translate(width/2, 0);
    translate(-carts.getBest().pos.x, 0);
  }
  carts.show();

  for (let wall of walls) {
    wall.show();
  }
  pop();
  fill(255);
  textSize(30);
  text("Step: " + carts.step, 50, 50);
  text("Gen: " + carts.gen, 50, 100);
 }

function fixedDraw() {
  if (carts.finished()) {
    carts.evolve();
  }

  // if (keyIsPressed) {
  //   if (keyCode == LEFT_ARROW) {
  //     carts.move(-10);
  //   } else if (keyCode == RIGHT_ARROW) {
  //     carts.move(10);
  //   }
  // }

  carts.update();

  for (let wall of walls) {
    wall.show();
    for (let cart of carts.carts) {
      for (let ball of cart.wheels) {
        if (BallvsWall(ball, wall)) {
          penResBW(ball, wall);
          collResBW(ball, wall);
        }
      }
    }
  }
}
setInterval(function() {
  fixedDraw();
}, 20);
