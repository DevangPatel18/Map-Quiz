import React, { Component } from 'react';
import { Button, Input } from 'semantic-ui-react';
import { isMobile } from 'react-device-detect';
import { connect } from 'react-redux';
import QuizPrompt, { QuizFlag } from '../styles/QuizPromptStyles';
import {
  startQuiz,
  closeQuiz,
  processTypeAnswer,
} from '../../actions/quizActions';

class QuestionBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userGuess: '',
    };
  }

  handleChange = event => this.setState({ userGuess: event.target.value });

  handleSubmit = event => {
    const { userGuess } = this.state;
    const { processTypeAnswer } = this.props;
    event.preventDefault();
    if (userGuess.length !== 0) {
      processTypeAnswer(userGuess);
      this.setState({ userGuess: '' });
    }
  };

  handleRestartQuiz = async () => {
    const { quizType } = this.props.quiz;
    const { startQuiz, closeQuiz } = this.props;
    await closeQuiz();
    startQuiz(quizType);
  };

  handleTypePrompt = testing => {
    const { userGuess } = this.state;
    const { subRegionName } = this.props.map;
    const text = `Enter the ${testing} of the highlighted ${subRegionName}`;
    const inputSize = isMobile ? 'mini' : 'small';
    return (
      <QuizPrompt typeTest={true}>
        <div className="qInputText">{text}</div>
        <form onSubmit={this.handleSubmit}>
          <Input
            type="text"
            aria-label="user guess"
            autoFocus
            size={inputSize}
            value={userGuess}
            onChange={this.handleChange}
          />
          <div>
            <Button
              type="submit"
              size="small"
              aria-label="submit answer"
              compact
            >
              Submit
            </Button>
          </div>
        </form>
      </QuizPrompt>
    );
  };

  handleFlagPrompt = region => (
    <QuizFlag>
      <img
        src={region}
        className="qFlag"
        display="block"
        height={isMobile ? '50px' : '100px'}
        alt=""
      />
    </QuizFlag>
  );

  handleNamePrompt = region => (
    <QuizPrompt>
      <span className="quizName">{region}</span>
    </QuizPrompt>
  );

  handleFinalDialog = () => {
    const { quiz, closeQuiz } = this.props;
    const { quizGuesses, quizAnswers } = quiz;

    const score = quizGuesses.reduce((a, b) => a * 1 + b * 1);
    const finalText = `Your score is ${score} / ${
      quizAnswers.length
    } (${Math.round((score / quizAnswers.length) * 100)}%)`;
    return (
      <QuizPrompt>
        <div>
          <div>{finalText}</div>
          <div style={{ display: 'flex' }}>
            <Button
              onClick={closeQuiz}
              size="large"
              compact
              content="CANCEL"
              style={{ marginRight: '1rem' }}
              aria-label="cancel quiz"
            />
            <Button
              onClick={this.handleRestartQuiz}
              size="large"
              compact
              content="RESTART"
              aria-label="restart quiz"
            />
          </div>
        </div>
      </QuizPrompt>
    );
  };

  render() {
    const { quizType, quizAnswers, activeQuestionNum } = this.props.quiz;
    const { geographyPaths } = this.props.data;
    const { regionKey } = this.props.map;
    const [type, testing] = quizType.split('_');

    if (activeQuestionNum !== quizAnswers.length) {
      if (type === 'type') {
        return this.handleTypePrompt(testing);
      }
      const alpha = quizAnswers[activeQuestionNum];
      const region = geographyPaths.find(x => x.properties[regionKey] === alpha)
        .properties[testing];

      if (testing === 'flag') {
        return this.handleFlagPrompt(region);
      }
      return this.handleNamePrompt(region);
    }
    return this.handleFinalDialog();
  }
}

const mapStateToProps = state => ({
  map: state.map,
  data: state.data,
  quiz: state.quiz,
});

export default connect(
  mapStateToProps,
  { startQuiz, closeQuiz, processTypeAnswer }
)(QuestionBox);
