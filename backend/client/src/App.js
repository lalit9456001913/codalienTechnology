import Login from './Login.js';
import Home from './Home.js';
import otpPage from './otpPage.js'
import Button from 'react-bootstrap/Button';
import { Redirect, BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import React from 'react';
import Userdata from './userData.js';
import AdminPanel from './adminPanel.js';

const routes = [
 
  {
    path: "/",
    exact:true,
    component: Home
  },
  {
    path: '/loginPage',
    component: Login
  },
  {
    path:'/adminLogin',
    component:Login
  },
  {
    path:'/userdata',
    component: Userdata
  },
  {
    path:'/admin',
    component:AdminPanel
  },
  {
    path: '*',
    render: () => <Redirect to="/" />
  }
];
export default class App extends React.Component {
  constructor(props){
    super(props)
    }
 
render(){
  return (
      <div >
         <Router>
          <Switch>
            {routes.map((route, index) => (
            <Route key={index} {...route} />
            )
            )}
          </Switch>
        </Router>
      </div>
      );
  }
}
 
