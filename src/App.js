import React, { useState, useEffect } from 'react';
import { Route, Link, BrowserRouter, Routes, Navigate   } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Manage from './components/Manage';
import Home from './components/Home';
import {web3Service} from './services/web3.service';
import { toast, ToastContainer } from 'react-toastify';


function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [account, setAccount] = useState();

  useEffect(() => {
    async function init(){
      try{
        await web3Service.initContract();
        setIsAdmin(await web3Service.isAdmin())
        setAccount(await web3Service.getAccountSelected());
      } 
      catch(err) {
        toast.error('Error : cannot get the conctract', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          });
        console.error(err);
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
                {isAdmin ? <li className="nav-item">
                  <Link to={"/manage"} className="nav-link">
                    Manage
                  </Link>
                </li> : <div></div>}
              </div>
            </nav>

            <div className="container mt-3">
                    <h1>Voting system</h1>
                    <p>Account selected : {account ?? 'N/A'}</p>
                    <hr></hr>
                    <Routes>
                        <Route  path="/" element={<Home />} />
                        <Route  path="/manage" element={isAdmin ? <Manage/> : <Navigate to='/'/> } />
                    </Routes>
            </div>
          </div>
          <ToastContainer />
          </BrowserRouter>
    );
}

export default App;
