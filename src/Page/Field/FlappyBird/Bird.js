// import Vector2D from "../../Tool/Vector2D"
import Brain from "./Brain";

export default class Bird {
  constructor(props = {}) {
    this.setting = props.setting;
    this.y = props.y;

    this.width = 30;
    this.height = 15;

    let x = this.setting.x;
    this.left = x;
    this.right = x + this.width;
    this.updateTopBottom(this.y, this.height);

    this.velY = 0;
    this.accY = 0;
    this.jumpForce = -1;

    this.maxVelY = 20;

    this.score = 0;

    this.transplantBrain(props.brain);
  }

  transplantBrain(brain) {
    if (brain instanceof Brain) {
      //   console.log("transplanted!");
      this.brain = brain;
    } else {
      //   console.log("new brain..");
      this.brain = new Brain();
    }
  }

  extractBrain() {
    return this.brain.copy();
  }

  disposeBrain() {
    this.brain.dispose();
  }

  think(pipes) {
    // todo
    // make input for neural network

    let { boardWidth, boardHeight } = this.setting;
    let pipe = pipes[0];

    let inputs = [];
    inputs[0] = this.y / boardHeight;
    inputs[1] = this.velY / this.maxVelY;
    inputs[2] = pipe.left / boardWidth;
    inputs[3] = pipe.right / boardWidth;
    inputs[4] = pipe.top / boardHeight;
    inputs[5] = pipe.bottom / boardHeight;

    let outputs = this.brain.predict(inputs);
    if (outputs[0] > outputs[1]) {
      this.jump();
    }
  }

  jump() {
    this.accY += this.jumpForce;
  }

  applyForceY(v) {
    this.accY += v;
  }

  update(ctx) {
    this.velY += this.accY;
    this.velY = Math.min(this.velY, this.maxVelY);
    this.y += this.velY;
    this.accY = 0;

    this.updateTopBottom();
    // this.checkEdges(ctx);
  }

  addScore() {
    this.score++;
  }

  display(ctx) {
    if (this.top <= 0) return;
    if (this.bottom >= this.setting.boardHeight) return;

    ctx.save();
    let { originX, originY } = this.setting;
    ctx.translate(originX, originY);
    ctx.strokeStyle = `rgba(0, 0, 0, 1)`;
    ctx.strokeRect(this.setting.x, this.y, this.width, this.height);
    ctx.restore();
  }

  updateTopBottom(y = this.y, height = this.height) {
    this.top = y;
    this.bottom = y + height;
  }

  collidesWith(pipe) {
    // console.log("BIRD:", this.left, this.right, this.top, this.bottom);
    // console.log("PIPE:", pipe.left, pipe.right, pipe.top, pipe.bottom);
    let checkX = this.right > pipe.left && this.left < pipe.right;
    let checkY = this.top < pipe.top || this.bottom > pipe.bottom;
    if (checkX && checkY) {
      //   console.log("HIT");
      return true;
    }
    return false;
  }

  isOutOfStage(ctx) {
    let { boardHeight } = this.setting;

    // // weaker criteria could be,
    // this.top < -this.height / 2 ||
    // this.bottom > boardHeight + this.height / 2

    if (this.top < 0 || this.bottom > boardHeight) {
      return true;
    } else {
      return false;
    }
  }
}
