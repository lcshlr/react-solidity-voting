import React, { useEffect } from 'react';
import { useStateIfMounted } from 'use-state-if-mounted';
import ListCandidates from '../components/candidate/ListCandidates';
import { web3Service } from '../services/web3.service';

export default function Home(props) {

    const [alreadyVoted, setAlreadyVoted] = useStateIfMounted(false);

    useEffect(() => {
      async function init() {
        try{
          await web3Service.initContract();
          setAlreadyVoted(await web3Service.alreadyVoted());
        } catch{
          
        }
      }
      init();
    });
  
  if(props.session){
    return (
      <div className='container mt-4'>
        <ListCandidates session={props.session} alreadyVoted={alreadyVoted} setVote={setAlreadyVoted} isHome={true}/>
        { alreadyVoted && <div className="alert alert-info mt-4 col-lg-4" role="alert">
          <p className="lead">You have already voted</p>
        </div>
        }
      </div>
    );
  }
  return(
    <div className='container mt-4'>
      <ListCandidates session={false} isHome={true}/>
    </div>
  );
}