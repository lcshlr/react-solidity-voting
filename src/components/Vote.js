import { web3Service } from "../services/web3.service";
import { toastPromise } from "../utils/HandlePromiseTransaction";
import { toastError } from "../utils/HandleResponse";

export default function Vote(props) {
    async function voteForCandidate() {
        toastPromise(
            web3Service.vote(props.id),
            'Vote for candidate awaiting validation',
            'Vote counted successfully'
            )
            .then(() => {
                props.setVote(true);
            })
            .catch((err) => toastError(err));
    }

    return(
        <button className='btn btn-primary' onClick={() => voteForCandidate()}>Vote</button>
    );
}