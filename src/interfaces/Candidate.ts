type Candidate = {
  attributes: {
    userId: string;
    stage: 'NEW' | 'VALIDATOR' | 'VALIDATED' | 'EMPLOYER' | 'EMPLOYED';
    name: string;
    email: string;
    twitter: string;
    github: string;
    linkedIn: string;
    account: string;
  };
};

export default Candidate;
