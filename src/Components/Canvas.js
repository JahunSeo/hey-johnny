import React, { Component } from "react";

export default class Canvas extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.mouseObj = {};
  }

  componentDidMount() {
    if (!this._frameId) {
      // initiate properties
      this._cvs = this.canvasRef.current;
      this._ctx = this._cvs.getContext("2d");
      this._frameCnt = 0;
      // start loop
      console.log("start loop");
      this.loop();
    }
    document.addEventListener("mousemove", this.mousemoveEventHandler);
  }

  componentWillUnmount() {
    console.log("cancel loop");
    window.cancelAnimationFrame(this._frameId);
    document.removeEventListener("mousemove", this.mousemoveEventHandler);
  }

  mousemoveEventHandler = (event) => {
    // https://stackoverflow.com/questions/17130395/real-mouse-position-in-canvas
    let rect = this._cvs.getBoundingClientRect();
    let borderWidth = 1; // temp

    let scaleX = this._cvs.width / (rect.width - borderWidth * 2);
    let scaleY = this._cvs.height / (rect.height - borderWidth * 2);

    let mouseX = (event.clientX - (rect.left + borderWidth)) * scaleX;
    let mouseY = (event.clientY - (rect.top + borderWidth)) * scaleY;

    let isMouseOverCanvas =
      mouseX >= 0 &&
      mouseX <= this._cvs.width &&
      mouseY >= 0 &&
      mouseY <= this._cvs.height;

    this.mouseObj.mouseX = mouseX;
    this.mouseObj.mouseY = mouseY;
    this.mouseObj.isMouseOverCanvas = isMouseOverCanvas;
  };

  loop = () => {
    this._frameCnt += 1;
    let { draw, isLooped = true } = this.props;
    draw(this._ctx, this._frameCnt, this.mouseObj);
    if (isLooped) {
      this._frameId = window.requestAnimationFrame(this.loop);
    }
  };

  render() {
    let { width = 600, height = 300 } = this.props;
    return (
      <canvas
        ref={this.canvasRef}
        width={width}
        height={height}
        style={{ border: "1px solid black" }}
      />
    );
  }
}
