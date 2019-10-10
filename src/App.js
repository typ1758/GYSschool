import React, { Component } from 'react';
import {HashRouter as Router } from 'react-router-dom'
import RouterView from './router/Router'
import Nav from './containers/nav/Nav'
import 'antd-mobile/dist/antd-mobile.css';
import './App.css';
import 'antd/dist/antd.css';

class App extends Component {
  render() {
    return (
        <div>
            <Router>
                <div className={'content'}>
                    <Nav></Nav>
                    <RouterView ></RouterView>
                </div>
            </Router>
        </div>

    );
  }
}

export default App;
