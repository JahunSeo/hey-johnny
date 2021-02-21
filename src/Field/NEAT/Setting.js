export default class GenerationSetting {
  constructor() {
    this.groupSize = 4;
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

    // reset every generation
    this.invResults = [];
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
