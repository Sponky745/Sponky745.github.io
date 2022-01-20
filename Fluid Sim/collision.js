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
