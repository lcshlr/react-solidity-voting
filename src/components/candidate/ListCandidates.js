import { useEffect } from "react";
import { useStateIfMounted } from "use-state-if-mounted";
import { web3Service } from "../../services/web3.service";
import { toastError } from "../../utils/HandleResponse";
import Vote from "../Vote";
import Winner from "../Winner";
import RemoveCandidate from "./RemoveCandidate";

export default function ListCandidates(props){

    const [candidates, setCandidates] = useStateIfMounted([]);
    const session = props.session;

    async function init() {
      try{
        await web3Service.initContract();
        if(await web3Service.getCandidateCount() === 0){
          return;
        }

        if(props.isHome && !session){
          setCandidates(await web3Service.getResults());
        }
        else {
          setCandidates(await web3Service.getAllCandidates());
        }
      } catch(err) {
        console.error(err);
        toastError('Unable to fetch candidates');
      }
    }

    useEffect(() => {
      init();
    });

    if(candidates.length === 0){
      return <p>No candidate registered</p>;
    }

    function thirdColRendering(index, candidate){
      if(props.isManage) {
        return <th><RemoveCandidate id={index} /></th>;
      }
      if(props.isHome) {
        if(!session){
          return <th>{candidate?.voteCount?.toString()}</th>;
        }
        if(!props.alreadyVoted){
          return <th><Vote id={index} setVote={props.setVote}/></th>;
        }
      }
    }

    return (
        <div>
        <p class="display-6">{props.isHome && !session ? 'Results of candidates' : 'List of candidates' }:</p>
        <div className="row justify-content-left">
            <div className="col-lg-8">
              <table className='table table-sm'>
              <thead className='thead-dark'>
                <tr>
                  <th scope="col">Id</th>
                  <th scope="col">Name</th>
                  { (props.isManage || props.isHome) && <th>{!session && "Vote count" }</th> }
                </tr>
              </thead>
              <tbody>
                {
                candidates.map((candidate, index) => (
                  <tr key={index}>
                    <th scope='row'>{index}</th>
                    <th>{candidate?.name ? candidate.name : candidate}</th>
                    {thirdColRendering(index, candidate)}
                    </tr>
                    ) 
                )}
              </tbody>
              </table>
              </div>
              </div>
              {props.isHome && props.session === false && 
                <Winner session={props.session} candidates={candidates}/>
              }
        </div>
    );
}