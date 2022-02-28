class Particle {
  constructor(x, y, isSolute = false) {
    this.pos = createVector(x, y);
    this.vel = createVector();
    this.acc = createVector();
    this.r = 12;
    this.isSolute = isSolute;
  }

  applyForce(force) {
    this.acc.add(force);
  }

  show() {
    fill(255, 128);
    if (this.isSolute) {
      fill(0, 255, 0);
    }
    noStroke();
    circle(this.pos.x, this.pos.y, this.r);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
  }
}
