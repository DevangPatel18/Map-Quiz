import React from 'react';
import { connect } from 'react-redux';
import { Progress } from 'semantic-ui-react';
import { isMobile } from 'react-device-detect';
import StatusBarStyles from '../styles/StatusBarStyles';

const StatusBar = props => {
  const { quiz, quizGuesses, quizAnswers } = props.quiz;
  const percentComp = quiz
    ? parseInt((quizGuesses.length / quizAnswers.length) * 100, 10)
    : '';
  const questionText = `Question: ${quizGuesses.length} / ${
    quizAnswers.length
  }`;
  const scoreText = `Score: ${quizGuesses.filter(x => x).length}`;

  return (
    <div>
      <StatusBarStyles quiz={quiz} mobile={isMobile}>
        <Progress
          percent={percentComp}
          className="statusBar-progress"
          progress
        />
        <div className="statusBar-ratio">
          <p>{questionText}</p>
          <p>{scoreText}</p>
        </div>
      </StatusBarStyles>
    </div>
  );
};

const mapStateToProps = state => ({
  quiz: state.quiz,
});

export default connect(mapStateToProps)(StatusBar);
