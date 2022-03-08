export default function Header(props) {
    return (
        <div className="row">
        <div className='col-lg-10'>
          <h1 className='display-4'>Voting system</h1>
          <p className='lead text-break'>Account selected : {props.account ?? 'N/A'}</p>
          <p>Contract address : {process.env.REACT_APP_CONTRACT_ADDRESS ?? 'N/A'}</p>
          {process.env.REACT_APP_CONTRACT_ADDRESS && <p>Deployed on network : {process.env.REACT_APP_NETWORK ?? 'localhost'}</p>}
        </div>
        <div className='col-lg-2'>
        {props.session ? <div className="alert alert-success" role="alert">
          <p className="lead">Voting session opened </p>
        </div> :
        <div className="alert alert-danger" role="alert">
          <p className="lead">Voting session closed </p>
        </div>
        }
        </div>
    </div>
    )
}