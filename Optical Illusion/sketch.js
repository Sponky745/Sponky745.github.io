const PHI = (1 + Math.sqrt(5)) / 2;

const numPoints = 1000;
let turnFraction = PHI;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(51);
  translate(width/2, height/2);
  scale(8);
  textAlign(CENTER);
  textSize(18);
  fill(255);
  text("Turn Fraction: " + turnFraction, 0, -200);
  for (let i = 0; i < numPoints; i++) {
    let dst = i / (numPoints - 1);
    let angle = TAU * turnFraction * i;

    let pos = createVector(
      dst*150 * cos(angle),
      dst*150 * sin(angle)
    );
    stroke(255);

    point(pos.x, pos.y);
  }
  turnFraction += 0.00001;
}
