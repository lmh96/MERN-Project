import React from "react";

import "./css/Account.css";

class Account extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            handlePageChange: this.props.handlePageChange,
            comics: [],
            activePage: "home",
        }
    }

    componentWillMount() {
        if(localStorage.getItem('currentUser') === "" || localStorage.getItem('currentUser') === null) {
            window.location = "/";
        }
        let cmx = JSON.parse(localStorage.getItem('currentUserComics')).comics;
        if (localStorage.getItem('currentUserComics') === "" || localStorage.getItem('currentUserComics') === null) {

        }
        else {
            if (Array.isArray(cmx)) {
                this.setState({
                    comics: cmx,
                });
            }
            else {
                let hasChildren = false;
                for(let propName in cmx) {
                    if(cmx.hasOwnProperty(propName)) {
                        hasChildren = true;
                    }
                }

                if(hasChildren) {
                    this.setState({
                        comics: cmx.comics,
                    })
                }
                else {
                    this.setState({
                        comics: [],
                    })
                }
            }

        }
        this.state.handlePageChange(window.location.pathname);
    }

    handleStateChange = event => {
        let { name, value } = event.target;
        this.setState({
            [name]: value,
        });
    }

    render() {
        return (
            <div className="account-content">
                {/*
                <section className="side-panel">
                    <button className={"account-nav-btn" + (this.state.activePage === "home" ? " active-account-nav" : "")} onClick={this.handleStateChange} name="activePage" value={"home"}>
                        Home
                    </button>
                    <button className={"account-nav-btn" + (this.state.activePage === "settings" ? " active-account-nav" : "")} onClick={this.handleStateChange} name="activePage" value={"settings"}>
                        Settings
                    </button>
                </section>
                */}
                {this.state.activePage === "home" ?
                    <div className="home-content">
                        <h2 className="home-title">Like History:</h2>
                        <div className="history-contents">
                            {this.state.comics.map(comic => (
                                <div key={comic.title} className="past-result">
                                    <img className="past-result-image" src={comic.imageURL} value={comic.volumeCall} alt="comic-cover">

                                    </img>
                                    <h2 className="past-result-title">
                                        {comic.title}
                                    </h2>
                                </div>
                            ))}
                        </div>
                    </div>
                    :
                    <div className="settings-content">
                        <form class="account-settings-form">
                            <img className="account-settings-user-image" src="https://www.loginradius.com/wp-content/plugins/all-in-one-seo-pack/images/default-user-image.png" alt="user" />
                            <h3 className="account-settings-select-image">Select user image</h3>

                            <h3 className="account-settings-label"> Change Name: </h3>
                            <input className="account-settings-input"></input>

                            <h3 className="account-settings-label">Change Email: </h3>
                            <input className="account-settings-input"></input>

                            <h3 className="account-settings-label">New Password: </h3>
                            <input className="account-settings-input"></input>

                            <h3 className="account-settings-label">Confirm Password: </h3>
                            <input className="account-settings-input"></input>

                            <button className="account-settings-save-btn">Save</button>
                        </form>
                    </div>
                }
            </div>
        );
    }
}

export default Account;