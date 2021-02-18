import React, { Component } from "react";
import Canvas from "../../Component/Canvas";

import Generation from "./Generation";

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
  }

  componentDidMount() {
    document.addEventListener("keydown", this.keydownEventHandler);
    document.addEventListener("keyup", this.keyupEventHandler);

    this.generation = new Generation({
      cvsWidth: this.canvasWidth,
      cvsHeight: this.canvasHeight,
    });
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

    if (this.generation === undefined) {
      return;
    }

    ctx.save();
    ctx.fillStyle = `rgba(255, 235, 199, 1)`;
    ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

    this.generation.run(ctx, frameCnt, mouseObj);

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
