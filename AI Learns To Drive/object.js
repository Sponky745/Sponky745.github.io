class Wheel {
  constructor(x, y, r) {
    this.prevPos = createVector(x, y);
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);

    this.elasticity = random(0.7, 1);
    this.terminalVel = 40;
    this.r = r;
    this.mass = (r*r) / 10;
  }

  applyForce(force) {
    let f = force.copy();
    f.div(this.mass);
    this.acc.add(f);
  }

  copy() {
    let copy = new Wheel(this.x, this.y, this.r);
    copy.elasticity = this.elasticity;
    return copy;
  }

  update() {
    let posBeforeUpdate = this.pos.copy();
    this.vel.add(this.acc);
    this.vel.limit(this.terminalVel);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
    this.vel.x *= 1 - friction;
    this.prevPos = posBeforeUpdate;
  }

  show() {
    fill(255, 50);
    stroke(0);
    circle(this.pos.x, this.pos.y, this.r * 2);
  }
}

class Wall {
  constructor(x1, y1, x2, y2) {
    this.a = createVector(x1, y1);
    this.b = createVector(x2, y2);
  }

  show() {
    stroke(255);
    line(this.a.x, this.a.y, this.b.x, this.b.y)
  }

  wallUnit() {
    return p5.Vector.sub(this.b, this.a).normalize();
  }
}
