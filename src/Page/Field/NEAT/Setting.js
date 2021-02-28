export default class GenerationSetting {
  constructor(props = {}) {
    this.groupSize = 36;
    this.generationNum = 0;
    this.lastSpeciesNum = 0;
    this.lastAgentId = 0;

    this.inputSize = 2;
    this.outputSize = 1;
    this.lastNodeNum = -1;
    this.lastInvNum = -1;

    this.blockRecurrent = false;

    this.distC1 = 1.0;
    this.distC2 = 1.0;
    this.distC3 = 0.4;
    this.compatibilityThreshold = 3.0;
    this.eliminationRate = 0.5;

    this.areaWidth = 120;
    this.areaHeight = 80;

    this.generationLimit = 2000;

    // reset every generation
    this.invResults = [];
    this.updateSize(props);
  }

  updateSize(props) {
    // console.log("BirdGroup Setting", props);
    this.cvsWidth = props.cvsWidth;
    this.cvsHeight = props.cvsHeight;

    this.boardWidth = this.cvsWidth - (this.cvsWidth % this.areaWidth);
    this.boardWidth = Math.min(this.boardWidth, this.areaWidth * 6);
    let colCnt = Math.floor(this.boardWidth / this.areaWidth);
    this.boardHeight = this.cvsHeight - (this.cvsHeight % this.areaHeight);
    let rowCnt = Math.floor(this.groupSize / colCnt);
    this.boardHeight = Math.min(this.boardHeight, this.areaHeight * rowCnt);

    // warning! originX and Y is just for displaying!
    this.originX = (this.cvsWidth - this.boardWidth) / 2;
    this.originY = (this.cvsHeight - this.boardHeight) / 2;
  }

  getGenerationNum() {
    return this.generationNum;
  }
  addGenerationNum() {
    this.generationNum++;
    return this.generationNum;
  }

  getLastSpeciesNum() {
    return this.lastSpeciesNum;
  }
  addLastSpeciesNum(size = 1) {
    this.lastSpeciesNum += size;
    return this.lastSpeciesNum;
  }

  getLastAgentId() {
    return this.lastAgentId;
  }
  addLastAgentId() {
    this.lastAgentId++;
    return this.lastAgentId;
  }

  getLastNodeNum() {
    return this.lastNodeNum;
  }
  addLastNodeNum(size = 1) {
    this.lastNodeNum += size;
    return this.lastNodeNum;
  }

  getLastInvNum() {
    return this.lastInvNum;
  }
  addLastInvNum(size = 1) {
    this.lastInvNum += size;
    return this.lastInvNum;
  }

  addInvResult(curr) {
    // check the same location is already innovated.
    for (let i = 0; i < this.invResults.length; i++) {
      let prev = this.invResults[i];
      // if so, return the prev innovation result.
      if (prev.from === curr.from && prev.to === curr.to) {
        if (prev.toSplit === curr.toSplit) {
          // console.log("addInvResult, return prev");
          return prev;
        }
      }
    }
    // if not, make and return result with new invNum
    if (curr.toSplit !== undefined) {
      // addNode
      curr.nodeNum = this.addLastNodeNum();
      curr.invNum1 = this.addLastInvNum();
      curr.invNum2 = this.addLastInvNum();
      this.invResults.push(curr);
    } else {
      // addConn
      curr.invNum = this.addLastInvNum();
      this.invResults.push(curr);
    }

    return curr;
  }
}
