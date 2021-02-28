import * as tf from "@tensorflow/tfjs";
// import * as tfvis from "@tensorflow/tfjs-vis";

export default class Brain {
  constructor(model) {
    if (model instanceof tf.Sequential) {
      this.model = model;
    } else {
      this.model = this.createModel();
    }
  }

  createModel() {
    // Create a sequential model
    const model = tf.sequential();

    // Add a single input layer
    model.add(
      tf.layers.dense({ inputShape: [6], units: 8, activation: "sigmoid" })
    );

    // Add an output layer
    model.add(tf.layers.dense({ units: 2, activation: "softmax" }));

    // tfvis.show.modelSummary({ name: "Model Summary" }, model);

    return model;
  }

  predict(input) {
    return tf.tidy(() => {
      let xs = tf.tensor2d([input]);
      let ys = this.model.predict(xs);
      let outputs = ys.dataSync();
      return outputs;
    });
  }

  copy() {
    return tf.tidy(() => {
      let weights = this.model.getWeights();
      let copied = [];
      weights.forEach((w) => copied.push(w.clone()));

      let newBrain = new Brain();
      newBrain.model.setWeights(copied);
      return newBrain;
    });
  }

  mutate(rate = 0.1) {
    tf.tidy(() => {
      let weights = this.model.getWeights();
      let mutated = weights.map((weight) => {
        let shape = weight.shape;
        let array = weight.dataSync().slice();
        for (let i = 0; i < array.length; i++) {
          if (Math.random() < rate) {
            let randNum = tf.randomNormal([1]).arraySync()[0];
            array[i] += randNum;
          }
        }
        return tf.tensor(array, shape);
      });
      this.model.setWeights(mutated);
    });
  }

  dispose() {
    this.model.dispose();
  }
}
