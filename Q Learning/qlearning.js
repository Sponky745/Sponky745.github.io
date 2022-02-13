class Environment {
  constructor(agent, grid) {
    this.grid = grid;
    this.agent = agent;
    this.prevState = null;
    this.prevQ = 0;
    this.discount = 0.8;
    this.lr = 0.1;
  }

  calculateProbabilites(arr) {
    let sum = 0;
    let probabilities = [];
    for (let elem of arr) {
      sum += elem;
    }

    if (sum === 0) return [...arr];

    for (let i = 0; i < arr.length; i++) {
      probabilities[i] = arr[i] / sum;
    }
    return probabilities;
  }

  reward(rew, a) {

    const actions = [
      'Up',
      'Down',
      'Left',
      'Right'
    ];

    let action = actions[a];
    if (this.agent.prevCell !== null) {
      this.agent.prevCell.QTable[action] += rew;
    }
  }

  TD(s, a) {
    if (this.agent.prevCell === null) return 0;
    let table = this.agent.prevCell.QTable;
    const possibleActions = [
      table.Up,
      table.Down,
      table.Left,
      table.Right
    ];

    let action = selectAction(possibleActions);

    return this.R(s, a) + this.discount * action[0] * this.expectedValue(action[1]) - this.prevQ;
  }

  R(s, a) {
    switch (s) {
      case CellType.Mine:
        return rewards.MINE;
        break;
      case CellType.Lightning:
      return rewards.LIGHTNING;
        break;
      case CellType.Goal:
        return rewards.GOAL;
        break;
      default:
        return rewards.STEP;
    }
  }

  expectedValue(a) {
    let table = this.agent.cellOccupied.QTable;
    const possibleActions = [
      table.Up,
      table.Down,
      table.Left,
      table.Right
    ];

    let probabilities = this.calculateProbabilites(possibleActions);
    // console.log(probabilities);

    let sum = 0;
    for (let i = 0; i < possibleActions.length; i++) {
      let elem = possibleActions[i];
      if (a === i) continue;
      sum += elem * probabilities[i];
    }
    return sum;
  }

  V(s) {
    if (this.agent.prevCell === null) return 0;
    let table = this.agent.prevCell.QTable;
    const possibleActions = [
      table.Up,
      table.Down,
      table.Left,
      table.Right
    ];

    let a = selectAction(possibleActions);

    let result = this.R(s, a[0]);
    result += this.discount * this.expectedValue(a[1]);
    return result;
  }



  Q(s, a) {
    return this.prevQ + this.lr * this.TD(s, a);
  }

  step() {

    let table;
    let possibleActions = [];

    if (this.agent.prevCell !== null) {
      table = this.agent.prevCell.QTable;
      possibleActions = [
        table.Up,
        table.Down,
        table.Left,
        table.Right
      ];
    }


    let action1 = selectAction(possibleActions);
    let rew = this.Q(this.getState(), action1);
    console.log(rew);
    this.reward(rew, action1[0]);

    let action2 = selectAction(possibleActions)[0];
    if (this.getState() == CellType.Mine || this.getState() == CellType.Goal) {
      this.agent.pos.set(floor(cols/2), floor(rows/2));
    }
    this.prevQ = this.Q(this.getState(), action1);
    this.prevState = this.getState();
    this.agent.update();

  }

  getState() {
    return this.agent.cellOccupied.type;
  }
}

function sumArray(arr) {
  let sum;
  for (let elem of arr) {
    sum += elem;
  }
  return sum;
}

function selectAction(arr) {
  let record = -99999;
  let index = -1;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] >= record) {
      record = arr[i];
      index = i;
    }
  }

  return [record, index];
}
