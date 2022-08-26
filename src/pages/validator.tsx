import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { useMoralis, useMoralisQuery, useNewMoralisObject, useApiContract } from 'react-moralis';

import AppHeader from '../components/AppHeader';
import ButtonWithProgress from '../components/ButtonWithProgress';
import Loading from '../components/Loading';

import ValidatorInterviewList from '../containers/ValidatorInterviewList';
import { showError } from '../containers/Toast';

import NoCandidates from '../../public/img/no-candidates.png';
import NotAValidator from '../../public/img/not-a-validator.jpeg';

import TrinityAbi from '../abi/Trinity.json';

import { CHAIN_ID, CONTRACT_ADDRESS } from '../constants';

const ValidatorStats = ({ candidates }) => {
  return (
    <div className='p-4 rounded-lg bg-purple'>
      <h2 className='text-lg text-center uppercase'>Stats</h2>
      <div className='mt-8 grid grid-cols-2'>
        <div className='col-start-1 col-end-2'>
          Candidates
        </div>
        <div className='text-right col-start-2 col-end-3'>
          {candidates.length}
        </div>
      </div>
    </div>
  );
}

const Main = () => {
  const [loading, setLoading] = useState(true);
  const [isValidator, setIsValidator] = useState(false);
  const [showGetCandidate, setShowGetCandidate] = useState(true);
  const [interviews, setInterviews] = useState([]);
  const { user, account } = useMoralis();
  const { save: saveInterview } = useNewMoralisObject("Interviews");

   const {
     runContractFunction: runIsValidator,
     data: isValidatorData,
     error: isValidatorError,
   } = useApiContract({
     chain: CHAIN_ID,
     address: CONTRACT_ADDRESS,
     functionName: "isValidator",
     abi: TrinityAbi.abi,
     params: {
       _validator: account,
     },
   });

  const { fetch: fetchCandidateData } = useMoralisQuery(
    "Candidates",
    (query) => query.equalTo("status", "NEW").limit(1),
    [],
    { autoFetch: false }
  );

  const { fetch: fetchInterviews } = useMoralisQuery(
    "Interviews",
    (query) => query
      .equalTo("status", "OPEN")
      .equalTo("sourceAccount", account)
      .equalTo("stage", "VALIDATOR"),
    [account],
    { autoFetch: false }
  );

  const onGetCandidate = async () => {
    setShowGetCandidate(false);

    try {
      const candidates = await fetchCandidateData();
      const candidate = candidates[0];

      if (candidate) {
        console.log(candidate);

        // Update the state of the candidate to VALIDATOR
        candidate.set("status", "VALIDATOR");
        await candidate.save();

        // Create an interview entry for the candidate
        const interview = {
          sourceAccount: account,
          candidate: candidate.attributes.account,
          stage: 'VALIDATOR',
          startEpochSeconds: Math.floor(Date.now() / 1000),
        };
        await saveInterview(interview);

        // Force reload the UI with the new interview
        setInterviews([{
          attributes: {
            ...interview
          }
        }]);
      } else {
        showError('No candidate found for interview!');
      }
    } catch (error) {
      console.log(error);
      showError('Could not find any candidate to validate');
    }

    setShowGetCandidate(true);
  }

  useEffect(() => {
    const runQuery = async () => {
      try {
        await runIsValidator();

        const candidates = await fetchInterviews();
        console.log(candidates);

        if (candidates) {
          setInterviews(candidates);
        }
      } catch (error) {
        console.log(error);
        setInterviews([]);
        showError('Could not fetch list of candidates to validate');
      }

      setLoading(false);
    };

    runQuery();
  }, [user, account]);

  // Update the value of isValidator
  useEffect(() => {
    if (isValidatorData) {
      setIsValidator(!!isValidatorData);
    }
  }, [isValidatorData, isValidatorError]);

  if (loading) {
    return (
      <div className='min-h-screen -mt-16'>
        <div className='flex flex-row items-center justify-center min-h-screen'>
          <Loading />
        </div>
      </div>
    );
  }

  if (!isValidator) {
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
        {interviews.length === 0 ? (
          <div className='flex flex-col items-center justify-center p-4 mt-8 rounded-lg bg-opacity-50'>
            <div className='w-2/3 p-4 md:w-2/5'>
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
          <div className='mt-4'>
            <ValidatorInterviewList validator={account} candidates={interviews} />
          </div>
        )}
      </div>

      <div className='col-start-3 col-end-4'>
        <ValidatorStats candidates={interviews} />
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
