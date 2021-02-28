import { NodeGene, ConnectionGene } from "./Gene";
import Activation from "./Activation";

export const NODE_TYPE = {
  I: "NODE_INPUT",
  H: "NODE_HIDDEN",
  O: "NODE_OUTPUT",
};

export const CONN_TYPE = {
  F: "CONN_FORWARD",
  R: "CONN_RECURRENT",
};

export default class Genome {
  constructor(props) {
    this.setting = props.setting;
    this.inputSize = this.setting.inputSize;
    this.outputSize = this.setting.outputSize;

    // nodes is orders of calculation
    this.nodes = [];
    this.nodeMap = {};
    this.connMap = {};

    if (props.isPrimal) {
      this.createPrimal();
    }
  }

  initNode(props) {
    let { nodeNum, order } = props;
    let node = new NodeGene(props);
    if (order === undefined) {
      order = this.nodes.length;
    }
    this.nodes.splice(order, 0, nodeNum);
    this.nodeMap[nodeNum] = node;

    return node;
  }

  initConn(props) {
    let { invNum, from, to } = props;
    let conn = new ConnectionGene(props);
    this.connMap[invNum] = conn;

    this.nodeMap[from].fromHereConns.push(invNum);
    this.nodeMap[to].toHereConns.push(invNum);

    return conn;
  }

  createPrimal() {
    for (let i = 0; i < this.inputSize; i++) {
      let nodeNum = this.setting.addLastNodeNum();
      this.initNode({
        nodeNum,
        type: NODE_TYPE.I,
        layer: 0,
      });
    }
    for (let i = 0; i < this.outputSize; i++) {
      let nodeNum = this.setting.addLastNodeNum();
      this.initNode({
        nodeNum,
        type: NODE_TYPE.O,
        layer: 1,
        activation: "modifiedSigmoid",
      });
    }

    for (let i = 0; i < this.inputSize; i++) {
      for (let j = this.inputSize; j < this.inputSize + this.outputSize; j++) {
        let invNum = this.setting.addLastInvNum();
        this.initConn({ invNum, type: CONN_TYPE.F, from: i, to: j });
      }
    }
  }

  predict(input) {
    let output = [];

    // make outValue of each node
    for (let i = 0; i < this.nodes.length; i++) {
      let nodeNum = this.nodes[i];
      let node = this.nodeMap[nodeNum];

      if (node.type === NODE_TYPE.I) {
        node.outValue = input[i];
        continue;
      }

      let weightedSum = 0;
      for (let k = 0; k < node.toHereConns.length; k++) {
        let invNum = node.toHereConns[k];
        let conn = this.connMap[invNum];
        if (conn.enabled) {
          weightedSum += this.nodeMap[conn.from].outValue * conn.weight;
        }
      }
      let func = Activation[node.activation];
      node.outValue = func(weightedSum + node.bias);
      if (node.type === NODE_TYPE.O) {
        output.push(node.outValue);
      }
    }

    return output;
  }

  copy() {
    let copied = new Genome({ setting: this.setting });
    copied.nodes = this.nodes.slice();

    for (let nodeNum in this.nodeMap) {
      copied.nodeMap[nodeNum] = this.nodeMap[nodeNum].copy();
    }

    for (let invNum in this.connMap) {
      copied.connMap[invNum] = this.connMap[invNum].copy();
    }

    return copied;
  }

  calculateFitness() {}

  crossover(partner) {
    // compare the fitness score of this and partner,
    // and set to parent1 and parent2, where parent1 is more fit one.
    let parent1, parent2;
    // console.log("crossover:", this.fitness > partner.fitness);
    if (this.fitness > partner.fitness) {
      parent1 = this;
      parent2 = partner;
    } else {
      parent1 = partner;
      parent2 = this;
    }

    let child = new Genome({ setting: this.setting });
    child.nodes = parent1.nodes.slice();
    // set nodes
    // just copy from more fit parent
    // 이 때 layer 복사를 랜덤으로 하면 topology가 꼬인다
    for (let nodeNum in parent1.nodeMap) {
      child.nodeMap[nodeNum] = parent1.nodeMap[nodeNum].copy();
      if (nodeNum in parent2.nodeMap) {
        if (Math.random() > 0.5) {
          child.nodeMap[nodeNum].bias = parent2.nodeMap[nodeNum].bias;
        }
      }
    }
    // set conns
    for (let invNum in parent1.connMap) {
      child.connMap[invNum] = parent1.connMap[invNum].copy();
      if (invNum in parent2.connMap) {
        if (Math.random() > 0.5) {
          //   child.connMap[invNum].weight = parent2.connMap[invNum].weight;
          //   child.connMap[invNum].enabled = parent2.connMap[invNum].enabled;
          child.connMap[invNum] = parent2.connMap[invNum].copy();
        }
      }
    }

    return child;
  }

  mutate(keepStructure = false) {
    for (let invNum in this.connMap) {
      let conn = this.connMap[invNum];
      if (Math.random() < 0.8) conn.mutateWeight();
    }
    for (let nodeNum in this.nodeMap) {
      let node = this.nodeMap[nodeNum];
      if (Math.random() < 0.8) node.mutateBias();
      //   if (Math.random() < 0.01) node.mutateActivation();
    }

    if (keepStructure) return;
    if (Math.random() < 0.03) this.addNode();
    if (Math.random() < 0.05) this.addConn();

    // // // DEBUG CODE
    // if (Math.random() < 0.5) this.addNode();
    // else {
    //   this.addNode();
    //   this.addConn();
    // }
  }

  getNodeFromNodeIndex(idx) {
    return this.nodeMap[this.nodes[idx]];
  }

  selectEnabledConn() {
    let candidates = [];
    for (let invNum in this.connMap) {
      let conn = this.connMap[invNum];
      if (conn.enabled) candidates.push(invNum);
    }
    if (candidates.length <= 0) {
      return undefined;
    }
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  selectNewConn(blockRecurrent = false) {
    // the layers of fromNode and toNode should be different.
    // and toNode should not be input layer.
    // check to block recurrent or not
    let candidates = [];
    for (let to in this.nodeMap) {
      to = parseInt(to);
      let toNode = this.nodeMap[to];
      if (toNode.layer === 0) continue;
      let used = toNode.toHereConns.map((invNum) => {
        return this.connMap[invNum].from;
      });
      for (let from in this.nodeMap) {
        from = parseInt(from);
        let fromNode = this.nodeMap[from];
        if (fromNode.layer === toNode.layer) continue;
        if (used.indexOf(from) === -1) {
          let type;
          if (toNode.layer > fromNode.layer) {
            type = CONN_TYPE.F;
          } else {
            if (blockRecurrent) continue;
            type = CONN_TYPE.R;
          }
          candidates.push({ from, to, type });
        }
      }
    }
    if (candidates.length <= 0) {
      return undefined;
    }
    return candidates[Math.floor(Math.random() * candidates.length)];
  }

  addNode() {
    // should report the structural innovation to setting
    // to check whether the same structural innovation
    // in the current generation occurs.

    // select an existing conn which is not disabled
    let oldInvNum = this.selectEnabledConn();
    if (oldInvNum === undefined) return false;
    let oldConn = this.connMap[oldInvNum];

    // check the conn is already innovated in current generation
    let invResult = this.setting.addInvResult({
      toSplit: oldConn.invNum,
      from: oldConn.from,
      to: oldConn.to,
    });
    // console.log("addNode: invResult", invResult);

    // // innovate structure
    // select layer
    let fromNode = this.nodeMap[oldConn.from];
    let toNode = this.nodeMap[oldConn.to];

    let lowLayer, highLayer;
    if (toNode.layer > fromNode.layer) {
      // oldConn.type === CONN_TYPE.F
      lowLayer = fromNode.layer;
      highLayer = toNode.layer;
    } else {
      // oldConn.type === CONN_TYPE.R
      lowLayer = toNode.layer;
      highLayer = fromNode.layer;
    }
    let layerDist = highLayer - lowLayer;
    let layer = lowLayer + 1; // if this line is changed, many things should be changed.

    // console.log("addNode: layerDist", oldConn.type, layerDist);
    // console.log("addNode: newNodeLayer", layer);

    // update other nodes' layer
    let spliceIndex;
    for (let i = 0; i < this.nodes.length; i++) {
      let node = this.getNodeFromNodeIndex(i);
      if (node.layer >= layer) {
        spliceIndex = i;
        break;
      }
    }
    // console.log("addNode: spliceIndex", spliceIndex);
    if (layerDist <= 1) {
      for (let i = spliceIndex; i < this.nodes.length; i++) {
        let node = this.getNodeFromNodeIndex(i);
        node.layer++;
      }
    }

    // make Node
    let { nodeNum, invNum1, invNum2 } = invResult;
    this.initNode({
      nodeNum,
      type: NODE_TYPE.H,
      layer,
      order: spliceIndex,
      activation: "modifiedSigmoid",
    });

    // make Conns
    this.initConn({
      invNum: invNum1,
      type: oldConn.type,
      from: oldConn.from,
      to: nodeNum,
      weight: 1,
    });
    this.initConn({
      invNum: invNum2,
      type: oldConn.type,
      from: nodeNum,
      to: oldConn.to,
      weight: oldConn.weight,
    });
    // disable oldConn
    oldConn.disable();
  }

  addConn() {
    // select new conn
    let newConn = this.selectNewConn(this.setting.blockRecurrent);
    // if there is no more room for new conn, return false
    if (newConn === undefined) return false;
    let { from, to, type } = newConn;
    // console.log("addConn:", from, to, type);

    // check the conn is already innovated in current generation
    let invResult = this.setting.addInvResult({ from, to });
    // console.log("addConn: invResult", invResult);
    // innovate structure
    let { invNum } = invResult;
    this.initConn({
      invNum,
      type,
      from,
      to,
    });
  }

  measureDist(other) {
    if (!(other instanceof Genome)) {
      throw new Error(
        "To measure distance, other should be instance of Genome."
      );
    }

    let matching = [];
    let myLeft = [];
    let otherLeft = [];
    for (let invNum in this.connMap) {
      invNum = parseInt(invNum);
      if (invNum in other.connMap) {
        matching.push(invNum);
      } else {
        myLeft.push(invNum);
      }
    }
    for (let invNum in other.connMap) {
      invNum = parseInt(invNum);
      if (!(invNum in this.connMap)) {
        otherLeft.push(invNum);
      }
    }
    let N = matching.length + Math.max(myLeft.length, otherLeft.length);
    let matchingMax = Math.max(...matching);

    let disjointCnt = 0;
    let excessCnt = 0;
    for (let i = 0; i < myLeft.length; i++) {
      let invNum = myLeft[i];
      if (invNum < matchingMax) disjointCnt++;
      else excessCnt++;
    }
    for (let i = 0; i < otherLeft.length; i++) {
      let invNum = otherLeft[i];
      if (invNum < matchingMax) disjointCnt++;
      else excessCnt++;
    }

    let weightDiff = 0;
    for (let i = 0; i < matching.length; i++) {
      let invNum = matching[i];
      let myWeight = this.connMap[invNum].weight;
      let otherWeight = other.connMap[invNum].weight;
      weightDiff += Math.abs(myWeight - otherWeight);
    }

    // console.log(Object.keys(this.connMap), Object.keys(other.connMap));
    // console.log("arrays", matching, myLeft, otherLeft);
    // console.log("matching", N, matchingMax, disjointCnt, excessCnt, weightDiff);

    let { distC1, distC2, distC3 } = this.setting;
    let result = (distC1 * excessCnt) / N;
    result += (distC2 * disjointCnt) / N;
    if (matching.length > 0) result += (distC3 * weightDiff) / matching.length;
    // console.log("result", result);
    return result;
  }
}
