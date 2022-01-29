class Rectangle {
  constructor(x, y, w, h, m) {
    this.body = new Body(x, y, m);
    this.collider = new RectCollider(this.body.pos, w, h, true, this.body);
    this.w = w;
    this.h = h;
    world.add(this.body);
    world.add(this.collider);
    shapes.push(this);
  }

  move(speed) {
    this.body.addForce(createVector(speed, 0));
  }

  jump(force) {
    this.body.addForce(createVector(0, -force));
  }

  show() {
    fill((this.collider.colliding) ? 0 : 255);
    rectMode(CENTER);
    stroke(0);
    strokeWeight(1);
    let pos = this.body.pos;
    rect(pos.x, pos.y, this.w, this.h);
  }
}

class Circle {
  constructor(x, y, r, m) {
    this.body = new Body(x, y, m);
    this.collider = new CircleCollider(this.body.pos, r, this.body, true);
    this.r = r;
    world.add(this.body);
    world.add(this.collider);
    shapes.push(this);
  }

  move(speed) {
    this.body.addForce(createVector(speed, 0));
  }

  jump(force) {
    this.body.addForce(createVector(0, -force));
  }

  show() {
    fill((this.collider.colliding) ? 0 : 255);
    let pos = this.body.pos;
    circle(pos.x, pos.y, this.r*2);
  }
}
