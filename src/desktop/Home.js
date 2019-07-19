import React from "react";
import {Link} from 'react-router-dom'


import "./css/Home.css";

class Home extends React.Component {
    constructor(props){
        super(props);
        this.state ={
            currentPage: this.props.page,
            query: this.props.query,
            handleStateChange: this.props.handleStateChange,
            currentLoc: window.location.pathname,

        }
    
    }
    componenetWillReceiveProps(){
        this.setState({currentLoc: window.location.pathname});
    }
    handleSearchClick = () => {
        this.setState({currentLoc: "/results"});
    }
    handleTitleClick = () => {
        this.setState({currentLoc: "/"});
    }
    handleAccountClick = () => {
        this.setState({currentLoc: "/account"});
    }

    render(){
        return(
             <div className={this.state.currentLoc === "/" ? "Center-Head" : "Top-Head"}>
                <Link to= "/" onClick={this.handleTitleClick}><h1 className={this.state.currentLoc === "/" ? "Head-Title" : "Top-Head-Title"}>Comic Scape</h1></Link>
                <h3 className={this.state.currentLoc === "/" ? "Head-Desc" : "Top-Head-Desc"}>Search for your next favorite comic!</h3>
                <Link to="/account" className={this.state.currentLoc ==="/" ? "To-Account" : "Other-To-Account"} onClick={this.handleAccountClick}><img src="/Default-Profile.png" className="Account-Image" alt="Profile Icon"/></Link>
                <div className={this.state.currentLoc ==="/" ? "Head-Form" : "Top-Head-Form"}>
                    <div className="Publisher-Label">Publisher:</div>
                    <select className="Publisher-Select" name="publisher" onchange={this.state.handleStateChange}>
                        Publisher:
                        <option value="Marvel">
                            Marvel
                        </option>
                        <option value="DC comics">
                            DC Comics
                        </option>   
                    </select>
                    
                    <input
                        className="Header-Input"
                        name="queryKey"
                        onChange={this.state.handleStateChange}
                        type="text"
                        placeholder="hero name"
                    />
                <Link className="Search-Container" to="/results"><button className="Search-Bttn" onClick={this.handleSearchClick}>Search</button></Link>
                </div>
            </div>
        );
    }
}

export default Home;