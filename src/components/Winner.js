import { useEffect } from "react";
import { useStateIfMounted } from "use-state-if-mounted";
import { web3Service } from "../services/web3.service";
import { getHandledError } from '../utils/HandleResponse';

export default function Winner(props){

    const [winner, setWinner] = useStateIfMounted();
    const [error, setError] = useStateIfMounted('');

        useEffect(() => {
        async function init(){
            await web3Service.initContract();
            if(!props.session && await web3Service.getCandidateCount() > 0){
                try{
                    const winnerName = (await web3Service.getWinner()).name;
                    setWinner(winnerName);
                } catch(err){
                    setError('No winner : ' + getHandledError(err));
                }
            }
        }
        init();
    });

    return (
        <div className="mt-4 pt-4">
            {winner && <p className="display-6">Winner is: {winner}</p>}
            {error && <p>{error}</p>}
        </div>
    )
}