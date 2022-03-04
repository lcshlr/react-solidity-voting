import React, { useState, useEffect } from 'react';
import {web3Service} from '../services/web3.service';
import { toastError, toastSuccess } from '../utils/HandleResponse';
import ListCandidates from './candidate/ListCandidates';

export default function Admin(props) {

    const [name, setName] = useState('');
    const [session, setSession] = useState(false);
    const setLoading = props.setLoading;

    useEffect(() => {
        async function init() {
          await web3Service.initContract();
          setSession(await web3Service.getSession());
        }
        init();
    }, [props.session]);
  
    async function changeSessionStatus(status){
        try {
          setLoading(true);
          await web3Service.setSession(status);
          const statusTxt = session ? "closed" : "opened";
          toastSuccess(`Session ${statusTxt} successfully`);
          setSession(!session);
        } catch(err) {
          toastError(err);
        }
        finally{
          setLoading(false);
        }
      }

    async function addCandidate(e){
      console.log('try adding candidate', name);
      e.preventDefault();
      try{
        setLoading(true);
        await web3Service.addCandidate(name);
        toastSuccess(name + ' added as candidate sucessfully');
        setName('');
      } catch(err) {
        console.error(err);
        toastError(err);
      }
      finally{
        setLoading(false)
      }
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
        <ListCandidates isManage="true"/>
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