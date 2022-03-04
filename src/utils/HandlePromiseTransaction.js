import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getHandledError } from './HandleResponse';

export async function toastPromise(callback, pending, success){
    return toast.promise(
        callback,
        {
            pending: pending,
            success: success,
            error: {
                render({data}){
                    return <div>{data.message}</div>
                }
              }
        }
    );
}