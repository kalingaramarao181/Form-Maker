import React, { useState } from 'react';
import './index.css';

// Sample pricing data
const pricingData = [
  {
    id: 1,
    name: 'Basic',
    price: '$10',
    features: ['Feature 1', 'Feature 2', 'Feature 3'],
  },
  {
    id: 2,
    name: 'Standard',
    price: '$20',
    features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4'],
  },
  {
    id: 3,
    name: 'Premium',
    price: '$30',
    features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4', 'Feature 5'],
  },
];

const Prising = () => {
  const [selectedPlan, setSelectedPlan] = useState(pricingData[0]);

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
  };

  return (
    <div className="App">
      <h1>Choose Your Plan</h1>
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
          </div>
        ))}
      </div>
      <div className="selected-plan-details">
        <h2>Selected Plan: {selectedPlan.name}</h2>
        <p>Price: {selectedPlan.price}</p>
        <p>Features:</p>
        <ul>
          {selectedPlan.features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Prising;
