import React, { Component } from "react";
import Canvas from "../../Component/Canvas";

import Generation from "./Generation";

export default class Asteroid01 extends Component {
  // constructor(props) {
  //   super(props);
  // }

  componentDidMount() {
    window.addEventListener("resize", this.resizeEventHandler);
    this.resizeEventHandler();
    this.generation = new Generation({
      cvsWidth: this.stageWidth,
      cvsHeight: this.stageHeight,
    });
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeEventHandler);
  }

  resizeEventHandler = (event) => {
    // console.log("index, resizeEventHandler");
    // console.log(window.innerWidth, window.innerHeight);

    this.stageWidth = window.innerWidth;
    this.stageHeight = window.innerHeight;

    if (this.generation !== undefined) {
      this.generation.resize({
        cvsWidth: this.stageWidth,
        cvsHeight: this.stageHeight,
      });
    }
  };

  draw = (ctx, frameCnt, mouseObj) => {
    let cvsWidth = ctx.canvas.width;
    let cvsHeight = ctx.canvas.height;

    ctx.save();
    // clear screen
    ctx.clearRect(0, 0, cvsWidth, cvsHeight);
    // check generation initiated
    if (this.generation === undefined) return;
    // draw background
    ctx.fillStyle = `rgba(255, 235, 199, 1)`;
    ctx.fillRect(0, 0, cvsWidth, cvsHeight);
    // draw generation
    this.generation.run(ctx, frameCnt, mouseObj);

    ctx.restore();
  };

  render() {
    return <Canvas draw={this.draw} />;
  }
}
