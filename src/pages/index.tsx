import Head from 'next/head';
import Link from 'next/link';
import { BsArrowRightShort } from 'react-icons/bs';

import Header from '../components/Header';

export default function Home() {
  return (
    <>
      <Head>
        <title>Trinity - the future of hiring!</title>
      </Head>

      <Header />

      <div className="container flex items-center justify-center min-h-screen p-4 mx-auto -mt-16 text-center">
        <main>
          <div className="">
            <h1 className="mt-2 text-4xl font-bold text-white drop-shadow-lg md:text-6xl">
              <span className='text-gradient'>Trinity</span> - web3 hiring!
            </h1>
            <h2 className='mt-4 text-xl'>
              World&apos;s first Validate to Earn platform.
            </h2>
            <p className='mt-16'>
              Validators provide quality candidates onchain skill SBTs, <br/>
              which employers can use to hire the best candidates.
            </p>
            <div className='flex flex-row items-center justify-center'>
              <Link href="/employers" passHref>
                <button className="mt-8 text-xl btn-basic bg-gradient">
                  Employer
                  <BsArrowRightShort className="inline w-6 h-6" />
                </button>
              </Link>
              <Link href="/candidates" passHref className=''>
                <button className="mt-8 ml-4 text-xl btn-basic bg-gradient">
                  Candidate
                  <BsArrowRightShort className="inline w-6 h-6" />
                </button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
