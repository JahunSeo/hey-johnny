import Agent, { AGENT_TYPE } from "./Asteroid";
import Vector2D from "../Tool/Vector2D";

import { getScreenRect } from "../Constant";

class Setting {
  constructor(props = {}) {
    this.agentType = AGENT_TYPE.SCREEN;
    this.arrivedLimit = 0.01;
    this.updateSize(props);
  }

  updateSize(props) {
    // console.log("Screen Group Setting", props);
    this.cvsWidth = props.cvsWidth;
    this.cvsHeight = props.cvsHeight;
    this.currentPage = props.currentPage;

    let rect = getScreenRect(this.cvsWidth, this.cvsHeight, this.currentPage);
    this.scrW = rect.width;
    this.scrH = rect.height;
    this.scrL = rect.left;
    this.scrT = rect.top;

    this.onLocal = {
      TL: new Vector2D(this.scrL, this.scrT),
      TR: new Vector2D(this.scrL, this.scrT + this.scrH),
      BL: new Vector2D(this.scrL + this.scrW, this.scrT),
      BR: new Vector2D(this.scrL + this.scrW, this.scrT + this.scrH),
    };
    this.offLocal = {
      TL: new Vector2D(this.cvsWidth / 2, this.cvsHeight / 2),
      TR: new Vector2D(this.cvsWidth / 2, this.cvsHeight / 2),
      BL: new Vector2D(this.cvsWidth / 2, this.cvsHeight / 2),
      BR: new Vector2D(this.cvsWidth / 2, this.cvsHeight / 2),
    };
  }
}

export default class ScreenGroup {
  constructor(props) {
    this.setting = new Setting(props);
    this.createAgents();
    this.isSpread = false;
    this.isMoving = false;
  }

  resize(props) {
    this.setting.updateSize(props);
  }

  createAgents() {
    this.agentMap = {};
    this.agentMap["TL"] = new Agent({ setting: this.setting });
    this.agentMap["TR"] = new Agent({ setting: this.setting });
    this.agentMap["BL"] = new Agent({ setting: this.setting });
    this.agentMap["BR"] = new Agent({ setting: this.setting });
  }

  getTargetByLocal(local) {
    if (this.isSpread) {
      return this.setting.onLocal[local];
    } else {
      return this.setting.offLocal[local];
    }
  }

  spread() {
    this.isSpread = true;
    this.isMoving = true;
  }

  fold() {
    this.isSpread = false;
    this.isMoving = true;
  }

  run(ctx, frameCnt, mouseObj) {
    ctx.save();
    // check for isMoving
    if (this.isSpread) {
      let agentTL = this.agentMap["TL"];
      let agentTR = this.agentMap["TR"];
      let agentBL = this.agentMap["BL"];
      let agentBR = this.agentMap["BR"];
      ctx.fillStyle = `rgba(255, 255, 255, 1)`;
      ctx.strokeStyle = `rgba(0, 0, 0, 1)`;
      ctx.beginPath();
      ctx.moveTo(agentTL.location.x, agentTL.location.y);
      ctx.lineTo(agentTR.location.x, agentTR.location.y);
      ctx.lineTo(agentBR.location.x, agentBR.location.y);
      ctx.lineTo(agentBL.location.x, agentBL.location.y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();

    ctx.save();
    let isMoving = false;
    for (let local in this.agentMap) {
      let agent = this.agentMap[local];
      let target = this.getTargetByLocal(local);
      let distSq = Vector2D.sub(agent.location, target).getMagSq();
      if (distSq > this.setting.arrivedLimit) {
        // console.log("Screen is moving..");
        isMoving = true;
      }
      let force = agent.seek(target);
      agent.applyForce(force);
      agent.update(ctx);
      agent.display(ctx, mouseObj);
    }
    this.isMoving = isMoving;
    ctx.restore();
  }
}
