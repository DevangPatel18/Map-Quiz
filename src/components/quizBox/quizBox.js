import React, { Component } from 'react';
import {
  Button, Form, Radio, Icon,
} from 'semantic-ui-react';
import QuestionBox from './questionInputBox';
import './quizBox.css';

class QuizBox extends Component {
  constructor() {
    super();

    this.state = {
      quizType: 'click_name',
      quizOptions: [
        { label: 'Click Country', value: 'click_name' },
        { label: 'Type Country', value: 'type_name' },
        { label: 'Click Capital', value: 'click_capital' },
        { label: 'Type Capital', value: 'type_capital' },
        { label: 'Click Country from matching Flag', value: 'click_flag' }],
    };

    this.handleQuizChange = this.handleQuizChange.bind(this);
    this.handleLabelToggle = this.handleLabelToggle.bind(this);
  }

  handleQuizChange(event, { value }) {
    this.setState({ quizType: value });
  }

  handleLabelToggle(marker) {
    const { setToggle, loadData, quizData } = this.props;
    const { fetchRequests, currentMap, markerToggle } = quizData;
    const parentMarker = ((markerToggle === '') || (marker !== markerToggle)) ? marker:''
    if ((parentMarker === 'capital') && (!fetchRequests.includes(`${currentMap}capital`))) {
      loadData('click_capital', true);
    } else {
      setToggle(parentMarker);
    }
  }

  render() {
    const {
      quizType, quizOptions,
    } = this.state;
    const {
      visible, nonactive, handleQuiz, closequiz, quizData, handleAnswer,
    } = this.props;
    const { markerToggle } = quizData;
    const countryLabel = markerToggle === 'name';
    const capitalLabel = markerToggle === 'capital';

    if (visible) {
      if (nonactive) {
        return (
          <div className="App-quiz">
            <Button onClick={() => { handleQuiz(quizType); }}>START QUIZ</Button>
            <Form>
              {
                quizOptions.map(form => (
                  <Form.Field key={form.value}>
                    <Radio
                      label={form.label}
                      value={form.value}
                      name="quiz"
                      checked={quizType === form.value}
                      onChange={this.handleQuizChange}
                    />
                  </Form.Field>
                ))
              }
            </Form>
            <div className="App-quiz-toggle">
              <p>TOGGLE LABEL</p>
              <Button.Group size="tiny">
                <Button toggle active={countryLabel} onClick={() => this.handleLabelToggle('name')}>
                  {'Country'}
                </Button>
                <Button.Or />
                <Button toggle active={capitalLabel} onClick={() => this.handleLabelToggle('capital')}>
                  {'Capital'}
                </Button>
              </Button.Group>
            </div>
          </div>
        );
      }
      return (
        <div className="App-quiz">
          <Button size="tiny" className="App-quiz-close" onClick={closequiz}>
            <Icon fitted size="large" name="close" />
          </Button>
          <QuestionBox
            quizType={quizType}
            quizData={quizData}
            handleAnswer={handleAnswer}
          />
        </div>
      );
    }

    return null;
  }
}

export default QuizBox;
