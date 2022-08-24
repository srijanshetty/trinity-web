type Interview = {
  attributes: {
    sourceAccount: string;
    candidate: string;
    stage: 'VALIDATOR' | 'EMPLOYER';
    startEpochSeconds: number;
  };
};

export default Interview;
