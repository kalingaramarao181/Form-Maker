import React, { useState, useEffect } from 'react';
import './index.css';
import upiqr from "upiqr";
import { Link } from 'react-router-dom/cjs/react-router-dom';



// Sample pricing data
const pricingData = [
  {
    id: 1,
    name: 'Free',
    price: '$0',
    features: ['Access 3 Times  ', '-Creating Table', ' '],
    backgroundColor: 'rgb(46, 105, 255)',
    link:"client-form"

  },
  {
    id: 2,
    name: 'Standard',
    price: '$20',
    features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4'],
    backgroundColor: '#ff6100',
    link:"candidate-purchage"

  },
  {
    id: 3,
    name: 'Premium',
    price: '$30',
    features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4', 'Feature 5'],
    backgroundColor: '#892dca',
    link:"candidate-purchage"
  },
];

const Pricing = () => {

  const [selectedPlan, setSelectedPlan] = useState(pricingData[0]);
  const [qrScan, setQrScan] = useState()

  const onClickPurchage = (price) => {
    upiqr({
      payeeVPA: "ramaraok8281@ybl",
      payeeName: "Bharat Sahu",
      amount: 1000
    })
    .then((upi) => {
      console.log(upi.qr);      // data:image/png;base64,eR0lGODP...
      setQrScan(toString(upi.intent));  // upi://pay?pa=bhar4t@upi&pn=Bharat..
    })
    .catch(err => {
      console.log(err);
    });
  }

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
  };

  return (
    <div className="pricing-app">
      <h1 className='Pricing-heading'>Choose Your Plan</h1>
      <div className="pricing-container">
        {pricingData.map((plan) => (
          <div key={plan.id} className={`plan ${selectedPlan.id === plan.id ? 'selected' : ''}`} onClick={() => handlePlanSelect(plan)}>
            <h2>{plan.name}</h2>
            <p className="price">{plan.price}</p>
            <ul className="features">
              {plan.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            <button style={{ backgroundColor: plan.backgroundColor }} className='pricing-button-select'>Get Started</button>
          </div>
        ))}
      </div>
      <div>
        <div>
        </div>
        <div className="selected-plan-details">
          <div className='pricing-paragraph'>
            <h2 >Selected Plan: {selectedPlan.name}</h2>
            <p>Price: {selectedPlan.price}</p>
            <p>Features:</p>
            <ul className='features'>
              {selectedPlan.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            <Link to={selectedPlan.link}>
              <button onClick={() => onClickPurchage(selectedPlan.price)} className='pricing-button-select-buying'>BUY NOW</button>
            </Link>
            {qrScan && <a href={qrScan}>Go</a>}
          </div>
            <img src='https://proofeasy.io/wp-content/uploads/2021/04/planpricing.png' alt='pricing-img' />
        </div>
      </div>
    </div>
  );
};

export default Pricing;
