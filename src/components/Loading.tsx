import { Fragment } from 'react';
import ReactLoading from 'react-loading';

const Loading = ({ className = 'min-h-screen' }) => (
  <Fragment>
    <div
      className={`hidden md:flex flex-col items-center justify-center ${className}`}
    >
      <ReactLoading type="spin" color="white" height="50px" width="50px" />
      <img
        className="block w-20 mt-4"
        src="/img/logo.png"
        alt="logo"
      />
    </div>
    <div
      className={`md:hidden flex flex-col items-center justify-center ${className}`}
    >
      <ReactLoading type="spin" color="white" height="30px" width="30px" />
      <img
        className="block mt-4"
        src="/img/logo.png"
        alt="logo"
      />
    </div>
  </Fragment>
);

export default Loading;
