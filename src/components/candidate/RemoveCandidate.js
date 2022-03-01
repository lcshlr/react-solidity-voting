import { web3Service } from "../../services/web3.service";
import { toastError } from "../../utils/HandleResponse";

export default function RemoveCandidate(props){
    async function removeCandidate() {
        try{
            await web3Service.removeCandidate(props.id);
        } catch(err) {
            console.error(err);
            toastError(err);
        }
    }

    return(
        <button className='btn btn-danger' onClick={() => removeCandidate()}>Delete</button>
    );
}