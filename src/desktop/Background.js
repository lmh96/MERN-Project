import React from "react";

import "./css/Background.css";

class Background extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            handlePageChange: this.props.handlePageChange,
            handleStateChange: this.props.handleStateChange,
            currentLoc: window.location.pathname,
        }
    }

    componentWillMount() {
        this.state.handlePageChange(window.location.pathname);
    }

    render() {
        return (
            <div>
                <div className={this.state.currentLoc === "/" ? "Background" : "Background-Other"}></div>
                <div className="Background-Gradient"></div>
            </div>
        );
    }
}

export default Background;
