import Vector2D from "../../Tool/Vector2D";
import { PAGES } from "../../Constant";

const NAV_STATUS = {
  UNFOLDED: "NAV_UNFOLDED",
  FOLDED: "NAV_FOLDED",
  BACK: "NAV_BACK",

  SHRINK: "NAV_SHRINK",
  EXPAND: "NAV_EXPAND",
};

class Setting {
  constructor(props = {}) {
    this.cvsWidth = props.cvsWidth;
    this.cvsHeight = props.cvsHeight;

    this.center = new Vector2D(this.cvsWidth / 2, this.cvsHeight / 2);
    this.updateSize(props);
  }

  updateSize(props) {
    this.cvsWidth = props.cvsWidth;
    this.cvsHeight = props.cvsHeight;

    this.center.x = this.cvsWidth / 2;
    this.center.y = this.cvsHeight / 2;

    // todo: update radius by screen size
    this.radiusLimit = 100;
    this.sateRadiusLimit = 25;
  }
}

export default class SatelliteGroup {
  constructor(props) {
    this.setting = new Setting(props);

    this.sates = [PAGES.WIZLAB, PAGES.MIDAS, PAGES.QUIZ];

    this.satesLength = this.sates.length; // temp
    this.sateAngleDist = (Math.PI * 2) / this.satesLength;

    this.radius = this.setting.radiusLimit;
    this.sateRadius = this.setting.sateRadiusLimit;

    this.angle = 0;
    this.angleStep = 0.005;
    this.radiusShrinkSpeed = 3;
    this.sateRadiusShrinkSpeed = 1;

    this.status = NAV_STATUS.UNFOLDED;

    this.setPage = props.setPage;
  }

  resize(props) {
    this.setting.updateSize(props);
  }

  run(ctx, frameCnt, mouseObj) {
    this.update(ctx, frameCnt, mouseObj);
    this.display(ctx, frameCnt, mouseObj);
  }

  setStatus(status) {
    console.log("nav status", status);
    this.status = status;
  }

  expand() {
    this.setStatus(NAV_STATUS.EXPAND);
  }

  checkClick(mouseObj) {
    // 만약 클릭이 되었을 때, 모두 펼쳐져 있을 때만
    if (this.status === NAV_STATUS.UNFOLDED && mouseObj.clicked) {
      let { mouseX, mouseY } = mouseObj;
      for (let i = 0; i < this.satesLength; i++) {
        let page = this.sates[i];
        if (!page) continue;
        // polar to cartasian
        let sateAngle = this.angle + i * this.sateAngleDist;
        let r = this.radius;
        let dx = r * Math.cos(sateAngle);
        let dy = r * Math.sin(sateAngle);
        let center = this.setting.center;
        let x = center.x + dx;
        let y = center.y + dy;
        // calculate distance
        let sateRadius = this.sateRadius;
        let distSq = (x - mouseX) ** 2 + (y - mouseY) ** 2;
        if (distSq < sateRadius * sateRadius) {
          console.log("clicked", page);
          return page;
        }
      }
      return false;
    }
  }

  update(ctx, frameCnt, mouseObj) {
    if (this.status === NAV_STATUS.UNFOLDED) {
      let page = this.checkClick(mouseObj);
      if (page) {
        this.selected = page;
        this.setStatus(NAV_STATUS.SHRINK);
      }

      this.angle += this.angleStep;
      this.angle = this.angle % (Math.PI * 2);

      if (this.radius < this.setting.radiusLimit) {
        this.radius++;
      } else if (this.radius > this.setting.radiusLimit) {
        this.radius--;
      }

      if (this.sateRadius < this.setting.sateRadiusLimit) {
        this.sateRadius++;
      } else if (this.sateRadius > this.setting.sateRadiusLimit) {
        this.sateRadius--;
      }
    } else if (this.status === NAV_STATUS.SHRINK) {
      this.radius -= this.radiusShrinkSpeed;
      this.sateRadius -= this.sateRadiusShrinkSpeed;
      this.angle += this.angleStep * 20;
      this.angle = this.angle % (Math.PI * 2);

      let sateCheck = this.sateRadius <= 0;
      let radiusCheck = this.radius <= 0;

      if (sateCheck) this.sateRadius = 0;
      if (radiusCheck) this.radius = 0;
      if (sateCheck && radiusCheck) {
        this.setStatus(NAV_STATUS.FOLDED);
        this.setPage(this.selected);
      }
    } else if (this.status === NAV_STATUS.EXPAND) {
      this.radius += this.radiusShrinkSpeed;
      this.sateRadius += this.sateRadiusShrinkSpeed;
      this.angle -= this.angleStep * 20;
      this.angle = this.angle % (Math.PI * 2);

      let sateCheck = this.sateRadius >= this.setting.sateRadiusLimit;
      let radiusCheck = this.radius >= this.setting.radiusLimit;

      if (sateCheck) this.sateRadius = this.setting.sateRadiusLimit;
      if (radiusCheck) this.radius = this.setting.radiusLimit;
      if (sateCheck && radiusCheck) {
        this.setStatus(NAV_STATUS.UNFOLDED);
      }
    }
  }

  display(ctx, frameCnt, mouseObj) {
    ctx.save();
    let center = this.setting.center;
    let radius = this.radius;
    let sateRadius = this.sateRadius;
    ctx.translate(center.x, center.y);
    ctx.beginPath();
    // ctx.arc(0, 0, 1, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = `rgba(255, 255, 255, 1)`;
    ctx.strokeStyle = `rgba(0, 0, 0, 1)`;

    for (let i = 0; i < this.satesLength; i++) {
      let page = this.sates[i];
      ctx.save();
      ctx.rotate(this.angle + i * this.sateAngleDist);
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
        return "#23d8af";
      case PAGES.MIDAS:
        return "#23395d";
      default:
        return `rgba(255, 255, 255, 1)`;
    }
  }
}
