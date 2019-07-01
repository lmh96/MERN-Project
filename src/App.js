import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import './App.css';

import DesktopHome from './desktop/Home';
import DesktopResults from './desktop/Results';
import DesktopAccount from './desktop/Account';

//branchT

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight,
      isMobile: false,
    }
  }

  componentWillMount() {
    window.addEventListener('resize', this.handleWindowSizeChange);
    if (this.state.width < 600) {
      this.setState({
        isMobile: true,
      })
    }
    else {
      this.setState({
        isMobile: false,
      })
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowSizeChange);
  }

  handleWindowSizeChange = () => {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
    })
  }

  handleStateChange = event => {
    event.preventDefault();
    const { name, value } = event.target;

    this.setState({
      [name]: value,
    });
  }

  render() {
    return (
      <Router>
        <div className="App">
          <Route exact path="/" render={() => (
            <DesktopHome></DesktopHome>
          )} />
          <Route exact path="/results" render={() => (
            <DesktopResults></DesktopResults>
          )} />
          <Route exact path="/account" render={() => (
            <DesktopAccount></DesktopAccount>
          )} />
        </div>
      </Router>
    );
  }
}

export default App;
