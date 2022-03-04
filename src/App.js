import React, { useState, useEffect } from 'react';
import { Route, Link, BrowserRouter, Routes, Navigate   } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-toastify/dist/ReactToastify.css';
import './styles/style.css';
import Manage from './screens/Manage';
import Home from './screens/Home';
import Header from './components/Header';
import {web3Service} from './services/web3.service';
import { ToastContainer } from 'react-toastify';
import { toastError } from './utils/HandleResponse';


function App() {
  
  const [account, setAccount] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [session, setSession] = useState(false);
  const [isConnectMetaMask, setIsConnectMetaMask] = useState(true);
  const [loading, setLoading] = useState(false);

  function listenEvents() {
    window.ethereum.on("accountsChanged", async([newAddress]) => {
      setAccount(newAddress);
      setIsAdmin(await web3Service.isAdmin());
    });

    web3Service.contract.on("ChangeSessionStatus", (_, newStatus) => {
      setSession(newStatus);
    });
  }

  async function init(){
    try{
      setLoading(true);
      console.log('Try to initialize contract :', process.env.REACT_APP_CONTRACT_ADDRESS);
      await web3Service.initContract();
      listenEvents();
      setIsAdmin(await web3Service.isAdmin());
      setAccount(await web3Service.getAccountSelected());
      setSession(await web3Service.getSession());
      setIsConnectMetaMask(true);
    } 
    catch(err) {
      if(err.toString().includes("unknown account")){
        setIsConnectMetaMask(false);
      }
      else{
        console.log(err);
        toastError("Error : " + err);
      }
    }
    finally{
      setLoading(false);
    }
  }

  async function connectMetaMask() {
    try{
      setLoading(true);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      init();
    } finally{
      setLoading(false)
    }
  }

  useEffect(() => {
      init();
  },[]); // eslint-disable-line react-hooks/exhaustive-deps


    return (
          <BrowserRouter>
          <div>
            <nav className="navbar navbar-expand navbar-dark bg-dark">
              <div className="navbar-nav mr-auto">
                <li className='nav-item'>
                  <Link to={"/"} className="nav-link">Home</Link>
                </li>
                { isAdmin ? <li className="nav-item">
                  <Link to={"/manage"} className="nav-link">
                    Manage
                  </Link>
                </li> : <div></div>}
              </div>
            </nav>
            <div className="container-fluid mt-3 px-3">
                      <Header session={session} account={account}/>
                      <hr/>
                      { loading ? 
                          <div className='d-flex flex-column justify-content-center align-items-center mt-4 pt-4'>
                          <div className="loader">Loading...</div>
                          <p className='leading'>Loading while waiting transaction be accepted....</p>
                        </div>
                        :
                        !isConnectMetaMask ? 
                              <div className="mt-4 row justify-content-center">
                              <button onClick={connectMetaMask} className='col-lg-2 btn btn-primary btn-lg'>Connect to Metamask</button>
                          </div> :
                      <Routes>
                          <Route  path="/" element={<Home />} />
                          <Route  path="/manage" element={isAdmin ? <Manage setLoading={setLoading} session={session}/> : <Navigate to='/'/> } />
                      </Routes>
                    }
              </div>
          </div>
          <ToastContainer />
          </BrowserRouter>
    );
}

export default App;
