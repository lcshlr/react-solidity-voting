import { useEffect, useState } from "react";
import { web3Service } from "../../services/web3.service";
import { toastError } from "../../utils/HandleResponse";

export default function ListAdministrator(props){

    const [administrators, setAdministrators] = useState([]);
    const setLoading = props.setLoading;

    async function init() {
      await web3Service.initContract();
      setAdministrators(await web3Service.getAllAdmins());
    }

    async function removeAdministrator(administratorAddress) {
      try{
        setLoading(true);
        await web3Service.removeAdmin(administratorAddress);
      } catch(err) {
          toastError(err);
      }
      finally{
        setLoading(false);
      }
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