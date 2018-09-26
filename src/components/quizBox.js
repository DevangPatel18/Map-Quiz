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
  }

  handleQuizChange(event, { value }) {
    this.setState({ quizType: value })
  }

  render() {

    let { quizType} = this.state

    if(this.props.visible) {
      if(this.props.nonactive) {
        return (
          <div className="App-quiz">
            <Button onClick={ () => {this.props.handleQuiz(quizType)} }>START QUIZ</Button>
              <Form>
                {
                  this.state.quizOptions.map((form, i) => 
                    <Form.Field key={i}>
                      <Radio
                        label={form.label}
                        value={form.value}
                        name="quiz"
                        checked={quizType === form.value}
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
              quizType = { quizType }
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