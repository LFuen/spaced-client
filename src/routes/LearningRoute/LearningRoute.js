import React, { Component } from 'react'
import config from '../../config'
import UserContext from '../../contexts/UserContext'
import Token from '../../services/token-service'

class LearningRoute extends Component {
  static contextType = UserContext

  static = {
    answer: null,
    translation: '',
    score: 0,
    correct: '',
    incorrect: '',
    total: 0,
    isClicked: false,
    nextWord: null,
    response: {},
    guess: ''
  }

  handleNext() {
    this.setState({
      isClicked: false,
      correct: this.state.response.wordCorrectCount,
      incorrect: this.state.response.wordIncorrectCount,
      translation: '',
      answer: null,
      nextWord: {
        nextWord: this.state.respose.nextWord,
        totalScore: this.state.response.nextWord.totalScore,
        wordCorrectCount: this.state.response.wordCorrectCount,
        wordIncorrectCount: this.state.response.wordIncorrectCount
      }
    })
  }

  async componentDidMount() {
    try {
      const response = await fetch(
        `${config.API_ENDPOINT}/langage/head`,
        {
          headers:{
            authorization: `Bearer ${Token.getAuthToken()}`,
          },
        }
    )

    const results = await response.json()

    this.context.setNextWord(results)
    this.setState({nextWord: results})
    this.setState({
      correct: results.wordCorrectCount,
      incorrect: results.wordIncorrectCount,
      total: results.totalScore,
      isClicked: false,
      score: null
    })
    } catch (e) {
      this.setState({ error: e })
    }
  }

  async submitForm(e) {
    e.preventDefault() 
    const guesses = e.target.guesses.value.toLowerCase().trim()
    e.target.guesses.value = ''
    this.setState({guess: guesses})
    this.context.setGuess(guesses)

    try {
      const results = await fetch(
        `${config.API_ENDPOINT}/language/guess`,
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            authorization: `Bearer ${Token.getAuthToken()}`
          },
          body: JSON.stringify({guess: guesses}),
        }
      )

      const answers = await answers.json()
      this.context.setResponse(answers)
      this.setState({
        response: answers,
        total: answers.totalScore,
        isClicked: true,
        translation: answers.answer,
      })
    } catch (e) {
      this.setState({error: e})
    }

    if(this.state.response.isCorrect) {
      this.setState({
        answer: 'correct',
        correct: this.state.correct + 1
      })
    } else {
      this.setState({
        answer: 'incorrect',
        incorrect: this.state.incorrect + 1
      })
    }
  }



  render() {
    return (
      <div>
      <form onSubmit={(e) => this.submitForm(e, this.context)}>
        {this.state.answer == null && <h2>Translate this:</h2>}
        {this.state.answer === 'correct' && (
          <div className='DisplayFeedback'>
            <h2>That's the right answer!</h2>
            <p>We were looking for {' '} 
              {this.state.translation}, for the translation of {' '} 
              {this.state.nextWord.nextWord}, and you chose {' '} 
              {this.state.guess}. Sweet!</p>
          </div>
        )}
        <span className='word'>
          {this.state.isClicked === false && this.state.nextWord ?
            this.state.nextWord.nextWord : null}
        </span>
        <div className='DisplayScore'>
          {' '} <p>Your total score is: {this.state.total}</p>
        </div>
        {this.state.isClicked === false && <fieldset>
          <label htmlFor='learn-guess-input'>What does this translate to?</label>
          <input
            name='guess'
            id='learn-guess-input'
            type='text'
            required></input>
            {this.state.isClicked === false && (
              <button type='submit'>Submit Answer</button>
            )}
            </fieldset>}

            <p>You have translated this correctly {this.state.correct}{' '} times!</p>
            <p>You have not translated this correctly {this.state.incorrect}{' '} times.</p>
      </form>
      {this.state.answer !== null && (
        <button onClick={() => this.handleNext()}>On to the next!</button>
      )}
      </div>
    );
  }
}

export default LearningRoute
