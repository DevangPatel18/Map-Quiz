import React, { Component } from 'react';
import { Progress, Button, Modal } from 'semantic-ui-react';
import msToTime from '../../helpers/msToTime';
import { isMobile } from 'react-device-detect';
import StatusBarStyles from '../styles/StatusBarStyles';

class StatusBar extends Component {
  constructor() {
    super();
    this.state = {
      open: false,
      time: 0,
      timerOn: false,
    };
    this.pause = this.pause.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.start = this.start.bind(this);
    this.close = this.close.bind(this);
  }

  pause() {
    const { timerOn } = this.state;
    if (timerOn) {
      clearInterval(this.timer);
      this.setState({ timerOn: false, open: true });
    }
  }

  close() {
    const { closeQuiz } = this.props;
    closeQuiz();
    clearInterval(this.timer);
    this.setState({ time: 0, timerOn: false });
  }

  closeModal() {
    const { timerOn, time } = this.state;
    if (!timerOn) {
      this.setState({ timerOn: true, open: false }, () => {
        const x = Date.now() - time;
        this.timer = setInterval(
          () => this.setState({ time: Date.now() - x }),
          1000
        );
      });
    }
  }

  start() {
    const { time, timerOn } = this.state;
    if (!timerOn) {
      this.setState({ timerOn: true });
      const x = Date.now() - time;
      this.timer = setInterval(
        () => this.setState({ time: Date.now() - x }),
        1000
      );
    }
  }

  render() {
    const { open, time } = this.state;
    const { status } = this.props;
    const { quiz, quizGuesses, quizAnswers } = status;
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
              onClick={this.close}
            />
            <Button
              size="mini"
              compact
              inverted
              color="blue"
              icon="pause"
              onClick={this.pause}
              style={pauseStyle}
            />
            {time === 0 && (
              <Button
                size="mini"
                compact
                inverted
                color="green"
                icon="play"
                onClick={this.start}
                // style={pauseStyle}
              />
            )}
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
          onClose={this.closeModal}
          closeOnDimmerClick={false}
          style={{ textAlign: 'center' }}
        >
          <Button
            inverted
            color="green"
            size="massive"
            content="Resume"
            onClick={this.closeModal}
          />
        </Modal>
      </div>
    );
  }
}

export default StatusBar;
