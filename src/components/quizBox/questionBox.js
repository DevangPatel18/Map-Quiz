import React, { Component } from 'react';
import { Button, Input } from 'semantic-ui-react';
import { isMobile } from 'react-device-detect';
import { connect } from 'react-redux';
import QuizPrompt, { QuizFlag } from '../styles/QuizPromptStyles';
import {
  startQuiz,
  closeQuiz,
  answerQuiz,
} from '../../actions/quizActions';

class QuestionBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userGuess: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFinalDialog = this.handleFinalDialog.bind(this);
  }

  handleChange(event) {
    this.setState({ userGuess: event.target.value });
  }

  handleSubmit(event) {
    const { userGuess } = this.state;
    const { answerQuiz } = this.props;
    event.preventDefault();
    if (userGuess.length !== 0) {
      answerQuiz(userGuess);
      this.setState({ userGuess: '' });
    }
  }

  handleFinalDialog() {
    const { quiz, startQuiz, closeQuiz } = this.props;
    const { quizGuesses, quizAnswers, quizType } = quiz;

    const score = quizGuesses.reduce((a, b) => a * 1 + b * 1);
    const finalText = `Your score is ${score} / ${
      quizAnswers.length
    } or ${Math.round((score / quizAnswers.length) * 100)}%`;
    return (
      <div>
        <div>{finalText}</div>
        <div>
          <Button
            onClick={() => closeQuiz()}
            size="large"
            compact
            content="CANCEL"
            style={{ marginRight: '1rem' }}
          />
          <Button
            onClick={() => startQuiz(quizType)}
            size="large"
            compact
            content="RESTART"
          />
        </div>
      </div>
    );
  }

  render() {
    const { userGuess } = this.state;
    const { quizType, quizAnswers, activeQuestionNum } = this.props.quiz;
    const { geographyPaths } = this.props.data;
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
    return <QuizPrompt>{this.handleFinalDialog()}</QuizPrompt>;
  }
}

const mapStateToProps = state => ({
  data: state.data,
  quiz: state.quiz,
});

export default connect(
  mapStateToProps,
  { startQuiz, closeQuiz, answerQuiz }
)(QuestionBox);
