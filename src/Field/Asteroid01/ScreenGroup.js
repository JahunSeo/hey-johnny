import Agent, { AGENT_TYPE } from "./Asteroid";

class Setting {
  constructor(props = {}) {
    this.agentType = AGENT_TYPE.SCREEN;
    this.groupSize = 4;
    this.updateSize(props);
  }

  updateSize(props) {
    console.log("Screen Group Setting", props);
    this.cvsWidth = props.cvsWidth;
    this.cvsHeight = props.cvsHeight;
  }
}

export default class ScreenGroup {
  constructor(props) {
    this.setting = new Setting(props);
    this.agents = [];
    for (let i = 0; i < this.setting.groupSize; i++) {
      let agent = new Agent({ setting: this.setting });
      this.agents.push(agent);
    }
    this.isSpread = false;
  }

  resize(props) {
    this.setting.updateSize(props);
  }

  spread() {}

  fold() {}

  run(ctx, frameCnt, mouseObj) {
    for (let i = 0; i < this.setting.groupSize; i++) {
      let agent = this.agents[i];
      agent.update(ctx);
      agent.display(ctx, mouseObj);
    }
  }
}
