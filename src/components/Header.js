export default function Header(props) {
    return (
        <div className="row">
        <div className='col-lg-10'>
          <h1 className='display-4'>Voting system</h1>
          <p className='lead'>Account selected : {props.account ?? 'N/A'}</p>
        </div>
        <div className='col-lg-2'>
        {props.session ? <div class="alert alert-success" role="alert">
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