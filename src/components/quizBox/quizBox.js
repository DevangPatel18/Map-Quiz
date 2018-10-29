import React, { Component } from 'react';
import { Button, Form, Radio } from 'semantic-ui-react';
import { isMobile } from 'react-device-detect';
import QuestionBox from './questionBox';
import QuizMenu from '../styles/QuizMenuStyles';

const quizOptions = [
  { label: 'Click Country', value: 'click_name' },
  { label: 'Type Country', value: 'type_name' },
  { label: 'Click Capital', value: 'click_capital' },
  { label: 'Type Capital', value: 'type_capital' },
  { label: 'Click Country from matching Flag', value: 'click_flag' },
];

const checkedRegionsLabels = [
  'North & Central America',
  'South America',
  'Caribbean',
  'Europe',
  'Africa',
  'Asia',
  'Oceania',
];

class QuizBox extends Component {
  constructor() {
    super();

    this.state = { quizType: 'click_name' };
    this.handleQuizChange = this.handleQuizChange.bind(this);
    this.handleLabelToggle = this.handleLabelToggle.bind(this);
    this.handleCheckBox = this.handleCheckBox.bind(this);
  }

  handleQuizChange(event, { value }) {
    this.setState({ quizType: value });
  }

  handleLabelToggle(marker) {
    const { setToggle, loadData, quizData } = this.props;
    const { fetchRequests, currentMap, markerToggle } = quizData;
    const parentMarker =
      markerToggle === '' || marker !== markerToggle ? marker : '';
    if (
      parentMarker === 'capital' &&
      !fetchRequests.includes(`${currentMap}capital`)
    ) {
      loadData('click_capital', true);
    } else {
      setToggle(parentMarker);
    }
  }

  handleCheckBox(e) {
    const { setQuizRegions, quizData } = this.props;
    const { checkedRegions } = quizData;
    const { value, checked } = e.target;
    // check if nothing is selected
    const nothing = Object.keys(checkedRegions)
      .filter(region => region !== value)
      .every(region => !checkedRegions[region]);

    if (!(!checked && nothing)) {
      setQuizRegions(value, checked);
    }
  }

  render() {
    const { quizType } = this.state;
    const { nonactive, handleQuiz, quizData, handleAnswer } = this.props;
    const { markerToggle, currentMap, checkedRegions } = quizData;
    const countryLabel = markerToggle === 'name';
    const capitalLabel = markerToggle === 'capital';
    const formSize = isMobile ? 'mini' : 'small';

    if (nonactive) {
      return (
        <QuizMenu isMobile={isMobile}>
          <Button
            size={formSize}
            onClick={() => {
              handleQuiz(quizType);
            }}
          >
            START QUIZ
          </Button>
          <Form size={formSize}>
            {quizOptions.map(form => (
              <Form.Field key={form.value}>
                <Radio
                  label={form.label}
                  value={form.value}
                  name="quiz"
                  checked={quizType === form.value}
                  onChange={this.handleQuizChange}
                />
              </Form.Field>
            ))}
          </Form>
          {currentMap !== 'world' && (
            <div className="App-quiz-toggle">
              <div className="App-quiz-toggle-header">TOGGLE LABEL</div>
              <Button.Group size={formSize} compact>
                <Button
                  toggle
                  active={countryLabel}
                  onClick={() => this.handleLabelToggle('name')}
                >
                  {'Country'}
                </Button>
                <Button.Or />
                <Button
                  toggle
                  active={capitalLabel}
                  onClick={() => this.handleLabelToggle('capital')}
                >
                  {'Capital'}
                </Button>
              </Button.Group>
            </div>
          )}
          {currentMap === 'world' && (
            <Form className="fmRegionSelect">
              {checkedRegionsLabels.map(region => (
                <Form.Field
                  label={region}
                  value={region}
                  key={region}
                  control="input"
                  type="checkbox"
                  checked={checkedRegions[region]}
                  onChange={this.handleCheckBox}
                />
              ))}
            </Form>
          )}
        </QuizMenu>
      );
    }
    return (
      <QuestionBox
        quizType={quizType}
        quizData={quizData}
        handleAnswer={handleAnswer}
      />
    );
  }
}

export default QuizBox;
