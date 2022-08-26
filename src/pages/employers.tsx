import { useEffect, useState } from 'react';
import {
  useMoralis,
  useMoralisQuery,
  useNewMoralisObject,
  useApiContract,
  useWeb3ExecuteFunction,
} from 'react-moralis';
import Head from 'next/head';
import Image from 'next/image';

import Loading from '../components/Loading';
import AppHeader from '../components/AppHeader';
import ButtonWithProgress from '../components/ButtonWithProgress';

import EmployeeInterviewList from '../containers/EmployeeInterviewList';
import { showError } from '../containers/Toast';

import NoGas from '../../public/img/no-gas.png';
import NoCandidates from '../../public/img/no-candidates.png';

import TrinityAbi from '../abi/Trinity.json';

import { CHAIN_ID, CONTRACT_ADDRESS } from '../constants';

const EmployerStats = ({
  entranceFee,
  employerStake,
  enlistEmployer,
} : {
  entranceFee: string;
  employerStake: string;
  enlistEmployer: () => void;
}) => {
  return (
    <div className='px-4 py-8 mb-8 text-black bg-white rounded-lg'>
      <h2 className='text-lg text-center uppercase'>Stats</h2>
      <div className='mt-4 grid grid-cols-2'>
        <div className='col-start-1 col-end-2'>
          Fee:
        </div>
        <div className='text-right col-start-2 col-end-3'>
          {!entranceFee ? 'Error' : `${entranceFee} ETH`}
        </div>
        <div className='col-start-1 col-end-2'>
          Stake:
        </div>
        <div className='text-right col-start-2 col-end-3'>
          {!employerStake ? 'No Stake' : `${employerStake} ETH`}
        </div>
        <div className='flex flex-row items-center justify-center col-span-full'>
          <button className='mt-8 text-lg btn-basic bg-gradient' onClick={enlistEmployer}>
            Add Gas
          </button>
        </div>
      </div>
    </div>
  );
}

const Main = () => {
  const [loading, setLoading] = useState(true);
  const [showGetCandidate, setShowGetCandidate] = useState(true);
  const [interviews, setInterviews] = useState([]);
  const [entranceFee, setEntranceFee] = useState(null);
  const [employerStake, setEmployerStake] = useState(null);

  const { user, account, Moralis } = useMoralis();
  const { save: saveInterview } = useNewMoralisObject("Interviews");

   const {
     runContractFunction: getEntranceFee,
     data: entranceFeeData,
     error: entranceFeeDataError,
   } = useApiContract({
     chain: CHAIN_ID,
     address: CONTRACT_ADDRESS,
     functionName: "getEntranceFee",
     abi: TrinityAbi.abi,
   });

   const {
     runContractFunction: getEmployerStake,
     data: employerStakeData,
     error: employerStakeError,
   } = useApiContract({
     chain: CHAIN_ID,
     address: CONTRACT_ADDRESS,
     functionName: "getEmployerStake",
     abi: TrinityAbi.abi,
     params: {
       _employer: account,
     }
   });

   const {
     fetch: runEnlistEmployer,
   } = useWeb3ExecuteFunction({
     contractAddress: CONTRACT_ADDRESS,
     functionName: "enlistEmployer",
     abi: TrinityAbi.abi,
     msgValue: Moralis.Units.ETH(entranceFee || "0"),
   });

   const enlistEmployer = async () => {
     await runEnlistEmployer();
     setEmployerStake(entranceFee);
   };
  
  const { fetch: fetchCandidateData } = useMoralisQuery(
    "Candidates",
    (query) => query
      .equalTo("status", "VALIDATED")
      .limit(1),
    [],
    { autoFetch: false }
  );

  const { fetch: fetchInterviews } = useMoralisQuery(
    "Interviews",
    (query) => query
      .equalTo("status", "OPEN")
      .equalTo("sourceAccount", account)
      .equalTo("stage", "EMPLOYER"),
    [account],
    { autoFetch: false }
  );

  const onGetCandidate = async () => {
    // FIXME: Current we allow multiple candidates
    // for any stake amount, fix this and ensure
    // that only one candidate per entranceFee
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
          candidate: candidate.attributes.userId,
          stage: 'VALIDATOR',
          startEpochSeconds: Math.floor(Date.now() / 1000),
        };
        await saveInterview(interview);
        setInterviews([interview]);
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
    getEntranceFee();
    getEmployerStake();
  }, [account, getEntranceFee, getEmployerStake]);

  useEffect(() => {
    if (entranceFeeData) {
      setEntranceFee(Moralis.Units.FromWei(entranceFeeData));
      setLoading(false);
    }
  }, [entranceFeeData, entranceFeeDataError]);

  useEffect(() => {
    if (employerStakeData) {
      setEmployerStake(Moralis.Units.FromWei(employerStakeData));
    }
  }, [employerStakeData, employerStakeError]);

  useEffect(() => {
    const runQuery = async () => {
      try {
        const candidates = await fetchInterviews();
        console.log(candidates);
        if (candidates) {
          setInterviews(candidates);
        } else {
          setInterviews([]);
        }
      } catch (error) {
        console.log(error);
        setInterviews([]);
        showError('Could not fetch list of candidates to validate');
      }
    };

    runQuery();
  }, [user, account]);

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
        <h1 className='text-2xl'>Hello <span className='text-gradient'>Employer!</span></h1>
        {!employerStake ? (
          <div className='flex flex-col items-center justify-center p-4 mt-8 rounded-lg bg-opacity-50'>
            <div className='w-2/5 p-4 '>
              <Image
                src={NoGas}
                alt="no gas in tank"
              />
            </div>
            <div>
              No gas in the tank! Add some to search candidates!
            </div>
            <button className='mt-8 text-xl btn-basic bg-gradient' onClick={() => enlistEmployer()}>
              Add Gas
            </button>
          </div>
        ) : interviews.length === 0 ? (
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
            <EmployeeInterviewList candidates={interviews} />
          </div>
        )}
      </div>
      <div className='col-start-3 col-end-4'>
        <EmployerStats
          entranceFee={entranceFee}
          employerStake={employerStake}
          enlistEmployer={enlistEmployer}
        />
      </div>
    </div>
  );
}

export default function IndexPage() {
  const { isAuthenticated } = useMoralis();

  return (
    <section>
      <Head>
        <title>Trinity - Employer Home!</title>
      </Head>
      <AppHeader />

      <main className='min-h-screen mt-16'>
        {!isAuthenticated ? (
          <div className='flex flex-row items-center justify-center min-h-screen -mt-16'>
            <div className='p-8 md:p-0 md:w-1/2'>
              <h1 className='text-3xl'>Welcome <span className='text-gradient'>Employers!</span></h1>
              <h2 className='mt-4 text-lg'>
                This space is for the mavericks. The visionaries of the world!
              </h2>
              <p className='mt-8'>
                Proceed to pave the path of the future, a vision of decentralized hiring guided
                by skill, valor and unbridled grit.
                Go ahead, ready you battle stations and Connect!
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

