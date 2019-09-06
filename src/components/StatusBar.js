import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Progress, Button, Modal } from 'semantic-ui-react';
import StatusBarStyles from './styles/StatusBarStyles';
import { startQuiz, closeQuiz } from '../actions/quizActions';
import msToTime from '../helpers/msToTime';
import TimerStyles from './styles/TimerStyles';

class StatusBar extends Component {
  constructor() {
    super();

    this.state = {
      open: false,
      time: 0,
      timerOn: false,
    };

    this.start = this.start.bind(this);
    this.pause = this.pause.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.close = this.close.bind(this);
  }

  componentDidMount() {
    this.start();
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  start() {
    this.setState({ timerOn: true, time: 0 });
    const x = Date.now();
    this.timer = setInterval(
      () => this.setState({ time: Date.now() - x }),
      1000
    );
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

  render() {
    const { isQuizActive, quizGuesses, quizAnswers } = this.props.quiz;
    const { time, open } = this.state;
    const percentComp = isQuizActive
      ? parseInt((quizGuesses.length / quizAnswers.length) * 100, 10)
      : '';
    const questionText = `Question: ${quizGuesses.length} / ${
      quizAnswers.length
    }`;
    const scoreText = `Score: ${quizGuesses.filter(x => x).length}`;
    const pauseStyle =
      quizGuesses.length === quizAnswers.length ? { display: 'none' } : {};

    if (quizGuesses.length === quizAnswers.length) {
      clearInterval(this.timer);
    }

    return (
      <div>
        <StatusBarStyles isQuizActive={isQuizActive}>
          <TimerStyles>
            <div className="statusBar-timerButtons">
              <Button
                size="mini"
                compact
                inverted
                color="red"
                className="statusBar-stop"
                icon="stop"
                onClick={this.close}
                aria-label="stop quiz"
              />
              <Button
                size="mini"
                compact
                inverted
                color="yellow"
                icon="pause"
                onClick={this.pause}
                style={pauseStyle}
                aria-label="pause quiz"
              />
            </div>
          </TimerStyles>
          <Progress
            percent={percentComp}
            className="statusBar-progress"
            progress
          />
          <div className="statusBar-ratio">
            <p>{questionText}</p>
            <p>{scoreText}</p>
            <p className="statusBar-timer">{msToTime(time)}</p>
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
            aria-label="resume quiz"
          />
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  quiz: state.quiz,
});

export default connect(
  mapStateToProps,
  { startQuiz, closeQuiz }
)(StatusBar);
