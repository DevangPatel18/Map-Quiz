import React, { Component } from 'react';
import QuestionBox from './questionBox.js';
import QuestionInputBox from "./questionInputBox.js"
import { Button, Form, Radio, Icon } from 'semantic-ui-react'
import './quizBox.css'

class QuizBox extends Component {
  constructor() {
    super()

    this.state = {
      quizType: "click_name"
    }

    this.handleQuizChange = this.handleQuizChange.bind(this)
    this.handleQuizStart = this.handleQuizStart.bind(this)
  }

  handleQuizChange(event, { value }) {
    this.setState({ quizType: value })
  }

  handleQuizStart() {
    if(this.state.quizType.split("_")[0] === "click") {
      this.props.startquiz(this.state.quizType.split("_")[1])
    } else {
      this.props.startquiz(this.state.quizType.split("_")[1])
      this.props.disableInfoClick()
    }
  }

  render() {

  if(this.props.visible) {
    if(this.props.nonactive) {
      return (
        <div className="App-quiz">
          <Button onClick={ this.handleQuizStart }>START QUIZ</Button>
            <Form>
            <Form.Field>
              <Radio
                label="Click Country"
                value="click_name"
                name="quiz"
                checked={this.state.quizType === "click_name"}
                onChange={this.handleQuizChange}
              />
            </Form.Field>
            <Form.Field>
              <Radio
                label="Type Country"
                value="type_name"
                name="quiz"
                checked={this.state.quizType === "type_name"}
                onChange={this.handleQuizChange}
              />
            </Form.Field>
            <Form.Field>
              <Radio
                label="Click Capital"
                value="click_capital"
                name="quiz"
                checked={this.state.quizType === "click_capital"}
                onChange={this.handleQuizChange}
              />
            </Form.Field>
            <Form.Field>
              <Radio
                label="Type Capital"
                value="type_capital"
                name="quiz"
                checked={this.state.quizType === "type_capital"}
                onChange={this.handleQuizChange}
              />
            </Form.Field>
            <Form.Field>
              <Radio
                label="Click Country from matching Flag"
                value="click_flag"
                name="quiz"
                checked={this.state.quizType === "click_flag"}
                onChange={this.handleQuizChange}
              />
            </Form.Field>
            </Form>
        </div>
      )
    } else {
      if(this.state.quizType.split("_")[0] === "click") {
        return (
          <div className="App-quiz">
            <Button size="tiny" className="App-quiz-close" onClick={ this.props.closequiz }>
              <Icon fitted size="large" name="close"/>
            </Button>
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
            <Button size="tiny" className="App-quiz-close" onClick={ this.props.closequiz }>
              <Icon fitted size="large" name="close"/>
            </Button>
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