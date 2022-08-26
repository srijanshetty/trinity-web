import { toast, ToastOptions } from 'react-toastify';
import { FcApproval as CheckCircle } from 'react-icons/fc';
import { FcCancel as CancelCircle } from 'react-icons/fc';

export const showSuccess = (message: string, options: ToastOptions = {}) => {
  toast.dark(
    <div className="flex items-center">
      <CheckCircle className="w-6 h-6 mr-2 text-green" /> {message}
    </div>
  , options);
};

export const showError = (message: string, options: ToastOptions = {}) => {
  toast.dark(
    <div className='flex items-center'>
      <CancelCircle className="w-6 h-6 mr-2 text-red" />
      {message}
    </div>
  , options);
};
