const Activation = {
  identity: (x) => x,
  sigmoid: (x) => 1 / (1 + Math.pow(Math.E, -1 * x)),
  modifiedSigmoid: (x) => 1 / (1 + Math.pow(Math.E, -4.9 * x)),
  step: (x) => (x > 0 ? 1 : 0),
};

export default Activation;
