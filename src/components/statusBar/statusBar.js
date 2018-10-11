import React, { Component } from 'react';
import { Progress, Button, Modal } from 'semantic-ui-react';
import msToTime from '../../helpers/msToTime';
import './statusBar.css';

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
    const {
      quiz, quizGuesses, quizAnswers, time,
    } = status;
    const percentComp = quiz ? parseInt(quizGuesses.length / quizAnswers.length * 100, 10) : '';
    const top = quiz ? '0rem' : '-7rem';
    const questionText = `Question: ${quizGuesses.length} / ${quizAnswers.length}`;
    const scoreText = `Score: ${quizGuesses.filter(x => x).length}`;
    const pauseStyle = quizGuesses.length === quizAnswers.length ? { display: 'none' } : {};

    return (
      <div>
        <div className="statusBar" style={{ top: `${top}` }}>
          <div className="statusBar-timerButtons">
            <Button size="mini" compact inverted color="red" className="statusBar-stop" content="Close" onClick={closeQuiz} />
            <Button size="mini" compact inverted color="blue" content="Pause" onClick={this.show} style={pauseStyle} />
          </div>
          <Progress percent={percentComp} className="statusBar-progress" progress />
          <div className="statusBar-ratio">
            <p>{questionText}</p>
            <p>{scoreText}</p>
            <p>{ msToTime(time) }</p>
          </div>
        </div>
        <Modal
          basic
          dimmer="blurring"
          open={open}
          onClose={this.close}
          closeOnDimmerClick={false}
          style={{ textAlign: 'center' }}
        >
          <Button inverted color="green" size="massive" content="Resume" onClick={this.close} />
        </Modal>
      </div>
    );
  }
}

export default StatusBar;
