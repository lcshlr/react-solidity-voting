import { useEffect, useState } from "react";
import { web3Service } from "../../services/web3.service";
import { toastError } from "../../utils/HandleResponse";
import Vote from "../Vote";
import RemoveCandidate from "./RemoveCandidate";

export default function ListCandidates(props){

    const [candidates, setCandidates] = useState([]);

    async function init() {
      try{
        await web3Service.initContract();
        setCandidates(await web3Service.getAllCandidates());
      } catch(err) {
        toastError('Unable to fetch candidates');
      }
    }

    useEffect(() => {
      init();
    });

    if(candidates.length === 0){
      return <p>No candidate registered</p>;
    }

    return (
        <div>
        <p>List of candidates : </p>
        <div className="row justify-content-left">
            <div className="col-lg-10">
              <table className='table table-sm'>
              <thead className='thead-dark'>
                <tr>
                  <th scope="col">Id</th>
                  <th scope="col">Name</th>
                  { (props.isManage || props.isHome) && <th></th> }
                </tr>
              </thead>
              <tbody>
                {
                candidates.map((candidate, index) => (
                  <tr key={index}>
                    <th scope='row'>{index}</th>
                    <th>{candidate}</th>
                    {props.isManage && <th><RemoveCandidate id={index} /></th>}
                    {props.isHome && !props.alreadyVoted && <th><Vote id={index} setVote={props.setVote}/></th>}
                    </tr>
                    ) 
                )}
              </tbody>
              </table>
              </div>
              </div>
        </div>
    );
}