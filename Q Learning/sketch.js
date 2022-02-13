const make2DArray = (cols, rows) => {
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
};

const rewards = {
  STEP: 1,
  MINE: -100,
  LIGHTNING: 1,
  END: 100,
};

const scl = 20;
const NUM_LIGHTNINGS = 10;
const NUM_MINES = 50;

let grid;
let cols;
let rows;
let player;
let env;
let fastForward = false;

function setup() {
  createCanvas(960, 640);
  cols = width / scl;
  rows = height / scl;

  grid = make2DArray(cols, rows);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = new Cell(i, j, CellType.None, false);
    }
  }

  player = new Agent(floor(cols/2), floor(rows/2));
  env = new Environment(player, grid);

  // for (let i = 0; i < cols; i++) {
  //   grid[i][0].type = CellType.Mine;
  // }

  for (let i = 0; i < NUM_LIGHTNINGS; i++) {
    let randI = floor(random(cols));
    let randJ = floor(random(rows));
    grid[randI][randJ].type = CellType.Lightning;
  }

  for (let i = 0; i < NUM_MINES; i++) {
    let randI = floor(random(cols));
    let randJ = floor(random(rows));
    grid[randI][randJ].type = CellType.Mine;
  }

  let randI = floor(random(cols));
  let randJ = floor(random(rows));
  grid[randI][randJ].type = CellType.Goal;

  frameRate(10);
}

function draw() {
  background(0);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].show();
    }
  }

  env.step();
  player.show();
}

function keyPressed() {
  if (key === ' ') {
    fastForward = !fastForward;
    frameRate((fastForward) ? 60 : 10);
  }
}
