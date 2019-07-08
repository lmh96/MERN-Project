import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import LoadingSpinner from './LoadingSpinner';

import "./css/Results.css";

class Results extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            handleStateChange: this.props.handleStateChange,
            handlePageChange: this.props.handlePageChange,
            key: this.props.query,
            isLoading: true,
            fullresult: null,
            title: "Comic Title: ####-####",
            issuesCount: 100,
            people: ["Bob", "Mark", "Wade"],
            description: null,
            firstCoverLink: "http://cdn.shopify.com/s/files/1/1556/9595/products/asm4partmocktrade_1200x1200.jpg?v=1545239497",
            validationNumber: null,
            pastResults: ["Comics", "Can Go", "Here I Guess"],
            pastStates: [],
        }
    }

    handleLikeClick = () => {
        // console.log("like");
        this.setState({
            isLoading: true,
        })

        let res = this.state.pastResults;
        let states = this.state.pastStates;
        res.push(this.state.title);
        states.push(this.state);
        this.setState({
            pastResults: res,
            pastStates: states,
        })

        this.search();
    }

    handleDislikeClick = () => {
        // console.log("dislike"); 
        this.setState({
            isLoading: true,
        })

        let res = this.state.pastResults;
        let states = this.state.pastStates;
        res.push(this.state.title);
        states.push(this.state);
        this.setState({
            pastResults: res,
            pastStates: states,
        })

        this.search();
    }

    componentWillMount() {
        this.state.handlePageChange(window.location.pathname);
        this.search();
    }

    search() {
        this.state.handlePageChange(window.location.pathname);
        // console.log(this.state.key);
        fetch("/api/hero/" + this.state.key).then(res => res.json()).then((result) => {
            // console.log(result);
            if (this.state.validationNumber === null) {
                this.setState({
                    validationNumber: result.validationNumber,
                })
            }
            else {
                if (this.state.validationNumber === result.validationNumber) {
                    this.search();
                }
                else {
                    this.setState({
                        validationNumber: result.validationNumber
                    })
                }
            }

            if (result.firstdata.cover_date === null || result.lastdata.cover_date === null) {
                this.setState({
                    title: result.volumedata.name,
                    issuesCount: result.volumedata.count_of_issues,
                    description: (result.volumedata.description),
                    firstCoverLink: result.firstdata.image.original_url,
                    fullresult: result,
                })
            }
            else {
                let firstYear = parseInt(result.firstdata.cover_date.substring(0, 4));
                let lastYear = parseInt(result.lastdata.cover_date.substring(0, 4));

                if (firstYear === lastYear) {
                    this.setState({
                        title: result.volumedata.name + ": " + firstYear,
                        issuesCount: result.volumedata.count_of_issues,
                        description: (result.volumedata.description),
                        firstCoverLink: result.firstdata.image.original_url,
                        fullresult: result,
                    })
                }
                else {
                    this.setState({
                        title: result.volumedata.name + ": " + firstYear + " - " + lastYear,
                        issuesCount: result.volumedata.count_of_issues,
                        description: (result.volumedata.description),
                        firstCoverLink: result.firstdata.image.original_url,
                        fullresult: result,
                    })
                }

            }

            this.setState({
                isLoading: false,
            })
        })

    }

    render() {
        return (
            <div>
                <div className={this.state.isLoading ? "results-content results-blur" : "results-content"}>
                    <section className="results-history">
                        <h2 className="history-title">past results</h2>
                        {this.state.pastResults.map(pastResult => (
                            <h4 key={pastResult} className="history-result">{pastResult}</h4>
                        ))}
                    </section>
                    <section className="results-right-panel">

                    </section>
                    <div className="current-result">
                        <div className="current-cover-div">
                            <img className="current-cover" src={this.state.firstCoverLink} alt="cover" />
                        </div>
                        <h2 className="current-title">{this.state.title}</h2>
                        <h4 className="current-run-length">{this.state.issuesCount} issues</h4>

                        <div className="current-people-of-interest-div">
                            <h4 className="current-people-of-interest-title">Interesting People</h4>
                            {this.state.people.map(person => (
                                <h5 key={person} className="current-person-of-interest">{person}</h5>
                            ))}
                        </div>

                        <h4 className="current-description-label">Description: </h4>
                        {/* <p className="current-description">enter stuff here</p> */}
                        <div className="current-description-container" dangerouslySetInnerHTML={{ __html: this.state.description }}></div>

                        <div className="current-selection-div">
                            <button className="like-btn" onClick={this.handleLikeClick}><FontAwesomeIcon icon={faThumbsUp} /></button>
                            <button className="dislike-btn" onClick={this.handleDislikeClick}><FontAwesomeIcon icon={faThumbsDown} /></button>
                        </div>
                    </div>
                </div>

                {this.state.isLoading ? <LoadingSpinner /> : null}
            </div>
        );
    }

}

export default Results;