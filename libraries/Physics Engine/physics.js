const Time = {
  delta: 1
};

const staticMass = Number.MAX_VALUE;
let friction = 0;
let drag = 0;

function clamp(n, min, max) {
  return Math.max(Math.min(n, max), min);
}

class Vec2 {
  constructor(x, y) {
    this.x = (x === undefined) ? 0 : x;
    this.y = (y === undefined) ? 0 : y;
  }

  add(v) {
    this.x += v.x;
    this.y += v.y;
  }

  static add(v1, v2) {
    let result = v1.copy();
    result.add(v2);
    return result;
  }

  sub(v) {
    this.x -= v.x;
    this.y -= v.y;
  }

  static sub(v1, v2) {
    let result = v1.copy();
    result.sub(v2);
    return result;
  }

  mult(n) {
    this.x *= n;
    this.y *= n;
  }

  static mult(v1, n) {
    let result = v1.copy();
    result.mult(n);
    return result;
  }

  div(n) {
    this.x *= n;
    this.y *= n;
  }

  static div(v1, v2) {
    let result = v1.copy();
    result.div(v2);
    return result;
  }

  normalize() {
    this.x /= this.mag();
    this.y /= this.mag();
  }

  mag() {
    return Math.sqrt(this.x**2 + this.y**2);
  }

  setMag(m) {
    this.normalize();
    this.mult(m);
  }

  clamp(min, max) {
    this.x = clamp(this.x, min, max);
    this.y = clamp(this.y, min, max);
  }

  set(x, y) {
    this.x = x;
    this.y = y;
  }

  setMag(n) {
    this.normalize();
    this.mult(n);
  }

  heading() {
    return Math.atan2(this.y, this.x);
  }

  copy() {
    let result = new Vec2(this.x, this.y);
    return result;
  }

  static dot(v1, v2) {
    return (v1.x * v2.x) + (v1.y * v2.y);
  }

  static dist(v1, v2) {
    return Vec2.sub(v1, v2).mag();
  }

  static zero() {
    return new Vec2(0, 0);
  }

  static fromVec(v) {
    return new Vec2(v.x, v.y);
  }

  static abs(v) {
    let result = Vec2.zero();
    result.x = abs(v.x);
    result.y = abs(v.y);
    return result;
  }
}

function collResBB(b1, b2) {
  let normal = Vec2.sub(b1.pos, b2.pos);
  normal.normalize();
  let relVel = Vec2.sub(b1.body.vel, b2.body.vel);
  let sepVel = Vec2.dot(relVel, normal);
  let new_sepVel = -sepVel;
  let sepVelVec = Vec2.mult(normal, new_sepVel);

  let vsepDiff = new_sepVel - sepVel;
  let impulse = vsepDiff;
  let impulseVec = Vec2.mult(normal, impulse);
  console.log(impulseVec);

  b1.body.addForce(impulseVec);
  b2.body.addForce(Vec2.mult(impulseVec, -1));
}

function penResRR(r1, r2, bounce) {
  let normal = Vec2.sub(r2.pos, r1.pos);
  let aw = (r2.w + r1.w) * 0.5;
  let ah = (r2.h + r1.h) * 0.5;

  if (Math.abs(normal.x) > aw || Math.abs(normal.y) > ah) { return false; }

  if (r2.body.mass < staticMass) {
    if (Math.abs(normal.x / r1.w) > Math.abs(normal.y / r1.h)) {
      if (normal.x < 0) {
        r2.pos.x = (r1.pos.x - r1.w/2) - r2.w/2;
        r2.body.vel.x *= (bounce) ? -0.95 : 0;
      } else {
        r2.pos.x = (r1.pos.x + r1.w/2) + r2.w/2;
        r2.body.vel.x *= (bounce) ? -0.95 : 0;
      }
    } else {
      if (normal.y < 0) {
        r2.pos.y = (r1.pos.y - r1.h/2) - r2.h/2;
        r2.body.vel.y *= (bounce) ? -0.95 : 0;
      } else {
        r2.pos.y = (r1.pos.y + r1.h/2) + r1.h/2;
        r2.body.vel.y *= (bounce) ? -0.95 : 0;
      }
    }
  }
}

function penResBB(b1, b2) {
  let dist = Vec2.sub(b1.pos, b2.pos);
  dist.normalize();
  let depth = b1.r + b2.r - dist.mag();
  let res = Vec2.mult(dist, depth);

  if (b1.body.mass < staticMass) {
    b1.pos.add(Vec2.div(res, 0.5));
  }

  if (b2.body.mass < staticMass) {
    b2.pos.sub(Vec2.div(res, 0.5));
  }
}

function penResRB(r1, b1, bounce) {
  let min = new Vec2(r1.pos.x - r1.w/2, r1.pos.y - r1.h/2);
  let max = new Vec2(r1.pos.x + r1.w/2, r1.pos.y + r1.h/2);

  let p = new Vec2();
  p.x = clamp(b1.pos.x, min.x, max.x);
  p.y = clamp(b1.pos.y, min.y, max.y);

  let toClosest = Vec2.sub(b1.pos, p);

  let d = toClosest.mag();

  let normal = Vec2.div(toClosest, d);
  let depth = b1.r - d;
  normal.setMag(depth);

  if (r1.body.mass < staticMass) {
    r1.body.pos.sub(normal);

  }
  if (b1.body.mass < staticMass) {
    b1.body.pos.add(normal);
    b1.body.vel.mult(-1);
  }
}

function RectvsRect(r1, r2) {
  let r1x = r1.pos.x - r1.w/2;
  let r1y = r1.pos.y - r1.h;

  let r2x = r2.pos.x - r2.w/2;
  let r2y = r2.pos.y - r2.h;

  let coll = (r1x + r1.w >= r2x &&    // r1 right edge past r2 left
              r1x <= r2x + r2.w &&    // r1 left edge past r2 right
              r1y + r1.h >= r2y &&    // r1 top edge past r2 bottom
              r1y <= r2y + r2.h);

  return coll;
}

function RectvsBall(r1, b1) {
  let test = b1.pos.copy();

  if (b1.pos.x < r1.pos.x - r1.w/2) { test.x = r1.pos.x - r1.w/2; }
  else if (b1.pos.x > r1.pos.x + r1.w/2) { test.x = r1.pos.x + r1.w/2; }

  if (b1.pos.y < r1.pos.y - r1.h/2) { test.y = r1.pos.y - r1.h/2; }
  else if (b1.pos.y > r1.pos.y + r1.h/2) { test.y = r1.pos.y + r1.h/2; }
  let dist = Vec2.dist(b1.pos, test);

  let coll = (dist <= b1.r);
  return coll;
}

function BallvsBall(b1, b2) {
  let coll = (b1.r + b2.r >= Vec2.sub(b2.pos, b1.pos).mag());
  return coll;
}


class World {
  constructor(options) {
    this.objects = [];
    this.colliders = [];
    this.G = (options.G !== undefined) ? options.G : 9.81;
    this.gravity = (options.gravity !== undefined) ? options.gravity.copy() : new Vec2(0, 0.3);
    friction = (options.friction !== undefined) ? options.friction : 0;
    drag = (options.drag !== undefined) ? options.drag : 0;

  }

  update() {
    for (let coll of this.colliders) {
      for (let other of this.colliders) {
        if (coll !== other) {
          coll.update();
          coll.collide(other);
        }
      }
    }

    for (let obj of this.objects) {
      obj.addForce(Vec2.mult(this.gravity, obj.mass));
      obj.update();
    }
  }

  add(obj) {
    if (obj instanceof Body) {
      this.objects.push(obj);
    } else if (obj instanceof CircleCollider || obj instanceof RectCollider) {
      this.colliders.push(obj);
    }
  }
}

class RectCollider {
  constructor(pos, w, h, bouncy, body) {
    this.pos = pos;
    this.w = w;
    this.h = h;
    this.body = body;
    this.colliding = false;
    this.bouncy = bouncy;
  }

  update() {
    this.pos = this.body.pos;
  }

  collide(other) {
    if (other instanceof CircleCollider) {
      if (RectvsBall(this, other)) {
        penResRB(this, other, this.bouncy);
        // collResRB(this, other);
        this.body.vel.mult(-0.95);
      }
    } else if (other instanceof RectCollider) {
        penResRR(this, other, this.bouncy);
    }
  }
}

class CircleCollider {
  constructor(pos, r, body, bounce) {
    this.pos = pos;
    this.r = r;
    this.body = body;
    this.bouncy = bounce;
  }

  update() {
    this.pos = this.body.pos;
  }

  collide(other) {
    if (other instanceof CircleCollider) {
      if (BallvsBall(this, other)) {
        penResBB(this, other);
        // collResBB(this, other);
        this.body.vel.mult(0.95);
      }
    } else if (other instanceof RectCollider) {
      if (RectvsBall(other, this)) {
        penResRB(other, this, true);
        // collResRB(this, other);
        this.body.vel.mult(-0.95);
      }
    }
  }
}

class Body {
  constructor(x, y, m, terminalVelocity) {
    this.pos = new Vec2(x, y);
    this.vel = new Vec2();
    this.acc = new Vec2();
    this.terminalVelocity = (terminalVelocity !== undefined) ? terminalVelocity : Number.MAX_VALUE;
    this.mass = (m >= 0) ? m : 1;
  }

  addForce(force) {
    let f = (force instanceof Array) ? new Vec2(force[0], force[1]) : force.copy();
    f.div((this.mass > 0) ? this.mass : staticMass);
    if (this.mass < staticMass) {
      this.acc.add(f);
    }
  }

  update() {
    this.vel.add(Vec2.mult(this.acc, Time.delta));
    this.vel.clamp(-this.terminalVelocity, this.terminalVelocity);
    this.pos.add(Vec2.mult(this.vel, Time.delta));
    this.acc.set(0, 0);
    this.vel.x *= 1 - friction;
    this.vel.y *= 1 - drag;
  }
}
