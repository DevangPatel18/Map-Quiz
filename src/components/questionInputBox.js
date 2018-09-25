import React, { Component } from 'react';
import { Button, Input } from 'semantic-ui-react'

class QuestionInputBox extends Component {
  constructor(props) {
    super(props)

    this.state = {
      userGuess: "",
      answerResult: null
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({userGuess: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    if(this.state.userGuess.length !== 0) {
      let answerResult = this.props.answerResultFunc(this.state.userGuess, this.props.testing)
  
      this.setState({userGuess: "", answerResult})
    }
  }

  render() {
    let { quizAnswers, quizGuesses, activeQuestionNum } = this.props.quizData

    let next

    if(activeQuestionNum === quizGuesses.length - 1) {
      next = this.state.answerResult;
    } else {
      next = 
        <div>
          <p>Enter the { this.props.testing } of the highlighted country</p>
          <form onSubmit={this.handleSubmit}>
            <Input type="text" autoFocus value={this.state.userGuess} onChange={this.handleChange} />
            <Button type="submit" size="large" className="qSubmit">Submit</Button>
          </form>
        </div>
    }

    if(activeQuestionNum === quizAnswers.length) {
      let result = this.props.answerResultFunc()
      next = 
        <div>
          {result}
        </div>
    }

    return (
      <div className="qInputBox">
        {next}
      </div>
    )
  }
}

export default QuestionInputBox