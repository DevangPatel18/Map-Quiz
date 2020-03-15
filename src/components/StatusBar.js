import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Progress, Button, Modal } from 'semantic-ui-react';
import StatusBarStyles from './styles/StatusBarStyles';
import { startQuiz, giveUpQuiz, closeQuiz } from '../actions/quizActions';
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
  }

  componentDidMount() {
    const { isTimerEnabled } = this.props.quiz;
    isTimerEnabled && this.start();
    this.setState({ timerOn: true, time: 0 });
  }

  componentWillUnmount() {
    const { isTimerEnabled } = this.props.quiz;
    isTimerEnabled && clearInterval(this.timer);
  }

  start = () => {
    const x = Date.now();
    this.timer = setInterval(
      () => this.setState({ time: Date.now() - x }),
      1000
    );
  };

  pause = () => {
    const { isTimerEnabled } = this.props.quiz;
    const { timerOn } = this.state;
    if (timerOn) {
      isTimerEnabled && clearInterval(this.timer);
      this.setState({ timerOn: false, open: true });
    }
  };

  giveUp = () => {
    this.props.giveUpQuiz();
    this.props.quiz.isTimerEnabled && clearInterval(this.timer);
    this.setState({ time: 0, timerOn: false });
  };

  close = () => {
    const { isTimerEnabled } = this.props.quiz;
    const { closeQuiz } = this.props;
    closeQuiz();
    isTimerEnabled && clearInterval(this.timer);
    this.setState({ time: 0, timerOn: false });
  };

  closeModal = () => {
    const { isTimerEnabled } = this.props.quiz;
    const { timerOn, time } = this.state;
    if (!timerOn) {
      this.setState({ timerOn: true, open: false }, () => {
        if (isTimerEnabled) {
          const x = Date.now() - time;
          this.timer = setInterval(
            () => this.setState({ time: Date.now() - x }),
            1000
          );
        }
      });
    }
  };

  render() {
    const {
      isQuizActive,
      quizGuesses,
      quizAnswers,
      isTimerEnabled,
    } = this.props.quiz;
    const { time, open } = this.state;
    const correctAnswers = quizGuesses.filter(x => x).length;
    const answered = quizGuesses.filter(x => x | !x).length;
    const total = quizAnswers.length;
    const percentComp = isQuizActive
      ? parseInt((answered / total) * 100, 10)
      : '';
    const questionText = `Question: ${answered} / ${total}`;
    const scoreText = `Score: ${correctAnswers}`;
    const quizEndStyle = answered === total ? { display: 'none' } : {};

    if (answered === total && isTimerEnabled) {
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
                style={quizEndStyle}
                aria-label="pause quiz"
              />
              <Button
                size="mini"
                compact
                inverted
                icon="flag outline"
                onClick={this.giveUp}
                style={quizEndStyle}
                aria-label="give up quiz"
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
            {isTimerEnabled && (
              <p className="statusBar-timer">{msToTime(time)}</p>
            )}
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

export default connect(mapStateToProps, { startQuiz, giveUpQuiz, closeQuiz })(
  StatusBar
);
