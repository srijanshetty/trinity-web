type Interview = {
  attributes: {
    sourceAccount: string;
    candidate: string;
    stage: 'VALIDATOR' | 'EMPLOYER';
    status: 'OPEN' | 'CLOSED';
    startEpochSeconds: number;
  };
};

export default Interview;
