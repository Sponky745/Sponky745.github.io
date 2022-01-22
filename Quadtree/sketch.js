let qt;

function setup() {
  createCanvas(800, 800);

  let boundary = new Rectangle(width/2, height/2, width/2, height/2);
  qt = new QuadTree(boundary, 4);

  for (let i = 0; i < 500; i++) {
    let p = new Point(random(width), random(height));
    qt.insert(p);
  }

  console.log(qt);
  console.log("----------------------------------------");
  console.log(JSON.stringify(qt));
}

function draw() {
  background(0);
  qt.show();

  stroke(0, 255, 0);

  let range = new Rectangle(random(width), random(height), 200, 200);
  rect(range.x, range.y, range.w*2, range.h*2);
  let points = [];
  qt.query(range, points);
  for (let p of points) {
    strokeWeight(4);
    stroke(0, 255, 0);
    point(p.x, p.y);
  }
  noLoop();
}

// function mouseDragged() {
//   qt.insert(new Point(mouseX, mouseY));
// }
