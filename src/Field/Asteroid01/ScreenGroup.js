import Agent, { AGENT_TYPE } from "./Asteroid";
import Vector2D from "../../Tool/Vector2D";

class Setting {
  constructor(props = {}) {
    this.agentType = AGENT_TYPE.SCREEN;
    this.updateSize(props);
  }

  updateSize(props) {
    console.log("Screen Group Setting", props);
    this.cvsWidth = props.cvsWidth;
    this.cvsHeight = props.cvsHeight;
    // todo: set 4 points
    this.scrTop = this.cvsHeight * 0.2;
    this.scrLeft = this.cvsWidth * 0.1;
    this.scrWidth = this.cvsWidth * 0.8;
    this.scrHeight = this.cvsHeight * 0.6;

    this.onLocal = {
      TL: new Vector2D(this.scrLeft, this.scrTop),
      TR: new Vector2D(this.scrLeft, this.scrTop + this.scrHeight),
      BL: new Vector2D(this.scrLeft + this.scrWidth, this.scrTop),
      BR: new Vector2D(
        this.scrLeft + this.scrWidth,
        this.scrTop + this.scrHeight
      ),
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
      let agentBR = this.agentMap["BR"];
      ctx.fillStyle = `rgba(255, 255, 255, 1)`;
      ctx.strokeStyle = `rgba(0, 0, 0, 1)`;
      ctx.fillRect(
        agentTL.location.x,
        agentTL.location.y,
        agentBR.location.x - agentTL.location.x,
        agentBR.location.y - agentTL.location.y
      );
      ctx.strokeRect(
        agentTL.location.x,
        agentTL.location.y,
        agentBR.location.x - agentTL.location.x,
        agentBR.location.y - agentTL.location.y
      );
    }
    ctx.restore();

    ctx.save();
    let isMoving = false;
    for (let local in this.agentMap) {
      let agent = this.agentMap[local];
      let target = this.getTargetByLocal(local);
      let distSq = Vector2D.sub(agent.location, target).getMagSq();
      if (distSq > 0.05) {
        console.log("Screen is moving..");
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
