import Agent, { AGENT_TYPE } from "./Asteroid";

class Setting {
  constructor(props = {}) {
    this.agentType = AGENT_TYPE.WANDERER;
    this.groupSize = 10;
    this.updateSize(props);
  }

  updateSize(props) {
    console.log("Generation Setting", props);
    this.gridSize = 100;
    this.cvsWidth = props.cvsWidth;
    this.cvsHeight = props.cvsHeight;
    this.gridRowCnt = Math.ceil(this.cvsHeight / this.gridSize);
    this.gridColCnt = Math.ceil(this.cvsWidth / this.gridSize);
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
    this.makeGrid();
  }

  resize(props) {
    this.setting.updateSize(props);
  }

  makeGrid() {
    let { gridRowCnt, gridColCnt } = this.setting;
    this.grid = [];
    for (let i = 0; i < gridRowCnt; i++) {
      let row = [];
      for (let j = 0; j < gridColCnt; j++) {
        row.push([]);
      }
      this.grid.push(row);
    }
  }

  getGridRowByY(y) {
    let row = Math.floor(y / this.setting.gridSize);
    return Math.max(0, Math.min(row, this.setting.gridRowCnt - 1));
  }

  getGridColByX(x) {
    let col = Math.floor(x / this.setting.gridSize);
    return Math.max(0, Math.min(col, this.setting.gridColCnt - 1));
  }

  run(ctx, frameCnt, mouseObj) {
    this.makeGrid();
    // set grid
    for (let i = 0; i < this.setting.groupSize; i++) {
      let agent = this.agents[i];
      let row = this.getGridRowByY(agent.location.y);
      let col = this.getGridColByX(agent.location.x);
      agent.setGridLocal(row, col);
      this.grid[row][col].push(agent);
    }

    for (let i = 0; i < this.setting.groupSize; i++) {
      let agent = this.agents[i];
      let { row, col } = agent.gridLocal;
      let subAgents = this.grid[row][col];

      agent.flock(subAgents, mouseObj);
      agent.update(ctx);
      agent.display(ctx, mouseObj);
    }
  }
}
