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
      iHaveLoginWorking: true,
      isLoggedIn: true,
      isMobile: false,
      publisher: "Marvel",
      queryKey: "flash",
      page: window.location.pathname,
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
    console.log("old: " + this.state.page);
    this.setState({page: value}, () => {
      console.log("new: " + this.state.page);
    });
  }

  render() {
    return (
      <Router>
        <div className="App">
          <DesktopHome query={this.state.queryKey} isLoggedIn={this.state.isLoggedIn} iHaveLoginWorking={this.state.iHaveLoginWorking} page={this.state.page} handleStateChange={this.handleStateChange} handleFormSubmit={this.handleFormSubmit}></DesktopHome>
          {/* <Route exact path="/" render={(props) => <DesktopBackground {...props} handleStateChange={this.handleStateChange} handlePageChange={this.handlePageChange}/>} /> */}
          <Route exact path="/results" render={(props) => <DesktopResults {...props} publisher={this.state.publisher} query={this.state.queryKey} handlePageChange={this.handlePageChange}></DesktopResults>} />
          {/* {this.state.iHaveLoginWorking ? <Route exact path="/account" render={(props) => <DesktopAccount {...props} handlePageChange={this.handlePageChange}></DesktopAccount>} /> : null} */}

        <link href="https://fonts.googleapis.com/css?family=Luckiest+Guy|Roboto+Slab&display=swap" rel="stylesheet"></link>
         <Route exact path="/" render={(props) => <DesktopBackground {...props} handleStateChange={this.handleStateChange} handlePageChange={this.handlePageChange}/>} />
         <DesktopHome query={this.state.queryKey} page={this.state.page} handleStateChange={this.handleStateChange} handleFormSubmit={this.handleFormSubmit} iHaveLoginWorking={this.state.iHaveLoginWorking}></DesktopHome>
         <Route exact path="/results" render={(props) => <DesktopBackground {...props} handleStateChange={this.handleStateChange} handlePageChange={this.handlePageChange}/>} />
         {/* <Route exact path="/results" render={(props) => <DesktopResults {...props} query={this.state.queryKey} handlePageChange={this.handlePageChange}></DesktopResults>} /> */}
         {this.state.iHaveLoginWorking ? <Route exact path="/account" render={(props) => <DesktopBackground {...props} handleStateChange={this.handleStateChange} handlePageChange={this.handlePageChange}/>} /> : null }
         {this.state.iHaveLoginWorking ? <Route exact path="/account" render={(props) => <DesktopAccount {...props} handlePageChange={this.handlePageChange}></DesktopAccount>} /> : null }
        </div>
      </Router>
    );
  }
}

export default App;
