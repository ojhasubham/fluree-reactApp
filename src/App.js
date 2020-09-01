import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Switch, Route, useHistory, useLocation, Router, Redirect } from "react-router-dom";
import history from './history';
import Login from "./component/login";
import SignUp from "./component/signUp";
import Dashboard from "./component/dashboard";

function App() {
  return (
    <div className="App">
      <Router history={history}>
           <Switch>
          <Route path="/dashboard">
            <Dashboard />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/signUp">
            <SignUp register />
          </Route>
          <Redirect to='/login' />
        </Switch>
        </Router>
    </div>
  );
}

export default App;
