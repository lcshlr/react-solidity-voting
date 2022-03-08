import React, { useEffect } from 'react';
import { Route, Link, BrowserRouter, Routes, Navigate   } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-toastify/dist/ReactToastify.css';
import './styles/style.css';
import Manage from './screens/Manage';
import Home from './screens/Home';
import Header from './components/Header';
import {web3Service} from './services/web3.service';
import { ToastContainer } from 'react-toastify';
import { getHandledError, toastError } from './utils/HandleResponse';
import { useStateIfMounted } from 'use-state-if-mounted';


function App() {
  
  const [account, setAccount] = useStateIfMounted('');
  const [isAdmin, setIsAdmin] = useStateIfMounted(false);
  const [session, setSession] = useStateIfMounted(true);
  const [isConnectMetaMask, setIsConnectMetaMask] = useStateIfMounted(true);
  const [loading, setLoading] = useStateIfMounted(false);

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
      else if(err.message && err.message.includes("Metamask")){
        toastError(getHandledError(err))
      }
      else{
        toastError("Error : connection to contract failed. Please ensure you are on the good network and the contract exists");
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
                          <p className='leading'>Loading...</p>
                        </div>
                        :
                        !isConnectMetaMask ? 
                              <div className="mt-4 row justify-content-center">
                              <button onClick={connectMetaMask} className='col-lg-2 btn btn-primary btn-lg'>Connect to Metamask</button>
                          </div> :
                      <Routes>
                          <Route  path="/" element={<Home session={session}/>} />
                          <Route  path="/manage" element={isAdmin ? <Manage session={session}/> : <Navigate to='/'/> } />
                      </Routes>
                    }
              </div>
          </div>
          <ToastContainer />
          </BrowserRouter>
    );
}

export default App;
