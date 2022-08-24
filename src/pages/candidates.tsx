import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Image from 'next/image';
import { useMoralis, useMoralisQuery, useNewMoralisObject } from 'react-moralis';
import { User, Twitter, Github, Mail, Pulse } from '@web3uikit/icons'

import Loading from '../components/Loading';
import AppHeader from '../components/AppHeader';
import ButtonWithProgress from '../components/ButtonWithProgress';
import { showSuccess, showError } from '../containers/Toast';
import CandidateInterviewList from '../containers/CandidateInterviewList';

import Candidate from '../interfaces/Candidate';
import Interview from '../interfaces/Interview';

import { CandidateSchema } from '../lib/validationSchemas';

import NoCandidates from '../../public/img/no-candidates.png';

// DONE:
// - Landing Page inviting them to join
// - Fetch and save candidate data

// FIXME:
// - Show Skills, Interviews
// - Show open jobs, skills and underprocess validations

const Formik = dynamic(() => import('../components/form/Formik'), {
  ssr: false,
  loading: () => null,
});
const Form = dynamic(() => import('../components/form/Form'), {
  ssr: false,
  loading: () => null,
});
const Field = dynamic(() => import('../components/form/Field'), {
  ssr: false,
  loading: () => null,
});
const Input = dynamic(() => import('../components/form/Input'), {
  ssr: false,
  loading: () => null,
});

const CandidateStats = ({ candidate }) => {
  if (!candidate) {
    return (
      <div className='flex flex-col items-center justify-center p-4 pb-8 rounded-lg bg-purple'>
        <div className='mt-4'>
          <Pulse fontSize='50px'/>
        </div>
        <div className='mt-4'>
          Mr.Robot, give us control!
        </div>
      </div>
    );
  }

  return (
    <div className='p-4 pb-8 rounded-lg bg-purple'>
      <div className='flex flex-col items-center justify-center mt-4 grid grid-cols-4 gap-y-2'>
        <div className='col-start-1 col-end-2'><User /></div>
        <div className='col-start-2'>{candidate.name}</div>

        <div className='col-start-1 col-end-2'><Mail /></div>
        <div className='col-start-2'>{candidate.email}</div>

        <div className='col-start-1 col-end-2'><Twitter /></div>
        <div className='col-start-2'>
          <a className='' href={candidate.twitter}>@{candidate.twitter.split('/').pop()}</a>
        </div>

        <div className='col-start-1 col-end-2'><Github fontSize='20px' /></div>
        <div className='col-start-2'>
          <a className='' href={candidate.github}>@{candidate.github.split('/').pop()}</a>
        </div>
      </div>
    </div>
  );
}

const Trophies = ({
  candidate,
  interviews,
} : {
  candidate: Candidate;
  interviews: Interview[];
}) => {
  if (candidate) {
    return (
      <section>
        <div className='flex flex-col items-center justify-center p-4 mt-8 rounded-lg bg-opacity-50'>
          {interviews.length ? (
            <CandidateInterviewList interviews={interviews} />
          ) : (
            <div>
              <div className='w-2/3 p-4 md:w-2/5 '>
                <Image
                  src={NoCandidates}
                  alt="no candidates in queue"
                />
              </div>
              It&apos;s a bit lonely here! Your interviews will appear here!
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <>
      You have some candidates!!
    </>
  );
};

const Main = () => {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(true);
  const [candidateData, setCandidateData] = useState(null);
  const [interviews, setInterviews] = useState([]);

  const { user, account } = useMoralis();

  // Fetchers for the candidates
  const { fetch: fetchCandidateData } = useMoralisQuery(
    "Candidates",
    (query) => query.equalTo("account", account).limit(1),
    [account],
    { autoFetch: false }
  );
  const { save: saveCandidate } = useNewMoralisObject("Candidates");

  const { fetch: fetchInterviews } = useMoralisQuery(
    "Interviews",
    (query) => query.equalTo("candidate", user.id),
    [user, account],
    { autoFetch: false }
  );

  useEffect(() => {
    const runQuery = async () => {
      try {
        const candidate = await fetchCandidateData();

        if (candidate[0]) {
          setCandidateData(candidate[0].attributes);
        }

        const candidates = await fetchInterviews();
        console.log(candidates);
        setInterviews(candidates);
      } catch (error) {
        console.log(error);
        setInterviews([]);
        showError('Could not fetch list of candidates to validate');
      }

      setLoading(false);
    };

    runQuery();
  }, [user, account]);

  const onSubmit = async ({
    name,
    email,
    twitter,
    linkedIn,
    github,
  }) => {
    setShowConfirm(false);
    try {
      const candidate = {
        userId: user.id,
        status: 'NEW',
        name,
        email,
        twitter,
        github,
        linkedIn,
      };
      await saveCandidate(candidate);
      setCandidateData(candidate);
      showSuccess('Candidate saved successfully');
    } catch (error) {
      console.log(error);
    }
    setShowConfirm(true);
  }

  if (loading) {
    return (
      <div className='min-h-screen -mt-16'>
        <div className='flex flex-row items-center justify-center min-h-screen'>
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen p-16 grid grid-cols-3 gap-8'>
      <div className='col-start-1 col-end-3'>
        <h1 className='text-2xl'>Hello <span className='text-gradient'>Candidate!</span></h1>
        {!candidateData ? (
          <div className='mt-4'>
            <div>Let&apos;s get to know you better</div>
            <div className='w-full'>
              <Formik
                initialValues={{
                  email: '',
                  name: '',
                  twitter: '',
                  github: '',
                  linkedIn: '',
                }}
                onSubmit={onSubmit}
                validationSchema={CandidateSchema}
              >
                <Form className="flex flex-col w-full mt-6">
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Your Email"
                    autoFocus={true}
                    component={Input}
                  />
                  <Field
                    id="name"
                    name="name"
                    placeholder="Your Name"
                    component={Input}
                  />
                  <Field
                    id="twitter"
                    name="twitter"
                    placeholder="Your Twitter"
                    component={Input}
                  />
                  <Field
                    id="github"
                    name="github"
                    placeholder="Your Github"
                    component={Input}
                  />
                  <Field
                    id="linkedIn"
                    name="linkedIn"
                    placeholder="Your LinkedIn"
                    component={Input}
                  />

                  <ButtonWithProgress
                    id="candidate-submit-button"
                    confirmText="Submit"
                    showConfirmText={showConfirm}
                    className="mt-6 btn-basic bg-gradient"
                  />
                </Form>
              </Formik>
            </div>
          </div>
        ) : (
          <div className='mt-4'>
            <Trophies candidate={candidateData} interviews={interviews} />
          </div>
        )}
      </div>
      <div className='col-start-3 col-end-4'>
        <CandidateStats candidate={candidateData} />
      </div>
    </div>
  );
}

export default function IndexPage() {
  const { isAuthenticated } = useMoralis();

  return (
    <section>
      <Head>
        <title>Trinity - Candidate Home!</title>
      </Head>

      <AppHeader />
      <main className='min-h-screen mt-16'>
        {!isAuthenticated ? (
          <div className='flex flex-row items-center justify-center min-h-screen -mt-16'>
            <div className='p-8 md:p-0 md:w-1/2'>
              <h1 className='text-3xl'>Welcome <span className='text-gradient'>Candidate!</span></h1>
              <h2 className='mt-4 text-lg'>
                You&apos;re a knights of the realm. The protectors of the crypt!
              </h2>
              <p className='mt-8'>
                Don the suit, and give us our salvation. Connect!
              </p>
            </div>
          </div>
        ) : (
          <Main />
        )}
      </main>
    </section>
  );
}

