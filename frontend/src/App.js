import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import CreateTableForm from './components/CreateTableForm';
import Forms from './components/Forms';
import Header from './components/Header';
import Form from './components/Form';

function App() {
  return (
    <BrowserRouter>
    <Header />
      <Switch>
        <Route path='/create-form' exact component={CreateTableForm} />
        <Route path='/Forms' exact component={Forms} />
        <Route path="/survey-form" exact component={Form} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
