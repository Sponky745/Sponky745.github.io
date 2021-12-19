let pos;

function fullScreen() {
	createCanvas(windowWidth, windowHeight);
}

function setup() {
	fullScreen();
	pos = createVector(width/2, height/2);
}

function draw() {
	background(0);
	fill(0, 255, 255);
	circle(pos.x, pos.y, 64);
	pos.add(p5.Vector.fromAngle(atan2(mouseY-pos.y, mouseX-pos.x)));
}