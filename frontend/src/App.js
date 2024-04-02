import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import CreateTableForm from './components/CreateTableForm';
import Forms from './components/Forms';
import Header from './components/Header';

function App() {
  return (
    <BrowserRouter>
    <Header />
      <Switch>
        <Route path='/create-form' exact component={CreateTableForm} />
        <Route path='/Forms' exact component={Forms} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
