import React, { Component } from 'react';
import { Button, Input } from 'semantic-ui-react';
import { isMobile } from 'react-device-detect';
import QuizPrompt, { QuizFlag } from '../styles/QuizPromptStyles';

class QuestionBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userGuess: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ userGuess: event.target.value });
  }

  handleSubmit(event) {
    const { userGuess } = this.state;
    const { handleAnswer } = this.props;
    event.preventDefault();
    if (userGuess.length !== 0) {
      handleAnswer(userGuess);
      this.setState({ userGuess: '' });
    }
  }

  render() {
    const { userGuess } = this.state;
    const { quizData, quizType, handleAnswer } = this.props;
    const { quizAnswers, geographyPaths, activeQuestionNum } = quizData;
    const [type, testing] = quizType.split('_');
    const typeTest = type === 'type';
    let text;

    if (activeQuestionNum !== quizAnswers.length) {
      if (typeTest) {
        text = `Enter the ${testing} of the highlighted country`;
        const inputSize = isMobile ? 'mini' : 'small';
        return (
          <QuizPrompt isMobile={isMobile} typeTest={typeTest}>
            <div className="qInputText">{text}</div>
            <form onSubmit={this.handleSubmit}>
              <Input
                type="text"
                autoFocus
                size={inputSize}
                value={userGuess}
                onChange={this.handleChange}
              />
              <div>
                <Button type="submit" size="small" compact>
                  Submit
                </Button>
              </div>
            </form>
          </QuizPrompt>
        );
      }
      const alpha = quizAnswers[activeQuestionNum];
      const region = geographyPaths.find(x => x.properties.alpha3Code === alpha)
        .properties[testing];

      if (testing === 'flag') {
        const flagHeight = isMobile ? '50px' : '100px';
        return (
          <QuizFlag>
            <img
              src={region}
              className="qFlag"
              display="block"
              height={flagHeight}
              alt=""
            />
          </QuizFlag>
        );
      }
      return (
        <QuizPrompt>
          <span className="quizName">{region}</span>
        </QuizPrompt>
      );
    }
    return <QuizPrompt>{handleAnswer()}</QuizPrompt>;
  }
}

export default QuestionBox;
