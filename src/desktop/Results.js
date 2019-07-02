import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { faThumbsDown } from '@fortawesome/free-solid-svg-icons';

import "./css/Results.css";

class Results extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        let arr = [];
        for (let i = 0; i < 10; i++) {
            arr.push(
                <h4 key={i} className="history-result">Title</h4>
            )
        }

        return (
            <div className="results-content">
                <section className="results-history">
                    <h2 className="history-title">past results</h2>
                    {arr.map(item => (
                        item
                    ))}
                </section>
                <div className="current-result">
                    <img className="current-cover" src="https://i2.wp.com/josephmallozzi.com/wp-content/uploads/2018/01/159.jpg?ssl=1" alt="cover" />
                    <h2 className="current-title">Title: (****-****)</h2>
                    <h4 className="current-run-length">### issues</h4>
                    <h4 className="current-writer">Run Writer</h4>
                    <h4 className="current-artist">Run Artist</h4>
                    <h4 className="current-description-label">Description: </h4>
                    <p className="current-description">enter stuff here</p>

                    <button className="dislike-btn"><FontAwesomeIcon icon={faThumbsUp}/></button>
                    <button className="like-btn"><FontAwesomeIcon icon={faThumbsDown}/></button>
                </div>
            </div>
        );
    }

}

export default Results;