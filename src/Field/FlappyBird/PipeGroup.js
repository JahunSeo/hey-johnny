import Pipe from "./Pipe";

class Setting {
  constructor(props = {}) {
    this.updateSize(props);
  }

  updateSize(props) {
    console.log("PipeGroup Setting", props);
    this.cvsWidth = props.cvsWidth;
    this.cvsHeight = props.cvsHeight;
    // todo: update pipe related values by screen size
    this.interval = 160;
    this.pipeWidth = 80;
    this.pipeGap = 100;
    this.velX = -5;
  }
}

export default class PipeGroup {
  constructor(props) {
    this.setting = new Setting(props);
    this.restart();
  }

  resize(props) {
    this.setting.updateSize(props);
  }

  restart() {
    this.pipes = [];
    let {
      cvsWidth,
      // cvsHeight,
      interval,
      pipeWidth,
      pipeGap,
      velX,
    } = this.setting;

    let intervalWidth = interval + pipeWidth;

    let startPoint = cvsWidth;
    let pipeCnt = Math.ceil(cvsWidth / intervalWidth);
    pipeCnt += 2;
    this.frontIndex = 0;
    // console.log("pipeCnt: ", pipeCnt);

    for (let i = 0; i < pipeCnt; i++) {
      let x = startPoint + intervalWidth * i;
      let top = this.getRandomTop();
      let pipe = new Pipe(x, top, pipeWidth, pipeGap, velX);
      // for debug
      pipe.id = i;
      this.pipes.push(pipe);
    }
  }

  run(ctx) {
    let { interval, pipeWidth, pipeGap } = this.setting;

    for (let i = 0; i < this.pipes.length; i++) {
      let pipe = this.pipes[i];
      if (pipe.outStage) {
        this.frontIndex = i < this.pipes.length - 1 ? i + 1 : 0;
        let prev = i > 0 ? i - 1 : this.pipes.length - 1;
        // console.log(i, prev, this.frontIndex);
        prev = this.pipes[prev];
        pipe.x = prev.x + pipeWidth + interval;
        pipe.updateTopBottom(this.getRandomTop(), pipeGap);
        pipe.outStage = false;
      }
      pipe.update(ctx);
      pipe.display(ctx);
    }
  }

  getRandomTop() {
    let { cvsHeight, pipeGap } = this.setting;
    return (
      cvsHeight * 0.1 + Math.floor(Math.random() * (cvsHeight * 0.8 - pipeGap))
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
