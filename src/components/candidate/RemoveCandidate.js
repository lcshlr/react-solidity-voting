import { web3Service } from "../../services/web3.service";
import { toastPromise } from "../../utils/HandlePromiseTransaction";
import { toastError } from "../../utils/HandleResponse";

export default function RemoveCandidate(props){
    async function removeCandidate() {
        toastPromise(
            web3Service.removeCandidate(props.id),
            'Removing candidate awaiting validation',
            'Candidate removed successfully'
            ).catch((err) => toastError(err));
    }

    return(
        <button className='btn btn-danger' onClick={() => removeCandidate()}>Delete</button>
    );
}