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
      queryKey: "spider-man",
      page: window.location.pathname,
      currentUser: null,
      currentUserComics: [],
      currentUserToken: null,
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

    if (localStorage.getItem('currentUser') === null || localStorage.getItem('currentUser').trim() === "") {

    }
    else {
      let token = localStorage.getItem('currentUserToken');
      let comics = JSON.parse(localStorage.getItem('currentUserComics')).comics;
      let user = localStorage.getItem('currentUser');

      if (Date.now() - parseInt(token) >= (60 * 60 * 2000)) {
        localStorage.setItem('currentUser', "");
        localStorage.setItem('currentUserToken', "");
        localStorage.setItem('currentUserComics', "");

        alert("Your session has expired, please login again!");
      }
      else {
        this.setState({
          isLoggedIn: true,
          currentUser: user,
          currentUserToken: token,
          currentUserComics: comics,
        }, () => {
          console.log(this.state.isLoggedIn);
        })
      }
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
    this.setState({ page: value });
  }

  handleLogin = (user, comics, token) => {
    this.setState({
      isLoggedIn: true,
      currentUser: user,
      currentUserComics: comics,
      currentUserToken: token,
    }, () => {
      localStorage.setItem('currentUser', this.state.currentUser);
      localStorage.setItem('currentUserToken', this.state.currentUserToken);
      localStorage.setItem('currentUserComics', JSON.stringify({ comics: this.state.currentUserComics }));
    })
  }

  updateComics = (comics) => {
    this.setState({
      currentUserComics: comics,
    }, () => {
      localStorage.setItem('currentUserComics', JSON.stringify({ comics: this.state.currentUserComics }));
    });
  }

  render() {
    return (
      <Router>
        <div className="App">
          <DesktopHome query={this.state.queryKey} handleLogin={this.handleLogin} isLoggedIn={this.state.isLoggedIn} iHaveLoginWorking={this.state.iHaveLoginWorking} page={this.state.page} handleStateChange={this.handleStateChange} handleFormSubmit={this.handleFormSubmit}></DesktopHome>
          {/* <Route exact path="/" render={(props) => <DesktopBackground {...props} handleStateChange={this.handleStateChange} handlePageChange={this.handlePageChange}/>} /> */}
          <Route exact path="/results" render={(props) => <DesktopResults {...props} updateComics={this.updateComics} comics={this.state.currentUserComics} userID={this.state.currentUser} isLoggedIn={this.state.isLoggedIn} publisher={this.state.publisher} query={this.state.queryKey} handlePageChange={this.handlePageChange}></DesktopResults>} />
          {/* {this.state.iHaveLoginWorking ? <Route exact path="/account" render={(props) => <DesktopAccount {...props} handlePageChange={this.handlePageChange}></DesktopAccount>} /> : null} */}

          <link href="https://fonts.googleapis.com/css?family=Luckiest+Guy|Roboto+Slab&display=swap" rel="stylesheet"></link>
          <Route exact path="/" render={(props) => <DesktopBackground {...props} handleStateChange={this.handleStateChange} handlePageChange={this.handlePageChange} />} />
          <DesktopHome query={this.state.queryKey} page={this.state.page} handleLogin={this.handleLogin} handleStateChange={this.handleStateChange} handleFormSubmit={this.handleFormSubmit} iHaveLoginWorking={this.state.iHaveLoginWorking}></DesktopHome>
          <Route exact path="/results" render={(props) => <DesktopBackground {...props} handleStateChange={this.handleStateChange} handlePageChange={this.handlePageChange} />} />
          {/* <Route exact path="/results" render={(props) => <DesktopResults {...props} query={this.state.queryKey} handlePageChange={this.handlePageChange}></DesktopResults>} /> */}
          {this.state.iHaveLoginWorking ? <Route exact path="/account" render={(props) => <DesktopBackground {...props} handleStateChange={this.handleStateChange} handlePageChange={this.handlePageChange} />} /> : null}
          {this.state.iHaveLoginWorking ? <Route exact path="/account" render={(props) => <DesktopAccount {...props} comics={this.state.currentUserComics} handlePageChange={this.handlePageChange}></DesktopAccount>} /> : null}
        </div>
      </Router>
    );
  }
}

export default App;
