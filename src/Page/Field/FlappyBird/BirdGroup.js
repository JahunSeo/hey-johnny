import Bird from "./Bird";
import { SCREEN_SIZE } from "../../Constant";

class Setting {
  constructor(props = {}) {
    this.updateSize(props);
  }

  updateSize(props) {
    // console.log("BirdGroup Setting", props);
    this.cvsWidth = props.cvsWidth;
    this.cvsHeight = props.cvsHeight;

    this.boardWidthRadio = props.boardWidthRadio;
    this.boardWidth = this.cvsWidth * this.boardWidthRadio;
    this.boardHeight = SCREEN_SIZE.BIRD400.max.h;

    // warning! originX and Y is just for displaying!
    this.originX = (this.cvsWidth - this.boardWidth) / 2;
    this.originY = (this.cvsHeight - this.boardHeight) / 2;

    // todo: to locate bird in center of screen, getClosestPipesFrom logic should be refactored.
    // this.x = (this.boardWidth) / 2;
    this.x = 120;
    this.groupSize = 50;
    this.gravity = 0.5;
  }
}

export default class BirdGroup {
  constructor(props) {
    this.setting = new Setting(props);
    this.survivors = [];
    this.deads = [];

    this.generationNum = 1;
    this.distance = 0;
    this.createBirds();
  }

  resize(props) {
    this.setting.updateSize(props);
  }

  createBirds() {
    for (let i = 0; i < this.setting.groupSize; i++) {
      let bird = new Bird({
        setting: this.setting,
        y: this.getRandomY(),
      });
      this.survivors.push(bird);
    }
  }

  getRandomY() {
    let { boardHeight } = this.setting;
    let y = boardHeight * 0.1;
    y += Math.floor(Math.random() * (boardHeight * 0.8));
    return y;
  }

  run(ctx, pipeGroup) {
    // get the target pipes
    let subPipes = pipeGroup.getClosestPipesFrom(this.setting.x, 2);
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
      bird.applyForceY(this.setting.gravity);
      bird.update(ctx);
      bird.display(ctx);
    }

    this.distance++;
  }

  drawDashboard(ctx) {
    // guide text
    ctx.fillStyle = `rgba(0, 0, 0, 1)`;
    ctx.font = "12px NanumSquareRound, sans-serif";
    ctx.textBaseline = "top";

    let x = this.setting.originX + 20;
    let y = this.setting.originY + this.setting.boardHeight - 50;

    ctx.fillText(`Gen : ${this.generationNum}`, x, y);
    ctx.fillText(
      `Bird : ${this.survivors.length} / ${this.setting.groupSize}`,
      x,
      y + 12
    );
    ctx.fillText(`Dist : ${this.distance}`, x, y + 23);
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

    for (let i = 0; i < this.setting.groupSize; i++) {
      // pick one parent with probability according to relative fitness
      let parent = this.pickOne();
      // and copy it (rather than crossover)
      let brain = parent.extractBrain(); // get new brain object
      // mutate
      brain.mutate(0.1);
      let child = new Bird({
        setting: this.setting,
        y: this.getRandomY(),
        brain: brain,
      });

      this.survivors.push(child);
    }

    // dispose deads
    for (let i = 0; i < this.deads.length; i++) {
      let dead = this.deads[i];
      dead.disposeBrain();
    }
    this.deads = [];

    this.generationNum++;
    this.distance = 0;
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
