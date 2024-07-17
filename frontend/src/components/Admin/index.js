import Forms from "../Forms"
import "./index.css"
import ClientData from "../ClientData"
import { TiSocialLinkedin } from "react-icons/ti";
import { TiSocialTwitter } from "react-icons/ti";
import { SlSocialInstagram } from "react-icons/sl";
import { SlSocialFacebook } from "react-icons/sl";
import { SlSocialGoogle } from "react-icons/sl";
import Cookies from 'js-cookie'
import { withRouter } from "react-router-dom/cjs/react-router-dom.min"
import CreateQuestion from "../CreateQuestion"
import Responses from "../Responses"
import FormResponses from "../FormResponses"


const Admin = (props) => {
    const sidebarButtonStatus = localStorage.getItem("sidebarButtonStatus")

    const onClickLogout = () => {
        Cookies.remove("adminToken")
        props.history.replace("/")
    }

    const setSidebarButtonStatus = (buttonStatus) => {
        localStorage.setItem("sidebarButtonStatus", buttonStatus)
        window.location.reload()
    }

    const renderContent = () => {
        if (sidebarButtonStatus === "Forms") {
            return <Forms />
        } else if (sidebarButtonStatus === "Responses") {
            return <Responses />
        }else if (sidebarButtonStatus === "FormResponses") {
            return <FormResponses />
        } else if (sidebarButtonStatus === "CreateForm") {
            return <CreateQuestion />
        } else if (sidebarButtonStatus === "ClintData") {
            return <ClientData />
        } else if (sidebarButtonStatus === "Admin") {
            return <div className="admin-cards-container">
                <h1 className="admin">Admin</h1>
                <div className='admin-full-container'>
                    <div className='Admin-card1'>
                        <h1>Form data</h1>
                        <p>View full Forms data</p>
                        <button className='admin-button-select'>Get Started</button>
                    </div>
                    <div className='Admin-card1'>
                        <h1>Create Form</h1>
                        <p>Create Your New Form</p>
                        <button className='admin-button-select'>Get Started</button>
                    </div>
                    <div className='Admin-card1'>
                        <h1>Candidates </h1>
                        <p>View All Candidates</p>
                        <button className='admin-button-select'>Get Started</button>
                    </div>
                </div>
            </div>
        }
    }
    return (
        <div className="page-container">
            <div className="page-body">
                <div className="admin-sidebar">
                    <div className="admin-buttons-container">
                    <button className="admin-image-botton"  onClick={() => setSidebarButtonStatus("Admin")} >
                        <img className="admin-image" alt="admin" src="https://www.payrollhub.in/static/images/admin.png" />
                    </button>
                    <div>
                        <button style={{backgroundColor:sidebarButtonStatus==="Forms" ? "#0E0C49": "#030131" }} onClick={() => setSidebarButtonStatus("Forms")} className="admin-sidebar-button">Forms</button>
                        <button style={{backgroundColor:sidebarButtonStatus==="Responses" ? "#0E0C49": "#030131" }} onClick={() => setSidebarButtonStatus("Responses")} className="admin-sidebar-button">Responses</button>
                        <button style={{backgroundColor:sidebarButtonStatus==="CreateForm" ? "#0E0C49": "#030131" }} onClick={() => setSidebarButtonStatus("CreateForm")} className="admin-sidebar-button">Create Form</button>
                        <button style={{backgroundColor:sidebarButtonStatus==="ClintData" ? "#0E0C49": "#030131" }} onClick={() => setSidebarButtonStatus("ClintData")} className="admin-sidebar-button">Candidates</button>
                    </div>
                    </div>
                    <button onClick={onClickLogout} className="admin-logout-button">Logout</button>
                </div>
                <div className="content">
                    {renderContent()}
                </div>
            </div>
            <div className="page-footer">
                <p className="contact-us">Contact Us</p>
                <div>
                    <SlSocialFacebook className="social-icon" />
                    <SlSocialInstagram className="social-icon" />
                    <TiSocialTwitter className="social-icon" />
                    <TiSocialLinkedin className="social-icon" />
                    <SlSocialGoogle className="social-icon" />
                </div>
            </div>
        </div>
    )
}

export default withRouter(Admin)