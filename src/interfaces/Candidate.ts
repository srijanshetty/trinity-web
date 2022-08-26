type Candidate = {
  attributes: {
    userId: string;
    stage: 'NEW' | 'VALIDATED' | 'EMPLOYER';
    name: string;
    email: string;
    twitter: string;
    github: string;
    linkedIn: string;
    account: string;
  };
};

export default Candidate;
