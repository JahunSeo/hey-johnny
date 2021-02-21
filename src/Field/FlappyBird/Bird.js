// import Vector2D from "../../Tool/Vector2D"
import Brain from "./Brain";

export default class Bird {
  constructor(x = 0, y = 0, canvasWidth, canvasHeight, brain) {
    this.x = x;
    this.y = y;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;

    this.width = 30;
    this.height = 15;

    this.left = x;
    this.right = x + this.width;
    this.updateTopBottom(y, this.height);

    this.velY = 0;
    this.accY = 0;
    this.jumpForce = -1;

    this.maxVelY = 20;

    this.score = 0;

    this.transplantBrain(brain);
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
    let pipe = pipes[0];

    let inputs = [];
    inputs[0] = this.y / this.canvasHeight;
    inputs[1] = this.velY / this.maxVelY;
    inputs[2] = pipe.left / this.canvasWidth;
    inputs[3] = pipe.right / this.canvasWidth;
    inputs[4] = pipe.top / this.canvasHeight;
    inputs[5] = pipe.bottom / this.canvasHeight;

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
    ctx.save();
    ctx.strokeStyle = `rgba(0, 0, 0, 1)`;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
    ctx.restore();
  }

  checkEdges(ctx) {
    let canvasHeight = ctx.canvas.height;

    if (this.y < 0) {
      this.y = 0;
      this.velY = 0;
    } else if (this.y > canvasHeight - this.height) {
      this.y = canvasHeight - this.height;
      this.velY = 0;
    }
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
    let canvasHeight = ctx.canvas.height;
    if (
      this.top < -this.height / 2 ||
      this.bottom > canvasHeight + this.height / 2
    ) {
      return true;
    } else {
      return false;
    }
  }
}
