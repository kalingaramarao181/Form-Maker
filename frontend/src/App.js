import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Forms from './components/Forms';
import Header from './components/Header';
import Form from './components/Form';
import FormsData from './components/FormsData';
import SurveyFormData from './components/FormResponses';
import LoginForm from './components/LoginForm';
import Home from './components/Home';
import ProtectedRoute from './components/ProtectedRoute';
import ClientForm from "./components/ClientForm"
import CandidateForms from './components/CandidateForms';
import Purchage from './components/Purchage';
import Admin from './components/Admin';
import AboutUs from './components/About';
import FormsDemo from './components/FormsDemo';
import Secure from './components/Secure';
import Pricing from './components/Pricing';
import CreateQuestion from './components/CreateQuestion';
import Response from './components/Response';
function App() {
  return (
    <BrowserRouter>
    <Header />
      <Switch>
        <Route path='/' exact component={Home} />
        <ProtectedRoute path='/create-form' exact component={CreateQuestion} />
        <Route path='/response/:formid/:responseid' exact component={Response} />
        <Route path='/Forms' exact component={Forms} />
        <Route path="/form/:formid" exact component={Form} />
        <Secure path="/forms-data" exact component={FormsData} />
        <Route path="/form-responses" exact component={SurveyFormData} />
        <Route path="/login" exact component={LoginForm} />
        <Route path="/client-form" exact component={ClientForm} />
        <Route path="/candidate-forms" exact component={CandidateForms} />
        <Route path="/candidate-purchage" exact component={Purchage} />
        <Secure path="/admin" exact component={Admin} />
        <Route path="/about" exact component={AboutUs} />
        <Route path="/forms-demo" exact component={FormsDemo} />
        <Route path="/pricing" exact component={Pricing} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
