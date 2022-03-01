import React, { useState, useEffect } from 'react';
import {web3Service} from '../services/web3.service';
import { toastError, toastSuccess } from '../utils/HandleResponse';
import ListCandidates from './candidate/ListCandidates';

export default function Admin() {

    const [name, setName] = useState('');
    const [session, setSession] = useState(false);

    useEffect(() => {
        async function init() {
          await web3Service.initContract();
          setSession(await web3Service.getSession());
        }
        init();
    }, []);
  
    async function changeSessionStatus(status){
        try {
          await web3Service.setSession(status);
          const statusTxt = session ? "closed" : "opened";
          toastSuccess(`Session ${statusTxt} successfully`);
          setSession(!session);
        } catch(err) {
          toastError(err);
        }
      }

    async function addCandidate(e){
      console.log('try adding candidate', name);
      e.preventDefault();
      try{
        await web3Service.addCandidate(name);
        toastSuccess(name + ' added as candidate sucessfully');
        setName('');
      } catch(err) {
        console.error(err);
        toastError(err);
      }
    }

    return (
        <div className='my-4 py-4 row'>
        <div className='col-8'>
        <h2 className='display-6'>Candidates</h2>
        <div className='row'>
        <div className='col-4'>
        <form onSubmit={addCandidate}>
					<div className="form-group">
						<label htmlFor="name">Add new candidate : </label>
						<input
							type="text"
							className="form-control mt-4"
							id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
							required
              placeholder='candidate name...'
              minLength={2}
							name="name"
						/>
					</div>
          <br/>
					<button type="submit" className="btn btn-success">
						Add candidate
					</button>
				</form>
        </div>
        <div className='col-8'>
        <ListCandidates isManage="true"/>
        </div>
        </div>
      </div>
      <div className='col-4'>
        <h2 className='display-6'>Voting session</h2>
        { session ? <div>
        <button className='btn mt-2 btn-warning' onClick={() => changeSessionStatus(false)}>Finish session</button>
        </div>
        :
        <div>
        <button className='btn mt-2 btn-primary' onClick={() => changeSessionStatus(true)}>Start session</button> 
        </div>
        }
      </div>
      </div>
    )
}