import Agent from "./Asteroid";

class Setting {
  constructor(props = {}) {
    console.log("Setting", props);
    this.cvsWidth = props.cvsWidth;
    this.cvsHeight = props.cvsHeight;
    this.groupSize = 1;
  }
}

export default class Generation {
  constructor(props) {
    this.setting = new Setting(props);
    this.agents = [];
    for (let i = 0; i < this.setting.groupSize; i++) {
      let agent = new Agent({ setting: this.setting });
      this.agents.push(agent);
    }
  }

  run(ctx, frameCnt, mouseObj) {
    for (let i = 0; i < this.setting.groupSize; i++) {
      let agent = this.agents[i];
      if (mouseObj.isMouseOverCanvas) {
        agent.seekMouse(mouseObj);
      }
      agent.update(ctx);
      agent.display(ctx, mouseObj);
    }
  }
}
