import React from "react";
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUserCircle } from '@fortawesome/free-solid-svg-icons';

import "./css/Home.css";

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: this.props.isLoggedIn,
            iHaveLoginWorking: this.props.iHaveLoginWorking,
            currentPage: this.props.page,
            query: this.props.query,
            handleStateChange: this.props.handleStateChange,
            currentLoc: window.location.pathname,
        }
    }

    componentWillReceiveProps() {
        this.setState({ currentLoc: window.location.pathname });
    }

    handleSearchClick = () => {
        this.setState({ currentLoc: "/results" });
    }

    handleTitleClick = () => {
        this.setState({ currentLoc: "/" });
    }

    render() {
        return (
            <div className={this.state.currentLoc === "/" ? "header-contents-center" : "header-contents-top"}>
                <Link to="/" onClick={this.handleTitleClick}><h1 className={this.state.currentLoc === "/" ? "header-title" : "header-title-top"}>Comic Search</h1></Link>
                <h3 className={this.state.currentLoc === "/" ? "header-moto" : "header-moto-top"}>search for semi-random comics since i don't have a recommender algorithm working yet</h3>
                <div className={this.state.currentLoc === "/" ? "header-form" : "header-form-top"}>
                    <select className="header-publisher-select" name="publisher" onChange={this.state.handleStateChange}>
                        <option value="DC Comics">
                            DC
                        </option>
                        <option value="Marvel">
                            Marvel
                        </option>
                    </select>
                    <input
                        className="header-input"
                        name="queryKey"
                        onChange={this.state.handleStateChange}
                        type="text"
                        placeholder="hero name"
                    />
                    <Link className="header-btn" to="/results"><button className="header-btn" onClick={this.handleSearchClick}><FontAwesomeIcon icon={faSearch} /></button></Link>
                </div>

                {this.state.iHaveLoginWorking ? <Link to={this.state.isLoggedIn ? "/account" : this.state.currentLoc}><button className="header-contents-account-btn"><FontAwesomeIcon icon={faUserCircle} /></button></Link> : null }
            </div>
        );
    }

}

export default Home;