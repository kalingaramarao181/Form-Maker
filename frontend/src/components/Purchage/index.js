import "./index.css"
import { Link } from "react-router-dom/cjs/react-router-dom.min"

const Purchage = () => {
    return <div className="purchage-container">
        <h1 className="purchage-heading">No Longer Valid</h1>
        <p className="purchage-descreption">Your access was denied if you want to more click below button to Purchage</p>
        <Link to="client-form"><button className="purchage-buy-button">Buy Now</button></Link>
    </div>
}

export default Purchage