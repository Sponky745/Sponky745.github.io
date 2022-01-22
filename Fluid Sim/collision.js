function collResBB(b1, b2) {
  let normal = p5.Vector.sub(b1.pos, b2.pos).normalize();
  let relVel = p5.Vector.sub(b1.vel, b2.vel);
  let sepVel = p5.Vector.dot(relVel, normal);
  let new_sepVel = -sepVel;
  let sepVelVec = p5.Vector.mult(normal, new_sepVel);

  let vsepDiff = new_sepVel - sepVel;
  let impulse = vsepDiff;
  let impulseVec = p5.Vector.mult(normal, impulse);

  b1.vel.add(impulseVec);
  b2.vel.add(impulseVec.mult(-1));
}

function penResBB(b1, b2) {
  let dist = p5.Vector.sub(b1.pos, b2.pos);
  let depth = b1.r + b2.r - dist.mag();
  let res = p5.Vector.mult(dist.normalize(), depth);
  b1.pos.add(res);
  b2.pos.sub(res);
}

function BallvsBall(b1, b2) {
  return (b1.r + b2.r >= p5.Vector.sub(b2.pos, b1.pos).mag());
}
