import React, { Component } from 'react';
import QuestionBox from './questionBox.js';
import QuestionInputBox from "./questionInputBox.js"

class QuizBox extends Component {
  constructor() {
    super()

    this.state = {
      quizType: "click_name"
    }

    this.handleQuizChange = this.handleQuizChange.bind(this)
    this.handleQuizStart = this.handleQuizStart.bind(this)
  }

  handleQuizChange(event) {
    this.setState({ quizType: event.target.value })
  }

  handleQuizStart() {
    if(this.state.quizType.split("_")[0] === "click") {
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
            <input type="radio" id="click_name" value="click_name" name="quiz" checked={this.state.quizType === "click_name"} onChange={this.handleQuizChange} />
            <label htmlFor="click_name">Click Country</label>
            <input type="radio" id="type_name" value="type_name" name="quiz" checked={this.state.quizType === "type_name"} onChange={this.handleQuizChange} />
            <label htmlFor="type_name">Type Country</label>
          </div>
          <div>
            <input type="radio" id="click_capital" value="click_capital" name="quiz" checked={this.state.quizType === "click_capital"} onChange={this.handleQuizChange} />
            <label htmlFor="click_capital">Click Capital</label>
            <input type="radio" id="type_capital" value="type_capital" name="quiz" checked={this.state.quizType === "type_capital"} onChange={this.handleQuizChange} />
            <label htmlFor="type_capital">Type Capital</label>
          </div>
          <div>
            <input type="radio" id="click_flag" value="click_flag" name="quiz" checked={this.state.quizType === "click_flag"} onChange={this.handleQuizChange} />
            <label htmlFor="click_flag">Click Country from matching Flag</label>
          </div>
        </div>
      )
    } else {
      if(this.state.quizType.split("_")[0] === "click") {
        return (
          <div className="App-quiz">
            <button className="App-quiz-close" onClick={ this.props.closequiz }>X</button>
            <QuestionBox
              testing = { this.state.quizType.split("_")[1] }
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
              testing = { this.state.quizType.split("_")[1] }
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