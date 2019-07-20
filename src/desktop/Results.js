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
            updateComics: this.props.updateComics,
            isLoggedIn: this.props.isLoggedIn,
            userID: this.props.userID,
            userComics: this.props.comics,
            key: this.props.query,
            publisher: this.props.publisher,
            isLoading: true,
            fullresult: null,
            title: "Comic Title: ####-####",
            issuesCount: 100,
            people: [],
            description: null,
            firstCoverLink: "http://cdn.shopify.com/s/files/1/1556/9595/products/asm4partmocktrade_1200x1200.jpg?v=1545239497",
            validationNumber: null,
            pastResults: [],
            batchnum: 0,
            returnedVolumes: [],
            currentVolume: 0,
            volumeCall: null,
        }
    }

    componentWillReceiveProps () {
        let id = this.state.userID;

        this.setState({
            userID: id,
        }, () => {
            console.log(this.state.userID);
        })
        this.forceUpdate();
    }

    handleLikeClick = () => {
        if (this.state.isLoggedIn) {
            let likedComic = {
                title: this.state.title,
                imageURL: this.state.firstCoverLink,
                volumeCall: this.state.volumeCall,
            }
            console.log(this.state.userID);
            fetch('/api/like/' + this.state.userID, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(likedComic)
            }).then(res => res.json()).then((result) => {
                console.log(result);
                this.state.updateComics(result);
            });
        }
        // console.log("like");
        this.setState({
            isLoading: true,
        })

        let res = this.state.pastResults;
        res.push(this.state.title);
        this.setState({
            pastResults: res,
        })

        this.displayCurrent();
    }

    handleDislikeClick = () => {
        // console.log("dislike"); 
        this.setState({
            isLoading: true,
        })

        // let res = this.state.pastResults;
        // let states = this.state.pastStates;
        // res.push(this.state.title);
        // states.push(this.state);
        // this.setState({
        //     pastResults: res,
        //     pastStates: states,
        // })

        this.displayCurrent();
    }

    componentWillMount() {
        this.state.handlePageChange(window.location.pathname);
        this.search();
    }

    displayCurrent() {
        // console.log(this.state.currentVolume);
        // console.log(this.state.returnedVolumes.length);
        if (this.state.currentVolume === this.state.returnedVolumes.length) {
            // console.log("new search");
            this.search();
            return;
        }

        let currenthing = this.state.returnedVolumes[this.state.currentVolume];
        let currentTitle = "";

        if (currenthing.firstdata.cover_date === null || currenthing.lastdata.cover_date === null) {
            currentTitle = currenthing.volumedata.name;
        }
        else {
            let firstYear = parseInt(currenthing.firstdata.cover_date.substring(0, 4));
            let lastYear = parseInt(currenthing.lastdata.cover_date.substring(0, 4));

            if (firstYear === lastYear) {
                currentTitle = currenthing.volumedata.name + ": " + firstYear;
            }
            else {
                currentTitle = currenthing.volumedata.name + ": " + firstYear + " - " + lastYear;
            }
        }

        for (let i = 0; i < this.state.pastResults.length; i++) {
            if (this.state.pastResults[i] === currentTitle) {
                // console.log(this.state.pastResults[i]);
                // console.log(currentTitle);

                let vnum = this.state.currentVolume;
                vnum++;
                console.log(vnum);
                console.log(this.state.currentVolume);
                if (vnum === this.state.returnedVolumes.length) {
                    this.search();
                    return;
                }
                else {
                    this.setState({
                        currentVolume: vnum,
                    }, () => {
                        console.log(this.state.currentVolume + "\n\n");
                        this.displayCurrent();
                        return;
                    })
                }
            }
        }

        let result = this.state.returnedVolumes[this.state.currentVolume];

        // console.log(result); 

        let currentPeople = [];

        // console.log(result.volumedata);
        if (typeof (result.volumedata.people) === "undefined" || result.volumedata.people === null) {
            currentPeople.push("none listed")
        }
        else {
            for (let i = 0; i < result.volumedata.people.length; i++) {
                currentPeople.push(result.volumedata.people[i].name);
            }
        }

        this.setState({
            issuesCount: result.volumedata.count_of_issues,
            description: (result.volumedata.description),
            firstCoverLink: result.firstdata.image.small_url,
            fullresult: result,
            people: currentPeople,
            volumeCall: result.volumedata.api_detail_url,
        })

        if (result.firstdata.cover_date === null || result.lastdata.cover_date === null) {
            this.setState({
                title: result.volumedata.name,
            })
        }
        else {
            let firstYear = parseInt(result.firstdata.cover_date.substring(0, 4));
            let lastYear = parseInt(result.lastdata.cover_date.substring(0, 4));

            if (firstYear === lastYear) {
                this.setState({
                    title: result.volumedata.name + ": " + firstYear,
                })
            }
            else {
                this.setState({
                    title: result.volumedata.name + ": " + firstYear + " - " + lastYear,
                })
            }
        }

        let newCurrentVolume = this.state.currentVolume + 1;
        this.setState({
            isLoading: false,
            currentVolume: newCurrentVolume,
        })
    }

    search() {
        this.state.handlePageChange(window.location.pathname);
        // console.log(this.state.key);
        fetch("/api/hero/" + this.state.key + "/" + this.state.publisher + "/" + this.state.batchnum).then(res => res.json()).then((result) => {
            // console.log(result);
            this.setState({
                returnedVolumes: result.volumepackets,
                currentVolume: 0,
                batchnum: result.batchnum,
            });

            this.displayCurrent();
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