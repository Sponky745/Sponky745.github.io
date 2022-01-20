class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector();
    this.acc = createVector();
    this.r = 4;
  }

  applyForce(force) {
    this.acc.add(force);
  }

  show() {
    fill(255);
    noStroke();
    circle(this.pos.x, this.pos.y, this.r * 2);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
  }
}
