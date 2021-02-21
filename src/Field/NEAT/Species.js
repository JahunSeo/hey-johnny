export default class Species {
  constructor(props) {
    this.setting = props.setting;
    this.speciesNum = props.speciesNum;
    this.initGenNum = props.initGenNum;

    this.representative = props.agent;
    this.agents = [];
    this.nextAgents = [];
    this.isSorted = false;

    this.avgFitness = 0.01; // TODO: initial avgFitness
    this.isExtinct = false;

    this.ancestors = [];
  }

  adjustFitness() {
    let size = this.agents.length;
    let average = 0;
    for (let i = 0; i < this.agents.length; i++) {
      let agent = this.agents[i];
      agent.adjustedScore = agent.score / size;
      average += agent.adjustedScore;
    }
    average = Math.max(average, 0.01); // temp
    this.avgFitness = average;
    return average;
  }

  sortByFitness() {
    this.agents.sort((a, b) => {
      return b.score - a.score;
    });
    this.isSorted = true;
  }

  eliminateLowest() {
    this.sortByFitness();
    let survivalRate = 1 - this.setting.eliminationRate;
    let limit = Math.floor(this.agents.length * survivalRate);
    limit = Math.max(limit, 2);
    this.agents = this.agents.slice(0, limit);
  }

  getHighest() {
    if (this.isExtinct) {
      return undefined;
    }
    if (!this.isSorted) {
      this.sortByFitness();
    }
    return this.agents[0];
  }

  getSpeciesSize() {
    return this.agents.length;
  }

  setExtinction() {
    this.isExtinct = true;
    this.avgFitness = 0;
  }

  setAvgFitness(fitness) {
    this.avgFitness = fitness;
  }

  getRepresentative() {
    return this.representative;
  }

  setRepresentative(criteria) {
    // todo: set representative by fitness
    let index = Math.floor(Math.random() * this.agents.length);
    this.representative = this.agents[index];
    return this.representative;
  }

  getSingleParent() {
    let index = Math.floor(Math.random() * this.agents.length);
    return this.agents[index];
  }

  keepNextAgent(agent) {
    // console.log(
    //   "Species: keepNextAgent,",
    //   "species",
    //   this.speciesNum,
    //   "agentId",
    //   agentId
    // );
    this.nextAgents.push(agent);
  }

  update() {
    // if (this.initGenNum <= this.setting.getGenerationNum()) {
    //   let curr = {
    //     generationNum: this.setting.getGenerationNum(),
    //     representative: this.representative,
    //     agents: this.agents.slice(),
    //     avgFitness: this.avgFitness,
    //   };
    //   this.ancestors.push(curr);
    // }

    this.representative = undefined;
    this.agents = this.nextAgents;
    this.isSorted = false;
    this.nextAgents = [];
  }
}
