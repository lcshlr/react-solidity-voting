import React, { useState, useEffect } from 'react';
import {web3Service} from '../services/web3.service';
import Admin from '../components/Admin';
import Owner from '../components/Owner';


export default function Manage(props) {
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
        <Admin session={props.session}/>
      { owner &&
        <Owner setOwner={setOwner}/>
      }
      </div>
    );
}