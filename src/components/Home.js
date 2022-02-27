import { useState, useEffect} from 'react';
import {web3Service} from '../services/web3.service';

export default function Home() {
    const [candidates, setCandidates] = useState([]);

    useEffect(() => {
        async function init() {
          await web3Service.initContract();
          setCandidates(await web3Service.getAllCandidates());
        }
        init();
    }, []);
    return (
      <div>
        <p>List of candidates : </p>
        {candidates.map((candidate, index) => <li key={index}>Id : {index} - Nom : {candidate}</li>)}<br/>
      </div>
    )
}