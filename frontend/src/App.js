import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import CreateTableForm from './components/CreateTableForm';
import Forms from './components/Forms';
import Header from './components/Header';
import Form from './components/Form';
import FormsData from './components/FormsData';
import SurveyFormData from './components/SurveyFormData';
import SwapCards from './components/SwapCards';
import LoginForm from './components/LoginForm';
import Home from './components/Home';
import ProtectedRoute from './components/ProtectedRoute';
import ClientForm from "./components/ClientForm"
import CandidateForms from './components/CandidateForms';
import Purchage from './components/Purchage';
function App() {
  return (
    <BrowserRouter>
    <Header />
      <Switch>
        <Route path='/' exact component={Home} />
        <ProtectedRoute path='/create-form' exact component={CreateTableForm} />
        <Route path='/Forms' exact component={Forms} />
        <Route path="/survey-form" exact component={Form} />
        <ProtectedRoute path="/forms-data" exact component={FormsData} />
        <Route path="/survey-form-data" exact component={SurveyFormData} />
        <Route path="/swap-cards" exact component={SwapCards} />
        <Route path="/login" exact component={LoginForm} />
        <Route path="/client-form" exact component={ClientForm} />
        <Route path="/candidate-forms" exact component={CandidateForms} />
        <Route path="/candidate-purchage" exact component={Purchage} />

      </Switch>
    </BrowserRouter>
  );
}

export default App;
