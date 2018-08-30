import React, { Component } from 'react';
import QuestionBox from './questionBox.js';
import QuestionInputBox from "./questionInputBox.js"

class QuizBox extends Component {
  constructor() {
    super()

    this.state = {
      quizType: "clickCountry"
    }

    this.handleQuizChange = this.handleQuizChange.bind(this)
    this.handleQuizStart = this.handleQuizStart.bind(this)
  }

  handleQuizChange(event) {
    this.setState({ quizType: event.target.value })
  }

  handleQuizStart() {
    if(this.state.quizType === "clickCountry") {      
      this.props.startquiz()
    } else {
      this.props.startquiz()
      this.props.disableInfoClick()
    }
  }

  render() {

  if(this.props.visible) {
    if(this.props.nonactive) {
      return (
        <div className="App-quiz">
          <button onClick={ this.handleQuizStart }>START QUIZ</button>
          <div>
            <input type="radio" id="clickCountry" value="clickCountry" name="quiz" checked={this.state.quizType === "clickCountry"} onChange={this.handleQuizChange} />
            <label htmlFor="clickCountry">Click Country</label>
            <input type="radio" id="nameCountry" value="nameCountry" name="quiz" checked={this.state.quizType === "nameCountry"} onChange={this.handleQuizChange} />
            <label htmlFor="nameCountry">Name Country</label>
          </div>
        </div>
      )
    } else {
      if(this.state.quizType === "clickCountry") {
        return (
          <div className="App-quiz">
            <button className="App-quiz-close" onClick={ this.props.closequiz }>X</button>
            <QuestionBox
              quizAnswers = { this.props.quizAnswers }
              quizGuesses = { this.props.quizGuesses }
              geoPath = { this.props.geoPath }
              activeNum = { this.props.activeNum }
              answerResultFunc = { this.props.answerResultFunc }
            />
          </div>
        )
      } else {
        return (
          <div className="App-quiz">
            <button className="App-quiz-close" onClick={ this.props.closequiz }>X</button>
            <QuestionInputBox
              quizAnswers = { this.props.quizAnswers }
              quizGuesses = { this.props.quizGuesses }
              geoPath = { this.props.geoPath }
              activeNum = { this.props.activeNum }            
              answerResultFunc = { this.props.answerResultFunc }
            />
          </div>
        )        
      }
    }
  }

  return null

  }
  
}

export default QuizBox