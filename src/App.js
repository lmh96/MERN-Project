import React from 'react';
import logo from './logo.svg';
import './App.css';

//branchT

class App extends React.Component {
  constructor(props) {
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
    import { name, value } from event.target; 

    this.setState({
      [name]: value,
    });
  }

  render() {
    return (
      <div className="App">

      </div>
    );
  }
}

export default App;
