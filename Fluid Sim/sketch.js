const ClickType = {
  Move: 0,
  Add: 1
};

const spacing = 16;
const viscosity = 250;
const friction = 0.05;
const drag = 0.025;

let click = ClickType.Move;
let gravity;
let particles = [];

function setup() {
  createCanvas(windowWidth-400, windowHeight);
  gravity = createVector(0, 0.6);


  for (let y = height/2; y < height/2 + 200; y += spacing) {
    for (let x = width/2 - 100; x < width/2 + 100; x += spacing) {
      particles.push(new Particle(x, y))
    }
  }
}

function draw() {
  background(51);

  fill(255);
  textAlign(LEFT, CENTER);
  textSize(35);
  switch (click) {
    case ClickType.Move:
      text("Click Type: Move", 50, 50);
      break;
    case ClickType.Add:
      text("Click Type: Add", 50, 50);
      break;
    default:
      text("Click Type: None", 50, 50);
  }

  for (let particle of particles) {
    particle.applyForce(gravity);
    particle.show();
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

    for (let other of particles) {
      let d = p5.Vector.dist(other.pos, particle.pos);
      if (other !== particle && d < spacing + 4) {
        let force = p5.Vector.sub(other.pos, particle.pos);
        let x = force.mag();
        force.setMag(-1 * 0.5 * x);
        particle.applyForce(p5.Vector.div(force, 1));
        // other.applyForce(p5.Vector.div(force, -2));

        if (BallvsBall(particle, other)) {
          penResBB(particle, other);
        }
      }
    }

    if (mouseIsPressed && click === ClickType.Move) {
      let mouse = createVector(mouseX, mouseY);
      if (p5.Vector.dist(particle.pos, mouse) < viscosity) {
        let force = p5.Vector.sub(mouse, particle.pos);
        let x = force.mag();
        force.setMag(0.01 * x);
        particle.applyForce(force);
      }
    }

    particle.vel.x *= (1 - friction);
    particle.vel.y *= (1 - drag);
    particle.update();
  }

  if (mouseIsPressed && click == ClickType.Add) {
    particles.push(new Particle(mouseX + random(-16, 16), mouseY + random(-16, 16)));
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
}
