import './App.scss';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Login from './Login';
import Logout from './Logout';
import Content from './Content';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <Login />
          </Route>
          <Route path="/logout">
            <Logout />
          </Route>
          <Route path="/content">
            <Content />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
