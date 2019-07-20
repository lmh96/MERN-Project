import React from "react";
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';


import "./css/Home.css";

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            toResults: false,
            currentPage: this.props.page,
            query: this.props.query,
            handleStateChange: this.props.handleStateChange,
            currentLoc: window.location.pathname,
            iHaveLoginWorking: this.props.iHaveLoginWorking,
            isLoggedIn: this.props.isLoggedIn,
            handleLogin: this.props.handleLogin,
            isSignup: false,
            showForm: false,
            user: "",
            pass: "",
        }
    }

    componentWillReceiveProps() {
        if (localStorage.getItem('currentUser') === "" || localStorage.getItem('currentUser') === null) {

        }
        else {
            this.setState({
                isLoggedIn: true,
            })
        }
        this.setState({ currentLoc: window.location.pathname });
    }

    handleSearchClick = () => {
        window.location = "/results";
        this.setState({ currentLoc: "/results" });
    }
    handleTitleClick = () => {
        this.setState({ currentLoc: "/" });
    }
    handleAccountClick = () => {
        this.setState({ currentLoc: "/account" });
    }

    openLoginForm = () => {
        this.setState({
            showForm: true,
        });
    }

    closeLoginForm = () => {
        this.setState({
            showForm: false,
        });
    }

    loginClick = () => {
        if (this.state.user.trim() === "") {
            alert("You must enter a username to log in!");
        }
        else if (this.state.pass.trim() === "") {
            alert("You must enter a password to log in!");
        }
        else
            fetch("/api/signin/" + this.state.user + "/" + this.state.pass).then(res => res.json()).then((result) => {
                if (result.error === null || typeof (result.error) === 'undefined') {
                    this.setState({
                        isLoggedIn: true,
                    })
                    this.state.handleLogin(result._id, result.comics, result.tokentime)
                }
                else {
                    alert(result.error);
                }
            });
    }

    signupClick = () => {
        fetch("/api/signup/" + this.state.user + "/" + this.state.pass).then(res => res.json()).then((result) => {
            if (result.error === null || typeof (result.error) === 'undefined') {
                this.setState({
                    isLoggedIn: true,
                })
                this.state.handleLogin(result._id, result.comics, result.tokentime)
            }
            else {
                alert(result.error);
            }
        });
    }

    handleSwitchClick = () => {
        let it = !this.state.isSignup;
        this.setState({
            isSignup: it,
        })
    }

    handleLoginChange = event => {
        event.preventDefault();
        const { name, value } = event.target;
        this.setState({
            [name]: value,
        }, () => {
        });
    }

    handleKeyDown = event => {
        if(event.key === 'Enter') {
            //this.handleSearchClick();
        }
    }

    render() {
        return (
            <div className={this.state.currentLoc === "/" ? "Center-Head" : "Top-Head"}>
                <Link to="/" onClick={this.handleTitleClick}><h1 className={this.state.currentLoc === "/" ? "Head-Title" : "Top-Head-Title"}>Comic Scape</h1></Link>
                <h3 className={this.state.currentLoc === "/" ? "Head-Desc" : "Top-Head-Desc"}>Search for your next favorite comic!</h3>

                {this.state.iHaveLoginWorking ?
                    this.state.isLoggedIn ?
                        <Link to="/account" className={this.state.currentLoc === "/" ? "To-Account" : "Other-To-Account"} onClick={this.handleAccountClick}><img src="/Default-Profile.png" className="Account-Image" alt="Profile Icon" /></Link>
                        :
                        <button className={this.state.currentLoc === "/" ? "To-Account" : "Other-To-Account"} onClick={this.state.showForm ? this.closeLoginForm : this.openLoginForm} style={this.state.showForm ? { boxShadow: "none" } : null}>
                            <img src="/Default-Profile.png" className="Account-Image" alt="Profile Icon" onClick={this.openLoginForm} style={this.state.showForm ? { boxShadow: "none" } : null} />
                        </button>
                    :
                    null
                }

                {this.state.isLoggedIn ?
                    null
                    :
                    <div className={this.state.showForm ? "login-form-div" : "login-form-div hidden-div"}>
                        <button className="login-switcher-btn" onClick={this.handleSwitchClick}>
                            {this.state.isSignup ?
                                "need to log in?"
                                :
                                "need to sign up?"
                            }
                        </button>

                        <label>Username:</label>
                        <input className="username-input" name="user" onChange={this.handleLoginChange}>

                        </input>

                        <label>Password:</label>
                        <input className="password-input" name="pass" onChange={this.handleLoginChange} type="password">

                        </input>

                        <button className={this.state.isSignup ? "login-btn hidden-btn" : "login-btn"} onClick={this.loginClick}>
                            Login
                        </button>

                        <button className={this.state.isSignup ? "signup-btn" : "signup-btn hidden-btn"} onClick={this.signupClick}>
                            Sign Up
                        </button>
                    </div>
                }

                <div className={this.state.currentLoc === "/" ? "Head-Form" : "Top-Head-Form"}>
                    {/* <div className="Publisher-Label">Publisher:</div> */}
                    <select className="Publisher-Select" name="publisher" onChange={this.state.handleStateChange}>
                        Publisher:
                        <option value="Marvel" className="Publisher-Option">
                            Marvel
                        </option>
                        <option value="DC Comics" className="Publisher-Option">
                            DC
                        </option>
                    </select>

                    <input
                        className="Header-Input"
                        name="queryKey"
                        onChange={this.state.handleStateChange}
                        onKeyDown={this.handleKeyDown}
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