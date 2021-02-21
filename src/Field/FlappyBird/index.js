import React, { Component } from "react";
import Canvas from "../../Component/Canvas";
import * as tf from "@tensorflow/tfjs";

import BirdGroup from "./BirdGroup";
import PipeGroup from "./PipeGroup";

export default class FlappyBird extends Component {
  constructor(props) {
    super(props);

    this.canvasWidth = 600;
    this.canvasHeight = 400;
    this.keyboard = {
      Space: false,
    };

    this.gravity = 0.5;
    this.distance = 0;
  }

  async componentDidMount() {
    let tfBackend = await tf.setBackend("cpu");
    console.log("Tensorflow backend is cpu", tfBackend);

    this.birdGroup = new BirdGroup(
      this.canvasWidth / 5,
      this.canvasWidth,
      this.canvasHeight
    );
    this.pipeGroup = new PipeGroup(this.canvasWidth);

    document.addEventListener("keydown", this.keydownEventHandler);
    document.addEventListener("keyup", this.keyupEventHandler);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.keydownEventHandler);
    document.removeEventListener("keyup", this.keyupEventHandler);
  }

  keydownEventHandler = (event) => {
    if (event.code in this.keyboard) {
      console.log("keydown:", event.code);
      this.keyboard[event.code] = true;
    }
  };

  keyupEventHandler = (event) => {
    if (event.code in this.keyboard) {
      console.log("keyup:", event.code);
      this.keyboard[event.code] = false;
    }
  };

  draw = (ctx, frameCnt, mouseObj) => {
    ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    if (this.pipeGroup === undefined || this.birdGroup === undefined) {
      return;
    }

    ctx.save();

    if (this.birdGroup.survivors.length <= 0) {
      console.log(
        `GENERATION # ${this.birdGroup.generationNum}, maxDistance: ${this.distance}`
      );
      this.pipeGroup.restart();
      this.birdGroup.evolveNextGeneration();
      this.distance = 0;

      // check memory loss
      let memo = tf.memory();
      console.log(
        `numTensors:${memo.numTensors}, numBytes:${memo.numBytes}, numDataBuffers:${memo.numDataBuffers}`
      );
    }

    // pipeGroup
    this.pipeGroup.run(ctx);

    // birdGroup
    this.birdGroup.run(ctx, this.pipeGroup, this.gravity);

    // distance
    this.distance++;

    // guide text
    // ctx.fillStyle = "rgba(0,0,0, 0.5)";
    // ctx.fillRect(5, 5, 86, 35);
    ctx.font = "12px serif";
    ctx.textBaseline = "top";
    ctx.fillText(`Generation #: ${this.birdGroup.generationNum}`, 10, 11);
    ctx.fillText(`Survivors #: ${this.birdGroup.survivors.length}`, 10, 23);
    ctx.fillText(`Distance #: ${this.distance}`, 10, 35);

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
