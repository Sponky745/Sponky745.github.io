let map;
let clicktype = 0;
let prev;
let mountain = false;

function preload() {
  map = loadImage('map.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  map.resize(width, height);
  image(map, 0, 0);
}

function draw() {
  if (mountain) {
     strokeWeight(4);
     stroke(0);
     point(mouseX, mouseY);
  }
}

function mousePressed() {
  prev = createVector(mouseX, mouseY);
  switch (clicktype) {
      case 0:
         mountain = true;
        break;
      case 1:
         break;
  }
}

function mouseReleased() {
  switch (clicktype) {
      case 0:
         mountain = false;
        break;
      case 1:
        strokeWeight(2);
        stroke(0, 235, 255);
        line(prev.x, prev.y, mouseX, mouseY);
        break;
  }
}

let str;

function keyPressed() {
  switch(keyCode) {
    case RIGHT_ARROW:
      clicktype++;
      break;
    case LEFT_ARROW:
      clicktype--;
      break;
    case ENTER:
      str = "";
      break;
  }
}
