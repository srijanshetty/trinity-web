import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useMoralis } from 'react-moralis';

import AppHeader from '../components/AppHeader';
import ButtonWithProgress from '../components/ButtonWithProgress';

import { CandidateSchema } from '../lib/validationSchemas';


// FIXME:
// - Landing Page inviting them to join
// - If no credentials add credentials
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

const CandidateStats = () => {
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
  const [showConfirm, setShowConfirm] = useState(true);
  const { user } = useMoralis();
  const candidateData = user.attributes?.candidateData ?? {};

  const onSubmit = ({
    name,
    email,
    twitter,
    linkedIn,
    github,
  }) => {
    console.log('wow');
  }

  return (
    <div className='min-h-screen p-16 grid grid-cols-3 gap-8'>
      <div className='col-start-1 col-end-3'>
        <h1 className='text-2xl'>Hello <span className='text-gradient'>Candidate!</span></h1>
        {!candidateData.length ? (
          <div className='mt-4'>
            <div>Let&apos;s get to know you better</div>
            <div className='w-1/2'>
              <Formik
                initialValues={{
                  email: '',
                  name: '',
                  twitter: '',
                  linkedIn: '',
                  github: '',
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
          <CandidateList candidates={user.attributes.candidates} />
        )}
      </div>
      <div className='col-start-3 col-end-4'>
        <CandidateStats />
      </div>
    </div>
  );
}

export default function IndexPage() {
  const { isAuthenticated } = useMoralis();

  return (
    <section>
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

