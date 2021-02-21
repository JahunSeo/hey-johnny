import Genome, { CONN_TYPE } from "./Genome";

export default class Agent {
  constructor(props) {
    let { setting, isPrimal = false } = props;
    this.setting = setting;
    this.agentId = undefined;
    this.speciesNum = undefined;

    this.xor = [];
    this.score = 0;
    this.adjustedScore = undefined;
    if (isPrimal) {
      this.isPrimal = isPrimal;
      this.genome = new Genome({ setting, isPrimal });
      console.log("primal genome", this.genome);
    }
  }

  setId(id) {
    this.agentId = id;
  }
  getId() {
    return this.agentId;
  }
  setSpecies(speciesNum) {
    this.speciesNum = speciesNum;
  }
  getSpecies() {
    return this.speciesNum;
  }

  asexual(keepStructure = false) {
    // asexual reproduction
    // console.log("Agent: reproduce asexually");
    let child = new Agent({ setting: this.setting });
    child.genome = this.genome.copy();
    child.genome.mutate(keepStructure);
    return child;
  }

  sexual(partner) {
    if (!(partner instanceof Agent)) {
      throw new Error("sexual reproduction needs partner");
    }
    // console.log("Agent: reproduce with partner");
    let child = new Agent({ setting: this.setting });
    child.genome = this.genome.crossover(partner.genome);
    return child;
  }

  geneticDist(other) {
    return this.genome.measureDist(other.genome);
  }

  think(ctx, frameCnt) {
    // just in case, reset values
    this.xor.splice(0, this.xor.length);
    this.score = 0;

    let xs = [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ];
    let ys = [0, 1, 1, 0];

    for (let i = 0; i < xs.length; i++) {
      let x = xs[i];
      let y = ys[i];
      let output = this.genome.predict(x)[0];
      this.xor.push(output);
      this.score += 1 - (y - output) * (y - output);
    }

    // console.log(`Agent ${this.agentId}:`, this.score, this.xor);
  }

  run(ctx, local) {
    if (typeof this.agentId !== "number") {
      return; // TODO
    }

    ctx.save();
    let boardWidth = this.setting.boardWidth;
    let areaWidth = this.setting.areaWidth;
    let areaHeight = this.setting.areaHeight;

    let colCnt = Math.floor(boardWidth / areaWidth);

    let agentX = (local % colCnt) * areaWidth;
    let agentY = Math.floor(local / colCnt) * areaHeight;

    ctx.translate(agentX, agentY);

    // draw nodes by layer
    let nodeMap = this.genome.nodeMap;
    let connMap = this.genome.connMap;
    let layers = {};
    for (let nodeNum in nodeMap) {
      let node = nodeMap[nodeNum];
      let layer = node.layer;
      if (!(layer in layers)) {
        layers[layer] = [];
      }
      layers[layer].push(node);
    }
    let layersLength = Object.keys(layers).length;

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "8px";
    ctx.globalCompositeOperation = "destination-over";

    ctx.strokeStyle = `rgba(0, 0, 0, 0.2)`;
    ctx.strokeRect(0, 0, areaWidth, areaHeight);

    let nodeLocal = {};
    for (let layer in layers) {
      let layerNodes = layers[layer];
      for (let i = 0; i < layerNodes.length; i++) {
        let node = layerNodes[i];
        let nodeX = ((parseInt(layer) + 1) * areaWidth) / (layersLength + 1);
        let nodeY = ((i + 1) * areaHeight) / (layerNodes.length + 1);
        if (layer % 2 === 1) nodeY -= areaHeight / (layerNodes.length + 1) / 2;
        nodeLocal[node.nodeNum] = [nodeX, nodeY];
        ctx.save();
        ctx.translate(nodeX, nodeY);

        ctx.fillText(`${node.nodeNum}`, 0, 0);

        ctx.strokeStyle = `rgba(0, 0, 0, 1)`;
        ctx.fillStyle = `rgba(255, 255, 255, 1)`;
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fill();

        ctx.restore();
      }
    }

    // connect them
    for (let invNum in connMap) {
      let conn = connMap[invNum];
      if (!conn.enabled) continue;
      let fromNode = nodeLocal[conn.from];
      let toNode = nodeLocal[conn.to];
      if (conn.type === CONN_TYPE.R) {
        ctx.save();
        ctx.strokeStyle = this.connStyle(conn.weight);
        ctx.beginPath();
        ctx.moveTo(fromNode[0], fromNode[1]);
        ctx.setLineDash([3, 2]);
        ctx.quadraticCurveTo(
          (fromNode[0] + toNode[0]) / 2,
          toNode[1],
          toNode[0],
          toNode[1]
        );
        ctx.stroke();
        ctx.restore();
      } else {
        ctx.save();
        ctx.strokeStyle = this.connStyle(conn.weight);
        ctx.beginPath();
        ctx.moveTo(fromNode[0], fromNode[1]);
        ctx.lineTo(toNode[0], toNode[1]);
        ctx.stroke();
        ctx.restore();
      }
    }

    // console.log("Agent run: genome", this.genome);
    ctx.textAlign = "left";
    ctx.fillText(`S${this.speciesNum}`, 5, 10);
    let scoreText = Math.round(this.score * 100) / 100;
    ctx.fillText(`${scoreText}`, 5, 20);

    ctx.fillStyle = `rgba(0,0,0,${0.1 * this.speciesNum - 0.1})`;
    ctx.fillRect(0, 0, areaWidth, areaHeight);

    ctx.restore();
  }

  connStyle(weight) {
    let alpha = Math.min(Math.abs(weight), 1);
    if (weight > 0) {
      return `rgba(235, 0, 74, ${alpha})`;
    } else {
      return `rgba(0, 140, 252, ${alpha})`;
    }
  }

  update(ctx) {}

  display(ctx) {}
}
