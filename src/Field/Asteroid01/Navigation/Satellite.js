// import Vector2D from "../../../Tool/Vector2D";

export default class Satellite {
  constructor(props = {}) {
    this.setting = props.setting;
    this.id = props.id;

    this.angle = 0;
  }

  update(ctx) {
    // let radius = this.setting.radius;
    // let sateRadius = this.setting.sateRadius;
  }

  display(ctx) {
    // let center = this.setting.center;
    // let radius = this.setting.radius;
    let sateRadius = this.setting.sateRadius;
    ctx.save();
    ctx.beginPath();
    ctx.arc(10, 10, sateRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}
