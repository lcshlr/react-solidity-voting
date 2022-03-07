import { useEffect } from "react";
import { useStateIfMounted } from "use-state-if-mounted";
import { web3Service } from "../../services/web3.service";
import { toastPromise } from "../../utils/HandlePromiseTransaction";
import { toastError } from "../../utils/HandleResponse";

export default function ListAdministrator(){

    const [administrators, setAdministrators] = useStateIfMounted([]);

    async function init() {
      await web3Service.initContract();
      setAdministrators(await web3Service.getAllAdmins());
    }

    async function removeAdministrator(administratorAddress) {
      toastPromise(web3Service.removeAdmin(
        administratorAddress),
        'Removing admin awaiting validation',
        'Admin removed successfully'
        ).catch((err) => toastError(err));
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
              { administrators.map((administrator) => <li style={{cursor: "pointer"}} title="Remove this administrator" className="text-break" onClick={() => removeAdministrator(administrator)} key={administrator}>{administrator}</li>) }
              </ul>
              </div>
              </div>
        </div>
    );
}