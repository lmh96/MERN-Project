import React from "react";
import {Link} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';


import "./css/Home.css";

class Home extends React.Component {
    constructor(props){
        super(props);
        this.state ={
            currentPage: this.props.page,
            query: this.props.query,
            handleStateChange: this.props.handleStateChange,
            currentLoc: window.location.pathname,
            iHaveLoginWorking: this.props.iHaveLoginWorking,
        }
    
    }
    
    componentWillReceiveProps(){
        console.log("recieved");
        this.setState({currentLoc: window.location.pathname}, () => {
            console.log("current: " + this.state.currentLoc);
        });
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
                {this.state.iHaveLoginWorking ? <Link to="/account" className={this.state.currentLoc ==="/" ? "To-Account" : "Other-To-Account"} onClick={this.handleAccountClick}><img src="/Default-Profile.png" className="Account-Image" alt="Profile Icon"/></Link> : null }
                <div className={this.state.currentLoc ==="/" ? "Head-Form" : "Top-Head-Form"}>
                    {/* <div className="Publisher-Label">Publisher:</div> */}
                    <select className="Publisher-Select" name="publisher" onChange={this.state.handleStateChange}>
                        Publisher:
                        <option value="Marvel">
                            Marvel
                        </option>
                        <option value="DC Comics">
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
                <Link className="Search-Container" to="/results"><button className="Search-Bttn" onClick={this.handleSearchClick}><FontAwesomeIcon icon={faSearch} /></button></Link>
                </div>
            </div>
        );
    }
}

export default Home;