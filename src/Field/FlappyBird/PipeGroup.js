import Pipe from "./Pipe";
export default class PipeGroup {
  constructor(canvasWidth = 600, canvasHeight = 400) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;

    this.interval = 160;
    this.pipeWidth = 80;
    this.pipeGap = 100;
    this.velX = -5;
    this.restart();
  }

  run(ctx) {
    for (let i = 0; i < this.pipes.length; i++) {
      let pipe = this.pipes[i];
      if (pipe.outStage) {
        this.frontIndex = i < this.pipes.length - 1 ? i + 1 : 0;
        let prev = i > 0 ? i - 1 : this.pipes.length - 1;
        // console.log(i, prev, this.frontIndex);
        prev = this.pipes[prev];
        pipe.x = prev.x + this.pipeWidth + this.interval;
        pipe.updateTopBottom(this.getRandomTop(), this.pipeGap);
        pipe.outStage = false;
      }
      pipe.update(ctx);
      pipe.display(ctx);
    }
  }

  restart() {
    this.pipes = [];
    let intervalWidth = this.interval + this.pipeWidth;

    let startPoint = this.canvasWidth;
    let pipeCnt = Math.ceil(this.canvasWidth / intervalWidth);
    pipeCnt += 2;
    this.frontIndex = 0;
    // console.log("pipeCnt: ", pipeCnt);

    for (let i = 0; i < pipeCnt; i++) {
      let x = startPoint + intervalWidth * i;
      let top = this.getRandomTop();
      let pipe = new Pipe(x, top, this.pipeWidth, this.pipeGap, this.velX);
      // for debug
      pipe.id = i;
      this.pipes.push(pipe);
    }
  }

  getRandomTop() {
    return (
      this.canvasHeight * 0.1 +
      Math.floor(Math.random() * (this.canvasHeight * 0.8 - this.pipeGap))
    );
  }

  getClosestPipesFrom(x, num = 1) {
    num = Math.min(num, this.pipes.length);
    let subPipes = [];
    let idx = this.frontIndex;
    if (this.pipes[this.frontIndex].right < x) {
      idx = idx < this.pipes.length - 1 ? idx + 1 : 0;
    }
    for (let i = 0; i < num; i++) {
      subPipes.push(this.pipes[idx]);
      idx = idx < this.pipes.length - 1 ? idx + 1 : 0;
    }
    return subPipes;
  }
}
