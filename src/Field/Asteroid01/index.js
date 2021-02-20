import React, { Component } from "react";
import Canvas from "../../Component/Canvas";

import Generation from "./Generation";
import ScreenGroup from "./ScreenGroup";
import SatelliteGroup from "./SatelliteGroup";
import { PAGES } from "../../Constant";

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
  };

  draw = (ctx, frameCnt, mouseObj) => {
    let cvsWidth = ctx.canvas.width;
    let cvsHeight = ctx.canvas.height;
    let { isScreenOn, isArticleOn } = this.props;

    ctx.save();
    // clear screen
    ctx.clearRect(0, 0, cvsWidth, cvsHeight);
    // check generation initiated
    if (this.generation === undefined) return;
    // draw background
    // ctx.fillStyle = `rgba(255, 235, 199, 1)`;
    ctx.fillStyle = `rgba(255, 255, 255, 1)`;
    ctx.fillRect(0, 0, cvsWidth, cvsHeight);

    // draw generation
    // this.generation.run(ctx, frameCnt, mouseObj);

    // draw navigation
    this.sateGroup.run(ctx, frameCnt, mouseObj);

    // draw screen
    this.screenGroup.run(ctx, frameCnt, mouseObj);
    if (isScreenOn && !isArticleOn && !this.screenGroup.isMoving) {
      this.props.toggleArticle(true);
    } else if (!isScreenOn && isArticleOn) {
      this.props.toggleArticle(false);
    }

    ctx.restore();
  };

  render() {
    // console.log("Field", this.props);

    return <Canvas draw={this.draw} />;
  }
}
