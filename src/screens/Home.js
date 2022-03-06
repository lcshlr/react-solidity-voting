import React, { useState, useEffect } from 'react';
import ListCandidates from '../components/candidate/ListCandidates';
import { web3Service } from '../services/web3.service';

export default function Home() {

    const [alreadyVoted, setAlreadyVoted] = useState(false);

    useEffect(() => {
      async function init() {
        await web3Service.initContract();
        setAlreadyVoted(await web3Service.alreadyVoted());
      }
      init();
    }, []);
    
    return (
      <div className="container mt-4">
        <ListCandidates alreadyVoted={alreadyVoted} setVote={setAlreadyVoted} isHome={true}/>
        { alreadyVoted && <div className="alert alert-info mt-4 col-lg-4" role="alert">
           <p className="lead">You already have voted</p>
        </div>
        }
      </div>
    )
}