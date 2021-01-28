import React, { Component } from "react";
import config from "../../config";
import Token from "../../services/token-service";
import UserContext from "../../contexts/UserContext";
import './Dashboard.css'

class DashboardRoute extends Component {
  static contextType = UserContext;

  componentDidMount() {
    fetch(`${config.API_ENDPOINT}/language`, {
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${Token.getAuthToken()}`,
      },
    }).then((res) =>
      !res.ok
        ? res.json().then((e) => Promise.reject(e))
        : res.json().then((data) => {
            console.log(data.words)
            this.context.setLanguage(data.language.name);
            this.context.setWords(data.words);
            this.context.setTotalScore(data.language.total_score);
          })
    );
  }

  renderWords() {
    return this.context.words.map((word, i) => (
      <div key={word.id}>
        <h4>{word.original}</h4> 
        <span>Correct: {word.correct_count} </span>
        <br/>
        <span>Incorrect: {word.incorrect_count} </span>
      </div>
    ));
  }

  render() {
    return (
      <div>
        {this.context.words === null ? (
          <p> No words found, sorry! </p>
        ) : (
          <div>
            <h2> {this.context.language} </h2>
            <a href="/learn" className='practice'>Start practicing</a>
            <h3>Words to practice</h3>
            <div className='center'>
              <li>{this.renderWords()}</li>
            </div>
            <p>Total correct answers: 
              <em className='right'>{this.context.total_score}</em>
            </p>
          </div>
        )}
      </div>
    );
  }
}

export default DashboardRoute;
