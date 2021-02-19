import React, { Component } from "react";
import Canvas from "../../Component/Canvas";

export default class GA01 extends Component {
  constructor(props) {
    super(props);
    this.cvsWidth = 400;
    this.cvsHeight = 400;
  }

  componentDidMount() {}

  draw = (ctx, frameCnt, mouseObj) => {
    ctx.clearRect(0, 0, this.cvsWidth, this.cvsHeight);
    ctx.save();
    ctx.translate(this.cvsWidth / 2, this.cvsHeight / 2);
    ctx.rotate((Math.PI / 180) * frameCnt);
    ctx.beginPath();
    ctx.arc(0, 0, 40, Math.PI / 6, (Math.PI * 11) / 6);
    ctx.stroke();
    ctx.textBaseline = "middle";
    ctx.fillText("GA01", 0, 0);

    ctx.restore();
  };

  render() {
    return (
      <div>
        <Canvas
          draw={this.draw}
          width={this.cvsWidth}
          height={this.cvsHeight}
        />
      </div>
    );
  }
}
