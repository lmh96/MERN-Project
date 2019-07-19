import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import './App.css';

import DesktopHome from './desktop/Home';
import DesktopResults from './desktop/Results';
import DesktopAccount from './desktop/Account';
import DesktopBackground from './desktop/Background';

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
  handlePageChange = value => {
    this.setState({page: value});
  }

  render() {
    return (
      <Router>

        <link href="https://fonts.googleapis.com/css?family=Luckiest+Guy|Roboto+Slab&display=swap" rel="stylesheet"></link>
         <div className="App">
         <Route exact path="/" render={(props) => <DesktopBackground {...props} handleStateChange={this.handleStateChange} handlePageChange={this.handlePageChange}/>} />
         <DesktopHome query={this.state.queryKey} page={this.state.page} handleStateChange={this.handleStateChange} handleFormSubmit={this.handleFormSubmit}></DesktopHome>
         <Route exact path="/results" render={(props) => <DesktopBackground {...props} handleStateChange={this.handleStateChange} handlePageChange={this.handlePageChange}/>} />
         <Route exact path="/results" render={(props) => <DesktopResults {...props} query={this.state.queryKey} handlePageChange={this.handlePageChange}></DesktopResults>} />
         <Route exact path="/account" render={(props) => <DesktopBackground {...props} handleStateChange={this.handleStateChange} handlePageChange={this.handlePageChange}/>} />
         <Route exact path="/account" render={(props) => <DesktopAccount {...props} handlePageChange={this.handlePageChange}></DesktopAccount>} />
        </div>
      </Router>
    );
  }
}

export default App;
