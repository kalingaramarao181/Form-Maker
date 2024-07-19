import "./index.css"
import { Link, withRouter } from "react-router-dom/cjs/react-router-dom.min"
import { useState } from "react";
import Cookies from "js-cookie"

const Header = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const lock = Cookies.get("adminToken")

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const onClickLogout = () => {
        Cookies.remove("adminToken")
        props.history.replace("/")
    }

    return (
        <>
            <div className='nav'>
                <Link to="/" className='nav-Home-logo' >
                    <img className="app-logo" src="\images\RecoF-2 (1).png" alt="logo" />
                </Link>
                <Link to="/forms-demo" className='nav-Home'>Forms</Link>
                <Link to="/create-form" className='nav-Home'>Create Form</Link>
                <Link to="/about" className='nav-Home'>About Us</Link>
                <Link to="/pricing" className='nav-Home'>Pricing</Link>

                <button  onClick={toggleSidebar} to="login" className='home-login-button'>Admin</button>
            </div>
            <>
                <div onClick={toggleSidebar} className={`sidebar ${isOpen ? 'open' : ''}`}>
                    <div className="home-sidebar-container">
                        <div className="home-sidebar-top-container">
                        {lock ?
                        <><span className="home-sidebar-span">Already you are loged in</span>
                         <button onClick={onClickLogout} className="home-sidebar-login-button">Logout</button><span className="home-sidebar-span"> / </span>   
                         <Link to="/login">
                            <button className="home-sidebar-login-button">Admin</button>
                        </Link>
                         </>:<>
                            <span className="home-sidebar-span">Already have an account? </span>
                            <Link to="/login">
                                <button className="home-sidebar-login-button">Login</button>
                            </Link>
                            </>
                            
                        }
                        </div>
                        <div className="home-sidebar-bottom-container" >
                            <p className="home-sidebar-descreption">Get better data with conversational forms, surveys, quizzes & more.</p>
                            <Link to="/client-form">
                                <button className="home-sidebar-signup-button">Signup</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </>
        </>
    )
}

export default withRouter(Header)