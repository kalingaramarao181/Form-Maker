import "./index.css"
import { Link } from "react-router-dom/cjs/react-router-dom.min"

const Header = () => {
    return (
        <div className='nav'>
            <Link to="/" className='nav-Home-logo' >Logo</Link>
            <Link to="/" className='nav-Home' >Home</Link>
            <Link to="/Forms" className='nav-Home'>Forms</Link>
            <Link to="/create-form" className='nav-Home'>CreateForm</Link>
            <Link to="/ClientLogin" className='nav-Home'>ClientLogin</Link>
            <Link to="/Admin" className='nav-Home'>Admin</Link>
        </div>
    )
}

export default Header