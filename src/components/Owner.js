import React, { useState, useEffect } from 'react';
import {web3Service} from '../services/web3.service';
import { toastError, toastSuccess } from '../utils/HandleResponse';
import ListAdministrator from './administrators/ListAdministrator';

export default function Owner(props) {

    const [ownerAddress, setOwnerAddress] = useState('');
    const [adminAddress, setAdminAddress] = useState('');
    const setOwner = props.setOwner;
    const setLoading = props.setLoading;
    
    useEffect(() => {
        async function init() {
          await web3Service.initContract();
        }
        init();
    }, []);
  
    async function addAdmin(e) {
      e.preventDefault();
      console.log('try adding new administrator', adminAddress);
      try {
        setLoading(true);
        web3Service.isBlockchainAddress(adminAddress);
        await web3Service.addAdmin(adminAddress);
        setAdminAddress('');
      } catch(err) {
        console.error(err);
        toastError(err);
      }
      finally{
        setLoading(false);
      }
    }
  
    async function transferOwnership(e){
      e.preventDefault();
      console.log('try transfering ownership to', ownerAddress);
      try{
        setLoading(true);
        web3Service.isBlockchainAddress(ownerAddress);
        await web3Service.transferOwnership(ownerAddress);
        setOwner(false);
        setOwnerAddress('')
        toastSuccess('Ownership successfully transfered to '+ ownerAddress);
      } catch(err) {
        console.error(err);
        toastError(err);
      }
      finally{
        setLoading(false);
      }
    }

    return (
        <div>
        <hr/>
      <div className='row my-4 py-4'>
        <div className='col-lg-8'>
        <h2 className='display-6'>Administrators</h2>
        <div className='row'>
        <div className='col-lg-4'>
        <form onSubmit={addAdmin}>
					<div className="form-group">
						<label htmlFor="name">Add new admin : </label>
						<input
							type="text"
							className="form-control mt-4"
							id="address"
              value={adminAddress}
              onChange={(e) => setAdminAddress(e.target.value)}
							required
              placeholder='address of the new administrator...'
              minLength={2}
							name="address"
						/>
					</div>
          <br/>
					<button type="submit" className="btn btn-success">
						Add new administrator
					</button>
				</form>
        </div>
        <div className='col-lg-8 mt-4 mt-lg-0'>
        <ListAdministrator setLoading={setLoading}/>
        </div>
        </div>
        </div>
        <div className='col-lg-3 mt-3 mt-lg-0'>
        <h2 className='display-6'>Owner</h2>
        <form onSubmit={transferOwnership}>
					<div className="form-group">
						<label htmlFor="name">Transfer ownership : </label>
						<input
							type="text"
							className="form-control mt-4"
							id="newOwner"
              value={ownerAddress}
              onChange={(e) => setOwnerAddress(e.target.value)}
							required
              placeholder='address of the new owner...'
              minLength={2}
							name="newOwner"
						/>
					</div>
          <br/>
					<button type="submit" className="btn btn-success">
						Transfer ownership
					</button>
				</form>
      </div>
      </div>
      </div>
    )
}