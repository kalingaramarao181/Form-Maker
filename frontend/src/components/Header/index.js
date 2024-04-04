import "./index.css"
import { Link } from "react-router-dom/cjs/react-router-dom.min"

const Header = () => {
    return (
        <div className='nav'>
            <Link to="/" className='nav-Home-logo' >Logo</Link>
            <Link to="/" className='nav-Home' >Home</Link>
            <Link to="Forms" className='nav-Home'>Forms</Link>
            <Link to="create-form" className='nav-Home'>Create Form</Link>
            <Link to="forms-data" className='nav-Home'>Forms Data</Link>
            <Link to="Admin" className='nav-Home'>Admin</Link>
        </div>
    )
}

export default Header