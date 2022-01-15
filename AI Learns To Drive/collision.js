function collResBW(b1, w1) {
	let normal = p5.Vector.sub(b1.pos, closestPointBW(b1, w1)).normalize();
  let sepVel = p5.Vector.dot(b1.vel, normal);
  let new_sepVel = -sepVel * (1 - b1.elasticity);

  let vsep_diff = sepVel - new_sepVel;

  b1.applyForce(p5.Vector.mult(normal, -vsep_diff).mult(b1.mass));
}

function penResBW(b1, w1) {
	let penVec = p5.Vector.sub(b1.pos, closestPointBW(b1, w1));
  b1.pos.add(penVec.normalize().mult(b1.r - penVec.mag()));
}

function BallvsWall(b1, w1) {
  let ballToClosest = p5.Vector.sub(closestPointBW(b1, w1), b1.pos);
  if (ballToClosest.mag() <= b1.r) {
    return true;
  }  else {
  	return false;
  }
}


function closestPointBW(b1, w1) {
  let ballToWallStart = p5.Vector.sub(w1.a, b1.pos)
  if (p5.Vector.dot(w1.wallUnit(), ballToWallStart) > 0) {
    return w1.a;
  }

  let wallEndToBall = p5.Vector.sub(b1.pos, w1.b);
  if (p5.Vector.dot(w1.wallUnit(), wallEndToBall) > 0) {
    return w1.b;
  }
  let closestDist = p5.Vector.dot(w1.wallUnit(), ballToWallStart);
  let closestVec = p5.Vector.mult(w1.wallUnit(), closestDist);

  return p5.Vector.sub(w1.a, closestVec);

}
