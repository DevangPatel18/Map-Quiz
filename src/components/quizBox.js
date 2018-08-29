import React from 'react';
import QuestionBox from './questionBox.js';

const QuizBox = (props) => {
  
  if(props.visible) {
    if(props.active) {
      return (
        <div className="App-quiz">
          <button onClick={ props.startquiz }>START QUIZ</button>
        </div>
      )
    } else {
      return (
        <div className="App-quiz">
          <button className="App-quiz-close" onClick={ props.closequiz }>X</button>
          <QuestionBox
            quizAnswers = { props.quizAnswers }
            geoPath = { props.geoPath }
            activeNum = { props.activeNum }
            answerResultFunc = { props.answerResultFunc }
          />
        </div>
      )
    }
  }

  return null
}

export default QuizBox