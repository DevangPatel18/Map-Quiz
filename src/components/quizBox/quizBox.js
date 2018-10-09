import React, { Component } from 'react';
import {
  Button, Form, Radio, Icon,
} from 'semantic-ui-react';
import { isMobile } from 'react-device-detect';
import QuestionBox from './questionInputBox';
import './quizBox.css';

const quizOptions = [
  { label: 'Click Country', value: 'click_name' },
  { label: 'Type Country', value: 'type_name' },
  { label: 'Click Capital', value: 'click_capital' },
  { label: 'Type Capital', value: 'type_capital' },
  { label: 'Click Country from matching Flag', value: 'click_flag' }
];

class QuizBox extends Component {
  constructor() {
    super();

    this.state = { quizType: 'click_name' };

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
    const { quizType } = this.state;
    const {
      visible, nonactive, handleQuiz, closequiz, quizData, handleAnswer,
    } = this.props;
    const { markerToggle } = quizData;
    const countryLabel = markerToggle === 'name';
    const capitalLabel = markerToggle === 'capital';
    const fontSize = isMobile ? 5 : 16;
    const formSize = isMobile ? 'mini' : 'small';

    if (visible) {
      if (nonactive) {
        return (
          <div className="App-quiz" style={{ fontSize: `${fontSize}px` }}>
            <Button size={formSize} onClick={() => { handleQuiz(quizType); }}>START QUIZ</Button>
            <Form size={formSize}>
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
              <div className="App-quiz-toggle-header">TOGGLE LABEL</div>
              <Button.Group size={formSize} compact>
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
