import Agent from "./Agent";
import Species from "./Species";
import Setting from "./Setting";

export default class Generation {
  constructor() {
    this.setting = new Setting();
    this.ancestors = [];
    this.agentMap = {};
    this.speciesMap = {};

    this.initGeneration();
  }

  initSpecies(props) {
    let { speciesNum } = props;
    let species = new Species(props);
    if (speciesNum in this.speciesMap) {
      console.error(
        `Generation initSpecies: speciesNum ${speciesNum} is already taken.`
      );
      return this.speciesMap[speciesNum];
    }
    this.speciesMap[speciesNum] = species;

    return species;
  }

  initGeneration() {
    let primal = new Agent({ setting: this.setting, isPrimal: true });
    let agentId = this.setting.addLastAgentId();
    primal.setId(agentId);
    let speciesNum = this.setting.addLastSpeciesNum();
    let species = this.initSpecies({
      setting: this.setting,
      initGenNum: this.setting.getGenerationNum() + 1,
      speciesNum,
      agent: primal,
    });
    primal.setSpecies(speciesNum);

    for (let i = 0; i < this.setting.groupSize; i++) {
      let child = primal.asexual(true); // keepStructure true
      let agentId = this.setting.addLastAgentId();
      child.setId(agentId);
      child.setSpecies(speciesNum);
      species.agents.push(child);
      this.agentMap[agentId] = child;
    }

    this.speciesMap[speciesNum] = species;
    this.setting.addGenerationNum();

    console.log(`GENERATION ${this.setting.getGenerationNum()}: reproduced`);
    console.log(this.speciesMap);
  }

  nextGeneration() {
    // 각 species의 avgFitness 구하기
    // 이와 더불어 각 species에서 낮은 점수의 agent 탈락
    let avgFitnessTotal = 0;
    let representativeMap = {};
    for (let speciesNum in this.speciesMap) {
      let species = this.speciesMap[speciesNum];
      if (species.isExtinct) continue;

      let avgFitness = species.adjustFitness();
      avgFitnessTotal += avgFitness;
      species.eliminateLowest();

      // species의 대표 agent를 representativeMap에 저장
      let representative = species.setRepresentative();
      representativeMap[speciesNum] = representative;
    }
    // console.log("nextGeneration: avgFitnessTotal", avgFitnessTotal);
    // console.log(representativeMap);

    for (let speciesNum in representativeMap) {
      let species = this.speciesMap[speciesNum];
      let highest = species.getHighest();
      console.log(
        `GENERATION ${this.setting.getGenerationNum()}: `,
        speciesNum,
        highest.score
      );
      // if (highest.score >= 3.9) {
      //   console.log("HIT!", highest);
      // }
    }

    // 각 species의 할당량을 구해 allotment 생성
    let allotment = [];
    for (let speciesNum in representativeMap) {
      speciesNum = parseInt(speciesNum);
      let species = this.speciesMap[speciesNum];
      let proportion = species.avgFitness / avgFitnessTotal;
      let size = Math.ceil(proportion * this.setting.groupSize);
      // allotment에 할당된 수만큼 speciesNum 추가
      for (let i = 0; i < size; i++) {
        allotment.push(speciesNum);
      }
    }
    // allotment의 길이가 groupSize에 미치지 못하거나 초과할 시 조정
    if (allotment.length < this.setting.groupSize) {
      let diff = this.setting.groupSize - allotment.length;
      for (let i = 0; i < diff; i++) {
        let index = Math.floor(Math.random() * allotment.length);
        let speciesNum = allotment[index];
        allotment.push(speciesNum);
      }
    } else {
      allotment = allotment.slice(0, this.setting.groupSize);
    }
    // console.log("nextGeneration: allotment", allotment);

    // allotment에 맞게 새로운 agent 생성하고, species를 배정
    let newAgentMap = {};
    let speciesReproduced = {};
    for (let i = 0; i < allotment.length; i++) {
      // speciesNum를 기준으로 child 생성
      let speciesNum = allotment[i];
      let species = this.speciesMap[speciesNum];
      let parent1 = species.getSingleParent();
      let parent2 = species.getSingleParent();
      let child;
      if (parent1 === parent2 || Math.random() < 0.25) {
        child = parent1.asexual(false);
      } else {
        child = parent1.sexual(parent2);
      }
      // child에 AgentId 배정
      let agentId = this.setting.addLastAgentId();
      child.setId(agentId);
      // child가 기존 종들 중 어디에 속하는지 결정
      for (let speciesNum in representativeMap) {
        speciesNum = parseInt(speciesNum);
        let species = this.speciesMap[speciesNum];
        let representative = representativeMap[speciesNum];
        let dist = child.geneticDist(representative);
        // console.log("DIST", speciesNum, child.agentId, dist);
        if (dist < this.setting.compatibilityThreshold) {
          child.setSpecies(speciesNum);
          species.keepNextAgent(child);
          speciesReproduced[speciesNum] = true;
          break;
        }
      }
      // 배정된 종이 없을 경우, 새로운 종을 생성
      if (child.getSpecies() === undefined) {
        let speciesNum = this.setting.addLastSpeciesNum();
        let species = this.initSpecies({
          setting: this.setting,
          initGenNum: this.setting.getGenerationNum() + 1,
          speciesNum,
          agent: child,
        });
        child.setSpecies(speciesNum);
        species.keepNextAgent(child);
        speciesReproduced[speciesNum] = true;
        representativeMap[speciesNum] = child;
        this.speciesMap[speciesNum] = species;
      }

      newAgentMap[agentId] = child;
    }
    // 개체를 배정받지 못한 종은 멸종 처리
    for (let speciesNum in representativeMap) {
      if (!speciesReproduced[speciesNum]) {
        this.speciesMap[speciesNum].setExtinction();
      }
    }

    // 현재 세대를 ancestor로 넘김
    let ancestor = {
      generationNum: this.setting.getGenerationNum(),
      agentMap: this.agentMap,
    };
    this.ancestors.push(ancestor);
    // species 업데이트
    for (let speciesNum in representativeMap) {
      let species = this.speciesMap[speciesNum];
      species.update();
    }
    // generationNum 업데이트
    this.setting.addGenerationNum();
    // 새로운 agentMap으로 변경
    this.agentMap = newAgentMap;
    console.log(`GENERATION ${this.setting.getGenerationNum()}: reproduced`);
    // console.log(this.speciesMap);
  }

  run(ctx, frameCnt) {
    let local = 0;
    for (let agentId in this.agentMap) {
      let agent = this.agentMap[agentId];
      agent.think(ctx, frameCnt);
      agent.run(ctx, local);
      local++;
    }
  }
}
