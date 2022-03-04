import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getHandledError, toastError } from './HandleResponse';

export async function toastPromise(callback, pending, success){
    return toast.promise(
        callback,
        {
            pending: pending,
            success: success,
            error: {
                render({err}){
                    if(err?.message){
                        return <div>{getHandledError(err.message)}</div>
                    }
                    else {
                        toast.dismiss(pending);
                    }
                }
              }
        },
        {toastId: pending}
    );
}