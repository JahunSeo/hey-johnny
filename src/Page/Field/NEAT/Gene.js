import { NODE_TYPE } from "./Genome";

export class Gene {
  // constructor() {}

  getInitValue() {
    // TODO: add option to make value with random gaussian
    return Math.random() * 2 - 1;
  }

  getDeltaValue() {
    // TODO: add option to make value with random gaussian
    return (Math.random() * 2 - 1) / 5;
  }
}

export class NodeGene extends Gene {
  constructor(props = {}) {
    super(props);
    this.nodeNum = props.nodeNum;
    this.type = props.type;
    this.layer = props.layer || 0;

    this.fromHereConns = [];
    this.toHereConns = [];

    if (props.type !== NODE_TYPE.I) {
      this.initBias();
    }
    this.activation = props.activation || "identity";
    this.outValue = 0;
  }

  initBias() {
    this.bias = this.getInitValue();
  }

  mutateBias() {
    if (Math.random() < 0.9) {
      // uniformly perturbed
      this.bias += this.getDeltaValue();
    } else {
      // assigned a new random variable
      this.initBias();
    }
  }

  mutateActivation() {}

  copy() {
    let copied = new NodeGene({
      nodeNum: this.nodeNum,
      type: this.type,
      layer: this.layer,
      activation: this.activation,
    });
    copied.fromHereConns = this.fromHereConns.slice();
    copied.toHereConns = this.toHereConns.slice();
    copied.bias = this.bias;
    // copied.outValue = this.outValue;

    return copied;
  }
}

export class ConnectionGene extends Gene {
  constructor(props = {}) {
    super(props);
    this.invNum = props.invNum;
    this.type = props.type;
    this.from = props.from;
    this.to = props.to;

    this.enabled = true;
    this.initWeight(props.weight);
  }

  initWeight(weight) {
    this.weight = weight || this.getInitValue();
  }

  mutateWeight() {
    if (Math.random() < 0.9) {
      // uniformly perturbed
      this.weight += this.getDeltaValue();
    } else {
      // assigned a new random variable
      this.initWeight();
    }
  }

  disable() {
    this.enabled = false;
  }

  copy() {
    let copied = new ConnectionGene({
      invNum: this.invNum,
      type: this.type,
      from: this.from,
      to: this.to,
    });
    copied.weight = this.weight;
    copied.enabled = this.enabled;

    return copied;
  }
}
