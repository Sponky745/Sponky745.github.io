const ClickType = {
  Ball: 0,
  Square: 1,
  Move: 2
};

let world;
let click = ClickType.Ball;
let shapes = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  world = new World({ G: 981, gravity: createVector(0, 0.3), friction: 0.1, drag: 0.01 });
  let ground = new Rectangle(width/2, height + 320, width, 720, staticMass);
}

function draw() {
  background(51);
  world.update();

  fill(255);
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(35);

  switch (click) {
    case ClickType.Ball:
      text("Click Type: Ball", 50, 50);
      break;
    case ClickType.Square:
      text("Click Type: Rectangle", 50, 50);
      break;
    default:
      text("Click Type: None", 50, 50);
  }

  if (mouseIsPressed && click == ClickType.Move) {
    let record = Infinity;
    let closest;

    let mouse = createVector(mouseX, mouseY);

    shapes.forEach((s, i) => {
      let d = Vec2.dist(s.body.pos, new Vec2(mouseX, mouseY));

      if (d < record) {
        record = d;
        closest = s;
      }
    });

    let dir = Vec2.sub(closest.body.pos, new Vec2(mouseX, mouseY));
    let distanceSq = dir.mag()**2;

    if (closest.body.mass < staticMass) {
      let str = world.G * closest.body.mass / Math.max(distanceSq, 1);
      let force = dir.copy();
      force.setMag(str);
      closest.body.addForce(force.copy());
    }
  }
  for (let s of shapes) {
    s.show();
  }
}


function keyPressed() {
  switch (keyCode) {
    case RIGHT_ARROW:
      click++;
      break;
      case LEFT_ARROW:
      click--;
  }
}

let a;

function mousePressed() {
  switch (click) {
    case ClickType.Ball:
      let b = new Circle(mouseX, mouseY, 16);
      break;
    case ClickType.Square:
      a = createVector(mouseX, mouseY);
  }
}

function mouseReleased() {
  switch (click) {
    case ClickType.Square:
      let b = createVector(mouseX, mouseY);
      let pos = Vec2.add(a, b);
      pos.div(2);
      let dim = Vec2.abs(Vec2.sub(b, a));
      let r = new Rectangle(pos.x, pos.y, dim.x, dim.y);
  }
}
