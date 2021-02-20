import Vector2D from "../../../Tool/Vector2D";
import Satellite from "./Satellite";
import { PAGES } from "../../../Constant";

const NAV_STATUS = {
  SPREAD: "NAV_SPREAD",
  FOLD: "NAV_FOLD",
  BACK: "NAV_BACK",
};

class Setting {
  constructor(props = {}) {
    this.cvsWidth = props.cvsWidth;
    this.cvsHeight = props.cvsHeight;

    this.center = new Vector2D(this.cvsWidth / 2, this.cvsHeight / 2);

    this.location = new Vector2D(this.cvsWidth / 2, this.cvsHeight / 2);
    this.velocity = new Vector2D(0, 0);
    this.acceleration = new Vector2D(0, 0);

    this.updateSize(props);
  }

  updateSize(props) {
    this.cvsWidth = props.cvsWidth;
    this.cvsHeight = props.cvsHeight;

    this.center.x = this.cvsWidth / 2;
    this.center.y = this.cvsHeight / 2;

    // todo: update radius by screen size
    this.radius = 100;
    this.sateRadius = 25;
    this.accMag = null; // todo
  }
}

export default class SatelliteGroup {
  constructor(props) {
    this.setting = new Setting(props);

    this.sates = [PAGES.WIZLAB, PAGES.QUIZ, PAGES.CANDY];

    this.satesLength = 6; // temp
    this.sateAngleDist = (Math.PI * 2) / this.satesLength;

    this.angle = 0;
    this.angleStep = -0.005;
    this.status = NAV_STATUS.SPREAD;
    this.createGroup();
  }

  createGroup() {
    this.sateMap = {};
    for (let id in this.setting.sates) {
      let sate = new Satellite({ setting: this.setting, id: id });
      this.sateMap[id] = sate;
    }
  }

  run(ctx, frameCnt, mouseObj) {
    // todo: check for clicked
    this.update(ctx, frameCnt, mouseObj);
    this.display(ctx, frameCnt, mouseObj);
  }

  update(ctx, frameCnt, mouseObj) {
    this.angle += this.angleStep;
    this.angle = this.angle % (Math.PI * 2);
  }

  display(ctx, frameCnt, mouseObj) {
    ctx.save();
    let center = this.setting.center;
    let radius = this.setting.radius;
    let sateRadius = this.setting.sateRadius;
    ctx.translate(center.x, center.y);
    ctx.rotate(this.angle);
    ctx.beginPath();
    // ctx.arc(0, 0, 1, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = `rgba(255, 255, 255, 1)`;
    ctx.strokeStyle = `rgba(0, 0, 0, 1)`;

    for (let i = 0; i < this.satesLength; i++) {
      let page = this.sates[i];
      ctx.save();
      ctx.rotate(0 + i * this.sateAngleDist);
      ctx.translate(radius, 0);
      ctx.beginPath();
      ctx.arc(0, 0, sateRadius, 0, Math.PI * 2);
      ctx.fillStyle = this.getColorByPage(page);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    ctx.restore();
  }

  getColorByPage(page) {
    switch (page) {
      case PAGES.WIZLAB:
        return `rgba(0, 100, 200, 1)`;
      default:
        return `rgba(255, 255, 255, 1)`;
    }
  }
}
