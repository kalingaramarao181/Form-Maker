import { useState } from "react"
import Forms from "../Forms"
import "./index.css"
import FormsData from "../FormsData"
import CreateTableForm from "../CreateTableForm"
import ClientData from "../ClientData"
import { TiSocialLinkedin } from "react-icons/ti";
import { TiSocialTwitter } from "react-icons/ti";
import { SlSocialInstagram } from "react-icons/sl";
import { SlSocialFacebook } from "react-icons/sl";
import { SlSocialGoogle } from "react-icons/sl";


const Admin = () => {
    const [sidebarButtonStatus, setSidebarButtonStatus] = useState("Admin")

    const renderContent = () => {
        if (sidebarButtonStatus === "Forms"){
            return <Forms />
        }else if(sidebarButtonStatus === "FormsData"){
            return <FormsData />
        }else if(sidebarButtonStatus === "CreateForm"){
            return <CreateTableForm />
        }else if(sidebarButtonStatus === "ClintData"){
            return <ClientData />
        }else if(sidebarButtonStatus === "Admin"){
            return <h1 className="admin">Admin</h1>
        }
    }
    return (
        <div className="page-container">
        <div className="page-body">
        <div className="admin-sidebar">
            <div>
                <h1>Admin</h1>
                <button onClick={() => setSidebarButtonStatus("Forms")} className="admin-sidebar-button">Forms</button>
                <button onClick={() => setSidebarButtonStatus("FormsData")} className="admin-sidebar-button">Forms Data</button>
                <button onClick={() => setSidebarButtonStatus("CreateForm")} className="admin-sidebar-button">Create Form</button>
                <button onClick={() => setSidebarButtonStatus("ClintData")} className="admin-sidebar-button">Candites</button>
            </div>
            <button className="">Logout</button>
        </div>
        <div className="content">
            {renderContent()}
        </div>
      </div>
      <div className="page-footer">
        <p className="contact-us">Contact Us</p>
        <div>
            <SlSocialFacebook className="social-icon"/>
            <SlSocialInstagram className="social-icon"/>
            <TiSocialTwitter className="social-icon"/>
            <TiSocialLinkedin className="social-icon"/>
            <SlSocialGoogle className="social-icon"/>
        </div>
      </div>
      </div>
    )
}

export default Admin