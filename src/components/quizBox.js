import React, { Component } from 'react';
import QuestionBox from "./questionInputBox.js"
import { Button, Form, Radio, Icon } from 'semantic-ui-react'
import './quizBox.css'

class QuizBox extends Component {
  constructor() {
    super()

    this.state = {
      quizType: "click_name",
      quizOptions: [
        { label:"Click Country", value: "click_name" },
        { label:"Type Country", value: "type_name" },
        { label:"Click Capital", value: "click_capital" },
        { label:"Type Capital", value: "type_capital" },
        { label:"Click Country from matching Flag", value: "click_flag" },],
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
                {
                  this.state.quizOptions.map((form, i) => 
                    <Form.Field key={i}>
                      <Radio
                        label={form.label}
                        value={form.value}
                        name="quiz"
                        checked={this.state.quizType === form.value}
                        onChange={this.handleQuizChange}
                      />
                    </Form.Field>
                  )
                }
              </Form>
          </div>
        )
      } else {
        return (
          <div className="App-quiz">
            <Button size="tiny" className="App-quiz-close" onClick={ this.props.closequiz }>
              <Icon fitted size="large" name="close"/>
            </Button>
            <QuestionBox
              type = { this.state.quizType.split("_")[0] }
              testing = { this.state.quizType.split("_")[1] }
              quizData = { this.props.quizData }
              handleAnswer = { this.props.handleAnswer }
            />
          </div>
        )
      }
    }

    return null
  }
}

export default QuizBox