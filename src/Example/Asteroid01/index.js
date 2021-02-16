import React, { Component } from "react";
import Canvas from "../../Component/Canvas";

import Asteroid from "./Asteroid";

export default class Asteroid01 extends Component {
  constructor(props) {
    super(props);

    this.canvasWidth = 800;
    this.canvasHeight = 600;
    this.keyboard = {
      Space: false,
      ArrowLeft: false,
      ArrowRight: false,
    };

    this.asteroid = new Asteroid(this.canvasWidth / 2, this.canvasHeight / 2);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.keydownEventHandler);
    document.addEventListener("keyup", this.keyupEventHandler);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.keydownEventHandler);
    document.removeEventListener("keyup", this.keyupEventHandler);
  }

  keydownEventHandler = (event) => {
    if (event.code in this.keyboard) {
      // console.log("keydown:", event.code);
      this.keyboard[event.code] = true;
    }
  };

  keyupEventHandler = (event) => {
    if (event.code in this.keyboard) {
      // console.log("keyup:", event.code);
      this.keyboard[event.code] = false;
    }
  };

  draw = (ctx, frameCnt, mouseObj) => {
    ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    ctx.save();
    ctx.fillStyle = `rgba(255, 235, 199, 1)`;
    ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

    if (this.keyboard["ArrowLeft"]) {
      this.asteroid.turnLeft();
    }
    if (this.keyboard["ArrowRight"]) {
      this.asteroid.turnRight();
    }
    if (this.keyboard["Space"]) {
      this.asteroid.moveForward();
    }

    if (mouseObj.isMouseOverCanvas) {
      this.asteroid.seekMouse(mouseObj);
    }
    this.asteroid.update(ctx);
    this.asteroid.display(ctx, this.keyboard["Space"], mouseObj);

    ctx.restore();
  };

  render() {
    return (
      <div>
        <Canvas
          draw={this.draw}
          width={this.canvasWidth}
          height={this.canvasHeight}
        />
      </div>
    );
  }
}
