import { useEffect, useState } from "react";
import { web3Service } from "../../services/web3.service";
import { toastPromise } from "../../utils/HandlePromiseTransaction";

export default function ListAdministrator(){

    const [administrators, setAdministrators] = useState([]);

    async function init() {
      await web3Service.initContract();
      setAdministrators(await web3Service.getAllAdmins());
    }

    async function removeAdministrator(administratorAddress) {
      toastPromise(web3Service.removeAdmin(administratorAddress), 'Removing admin awaiting validation', 'Admin removed successfully');
    }

    useEffect(() => {
      init();
    });

    if(administrators.length === 0){
      return <p>No administrator registered</p>;
    }

    return (
        <div>
        <p>List of administrators : </p>
        <div className="row justify-content-left">
            <div className="col-10">
              <ul className="list">
              { administrators.map((administrator) => <li style={{cursor: "pointer"}} className="text-break" onClick={() => removeAdministrator(administrator)} key={administrator}>{administrator}</li>) }
              </ul>
              </div>
              </div>
        </div>
    );
}