import React, { Component } from 'react';
import { Button, Input } from 'semantic-ui-react'

class QuestionBox extends Component {
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
      let answerResult = this.props.handleAnswer(this.state.userGuess, this.props.testing)
  
      this.setState({userGuess: "", answerResult})
    }
  }

  render() {
    let { quizAnswers, quizGuesses, geographyPaths, activeQuestionNum } = this.props.quizData

    let typeTest = this.props.type === "type"

    if(activeQuestionNum === quizGuesses.length - 1) {
      var questionBoxContent = typeTest ? this.state.answerResult: this.props.handleAnswer();
    } else {
      if(typeTest){
        questionBoxContent = 
          <div>
            <p>Enter the { this.props.testing } of the highlighted country</p>
            <form onSubmit={this.handleSubmit}>
              <Input type="text" autoFocus value={this.state.userGuess} onChange={this.handleChange} />
              <Button type="submit" size="large" className="qSubmit">Submit</Button>
            </form>
          </div>
      } else {
        let alpha = quizAnswers[activeQuestionNum]
        let region = geographyPaths
          .find(x => x.properties["alpha3Code"] === alpha)
          .properties[this.props.testing];

        if(this.props.testing === "flag") {
          region = 
            <div className="qFlag">
              <img src={region} display="block" height="100px" border="1px solid black" alt=""/>
            </div>
        }

        if(activeQuestionNum !== quizAnswers.length) {
          questionBoxContent =
            <div>
              Where is {region}?
            </div>
        }
      }
    }

    if(activeQuestionNum === quizAnswers.length) {
      questionBoxContent = 
        <div>
          {this.props.handleAnswer()}
        </div>
    }

    return (
      <div className={ this.props.type === "type" ? "qInputBox":""}>
        {questionBoxContent}
      </div>
    )
  }
}

export default QuestionBox