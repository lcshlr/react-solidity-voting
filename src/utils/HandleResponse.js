import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function getHandledError(err){
    if(err.data?.message) {
        if(err.data.message.includes('Error: VM Exception while processing transaction: reverted with reason')){
            return err.data.message.split("'")[1];
        }
        return err.data?.message ?? err;
    }
    return err.message ?? err;
}

export function toastError(err, position='top-right'){
    toast.error('Error occured : ' + getHandledError(err), {
        position: position,
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
}

export function toastSuccess(msg, position='top-right'){
    toast.success(msg, {
        position: position,
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
}