import React from "react";

import "./css/Background.css";

class Background extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            handlePageChange: this.props.handlePageChange,
            handleStateChange: this.props.handleStateChange,
        }
    }

    componentWillMount() {
        this.state.handlePageChange(window.location.pathname);
    }

    render() {
        return (
            <div>

            </div>
        );
    }
}

export default Background;