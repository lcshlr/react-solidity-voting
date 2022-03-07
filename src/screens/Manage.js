import React, { useEffect } from 'react';
import {web3Service} from '../services/web3.service';
import Admin from '../components/Admin';
import Owner from '../components/Owner';
import { useStateIfMounted } from 'use-state-if-mounted';

export default function Manage() {
  const [owner, setOwner] = useStateIfMounted('');

  useEffect(() => {
      async function init() {
        await web3Service.initContract();
        setOwner(await web3Service.isOwner());
      }
      init();
  });

    return (
      <div>
        <Admin/>
      { owner &&
        <Owner setOwner={setOwner} />
      }
      </div>
    );
}
