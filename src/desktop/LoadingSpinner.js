import React from "react";

import "./css/LoadingSpinner.css";

function LoadingSpinner(props) {
    return (
        <div className="lds-overlay">
            <div className="lds-ring">
                <div>
                </div>
                <div>
                </div>
                <div>
                </div>
                <div>
                </div>
            </div>
        </div>
    );
}

export default LoadingSpinner;