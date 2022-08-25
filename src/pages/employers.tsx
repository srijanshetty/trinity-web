import { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';

import Loading from '../components/Loading';
import AppHeader from '../components/AppHeader';
import { useMoralis, useApiContract, useWeb3ExecuteFunction } from 'react-moralis';

import NoGas from '../../public/img/no-gas.png';
import TrinityAbi from '../abi/Trinity.json';

import { CHAIN_NAME, CONTRACT_ADDRESS } from '../constants';

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

const CandidateList = ({ candidates }) => {
  console.log(candidates);

  return (
    <>
      You have some candidates!!
    </>
  );
};

const Main = () => {
  const [loading, setLoading] = useState(true);
  const { user, Moralis, account } = useMoralis();
  const [entranceFee, setEntranceFee] = useState(null);
  const [employerStake, setEmployerStake] = useState(null);

   const {
     runContractFunction: getEntranceFee,
     data: entranceFeeData,
     error: entranceFeeDataError,
   } = useApiContract({
     chain: CHAIN_NAME,
     address: CONTRACT_ADDRESS,
     functionName: "getEntranceFee",
     abi: TrinityAbi.abi,
   });

   const {
     runContractFunction: getEmployerStake,
     data: employerStakeData,
     error: employerStakeError,
   } = useApiContract({
     chain: CHAIN_NAME,
     address: CONTRACT_ADDRESS,
     functionName: "getEmployerStake",
     abi: TrinityAbi.abi,
     params: {
       _employer: account,
     }
   });

   const {
     fetch: enlistEmployer,
     data: enlistEmployerData,
     error: enlistEmployerError,
   } = useWeb3ExecuteFunction({
     contractAddress: CONTRACT_ADDRESS,
     functionName: "enlistEmployer",
     abi: TrinityAbi.abi,
     msgValue: Moralis.Units.ETH(entranceFee || "0"),
   });
  
  const candidates = user.attributes?.candidates ?? [];

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
        ) : candidates.length ? (
          <div className='mt-8'>
            <h3 className='mb-2 text-xl text-gradient'>Interviews</h3>
            <CandidateList candidates={user.attributes.candidates} />
          </div>
        ) : (
          <div className='mt-4'>No candidates</div>
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

