import "./index.css"
import { Link, withRouter } from "react-router-dom/cjs/react-router-dom.min"

const Header = () => {
    return (
        <div className='nav'>
            <Link to="/" className='nav-Home-logo' >
                <img className="app-logo" src="\images\RecoF-2 (1).png" alt="logo" />
            </Link>
            <Link to="Forms" className='nav-Home'>Forms</Link>
            <Link to="create-form" className='nav-Home'>Create Form</Link>
            <Link to="forms-data" className='nav-Home'>Forms Data</Link>
            <Link to="login" className='nav-Home'>Admin</Link>
        </div>
    )
}

export default withRouter(Header)