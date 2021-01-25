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
            this.context.setLanguage(data.language.name);
            this.context.setWords(data.words);
            this.context.setTotalScore(data.language.total_score);
          })
    );
  }

  renderWords() {
    return this.context.words.map((word, i) => (
      <li>
        <h4>{word.original}</h4> <span>Correct: {word.correct_count} </span>
        <br/>
        <span>Incorrect: {word.incorrect_count} </span>
      </li>
    ));
  }

  render() {
    return (
      <div>
        {this.context.words === null ? (
          <p> no words found</p>
        ) : (
          <>
            <h2> {this.context.language}</h2>
            <a href="/learn">Start practicing</a>
            <h3>Words to practice</h3>
            <ul>{this.renderWords()}</ul>
            <p>Total correct answers: {this.context.total_score}</p>
          </>
        )}
      </div>
    );
  }
}

export default DashboardRoute;
