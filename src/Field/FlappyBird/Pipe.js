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

    let { originX, originY, pipeWidth, boardHeight } = this.setting;
    ctx.translate(originX, originY);
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.fillRect(this.x, 0, pipeWidth, this.top);
    ctx.fillRect(this.x, this.bottom, pipeWidth, boardHeight - this.bottom);

    ctx.restore();
  }

  checkEdges(ctx) {
    // 처음 x 설정 시 originX 없이 0을 기준으로 boardWidth만 사용하기 때문에,
    // display 할 때만 originX 가 활용되고, checkEdge 할 때는 originX를 고민하지 않아도 됨
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
