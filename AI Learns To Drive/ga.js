class Population {
  constructor(size) {
    this.size = size;
    this.carts = [];
    this.step = 0;
    this.maxSteps = 400;
    this.gen = 0;

    for (let i = 0; i < size; i++) {
      this.carts.push(new Cart(-w/2 + 200, height/2, 100, 50));
    }
  }

  evolve() {
    this.naturalSelection();
    this.mutate();
    this.reset();
  }

  mutate() {
    for (let i = 1; i < this.carts.length; i++) {
      this.carts[i].mutate(0.1);
    }
  }

  selectParent() {
    let index = 0;
    let r = random(1);

    while (r > 0) {
      r -= this.carts[index].fitness;
      index++;
    }

    return this.carts[index];
  }

  calculateFitnesses() {
    let scoreSum = 0;
    for (let cart of this.carts) {
      if (cart.best) {
        cart.score *= 15;
      }
      scoreSum += cart.score;
    }

    for (let cart of this.carts) {
      cart.fitness = cart.score / scoreSum;
    }
  }

  calculateFitnessSum() {
    let fitnessSum = 0;
    for (let cart of this.carts) {
      fitnessSum += cart.fitness;
    }
    return fitnessSum;
  }

  naturalSelection() {
    this.calculateFitnesses();
    this.calculateFitnessSum();

    let newCarts = [];
    let parent = this.selectParent();
    let best = this.getBest();
    best.prevBest = true;
    best.best = false;
    newCarts[0] = best;

    for (let i = 1; i < this.carts.length; i++) {
      newCarts[i] = parent.clone();
    }
    this.carts = newCarts;
  }

  getBest() {
    let record = 0;
    let furthestIndex = -1;
    for (let i = 0; i < this.carts.length; i++) {
      this.carts[i].best = false;

      if (!this.carts[i].prevBest && this.carts[i].score > record) {
        record = this.carts[i].score;
        furthestIndex = i;
      }
    }
    if (furthestIndex > -1) {
      this.carts[furthestIndex].best = true;
      return this.carts[furthestIndex];
    }
  }

  show() {
    for (let cart of this.carts) {
      cart.show();
    }
  }

  update() {
    if (this.step < this.maxSteps) {
      for (let cart of this.carts) {
        cart.update();
      }
      this.step++;
    }
  }

  move(force) {
    for (let cart of this.carts) {
      cart.move(force);
    }
  }

  finished() {
    return (this.step >= this.maxSteps);
  }

  reset() {
    for (let cart of this.carts) {
      for (let wheel of cart.wheels) {
        wheel.vel.set(0, 0);
        wheel.acc.set(0, 0);
      }
      cart.wheels[0].pos = p5.Vector.sub(cart.originalPos, cart.offset1);
      cart.pos.set(-w/2 + 200, height/2);
    }
    this.step = 0;
    this.gen++;
  }
}
