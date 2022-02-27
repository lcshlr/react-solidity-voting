import React, { useState, useEffect } from 'react';
import {web3Service} from '../services/web3.service';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Manage() {
  const [name, setName] = useState('');
  const idToRemove = React.createRef();

  useEffect(() => {
      web3Service.initContract();
  }, []);

  function addCandidate(e){
    console.log('try adding candidate', name);
    web3Service.addCandidate(name);
    setName('');
    e.preventDefault();
  }

  async function removeCandidate(e) {
    console.log('try removing candidate with id ', idToRemove);
    e.preventDefault();
    try{
      await web3Service.removeCandidate(idToRemove.current.value);
    } 
    catch (err) {
      toast.error('Error occured : ' + err.data.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
    }
  }

  web3Service.contract.once('AddCandidate', (id, name, transactionInfo) => {
    const hash = transactionInfo.blockHash;
    if(localStorage.getItem('lastBlock') === hash) return;
    localStorage.setItem('lastBlock', hash);
    toast.success(name + ' added as candidate sucessfully', {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      });
  });

    return (
      <div className='mt-4'>
        <h2>Candidates</h2>
        <div className='row'>
        <div className='col-6'>
        <form onSubmit={addCandidate}>
					<div className="form-group">
						<label htmlFor="name">Add new candidate : </label>
						<input
							type="text"
							className="form-control"
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
        <div className='col-6'>
        <form onSubmit={removeCandidate}>
          <div className="form-group">
						<label htmlFor="name">Remove candidate : </label>
            <input type='number' step={1} className="form-control" ref={idToRemove} placeholder='candidate id' required />
            <br/>
            <button type='submit' className='btn btn-danger'>
                Remove candidate
            </button>
          </div>
        </form>
        </div>
        </div>
      </div>
    );
}
