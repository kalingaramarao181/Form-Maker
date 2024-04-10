import React from 'react'
import './index.css'
import { FaFileSignature } from "react-icons/fa";

const AboutUs = () => {
  return (
    <>
      <div className='about-feature-container'>
        <div className='about-feature-icon-container'>
          <FaFileSignature className='about-iconfile' />
          <div className='about-features'>
            <p>Features</p>
            <p>Templates</p>
            <p>Customers</p>
            <p>Pricing</p>
            <p>Integrations</p>
            <p>Help</p>
          </div>
        </div>
        <div className='about-header-content'>
          <h1 className='about-head-text'>Online Form Maker</h1>
          <p className='about-head-paragraph'>A Form Maker is a unique and user-friendly tool designed to create, customize, and manage various types of forms. Create custom forms easily with our online form maker - the perfect tool for all your business needs.</p>
          <button className='about-button-top'>TRY - NOW</button>
        </div>
      </div>
      <div className="containerabout">
        <div className="about-content">
          <h1 className="about-main-heading">
            {" "}
            Build forms effortlessly with our formMaker
          </h1>
          <p className="about-main-para">
            Create forms with ease using our form creator software that's designed to accommodate users with no coding experience. Add and personalize form fields according to your individual needs. Generate custom reports to view and analyze all your form submissions.
          </p>
          <input
            type="text"
            placeholder="Enter Your Email"
            className="about-input"
          />
          <button className="about-button"> submit</button>
        </div>
        <div>
          <img
            className="about-image"
            src="https://makeforms.io/wp-content/uploads/2023/03/contact-Form-maker-builder-makeforms.png"
            alt="homemainimage"
          />
        </div>
      </div>
      <div className="containeraboutbelow">
        <div className="about-content2">
          <h1 className="about-main-heading">
            {" "}
            Generate forms with multiple pages Save your progress and resume later with our form generator!
          </h1>
          <p className="about-main-para">
            Give your respondents the freedom with our forms creator to save partially filled forms and complete them at their convenience. Ensure that no data is lost, so form filling is an easy task instead of a tiresome one.
            Simplify complex form by sectioning them out as multiple pages. Structure forms in our online form builder software to contain relevant fields or questions on each page, and ensure that respondents are directed to pages with questions that pertain to them.
          </p>
          <button className="about-button" style={{ color: "white" }}> View More</button>
        </div>
        <div className='about-swap-last'>
          <iframe title="About Us Video" src='https://beedatatech.com/01_Important_Documents/YouCut_20240405_014633663.mp4' className='videotag' ></iframe>
        </div>
      </div>
      <div className="containerabout">
        <div className="about-content">
          <h1 className="about-main-heading">
            {" "}
            Online form builder with free templates
          </h1>
          <p className="about-main-para">
            Our pre-designed templates are convenient, and time-saving. They eliminate the need to design forms from scratch, and allow quick customization using themes. This saves time, effort, and resources, enabling efficient form creation for all your business needs.
            Give your respondents the freedom with our forms creator to save partially filled forms and complete them at their convenience. Ensure that no data is lost, so form filling is an easy task instead of a tiresome one.
          </p>
        </div>
        <div>
          <img
            className="about-image"
            src="https://www.powrcdn.com/tutorial_pages_new_design/apps/formBuilder.png"
            alt="homemainimage"
          />
        </div>
      </div>

    </>
  );
}

export default AboutUs