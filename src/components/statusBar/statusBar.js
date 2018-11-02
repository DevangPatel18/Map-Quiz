import React from 'react';
import { Progress } from 'semantic-ui-react';
import { isMobile } from 'react-device-detect';
import StatusBarStyles from '../styles/StatusBarStyles';

const StatusBar = props => {
  const { status } = props;
  const { quiz, quizGuesses, quizAnswers } = status;
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

export default StatusBar;
