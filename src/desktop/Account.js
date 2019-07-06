import React from "react";

import "./css/Account.css";

class Account extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            handlePageChange: this.props.handlePageChange,
            activePage: "home",
        }
    }

    componentWillMount() {
        this.state.handlePageChange(window.location.pathname);
    }

    handleStateChange = event => {
        let { name, value } = event.target;
        this.setState({
            [name]: value,
        });
    }

    render() {
        let arr = [];
        for (let i = 0; i < 10; i++) {
            arr.push(
                <div key={i} className="past-result">
                    <img className="past-result-image" src="https://i2.wp.com/josephmallozzi.com/wp-content/uploads/2018/01/159.jpg?ssl=1" alt="comic-cover">

                    </img>
                    <h2 className="past-result-title">
                        ResultTitle
                            </h2>
                    <h3 className="past-result-year">
                        (****-****)
                            </h3>
                </div>
            )
        }
        return (
            <div className="account-content">
                <section className="side-panel">
                    <button className={"account-nav-btn" + (this.state.activePage === "home" ? " active-account-nav" : "")} onClick={this.handleStateChange} name="activePage" value={"home"}>
                        Home
                    </button>
                    <button className={"account-nav-btn" + (this.state.activePage === "settings" ? " active-account-nav" : "")} onClick={this.handleStateChange} name="activePage" value={"settings"}>
                        Settings
                    </button>
                </section>
                {console.log(this.state.activePage)}
                {this.state.activePage === "home" ?
                    <div className="home-content">
                        <h2 className="home-title">Like History</h2>
                        <div className="history-contents">
                            {arr.map(item => (
                                item
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