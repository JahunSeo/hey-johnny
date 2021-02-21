import React, { Component } from "react";
import Canvas from "../Component/Canvas";

import * as tf from "@tensorflow/tfjs";
import BirdGroup from "./FlappyBird/BirdGroup";
import PipeGroup from "./FlappyBird/PipeGroup";

import Generation from "./Generation";
import ScreenGroup from "./ScreenGroup";
import SatelliteGroup from "./SatelliteGroup";
import { PAGES } from "../Constant";

export default class Field extends Component {
  // constructor(props) {
  //   super(props);
  // }

  async componentDidMount() {
    window.addEventListener("resize", this.resizeEventHandler);
    this.resizeEventHandler();

    this.generation = new Generation({
      cvsWidth: this.stageWidth,
      cvsHeight: this.stageHeight,
    });
    this.sateGroup = new SatelliteGroup({
      cvsWidth: this.stageWidth,
      cvsHeight: this.stageHeight,
      setPage: this.props.setPage,
    });
    this.screenGroup = new ScreenGroup({
      cvsWidth: this.stageWidth,
      cvsHeight: this.stageHeight,
      currentPage: this.props.currentPage,
    });

    let tfBackend = await tf.setBackend("cpu");
    console.log("Tensorflow backend is cpu", tfBackend);

    this.birdBoardWidthRatio = 1;
    this.birdGroup = new BirdGroup({
      cvsWidth: this.stageWidth,
      cvsHeight: this.stageHeight,
      boardWidthRadio: this.birdBoardWidthRatio,
    });
    this.pipeGroup = new PipeGroup({
      cvsWidth: this.stageWidth,
      cvsHeight: this.stageHeight,
      boardWidthRadio: this.birdBoardWidthRatio,
    });
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeEventHandler);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isScreenOn !== this.props.isScreenOn) {
      if (this.props.isScreenOn) {
        // console.log("spread the screen");
        this.screenGroup.resize({
          cvsWidth: this.stageWidth,
          cvsHeight: this.stageHeight,
          currentPage: this.props.currentPage,
        });
        this.screenGroup.spread();
      } else {
        // console.log("fold the screen");
        this.screenGroup.fold();
      }
    }

    if (prevProps.currentPage !== this.props.currentPage) {
      if (this.props.currentPage === PAGES.MAIN) {
        this.sateGroup.expand();
      }
    }
  }

  resizeEventHandler = (event) => {
    // console.log("index, resizeEventHandler");
    // console.log(window.innerWidth, window.innerHeight);

    this.stageWidth = window.innerWidth || document.body.clientWidth;
    this.stageHeight = window.innerHeight || document.body.clientHeight;

    if (this.generation !== undefined) {
      this.generation.resize({
        cvsWidth: this.stageWidth,
        cvsHeight: this.stageHeight,
      });
    }
    if (this.screenGroup !== undefined) {
      this.screenGroup.resize({
        cvsWidth: this.stageWidth,
        cvsHeight: this.stageHeight,
        currentPage: this.props.currentPage,
      });
    }
    if (this.sateGroup !== undefined) {
      this.sateGroup.resize({
        cvsWidth: this.stageWidth,
        cvsHeight: this.stageHeight,
      });
    }
    if (this.birdGroup !== undefined) {
      this.birdGroup.resize({
        cvsWidth: this.stageWidth,
        cvsHeight: this.stageHeight,
        boardWidthRadio: this.birdBoardWidthRatio,
      });
    }
    if (this.pipeGroup !== undefined) {
      this.pipeGroup.resize({
        cvsWidth: this.stageWidth,
        cvsHeight: this.stageHeight,
        boardWidthRadio: this.birdBoardWidthRatio,
      });
    }
  };

  draw = (ctx, frameCnt, mouseObj) => {
    let cvsWidth = ctx.canvas.width;
    let cvsHeight = ctx.canvas.height;
    let { currentPage, isScreenOn, isArticleOn } = this.props;

    // check initiation
    if (this.generation === undefined) return;
    if (this.screenGroup === undefined) return;
    if (this.sateGroup === undefined) return;

    ctx.save();
    // clear screen
    ctx.clearRect(0, 0, cvsWidth, cvsHeight);

    // draw background
    ctx.fillStyle = `rgba(255, 255, 255, 1)`;
    ctx.fillRect(0, 0, cvsWidth, cvsHeight);

    // draw generation
    // this.generation.run(ctx, frameCnt, mouseObj);

    // draw navigation
    if (currentPage === PAGES.MAIN) {
      this.sateGroup.run(ctx, frameCnt, mouseObj);
    }

    // draw screen
    this.screenGroup.run(ctx, frameCnt, mouseObj);
    if (isScreenOn && !isArticleOn && !this.screenGroup.isMoving) {
      this.props.toggleArticle(true);
    } else if (!isScreenOn && isArticleOn) {
      this.props.toggleArticle(false);
    }

    // draw flappy bird
    if (currentPage === PAGES.BIRD && isArticleOn) {
      this.drawFlappyBird(ctx, frameCnt, mouseObj);
    }

    ctx.restore();
  };

  drawFlappyBird = (ctx, frameCnt, mouseObj) => {
    if (this.birdGroup === undefined) return;
    if (this.pipeGroup === undefined) return;

    ctx.save();

    // let width = this.stageWidth * this.birdBoardWidthRatio;
    // let height = 400;
    // let x = (this.stageWidth - width) / 2;
    // let y = (this.stageHeight - height) / 2;
    // ctx.strokeRect(x, y, width, height);

    if (this.birdGroup.survivors.length <= 0) {
      console.log(
        `GENERATION # ${this.birdGroup.generationNum}, maxDistance: ${this.distance}`
      );
      this.pipeGroup.restart();
      this.birdGroup.evolveNextGeneration();

      // check memory loss
      let memo = tf.memory();
      console.log(
        `numTensors:${memo.numTensors}, numBytes:${memo.numBytes}, numDataBuffers:${memo.numDataBuffers}`
      );
    }

    // pipeGroup
    this.pipeGroup.run(ctx);
    // birdGroup
    this.birdGroup.run(ctx, this.pipeGroup);

    // guide text
    ctx.fillStyle = `rgba(0, 0, 0, 1)`;
    ctx.font = "12px serif";
    ctx.textBaseline = "top";
    ctx.fillText(`Generation #: ${this.birdGroup.generationNum}`, 10, 11);
    ctx.fillText(`Survivors #: ${this.birdGroup.survivors.length}`, 10, 23);
    ctx.fillText(`Distance #: ${this.birdGroup.distance}`, 10, 35);

    ctx.restore();
  };

  render() {
    // console.log("Field", this.props);

    return <Canvas draw={this.draw} />;
  }
}
