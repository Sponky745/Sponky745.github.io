const ClickType = {
  Move: 0,
  Add: 1,
  Solute: 2,
};

const spacing = 20;
const viscosity = 250;
const friction = 0;
const drag = 0;
const maxspeed = 10;

let click = ClickType.Move;
let gravity;
let particles = [];
let showDebug = false;

function setup() {
  createCanvas(windowWidth-400, windowHeight);
  gravity = createVector(0, 0.6);


  for (let y = height/2 - 200; y < height/2 + 200; y += spacing) {
    for (let x = width/2 - 100; x < width/2 + 100; x += spacing) {
      particles.push(new Particle(x + random(-15, 15), y));
      particles.push(new Particle(x + random(-15, 15), y));
    }
  }
}

function draw() {
  background(51);

  let boundary = new Rectangle(width/2, height/2, width, height);
  let qt = new QuadTree(boundary, 4);

  fill(255);
  noStroke();
  textAlign(LEFT, CENTER);
  textSize(35);
  switch (click) {
    case ClickType.Move:
      text("Click Type: Move", 50, 50);
      break;
    case ClickType.Add:
      text("Click Type: Add", 50, 50);
      break;
    case ClickType.Solute:
      text("Click Type: Add Solute", 50, 50);
      break;
    default:
      text("Click Type: None", 50, 50);
  }

  if (showDebug) {
    text("Show Debug: True", 50, 100);
  } else {
    text("Show Debug: False", 50, 100);
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    const particle = particles[i];
    particle.applyForce(gravity);
    particle.show();
    let point = new Point(particle.pos.x, particle.pos.y, particle);
    qt.insert(point);

    if (particle.pos.y > height - particle.r) {
      particle.vel.y *= -1;
      particle.vel.y *= 0.99;
      particle.pos.y = height - particle.r;
    }
    if (particle.pos.y < -particle.r) {
      particle.vel.y *= -1;
      particle.vel.y *= 0.99;
      particle.pos.y = -particle.r;
    }

    if (particle.pos.x < -particle.r) {
      particle.vel.x *= -1;
      particle.vel.x *= 0.99;
      particle.pos.x = -particle.r;
    }

    if (particle.pos.x > width - particle.r) {
      particle.vel.x *= -1;
      particle.vel.x *= 0.99;
      particle.pos.x = width - particle.r;
    }

    particle.vel.x *= (1 - friction);
    particle.vel.y *= (1 - drag);
    particle.vel.x = constrain(particle.vel.x, -maxspeed, maxspeed);
    particle.vel.y = (particle.vel.y < -maxspeed) ? -maxspeed : particle.vel.y;
    particle.update();

    let circle = new Circle(particle.pos.x, particle.pos.y, spacing + 4);
    let others = qt.query(circle);

    for (let p of others) {
      let other = p.userData;
      let d = p5.Vector.dist(other.pos, particle.pos);
      if (other !== particle && d < spacing + 4) {
        let force = p5.Vector.sub(other.pos, particle.pos);
        let x = force.mag();
        force.setMag(-1 * 0.4 * x);
        // particle.applyForce(p5.Vector.div(force, 2));
        // other.applyForce(p5.Vector.div(force, -2));

        if (BallvsBall(particle, other)) {
          penResBB(particle, other);
          collResBB(particle, other);
          particle.vel.mult(0.99);
        }
      }
    }

    if (mouseIsPressed && click === ClickType.Move) {
      let mouse = createVector(mouseX, mouseY);
      if (p5.Vector.dist(particle.pos, mouse) < viscosity) {
        let force = p5.Vector.sub(mouse, particle.pos);
        let dsquared = force.magSq();
        dsquared = constrain(dsquared, 255, 400);
        const G = 1000;
        let str = G / dsquared;
        force.setMag(str);
        particle.applyForce(force);
      }
    }
  }
  if (mouseIsPressed && click == ClickType.Add) {
    particles.push(new Particle(mouseX + random(-16, 16), mouseY + random(-16, 16)));
  } else if (mouseIsPressed && click == ClickType.Solute) {
    particles.push(new Particle(mouseX + random(-16, 16), mouseY + random(-16, 16), true));
  }

  if (showDebug) {
    qt.show();
  }
}


function keyPressed() {
  switch (keyCode) {
    case LEFT_ARROW:
      if (click > 0) {
        click--;
      }
      break;
    case RIGHT_ARROW:
      click++;
      break;
  }

  switch (key) {
    case "D":
    case "d":
      showDebug = !showDebug;
      break;
    case "C":
    case "c":
      particles.length = 0;
  }
}
