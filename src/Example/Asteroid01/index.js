import React, { Component } from "react";
import Canvas from "../../Component/Canvas";

import Generation from "./Generation";

export default class Asteroid01 extends Component {
  constructor(props) {
    super(props);

    this.keyboard = {
      Space: false,
      ArrowLeft: false,
      ArrowRight: false,
    };
    this.state = {
      cvsWidth: 800,
      cvsHeight: 600,
    };
  }

  componentDidMount() {
    window.addEventListener("resize", this.resizeEventHandler);
    this.resizeEventHandler();

    document.addEventListener("keydown", this.keydownEventHandler);
    document.addEventListener("keyup", this.keyupEventHandler);

    this.generation = new Generation({
      cvsWidth: this.state.cvsWidth,
      cvsHeight: this.state.cvsHeight,
    });
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.keydownEventHandler);
    document.removeEventListener("keyup", this.keyupEventHandler);
  }

  resizeEventHandler = (event) => {
    console.log("index, resizeEventHandler");
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;

    this.setState({
      cvsWidth: this.stageWidth,
      cvsHeight: this.stageHeight,
    });
  };

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
    let { cvsWidth, cvsHeight } = this.state;

    ctx.save();
    // ctx.scale(2, 2);
    ctx.clearRect(0, 0, cvsWidth, cvsHeight);

    if (this.generation === undefined) {
      return;
    }

    ctx.fillStyle = `rgba(255, 235, 199, 1)`;
    ctx.fillRect(0, 0, cvsWidth, cvsHeight);

    this.generation.run(ctx, frameCnt, mouseObj);

    ctx.restore();
  };

  render() {
    console.log("index render", this.state);
    return (
      <Canvas
        draw={this.draw}
        width={this.state.cvsWidth}
        height={this.state.cvsHeight}
      />
    );
  }
}
