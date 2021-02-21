import Bird from "./Bird";
import * as tf from "@tensorflow/tfjs";

export default class BirdGroup {
  constructor(x, canvasWidth, canvasHeight, groupSize = 150) {
    this.x = x;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.groupSize = groupSize;
    this.survivors = [];
    this.deads = [];

    this.generationNum = 1;

    for (let i = 0; i < this.groupSize; i++) {
      let bird = new Bird(this.x, this.getRandomY(), canvasWidth, canvasHeight);
      this.survivors.push(bird);
    }
  }

  getRandomY() {
    let y = this.canvasHeight * 0.1;
    y += Math.floor(Math.random() * (this.canvasHeight * 0.8));
    return y;
  }

  run(ctx, pipeGroup, gravity) {
    // get the target pipes
    let subPipes = pipeGroup.getClosestPipesFrom(this.x, 2);
    // console.log(subPipes[0].id, subPipes[1].id);

    for (let i = this.survivors.length - 1; i >= 0; i--) {
      let bird = this.survivors[i];

      // check whether the bird is kill by pipes,
      // and if not dead, return inputs for 'think' method.
      let isDead = bird.collidesWith(subPipes[0]);
      isDead = isDead || bird.isOutOfStage(ctx);
      if (isDead) {
        let dropout = this.survivors.splice(i, 1);
        this.deads.push(dropout[0]);
        continue;
      }

      // only if the bird survives,
      bird.addScore();
      bird.think(subPipes);
      bird.applyForceY(gravity);
      bird.update(ctx);
      bird.display(ctx);
    }
  }

  evolveNextGeneration() {
    // selection: calculate fitness
    let sum = 0;
    let largest = 0;
    this.deads.forEach((bird) => {
      bird.score = bird.score * bird.score;
      sum += bird.score;
    });
    this.deads.forEach((bird) => {
      bird.fitness = bird.score / sum;
      if (bird.fitness > largest) {
        largest = bird.fitness;
      }
    });
    // console.log("FITNESS", sum, largest);

    // reproduction:
    if (this.survivors.length > 0) {
      throw new Error("there is a ghost bird!!!");
    }

    for (let i = 0; i < this.groupSize; i++) {
      // pick one parent with probability according to relative fitness
      let parent = this.pickOne();
      // and copy it (rather than crossover)
      let brain = parent.extractBrain(); // get new brain object
      // mutate
      brain.mutate(0.1);
      let child = new Bird(
        this.x,
        this.getRandomY(),
        this.canvasWidth,
        this.canvasHeight,
        brain
      );
      this.survivors.push(child);
    }

    // dispose deads
    for (let i = 0; i < this.deads.length; i++) {
      let dead = this.deads[i];
      dead.disposeBrain();
    }
    this.deads = [];

    this.generationNum++;
  }

  pickOne() {
    let idx = 0;
    let r = Math.random();
    while (r > 0) {
      r -= this.deads[idx].fitness;
      idx++;
    }
    idx--;
    let picked = this.deads[idx];
    return picked;
  }
}
