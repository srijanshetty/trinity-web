import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';

import AppHeader from '../components/AppHeader';
import { useMoralis, useMoralisQuery } from 'react-moralis';

import { showError } from '../containers/Toast';
import ButtonWithProgress from '../components/ButtonWithProgress';
import NoCandidates from '../../public/img/no-candidates.png';
import NotAValidator from '../../public/img/not-a-validator.jpeg';

// DONE:
// - Landing Page
// - If validator show message saying let's start
// - If not validator then signup to be a validator

// FIXME:
// - If validator and no candidates then search button
// - If validator and has candidates then show list of candidates

const ValidatorStats = () => {
  return (
    <div className='p-4 rounded-lg bg-purple'>
      <h2 className='text-lg text-center uppercase'>Stats</h2>
      <div className='grid grid-cols-2'>
      </div>
    </div>
  );
}

const CandidateList = ({ candidates }) => {
  console.log(candidates);

  return (
    <>
      You have some candidates!!
    </>
  );
};

const Main = () => {
  const [showGetCandidate, setShowGetCandidate] = useState(true);
  const [candidates, setCandidates] = useState([]);
  const { user, account } = useMoralis();

  const { fetch: fetchCandidateData } = useMoralisQuery(
    "Candidates",
    (query) => query.equalTo("status", "NEW").limit(1),
    [],
    { autoFetch: false }
  );

  const { fetch: fetchInterviews } = useMoralisQuery(
    "Interviews",
    (query) => query.equalTo("interviewer", account),
    [],
    { autoFetch: false }
  );

  const onGetCandidate = () => {
    setShowGetCandidate(false);
    fetchCandidateData({
      onSuccess: (candidate) => {
        console.log(candidate[0]);
        setShowGetCandidate(true);
      },
      onError: (error) => {
        console.log(error);
        showError('Could not find any candidate');
        setShowGetCandidate(true);
      },
    });
  }

  useEffect(() => {
    fetchInterviews({
      onSuccess: (candidates) => {
        setCandidates(candidates);
      },
      onError: (error) => {
        console.log(error);
        showError('No interviews found');
      },
    });
  }, [user]);

  if (!user.attributes.isValidator) {
    return (
      <div className='min-h-screen'>
        <div className='flex flex-col items-center justify-center p-4 mt-8 rounded-lg bg-opacity-50'>
          <div className='w-2/3 p-4 '>
            <Image
              src={NotAValidator}
              alt="you shall not pass"
            />
          </div>
          <div className='text-4xl'>
            Treachorous Knave, you are no validator!
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen p-16 grid grid-cols-3 gap-8'>
      <div className='col-start-1 col-end-3'>
        <h1 className='text-2xl'>Hello <span className='text-gradient'>Validator!</span></h1>
        {user.attributes?.candidates ?? [] ? (
          <div className='flex flex-col items-center justify-center p-4 mt-8 rounded-lg bg-opacity-50'>
            <div className='w-2/3 p-4 md:w-2/5 '>
              <Image
                src={NoCandidates}
                alt="no candidates in queue"
              />
            </div>
            <div>
              Nothing found! Let&apos;s start reviewing some candidates?
            </div>
            <ButtonWithProgress
              id="validator-get-candidate"
              showConfirmText={showGetCandidate}
              className="w-1/3 mt-2 btn-basic bg-gradient"
              confirmText="Get Candidate"
              onClick={onGetCandidate}
            />
          </div>
        ) : (
          <CandidateList candidates={user.attributes.candidates} />
        )}
      </div>

      <div className='col-start-3 col-end-4'>
        <ValidatorStats />
      </div>
    </div>
  );
}

export default function Validator() {
  const { isAuthenticated } = useMoralis();

  return (
    <section>
      <Head>
        <title>Trinity - Validator Home!</title>
      </Head>
      <AppHeader />

      <main className='min-h-screen mt-16'>
        {!isAuthenticated ? (
          <div className='flex flex-row items-center justify-center min-h-screen -mt-16'>
            <div className='p-8 md:p-0 md:w-1/2'>
              <h1 className='text-3xl'>Welcome <span className='text-gradient'>Explorers!</span></h1>
              <h2 className='mt-4 text-lg'>
                This space is for the chosen few - the validators. The keepers of the crypt!
              </h2>
              <p className='mt-8'>
                If chosen you shall select the knights of the realm, if deemed unworthy, you shall be exiled.
                Go ahead, unsheath your sword and connect!
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
