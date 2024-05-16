// Define a simple neural network class
class NeuralNetwork {
  constructor(inputCount, hiddenCount, outputCount) {
    this.inputCount = inputCount;
    this.hiddenCount = hiddenCount;
    this.outputCount = outputCount;
    this.weightsInputHidden = Array.from({ length: inputCount }, () =>
      Array.from({ length: hiddenCount }, () => Math.random())
    );
    this.weightsHiddenOutput = Array.from({ length: hiddenCount }, () =>
      Array.from({ length: outputCount }, () => Math.random())
    );
    this.initWeights();
  }

  initWeights() {
    if (!this.weightsInputHidden) {
      this.weightsInputHidden = Array.from({ length: this.inputCount }, () =>
        Array.from({ length: this.hiddenCount }, () => {
          const weight = Math.random();
          return isNaN(weight) ? 0.01 : weight; // Replace NaN with a small value (e.g., 0.01)
        })
      );
    }
  
    if (!this.weightsHiddenOutput) {
      this.weightsHiddenOutput = Array.from({ length: this.hiddenCount }, () =>
        Array.from({ length: this.outputCount }, () => {
          const weight = Math.random();
          return isNaN(weight) ? 0.01 : weight; // Replace NaN with a small value (e.g., 0.01)
        })
      );
    }
  }

  // Sigmoid activation function
  sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
  }

  // Feedforward propagation
  feedForward(input) {
    const hiddenInputs = new Array(this.hiddenCount).fill(0);
    for (let i = 0; i < this.hiddenCount; i++) {
      for (let j = 0; j < this.inputCount; j++) {
        hiddenInputs[i] += input[j] * this.weightsInputHidden[j][i];
      }
    }
    const hiddenOutputs = hiddenInputs.map(this.sigmoid);

    const finalInputs = new Array(this.outputCount).fill(0);
    for (let i = 0; i < this.outputCount; i++) {
      for (let j = 0; j < this.hiddenCount; j++) {
        finalInputs[i] += hiddenOutputs[j] * this.weightsHiddenOutput[j][i];
      }
    }
    const finalOutputs = finalInputs.map(this.sigmoid);

    return { hiddenOutputs, finalOutputs };
  }

  // Backpropagation
  backpropagate(input, expectedOutput, learningRate = 0.1) {
    const { hiddenOutputs, finalOutputs } = this.feedForward(input);
    const actualOutput = finalOutputs;

    // Calculate output layer error
    const outputErrors = actualOutput.map((output, index) =>
      output * (1 - output) * (expectedOutput[index] - output)
    );

    // Calculate hidden layer errors
    const hiddenErrors = new Array(this.hiddenCount).fill(0);
    for (let i = 0; i < this.hiddenCount; i++) {
      let error = 0;
      for (let j = 0; j < this.outputCount; j++) {
        error += outputErrors[j] * this.weightsHiddenOutput[i][j];
      }
      hiddenErrors[i] = hiddenOutputs[i] * (1 - hiddenOutputs[i]) * error;
    }

    // Update weights between hidden and output layers
    for (let i = 0; i < this.hiddenCount; i++) {
      for (let j = 0; j < this.outputCount; j++) {
        this.weightsHiddenOutput[i][j] +=
          learningRate * hiddenOutputs[i] * outputErrors[j];
      }
    }

    // Update weights between input and hidden layers
    for (let i = 0; i < this.inputCount; i++) {
      for (let j = 0; j < this.hiddenCount; j++) {
        this.weightsInputHidden[i][j] +=
          learningRate * input[i] * hiddenErrors[j];
      }
    }
  }

  train(trainingData, epochs, learningRate = 0.1) {
    for (let epoch = 0; epoch < epochs; epoch++) {
      trainingData.forEach(({ input, output }) => {
        this.backpropagate(input, output, learningRate);
      });
    }
  }
}
  
  const trainingData = [
    { input: [1, 100.25, 1234, 8], output: [0] },
    { input: [2, 50.75, 5678, 12], output: [0] },
    { input: [3, 200.0, 9012, 15], output: [0] },
    { input: [4, 300.5, 3456, 18], output: [1] },
    { input: [5, 150.8, 7890, 21], output: [0] },
    { input: [6, 500.0, 2345, 10], output: [1] },
    { input: [7, 75.25, 6789, 14], output: [0] },
    { input: [8, 400.0, 1111, 16], output: [1] },
    { input: [9, 250.5, 2222, 20], output: [0] },
    { input: [10, 600.0, 3333, 22], output: [1] },
    { input: [11, 125.75, 4444, 11], output: [0] },
    { input: [12, 90.25, 5678, 9], output: [0] },
    { input: [13, 150.75, 1234, 11], output: [0] },
    { input: [14, 220.0, 9012, 14], output: [0] },
    { input: [15, 350.5, 3456, 17], output: [1] },
    { input: [16, 200.8, 7890, 20], output: [0] },
    { input: [17, 400.0, 2345, 12], output: [1] },
    { input: [18, 60.25, 6789, 15], output: [0] },
    { input: [19, 500.0, 1111, 17], output: [1] },
    { input: [20, 275.5, 2222, 21], output: [0] },
    { input: [21, 650.0, 3333, 23], output: [1] },
    { input: [22, 145.75, 4444, 10], output: [0] },
    { input: [24, 135.95, 4234, 20], output: [1] },
  ];
  
  // Train the neural network
  const neuralNetwork = new NeuralNetwork(4, 4, 1); // 4 input features, 4 hidden neurons, 1 output node
  neuralNetwork.train(trainingData, 10000, 0.9); // Train for 10,000 epochs with a learning rate of 0.1
  
  // Test data for prediction
  const testData = [
    [1, 100.25, 1234, 8],
    [4, 300.5, 3456, 18],
    [6, 500.0, 2345, 10],
    [7, 75.25, 6789, 14],
    [8, 400.0, 1111, 16],
    [9, 250.5, 2222, 20],
  ];
  
  // Predict fraudulence for test data
  testData.forEach((input, index) => {
    const output = neuralNetwork.feedForward(input).finalOutputs;
    const isFraudulent = output[0] > 0.5 ? "Fraudulent" : "Non-fraudulent";
    console.log(`Test data ${index + 1}: ${isFraudulent} (${output})`);
  });