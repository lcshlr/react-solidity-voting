import React, { useState, useEffect } from 'react';
import {web3Service} from '../services/web3.service';
import Admin from '../components/Admin';
import Owner from '../components/Owner';


export default function Manage() {
  const [owner, setOwner] = useState('');

  useEffect(() => {
      async function init() {
        await web3Service.initContract();
        setOwner(await web3Service.isOwner());
      }
      init();
  }, []);

    return (
      <div>
        <Admin/>
      { owner &&
        <Owner owner={owner}/>
      }
      </div>
    );
}
