import React, { useEffect } from 'react';
import { useStateIfMounted } from 'use-state-if-mounted';
import {web3Service} from '../services/web3.service';
import {toastPromise} from '../utils/HandlePromiseTransaction';
import { toastError } from '../utils/HandleResponse';
import ListCandidates from './candidate/ListCandidates';

export default function Admin(props) {

    const [name, setName] = useStateIfMounted('');
    const [session, setSession] = useStateIfMounted(false);

    async function init() {
      await web3Service.initContract();
      setSession(await web3Service.getSession());
    }

    useEffect(() => {
        init();
    });
  
    function changeSessionStatus(status){
      const statusTxt = session ? "closed" : "opened";
      toastPromise(
        web3Service.setSession(status),
        'Set session awaiting validation',
        `Session ${statusTxt} successfully`)
        .then(() => setSession(!session))
        .catch((err) => toastError(err));
      }

    function addCandidate(e){
      console.log('try adding candidate', name);
      e.preventDefault();
      toastPromise(
        web3Service.addCandidate(name),
        'Adding candidate awaiting validation',
        name + ' added as candidate sucessfully'
      )
      .then(() => setName(''))
      .catch((err) => toastError(err));
    }

    return (
        <div className='my-4 py-4 row'>
        <div className='col-lg-8'>
        <h2 className='display-6'>Candidates</h2>
        <div className='row'>
        <div className='col-lg-4'>
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
        <div className='col-lg-8 mt-4 mt-lg-0'>
        <ListCandidates isManage={true}/>
        </div>
        </div>
      </div>
      <div className='col-lg-4 mt-4 mt-lg-0'>
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