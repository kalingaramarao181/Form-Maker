import React from 'react'
import './index.css'
import { Link } from 'react-router-dom'
import { SlSocialLinkedin } from "react-icons/sl";
import { SlSocialFacebook } from "react-icons/sl";
import { SlSocialInstagram } from "react-icons/sl";
import { TiSocialTwitter } from "react-icons/ti";

const FormsDemo = () => {

  return (
    <>
      <div className='form-feature-icon-container'>
        <div className='form-features'>
          <p>Features</p>
          <p>Templates</p>
          <p>Customers</p>
          <p>Pricing</p>
          <p>Integrations</p>
          <p>Help</p>
        </div>
      </div>
      <div className='containerform'>
        <div className='form-content'>
          <h1 className='form-main-heading'> Online <span className='form-span'>FORMS</span> builder  & that completes your workflows</h1>
          <p className='form-main-para'>Create forms, collect form submissions, and automate workflows with powerful integrations. Experience the best free form builder. Totally free & no coding is required.we meticulously craft diverse form designs and elements tailored for various sectors, including education, employee management, sports, and more. Each category receives specialized attention, ensuring intuitive and efficient user experiences across the board."

          </p>
          <Link to="client-form">
            <button className='form-button' >+ Create a free Form</button>
          </Link>
        </div>
        <div>
          <img className='form-main-image' src='images\form-builder-home-hero-en.webp' alt='formmainimage' />
        </div>
      </div>
      <div className='form-2-container'>
        <h1 className='form-heading-2page'>Create beautiful forms, surveys, and quizzes that will bring more responses.</h1>
      </div>
      <div className='containerform'>
        <div className='form-content'>
          <h1 className='form-main-heading'> Building forms made easy</h1>
          <p className='form-main-para'>"Create stunning web forms effortlessly with forms.app's intuitive online form creator. Say goodbye to tedious hours spent crafting contact forms and registration pages. Whether it's for your landing page or business, streamline your form creation process. With forms.app, design and deploy custom online order forms in minutes. Enjoy a seamless form-building experience without the hassle. Elevate your web presence with visually appealing forms tailored to your needs. Simplify data collection and interaction with our user-friendly form builder. Experience efficiency like never before with forms.app's comprehensive form-building solution.</p>
        </div>
        <div>
          <img className='form-main-image' style={{ width: "45vw" }} src='https://laraform.io/images/hero.png' alt='formmainimage' />
        </div>
      </div>
      <div className='containerform2'>
        <div className='form-content1' >
          <h1 className='form-main-heading' style={{ marginTop: "0px" }}> Share your forms anywhere</h1>
          <p className='form-main-para'>Easily distribute your forms by sharing their unique weblinks or seamlessly embedding them into your landing pages. With forms.app, reaching your audience has never been simpler. Take control of your form's visibility by adjusting privacy settings to target specific demographics and restrict access. Safeguard your data and ensure confidentiality by preventing unauthorized viewing of your forms. Whether it's for collecting customer feedback or gathering essential information, forms.app empowers you to tailor your forms to your audience's needs. Maximize engagement and minimize barriers by making your forms accessible wherever your audience is. Experience the flexibility and convenience of forms.app's versatile form-sharing capabilities.</p>
        </div>
        <div className='forn-content-2'>
          <img className='form-main-image' style={{ width: "45vw" }} src='https://www.fillhq.com/wp-content/uploads/2022/08/Untitled-design-2-768x597.png' alt='formmainimage' />
        </div>
      </div>
      <footer >
        <div className='footer' >
          <div>
            <p className='fotter-containt'>Home</p>
            <p >Features</p>
            <p >Templates</p>
            <p>Customers</p>
            <p >Pricing</p>
            <p >Integrations</p>
            <p >Help</p>
          </div>
          <div>
            <p className='fotter-containt'>AboutUs</p>
            <p >Features</p>
            <p >Templates</p>
            <p>Customers</p>
            <p >Pricing</p>
            <p >Integrations</p>
            <p >Help</p>
          </div>
          <div>
            <p className='fotter-containt'>Forms</p>
            <p >Features</p>
            <p >Templates</p>
            <p>Customers</p>
            <p >Pricing</p>
            <p >Integrations</p>
            <p >Help</p>
          </div>
          <div>
            <p className='fotter-containt'>Client information</p>
            <p >Features</p>
            <p >Templates</p>
            <p>Customers</p>
            <p >Pricing</p>
            <p >Integrations</p>
            <p >Help</p>
          </div>
          <div>
            <p className='fotter-containt'>Social Media</p>
            <div className='all-footer-icons'>
              <SlSocialLinkedin className='fotter-containt-icons-linkedin' />
              <SlSocialFacebook className='fotter-containt-icons-facebook' />
              <SlSocialInstagram className='fotter-containt-icons-insta' />
              <TiSocialTwitter className='fotter-containt-icons-twitter' />
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default FormsDemo