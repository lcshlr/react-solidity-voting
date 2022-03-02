import React, { useState, useEffect } from 'react';
import { Route, Link, BrowserRouter, Routes, Navigate   } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-toastify/dist/ReactToastify.css';
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

  function listenEvents() {
    window.ethereum.on("accountsChanged", async([newAddress]) => {
      setAccount(newAddress);
      setIsAdmin(await web3Service.isAdmin());
    });

    web3Service.contract.on("ChangeSessionStatus", (_, newStatus) => {
      setSession(newStatus);
    });
  }

  useEffect(() => {
    async function init(){
      try{
        await web3Service.initContract();
        listenEvents();
        setIsAdmin(await web3Service.isAdmin());
        setSession(await web3Service.getSession());
        setAccount(await web3Service.getAccountSelected());
      } 
      catch(err) {
        toastError("Error : " + err);
      }
    }
    init();
  }, []);


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
                    <Routes>
                        <Route  path="/" element={<Home />} />
                        <Route  path="/manage" element={isAdmin ? <Manage session={session}/> : <Navigate to='/'/> } />
                    </Routes>
            </div>
          </div>
          <ToastContainer />
          </BrowserRouter>
    );
}

export default App;
