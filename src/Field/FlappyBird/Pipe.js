export default class Pipe {
  constructor(props) {
    this.setting = props.setting;
    this.x = props.x;
    this.top = props.top;

    this.updateTopBottom(this.top);
    this.updateLeftRight(this.x);

    this.outStage = false;
  }

  update(ctx) {
    this.x += this.setting.velX;
    this.updateLeftRight(this.x);
    this.checkEdges(ctx);
  }

  display(ctx) {
    ctx.save();

    let { cvsHeight, pipeWidth } = this.setting;
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.fillRect(this.x, 0, pipeWidth, this.top);
    ctx.fillRect(this.x, this.bottom, pipeWidth, cvsHeight - this.bottom);

    ctx.restore();
  }

  checkEdges(ctx) {
    if (this.x < -this.setting.pipeWidth) {
      this.outStage = true;
    }
  }

  updateTopBottom(top) {
    this.top = top;
    this.bottom = top + this.setting.pipeGap;
  }

  updateLeftRight(x) {
    this.left = x;
    this.right = x + this.setting.pipeWidth;
  }
}
