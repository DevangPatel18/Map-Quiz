import React, { Component } from 'react';
import { Progress, Button, Modal } from 'semantic-ui-react';
import msToTime from '../../helpers/msToTime';
import { isMobile } from 'react-device-detect';
import StatusBarStyles from '../styles/StatusBarStyles';

class StatusBar extends Component {
  constructor() {
    super();
    this.state = { open: false };
    this.show = this.show.bind(this);
    this.close = this.close.bind(this);
  }

  show() {
    const { pauseQuiz } = this.props;
    pauseQuiz();
    this.setState({ open: true });
  }

  close() {
    const { resumeQuiz } = this.props;
    resumeQuiz();
    this.setState({ open: false });
  }

  render() {
    const { open } = this.state;
    const { status, closeQuiz } = this.props;
    const { quiz, quizGuesses, quizAnswers, time } = status;
    const percentComp = quiz
      ? parseInt((quizGuesses.length / quizAnswers.length) * 100, 10)
      : '';
    const questionText = `Question: ${quizGuesses.length} / ${
      quizAnswers.length
    }`;
    const scoreText = `Score: ${quizGuesses.filter(x => x).length}`;
    const pauseStyle =
      quizGuesses.length === quizAnswers.length ? { display: 'none' } : {};

    return (
      <div>
        <StatusBarStyles quiz={quiz} isMobile={isMobile}>
          <div className="statusBar-timerButtons">
            <Button
              size="mini"
              compact
              inverted
              color="red"
              className="statusBar-stop"
              icon="stop"
              onClick={closeQuiz}
            />
            <Button
              size="mini"
              compact
              inverted
              color="blue"
              icon="pause"
              onClick={this.show}
              style={pauseStyle}
            />
          </div>
          <Progress
            percent={percentComp}
            className="statusBar-progress"
            progress
          />
          <div className="statusBar-ratio">
            <p>{questionText}</p>
            <p>{scoreText}</p>
            <p>{msToTime(time)}</p>
          </div>
        </StatusBarStyles>
        <Modal
          basic
          dimmer="blurring"
          open={open}
          onClose={this.close}
          closeOnDimmerClick={false}
          style={{ textAlign: 'center' }}
        >
          <Button
            inverted
            color="green"
            size="massive"
            content="Resume"
            onClick={this.close}
          />
        </Modal>
      </div>
    );
  }
}

export default StatusBar;
