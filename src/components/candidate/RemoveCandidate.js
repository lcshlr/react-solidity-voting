import { web3Service } from "../../services/web3.service";
import { toastPromise } from "../../utils/HandlePromiseTransaction";

export default function RemoveCandidate(props){
    async function removeCandidate() {
        toastPromise(web3Service.removeCandidate(props.id), 'Removing candidate awaiting validation', 'Candidate removed successfully');
    }

    return(
        <button className='btn btn-danger' onClick={() => removeCandidate()}>Delete</button>
    );
}