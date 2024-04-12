import React, { useState } from 'react'
import { withRouter } from 'react-router-dom/cjs/react-router-dom.min'
import './index.css'
const Home = (props) => {

    const [email, setEmail] = useState("")

    const onClickSubmit = () => {
        localStorage.setItem("clientEmail", email)
        props.history.push("/")
    }

    return (
        <div className='containerhome'>
            <div className='home-content'>
                <h1 className='home-main-heading'> STREAMLINED <span className='home-span'>FORMS</span> & ELEMENTS FOR DIVERSE CATEGORIES</h1>
                <p className='home-main-para'>we meticulously craft diverse form designs and elements tailored for various sectors, including education, employee management, sports, and more. Each category receives specialized attention, ensuring intuitive and efficient user experiences across the board."</p>
                <input onChange={(e) => setEmail(e.target.value)} type='text' placeholder='Enter Your Email' className='home-input' required/>
                <button onClick={onClickSubmit} className='home-button'> submit</button>
            </div>
            <div>
                <img className='main-image' src='https://www.zohowebstatic.com/sites/default/files/workdrive/workdrve-mockup--1-.png' alt='homemainimage' />
            </div>
        </div>
    )
}

export default withRouter(Home)