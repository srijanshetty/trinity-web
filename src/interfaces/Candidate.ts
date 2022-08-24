type Candidate = {
  attributes: {
    userId: string;
    stage: 'NEW' | 'VALIDATOR' | 'EMPLOYER';
    name: string;
    email: string;
    twitter: string;
    github: string;
    linkedIn: string;
  };
};

export default Candidate;
