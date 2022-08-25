import { useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';

import AppHeader from '../components/AppHeader';
import { useMoralis, useApiContract } from 'react-moralis';

import NoGas from '../../public/img/no-gas.png';
import TrinityAbi from '../abi/Trinity.json';

import { CHAIN_NAME, CONTRACT_ADDRESS } from '../constants';

const EmployerStats = ({ entranceFee, entranceFeeError }) => {
  return (
    <div className='p-4 rounded-lg bg-purple'>
      <h2 className='text-lg text-center uppercase'>Stats</h2>
      <div className='mt-4 grid grid-cols-2'>
        <div className='col-start-1 col-end-2'>
          Fee:
        </div>
        <div className='text-right col-start-2 col-end-3'>
          {entranceFeeError ? 'Error' : entranceFee}
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
  const { user } = useMoralis();

   const {
     runContractFunction: getEntranceFee,
     data: entranceFee,
     error: entranceFeeError,
   } = useApiContract({
     chain: CHAIN_NAME,
     address: CONTRACT_ADDRESS,
     functionName: "getEntranceFee",
     abi: TrinityAbi.abi,
   });
  
  const gas = user.attributes?.gas ?? 0;
  const candidates = user.attributes?.candidates ?? [];

  useEffect(() => {
    getEntranceFee();
  }, [getEntranceFee]);

  return (
    <div className='min-h-screen p-16 grid grid-cols-3 gap-8'>
      <div className='col-start-1 col-end-3'>
        <h1 className='text-2xl'>Hello <span className='text-gradient'>Employer!</span></h1>
        {gas && !candidates ? (
          <CandidateList candidates={user.attributes.candidates} />
        ) : (
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
            <button className="mt-8 text-xl btn-basic bg-gradient" onClick={() => getEntranceFee()}>
              Add Gas
            </button>
          </div>
        )}
      </div>
      <div className='col-start-3 col-end-4'>
        <EmployerStats entranceFee={entranceFee} entranceFeeError={entranceFeeError} />
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

