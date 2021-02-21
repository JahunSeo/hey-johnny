export default class Pipe {
  constructor(x = 0, top = 50, width = 70, gap = 100, velX = -3) {
    this.x = x;

    this.width = width;
    this.gap = gap;

    this.updateTopBottom(top, gap);
    this.updateLeftRight(x, width);

    this.velX = velX;
    this.outStage = false;
  }

  update(ctx) {
    this.x += this.velX;
    this.updateLeftRight(this.x);
    this.checkEdges(ctx);
  }

  display(ctx) {
    ctx.save();

    let canvasHeight = ctx.canvas.height;
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.fillRect(this.x, 0, this.width, this.top);
    ctx.fillRect(this.x, this.bottom, this.width, canvasHeight - this.bottom);

    ctx.restore();
  }

  checkEdges(ctx) {
    if (this.x < -this.width) {
      this.outStage = true;
    }
  }

  updateTopBottom(top, gap = this.gap) {
    this.top = top;
    this.bottom = top + gap;
  }

  updateLeftRight(x, width = this.width) {
    this.left = x;
    this.right = x + width;
  }
}
