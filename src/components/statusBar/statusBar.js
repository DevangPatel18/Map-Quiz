import React from 'react';
import { Progress, Button } from 'semantic-ui-react';
import msToTime from '../../helpers/msToTime';
import './statusBar.css';

const StatusBar = (props) => {
  const { status, closequiz } = props;
  const {
    quiz, quizGuesses, quizAnswers, time,
  } = status;
  const percentComp = quiz ? parseInt(quizGuesses.length / quizAnswers.length * 100, 10) : '';
  const top = quiz ? '0rem' : '-7rem';
  const questionText = `Question: ${quizGuesses.length} / ${quizAnswers.length}`;
  const scoreText = `Score: ${quizGuesses.filter(x => x).length}`;
  return (
    <div className="statusBar" style={{ top: `${top}` }}>
      <Button size="mini" compact inverted color="red" className="statusBar-quiz-close" content="Close" onClick={closequiz} />
      <Progress percent={percentComp} className="statusBar-progress" progress />
      <div className="statusBar-ratio">
        <p>{questionText}</p>
        <p>{scoreText}</p>
        <p>{ msToTime(time) }</p>
      </div>
    </div>
  );
};

export default StatusBar;
