class Cart {
  constructor(x, y, w, h) {
    this.originalPos = createVector(x, y);
    this.pos = createVector(x, y);
    this.w = w;
    this.h = h;
    this.wheels = [];

    this.wheels.push(new Wheel(this.pos.x - this.w/2, this.pos.y + this.h/2, random(16, 32)));
    this.wheels.push(new Wheel(this.pos.x + this.w/2, this.pos.y + this.h/2 , random(16, 32)));
    this.offset1 = p5.Vector.sub(this.wheels[0].pos, this.pos);
    this.offset1.x += this.wheels[0].r;

    this.score = 0;
    this.fitness = 0;
    this.best = false;
    this.prevBest = false;

    this.brain = new NeuralNetwork(5, 8, 2);
    this.rays = [];
    for (let i = 0; i < 3; i++) {
      this.rays.push(new Ray(this.pos.x, this.pos.y));
      let angle = i * PI/6;
      let angleX = p5.Vector.fromAngle(angle).x;
      let angleY = p5.Vector.fromAngle(angle).y;
      this.rays[i].lookAt(angleX + this.rays[i].pos.x, angleY + this.rays[i].pos.y);
    }
  }

  clone() {
    let copy = new Cart(-w/2, height/2, this.w, this.h);
    copy.brain = this.brain.copy();
    copy.wheels = [];
    for (let i = 0; i < this.wheels.length; i++) {
      copy.wheels.push(this.wheels[i].copy());
    }
    return copy;
  }

  mutate(mr) {
    for (let wheel of this.wheels) {
      if (random(1) < mr) {
        wheel.r += random(-2, 2);
        wheel.mass = (wheel.r**2) / 10;
        wheel.elasticity += random(-0.1, 0.1);
      }
    }
    this.brain.mutate(mr);
  }

  update() {
    let inputs = [
      this.wheels[0].vel.x,
      this.wheels[1].vel.x
    ];

    for (let ray of this.rays) {
      inputs.push(ray.cast(walls) / dist(0, 0, width, height));
    }

    let guess = this.brain.predict(inputs);

    if (guess[0] > guess[1]) {
      this.move(10);
    } else if (guess[1] > guess[0]) {
      this.move(-10);
    }
    for (let wheel of this.wheels) {
      wheel.applyForce(createVector(0, 0.3 * wheel.mass));
      wheel.update();
    }
    // if (p5.Vector.dist(this.wheels[0].pos, this.wheels[1].pos) > sqrt(this.w*this.w + this.h*this.h)) {
    //   this.wheels[1].pos.add(p5.Vector.sub(this.wheels[0].pos, this.wheels[1].pos));
    // }

    this.pos = p5.Vector.sub(this.wheels[0].pos, this.offset1);

    for (let i = 0; i < this.rays.length; i++) {
      let ray = this.rays[i];
      ray.pos.set(this.pos.x, this.pos.y);

    }

    this.score = this.pos.x - this.originalPos.x;

    this.wheels[1].pos.set(this.wheels[0].pos.x - this.wheels[1].r*2 + this.w, constrain(this.wheels[1].pos.y, this.wheels[0].pos.y - 48, this.wheels[0].pos.y + 48));
  }

  move(force) {
    for (let wheel of this.wheels) {
      wheel.applyForce(createVector(force * ((wheel.r / 32) * 1.25), 0));
    }
  }

  stop() {
    for (let wheel of this.wheels) {
      acc.mult(0);
    }
  }

 show() {
    for (let wheel of this.wheels) {
     wheel.show();
    }
    fill(0, 50);
    if (this.prevBest) {
      fill(0, 0, 255, 50);
    }
    if (this.best) {
      fill(0, 255, 0, 50);
    }

    let v1 = p5.Vector.sub(this.wheels[1].pos, this.wheels[0].pos);
    let v2 = createVector(1, 0);

    let angle = v1.angleBetween(v2);

    let dx = this.h * -sin(angle);

    beginShape();
    vertex(this.pos.x-this.w/2, this.wheels[0].pos.y);
    vertex(this.pos.x-this.w/2 + dx, this.wheels[0].pos.y - this.h);
    vertex(this.pos.x+this.w/2 + dx, this.wheels[1].pos.y - this.h);
    vertex(this.pos.x+this.w/2, this.wheels[1].pos.y);
    endShape();

    for (let ray of this.rays) {
      ray.show();
      ray.cast(walls);
    }
  }
}
